const devMiddleware = require('webpack-dev-middleware')
const compose = require('koa-compose')
const isObject = require('isobject')

module.exports = (compiler, opts) => {
  const expressMiddleware = devMiddleware(compiler, opts)

  function normalizeAssets(assets) {
    if (isObject(assets)) {
      return Object.values(assets)
    }
    return Array.isArray(assets) ? assets : [assets]
  }

  function endsWith(a, b) {
    const path = require('path')
    return path.parse(a).ext === b
  };
  
  function middleware (ctx, next) {
    const res = ctx.res

    return expressMiddleware(ctx.req, {
      locals: ctx.state,
      end: (content) => {
        ctx.body = content
      },
      setHeader: (name, value) => {
        ctx.set(name, value)
      }
    }, next )
  }

  middleware.getFilenameFromUrl = expressMiddleware.getFilenameFromUrl
  middleware.waitUntilValid = expressMiddleware.waitUntilValid
  middleware.invalidate = expressMiddleware.invalidate
  middleware.close = expressMiddleware.close
  middleware.fileSystem = expressMiddleware.fileSystem

  return compose([middleware, (ctx , n)=>{
    const assetsByChunkName = ctx.state.webpackStats.toJson().assetsByChunkName
    const fs = ctx.state.fs
    const outputPath = ctx.state.webpackStats.toJson().outputPath
   
    ctx.entry = (name) => {
      const styles = normalizeAssets(assetsByChunkName[name])
      .filter(path => endsWith(path, '.css'))
      .map(path => fs.readFileSync(outputPath + '/' + path))
      .join('\n')
    const scripts = normalizeAssets(assetsByChunkName[name])
      .filter(path => endsWith(path, '.js'))
      .map(path => `<script src="${path}"></script>`)
      .join('\n')

      return {scripts, styles}
    }
    ctx.webpackStats = ctx.state.webpackStats
    ctx.webpackFs = ctx.state.fs
    return n()
  }])
}
