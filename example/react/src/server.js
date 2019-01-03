import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import Layout from "./components/Layout";

import webpack from 'webpack'
import m from '../../../middleware'
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

app.use(m(compile))


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

var server = app.listen(3000, () => {
    server.keepAliveTimeout = 0;
    })

function htmlTemplate( ctx, reactDom ) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>React SSR</title>
            ${ctx.styles}
        </head>
        
        <body>
            <div id="app">${ reactDom }</div>
            ${ctx.scripts}
        </body>
        </html>
    `;
}
