import nock from 'nock';
import {Credentials} from '../../src';
import decodeForm from './decodeForm';

interface Worklog {
  timeSpentSeconds: number;
  account: string;
  dateStarted: string;
  issueKey: string;
}

class TempoMock {
  private logoutCount = 0;
  private worklogs: Worklog[] = [];

  constructor(url: string, credentials: Credentials) {
    const {username, password} = credentials;
    const jira = nock(url);

    jira
      .post(
        '/rest/auth/1/session',
        (body: any) => body.password === password && body.username === username
      )
      .reply(
          200,
          '',
          {'Set-Cookie': () => [`${this.getCookie()}; Path=/`]}
      );

    jira
      .post(
        '/rest/auth/1/session',
        (body: any) => body.password !== password || body.username !== username
      )
      .reply(401, 'Not authorized');

    const loggedInScope = nock(url).matchHeader(
        'cookie',
        (c: string) => c === this.getCookie()
    );
    
    loggedInScope
        .get('/rest/tempo-timesheets/3/worklogs')
        .query((params: any) => params.username === username)
        .reply(200, this.getWorklogs.bind(this));

    loggedInScope
        .delete('/rest/auth/1/session')
        .reply(201, this.logout.bind(this));

    loggedInScope
        .get(/\/rest\/api\/2\/issue\/.+/)
        .query(true)
        .reply(200, this.getIssue.bind(this))

    jira.persist();
    loggedInScope.persist();
  }

  reset(worklogs: Worklog[] = []) {
    this.worklogs = worklogs;
  }

  getLogoutCount() {
      return this.logoutCount;
  }

  private logout() {
      this.logoutCount++;
  }

  private getCookie() {
      return `sessionId=${this.logoutCount}`;
  }

  private getWorklogs(uri: string) {
      const params = decodeSearch(uri);

      return JSON.stringify(
          this.worklogs
              .filter(byStartDate(params))
              .map(toJiraWorklog)
      );
  }

  private getIssue(uri: string) {
      const match = uri.match(/\/([^\/\?]*)($|\?)/);

      if (!match) {
          throw new Error(`No match for url: ${uri}`);
      }

      const issueKey = match[1];
      const params = decodeSearch(uri);
      if (params.fields != 'customfield_11961') {
          return {fields: {}};
      }

      return {
          fields: {
              customfield_11961: {
                  key: this.getAccount(issueKey)
              }
          }
      };
  }

  private getAccount(issueKey: string) {
      const worklog = this.worklogs.find(byIssueKey(issueKey));

      if (!worklog) {
          throw new Error(`No worklogs for issue: ${issueKey}`);
      }

      return worklog.account;
  }
}

function toJiraWorklog(worklog: Worklog) {
    const {account, issueKey, ...others} = worklog;

    return {
        ...others,
        issue: { key: issueKey}
    };
}

function byStartDate({dateFrom, dateTo}: {dateFrom: string, dateTo: string}) {
  return (worklog: Worklog) => {
    const date = worklog.dateStarted;
    return dateFrom <= date && date <= dateTo;
  };
}

function byIssueKey(key: string) {
    return (worklog: Worklog) => worklog.issueKey === key;
}

function decodeSearch(url: string) {
  return decodeForm(url.split('?')[1]);
}

export default TempoMock;
