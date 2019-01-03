import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import Layout from "./components/Layout";

import webpack from 'webpack'
import { devMiddleware, hotMiddleware } from '../../../middleware'
import devConfig from '../webpack.config'
const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');

// $ GET /package.json
app.use(serve( path.resolve( __dirname, "../dist" )));
// This function makes server rendering of asset references consistent with different webpack chunk/entry configurations
function normalizeAssets(assets) {
    if (isObject(assets)) {
      return Object.values(assets)
    }
    return Array.isArray(assets) ? assets : [assets]
  }
  
const compile = webpack(devConfig)

app.use(devMiddleware(compile, {
    serverSideRender: true
}))

app.use(hotMiddleware(compile, {
  // log: console.log,
  // path: '/__webpack_hmr',
  // heartbeat: 10 * 1000
}))

app.use( (ctx, next ) => {
    const jsx = ( <Layout /> );
    const reactDom = renderToString( jsx );
    ctx.type = 'text/html; charset=utf-8';
    ctx.body = ( htmlTemplate( reactDom ) );
} );

app.listen(3000);

function htmlTemplate( reactDom ) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>React SSR</title>
        </head>
        
        <body>
            <div id="app">${ reactDom }</div>
            <script src="./app.bundle.js"></script>
        </body>
        </html>
    `;
}
