# Gulp Tasks

Aria.js uses Gulp to compile. This document will show you some of the commands available.

---
- [Overview](overview.md)
- [Property types](types.md)
- [Utilities](utilities.md)
- [Plugins](plugins.md)
- **Gulps tasks**
---

## `gulp js`

The basic command to compile the files.

```bash
$ gulp js
```

This will create the following files:

- dist/aria.js
- dist/aria.min.js

If you're developing Aria.js, you can use a watch command for file changes and compile as changes are made.

```bash
$ gulp js:watch
```

## `gulp plugins`

This command will compile the plugins. For each plugin, 2 files will be created:

```bash
$ gulp plugins
```

- dist/plugins/(plugin name).js
- dist/plugins/(plugin name).min.js

If you're developing Aria.js, you can use a watch command for file changes and compile as changes are made.

```bash
$ gulp plugins:watch
```

You can see all the plugins using the list command:

```bash
$ gulp plugins:list
# Available plugins:
# - extend-node
# - jquery
# - proxy
# - tokens
```

## `gulp custom`

You can concatenate the main files and plugins using the `gulp custom` command. This command requires a `--plugins` argument to define the plugins that you'd like to include - a space-separated list of plugins to include. The names of the plugins can be found using the `plugins:list` command.

```bash
$ gulp custom --plugins "extend-node no-proxy"
```

This will create 2 files, which will be a combination of the main Aria.js file and plugins that you added (in this example, [extend-node](plugins.md#extend-node-plugin) and [no-proxy](plugins.md#no-proxy-plugin) plugins):

- dist/aria.custom.js
- dist/aria.custom.min.js

You can also use the keyword "all" to get all plugins.

```bash
$ gulp custom --plugins "all"
```

### Troubleshooting

You may get an error when running this command because the main Aria.js file hasn't been created yet. To get around that, be sure to run the [`gulp js`](#gulp-js) before `gulp custom`. There's also a helper function for this: [`gulp build`](#gulp-build).

## `gulp build`

This is a helper function for running [`gulp js`](#gulp-js) and then [`gulp custom`](#gulp-custom). It also uses the same `--plugins` argument.

```bash
$ gulp build --plugins "extend-node no-proxy"
```

Check the [`gulp custom`](#gulp-custom) section for more details and the [`gulp plugins`](#gulp-plugins) section to find out how to see all available plugins.

## `gulp test`

Unit tests are run using the `test` command.

```bash
$ gulp test
```

This will run the unit tests and display the results in the console. There's also a watch variant which can be used while developing.

```bash
$ gulp test:watch
```

You can test the plugins using the `test:plugins` command. This can be watched using `test:plugins:watch`.

```bash
$ gulp test:plugins
$ gulp test:plugins:watch
```

### Troubleshooting

You may get an error when you run this command if the main JavaScript files haven't been created. Be sure to run the [`gulp js`](#gulp-js) and [`gulp plugins`](#gulp-plugins) commands before you run `gulp test` to avoid these issues. There's a helper command for this: [`gulp full`](#gulp-full).

## `gulp full`

A helper function that runs the [`gulp js`](#gulp-js) and [`gulp plugins`](#gulp-plugins) commands before running [`gulp test`](#gulp-test).

```bash
$ gulp full
```

## `gulp watch`

This is simply a helper command which combines the watch version of [`gulp js`](#gulp-js), [`gulp plugins`](#gulp-plugins) and [`gulp test`](#gulp-test).

```bash
$ gulp watch
```

Another version called `gulp watch:test` will watch the core and plugins, compiling them and then running their tests afterwards.
