# koa-webpack-middleware

[![npm version](http://img.shields.io/npm/v/koa-webpack-middleware.svg?style=flat-square)](https://npmjs.org/package/koa-webpack-middleware "View this project on npm")
[![Circle CI](https://circleci.com/gh/leecade/koa-webpack-middleware.svg)](https://circleci.com/gh/leecade/koa-webpack-middleware)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) for [koa2](https://github.com/koajs/koa/tree/v2.x) with [HMR](http://webpack.github.io/docs/hot-module-replacement-with-webpack.html)(hot module replacement) supports.

## Install

```sh
$ npm i kwm -D
```

## exmaple

```
$ npm i
$ npm run dev
```

change  `example/react/src/components/Layout.js` #render() && save! 

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

// kwm(compile, devConf, hotConf) 
app.use(kwm(compile)

app.use( (ctx, next ) => {
    if (ctx.path === '/'){
        const jsx = ( <Layout /> );
        const reactDom = renderToString( jsx );
        ctx.styles = ctx.entry('app').styles
        ctx.scripts = ctx.entry('app').scripts
        ctx.type = 'html';
        ctx.body = htmlTemplate( ctx, reactDom ) ;
    }
} );

```

- ctx.webpackStats = ctx.state.webpackStats
- ctx.webpackFs = ctx.state.fs
- ctx.entry('webpack_entry_key') return {styles, scripts}

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

3. webpack `output` configure 
    
    ```js
    output: {
        path: path.resolve( __dirname, "dist" ),
        // filename: "[name].bundle.js",
        filename: '[name].[hash].js'
    },
    ```

4. put the code in your entry file to enable HMR

    > React project do not need

    ```js
    if (module.hot) {
      module.hot.accept()
    }
    ```

That's all, you're all set!
    
