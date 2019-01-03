# koa-webpack-middleware

[![npm version](http://img.shields.io/npm/v/koa-webpack-middleware.svg?style=flat-square)](https://npmjs.org/package/koa-webpack-middleware "View this project on npm")
[![Circle CI](https://circleci.com/gh/leecade/koa-webpack-middleware.svg)](https://circleci.com/gh/leecade/koa-webpack-middleware)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) for [koa2](https://github.com/koajs/koa/tree/v2.x) with [HMR](http://webpack.github.io/docs/hot-module-replacement-with-webpack.html)(hot module replacement) supports.

## Install

```sh
$ npm i kwm -D
```

## Depends

This middleware designd for koa2 ecosystem, make sure installed the right version:

```sh
npm i koa@next -S
```

## Usage

> See [example/](./example/) for an example of usage.

```js
import webpack from 'webpack'
import kwm from 'kwm'
import devConfig from './webpack.config.dev'
const compile = webpack(devConfig)
app.use(kwm(compile)
```

## HMR configure

1. webpack `plugins` configure

    ```js
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
    ```
2. webpack `entry` configure

    ```sh
    $ npm i eventsource-polyfill -D
    ```

    ```js
    entry: {
      'index': [
        // For old browsers
        'eventsource-polyfill',
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        'index.js']
    },
    ```

3. webpack `loader` configure 
    
    ```sh
    $ npm i babel-preset-es2015 babel-preset-stage-0 -D
    ```

    ```js
    {
      test: /\.js$/,
      loader: 'babel',
      query: {
        'presets': ['es2015', 'stage-0']
        }
      },
      include: './src'
    }
    ```

    > HMR for react project

    ```sh
    $ npm i babel-preset-react babel-preset-react-hmre -D
    ```

    ```js
    {
      test: /\.jsx?$/,
      loader: 'babel',
      query: {
        'presets': ['es2015', 'stage-0', 'react'],
        'env': {
          'development': {
            'presets': ['react-hmre']
          }
        }
      },
      include: './src'
    }
    ```

4. put the code in your entry file to enable HMR

    > React project do not need

    ```js
    if (module.hot) {
      module.hot.accept()
    }
    ```

That's all, you're all set!
    
