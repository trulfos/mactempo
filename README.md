# Mactempo magic hour transfer

This application transfer hours from Tempo to Maconomy, providing instant
relief for consultants tracking their hours in both systems.

Note that this solution is slightly hacky and may not work for other
tempo/maconomy setups than the one it has been created for.


## Usage

Create a `.mactempo` file in your home directory with the following structure:
```
{
    "jira": {
        "baseUrl": "https://jira.yourcompany.com",
        "accountField": "customfield_2312"
    },
    "maconomy": {
        "baseUrl": "https://touch.yourcompany.com"
    },
    "accountMap": {
        "tempoAccount1": "maconomyAccount1/maconomyTask1",
        "tempoAccount2": "maconomyAccount2/maconomyTask2",
        ...
    }
}
```

The `maconomy.baseUrl` must be the base address for the maconomy touch API, not
the regular web client. The `accountMap` is used to map accounts in Tempo to
correct accounts in Maconomy. An error will be thrown whenever an account is
missing in the map, but present in the Tempo worklog. Finally, the
`jira.accountField` specifies which field in your issue describes the account.

In addition to the fields in the example above, one can also specify a
`username` property both for Maconomy and Jira. This will be assumed to be the
username for Maconomy and Jira respectively, and may thus save some typing each
week.

Run `mactempo` and follow the instuctions. For more information on how the
application behaves, read the tests.

### Proxy configuration

This application uses the `global-tunnel-ng` package for proxy support. Set the
`http_proxy`, `https_proxy` and `no_proxy` environment variables.

Example:
```
export http_proxy=http://user:password@proxy.mycompany.com:80/
export https_proxy=http://user:password@proxy.mycompany.com:80/
export no_proxy=jira.mycompany.com
```

In the above example, Jira resides on the local network and requires no
proxying, while all other hosts are accessed through proxy.mycompany.com.


### Custom certificate authorities

Some companies use their own certificate authorities. In these cases, set the
environment variable
[`NODE_EXTRA_CA_CERTS`](https://nodejs.org/api/cli.html#cli_node_extra_ca_certs_file).

## Development

Pull requests are welcome, but do ensure
    * all tests are running and that new
    * tests are added for the new functionality and bug fixes, and
    * there are no lint errors.

### Running the tests

A single run of the tests can be done by issuing the command
```
yarn build
yarn test
```

Running the test continuously (as when doing development) is significantly
speedier when running the build in watch mode:
```
yarn build --watch
```
Use your favorite utility for watching the dist folder and running the tests
(`yarn test`) on change or with a given interval. The test ouput is in machine
readable format and can be piped to any software claiming to prettify the Test
Anything Protocol (TAP), such as
[tap-spec](https://github.com/scottcorgan/tap-spec).

### Linting

Run
```
yarn lint
```
to get a list of lint errors (if any).

## Acknowledgments

The Maconomy integration is based on the
[`maconomy`](https://github.com/Hanse/maconomy) npm package by Hanse and
would never be possible without his reverse engineering.
