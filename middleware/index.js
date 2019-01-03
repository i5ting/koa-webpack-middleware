const devMiddleware = require('./devMiddleware')
const hotMiddleware = require('./hotMiddleware')
const compose = require('koa-compose')

module.exports = (compile, devConf, hotConf) => {
    return compose([
        devMiddleware(compile, devConf||{
            noInfo: false,
            hot: true,
            serverSideRender: true
        }),
        hotMiddleware(compile, hotConf||{
            log: console.log,
            path: "/__webpack_hmr",
            heartbeat: 2000
        })
    ])
}
