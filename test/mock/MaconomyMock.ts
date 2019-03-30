import nock from 'nock';
import {Week, Credentials} from '../../src';
import MaconomyRequest from './MaconomyRequest';
import decodeForm from './decodeForm';

const endpoint = '/DeltekTouch/Maconomy/Time/maconomyshared/backend/RemoteCall.php';

interface Line {
    id: string;
    project: string;
    task: string;
    // Map from date to hours (yyyy.mm.dd)
    hours: {
        [date: string]: number;
    };
}

class MaconomyMock {
  private rpcUrl: string;
  private username: string;
  private password: string;
  private sessionId = 'session-node2-4234';
  private lines: Line[] = [];
  private lastLineId = 0;

  constructor(url: string, credentials: Credentials) {
    this.rpcUrl = url + endpoint;
    this.username = credentials.username;
    this.password = credentials.password;

    const mac = nock(url);

    mac.post(endpoint)
    .reply(200, this.generateResponse.bind(this));

    mac.persist();
  }

  reset(lines: Line[] = []) {
      this.lines = lines;
  }

  getLines() {
      return this.lines;
  }

  private generateResponse(_uri: string, stringBody: string) {
    const body = decodeForm(stringBody);

    if (
      body.macurl !== this.rpcUrl ||
        body.functionname !== 'executerequest'
    ) {
      throw new Error('Request with incorrect macurl or functionname detected');
    }

    const req = new MaconomyRequest(body);

    const expectedProps = {
      clean: false,
      calfocus: false,
      impersonate: false,
      maccharset: "UTF-8",
      lang: "en_US",
      locale: "en_US"
    };

    if (!req.hasProperties(expectedProps)) {
      return this.handleError('Invalid request');
    }

    const operation = req.getOperation();

    if (operation === 'login') {
      return this.handleLogin(req);
    }

    const {sessionId} = this;
    if (sessionId && req.getSessionId() !== sessionId) {
      return this.handleError('Invalid session');
    }

    switch (operation) {
      case 'getperiod': return this.handlePeriod(req);
      case 'savetimesheetentry': return this.handleSaveTimesheet(req);
      default: return this.handleError(
        `Error: No '${req.getOperation()}' exists`
      );
    }

  }

  private handleSaveTimesheet(req: MaconomyRequest) {
      // TODO: Validation
      const valid = req.hasProperties({
          reopenIfSubmitted: false
      });

      if (!valid) {
          throw new Error('Missing reopenIfSubmitted in request');
      }

      const {
          Fields: fields,
          InstanceKey: lineId,
          theDate: date
      } = req.getRequestObject();

      const match = fields.NumberOf.match(/'(.*)'/);
      if (!match) {
          throw new Error('NumberOf must be wrapped in single quotes');
      }
      const hours = Number(match[1]);
      
      // New line?
      if (lineId === '') {
          const id = `TimeSheetLine-${this.lastLineId++}`;
          this.lines.push({
            id,
            project: fields.JobNumber,
            task: fields.TaskName,
            hours: {
                [date]: hours
            }
          });
          return {ok: true, Line: {InstanceKey: id}};
      }

      const line = this.lines.find(l => l.id === lineId);
      if (line) {
          line.hours[date] = hours;
      } else {
          throw new Error('No line?');
      }
      return {ok: true, Line: {InstanceKey: lineId}};
  }

  private handleError(message: string) {
    return JSON.stringify({
      ok: false,
      message
    });
  }

  private handlePeriod(req: MaconomyRequest) {
      // Validate input
      const date = /^\d{4}\.\d{2}\.\d{2}$/;
      const isValid = req.hasProperties({
          inputTheDate: date,
          startDate: date,
          endDate: date,
          includeLineMetadata: true
      });

      if (!isValid) {
          return this.handleError('Invalid data for period request');
      }

      const reqObj = req.getRequestObject();
      const {startDate, endDate, inputTheDate} = reqObj;

      if (
          !isSameWeek(inputTheDate, endDate) ||
          !isSameWeek(inputTheDate, startDate)
      ) {
          throw new Error(
              'Requesting multiple weeks has unexpected consequences'
          );
      }

      const lineFields: string[] = reqObj.lineFields.split(',');
      if (
          !lineFields.includes('TheDate') ||
          !lineFields.includes('NumberOf')
      ) {
          throw new Error(
              'Mock currently only supports TheDate and NumberOf fields, but ' +
                  'none of these were requested'
          );
      }
    /*
     * TODO:
      const reqobj = req.getRequestObject();
      const {startDate, endDate} = reqobj;
      function relevantDate(date: string) {
          return date >= startDate && date <= endDate;
      }

    function relevantField(entry: [string, any]) {
      return lineFields.includes(entry[0]);
    }
   */

      // Generate output
    return toPeriod(this.sessionId, this.lines);
  }

  private handleLogin(req: MaconomyRequest) {
    const isValid = req.hasProperties({
      includeScreenLayouts: false,
      username: this.username,
      password: this.password
    });

    if (!isValid) {
      throw new Error('Invalid request for login operation');
    }

    return JSON.stringify({
      ok: true,
      sessionid: this.sessionId,
    });
  }
}

export default MaconomyMock;

/*
function toObject(obj: object, entry: [string, any]) {
  return {...obj, [entry[0]]: entry[1]};
}
*/

function toPeriod(sessionId: string, lines: Line[]) {
    return {
        operation: 'getperiod',
        sessionid: sessionId,
        ok: true,
        message: '',
        Lines: lines.map(toMaconomyLine)
    };
}

function toMaconomyLine(line: Line) {
    return {
        InstanceKey: line.id,
        Fields: {
            dailyFields: Object.entries(line.hours)
            .map(([date, hours]) => ({
                TheDate: date,
                NumberOf: hours.toFixed(2)
            }))
        }
    };
}

function toJsDate(date: string): Date {
    return new Date(date.replace(/\./, '-'));
}

function isSameWeek(date1: string, date2: string) {
    const dateA = toJsDate(date1);
    const dateB = toJsDate(date2);

    return new Week(dateA).includes(dateB);
}
