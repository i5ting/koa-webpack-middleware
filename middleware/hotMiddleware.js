const hotMiddleware = require('webpack-hot-middleware')
const PassThrough = require('stream').PassThrough

module.exports = (compiler, opts) => {
  const expressMiddleware = hotMiddleware(compiler, opts)
  return (ctx, next) => {
    let stream = new PassThrough()
    ctx.body = stream
    return expressMiddleware(ctx.req, {
      write: stream.write.bind(stream),
      writeHead: (status, headers) => {
        ctx.status = status
        ctx.set(headers)
      }
    }, next)
  }
}
