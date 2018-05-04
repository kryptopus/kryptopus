kryptopus
=========

Cryptocurrency manager

Requirements
------------

* NodeJS >= 9


Installation
------------

```bash
npm install
```


Plugins
-------

You can extend Kryptopus by defining plugins in `config/parameters.yml`.

```yaml
plugins:
    - kryptopus-cryptocompare
    - { name: my-plugin, url: file:../my-plugin }
    - { name: unregistered-plugin, url: https://github.com/user/plugin.git }
```

After that, install plugins with the following command:

```bash
npm run install-plugins
```


Execute a bot
-------------

```bash
npm run bot cryptocompare_ticker
```


