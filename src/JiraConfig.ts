interface JiraConfig {
    getBaseUrl(): string;
    getAccountField(): string;
    getUsername(): string | undefined;
}

export default JiraConfig;
