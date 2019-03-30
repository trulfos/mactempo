# Mactempo magic hour transfer

This application transfer hours from Tempo to Maconomy, providing instant
relief for consultants trackig their hours in both systems.

Note that this solution is slightly hacky and may not work for other
tempo/maconomy setups than the one it has been created for.


## Basic usage

Create a `.mactempo` file in your home directory with the following structure:
```
{
	"jiraBase": "https://jira.yourcompany.com",
	"maconomyBase": "https://touch.yourcompany.com",
	"accountMap": {
        "tempoAccount1": "maconomyAccount1/maconomyTask1",
        "tempoAccount2": "maconomyAccount2/maconomyTask2",
        ...
	}
}
```

The `maconomyBase` must be the base address for the maconomy touch API, not the
regular web client. The `accountMap` is used to map accounts in Tempo to correct
accounts in Maconomy. An error will be thrown whenever an account is missing in
the map, but present in the Tempo worklog.

Run `mactempo` and follow the instuctions.

For more information on how the application behaves, read the tests.

## Proxy configuration

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


## Custom certificate authorities

Some companies use their own certificate authorities. Use the environment
variable `NODE_EXTRA_CA_CERTS` for these cases.

# Aknowledgements

The Maconomy integration is based on the `maconomy` NPM-package by Hanse. Thanks
for the reverse engineering!
