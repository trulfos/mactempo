class MaconomyRequest {
  private body: any;

  constructor(body: any) {
    this.body = body;
  }

  hasProperties(props: object) {
    const obj = this.getRequestObject();

    return Object.entries(props).every(
        ([key, value]) => key in obj && (
            value instanceof RegExp && value.test(obj[key]) ||
            obj[key] === value
        )
    );
  }

  getOperation() {
    return this.getRequestObject().operation;
  }

  getRequestObject() {
    return JSON.parse(this.body.requestobj).inpObj;
  }

  getSessionId() {
    return this.getRequestObject().sessionid;
  }
}

export default MaconomyRequest;
