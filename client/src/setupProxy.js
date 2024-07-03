const createProxyMiddleware = require('http-proxy-middleware')

module.exports = function(app){
    app.use("/api/**", createProxyMiddleware.createProxyMiddleware({
        target: "https://mandala-api.vercel.app/",
        secure: false,
        changeOrigin: true
    }))
}