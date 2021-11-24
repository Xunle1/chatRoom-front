module.exports = {
  devServer: {
    port: 9000,
    proxy: {
      '/': {
        target: 'localhost:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  },
  publicPath: './',
  assetsDir: 'static',
  transpileDependencies: [
    'vuetify'
  ],
}
