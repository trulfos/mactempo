interface ConfigObject {
  jiraBase: string;
  maconomyBase: string;
  accountMap: {[input: string]: string};
}

function isConfigObject(value: any): value is ConfigObject {
  return typeof value === 'object' &&
    value !== null &&
    typeof value.jiraBase === 'string' &&
    typeof value.maconomyBase === 'string' &&
    typeof value.accountMap === 'object' &&
    value.accountMap !== null &&
    Object.entries(value.accountMap).every(
      (v: unknown[]) => v.every((a: unknown) => typeof a === 'string')
  );
}

export {
    ConfigObject as default,
    isConfigObject
};
