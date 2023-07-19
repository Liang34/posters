const webpack = require("webpack");
const path = require("path");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = {
  configureWebpack: (config) => {
    config.resolve.alias = {
      "@": path.resolve(__dirname, "src"),
    };
    // 为啥不生效？？？？？？
    config.optimization.splitChunks = {
      maxInitialRequests: 300 * 1024,
      minSize: 300 * 1024,
      chunks: "all",
      cacheGroups: {
        antVendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name.
            // node_modules/packageName/sub/path
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `npm.${packageName.replace("@", "")}`;
          },
        },
      },
    };
    if (isProduction) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm:'gzip',
          test: /\.js$|\.html$|\.json$|\.css/,
          threshold: 10240,
        })
      )
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
        })
      );
    }
  },
  devServer: {
    proxy: {
      // 代理的
      "/api": {
        target: "http://localhost:3000", // 代理的基础路径
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
  },
  // 生产环境要使用 OSS 地址
  // 其他环境都使用绝对路径
  //   publicPath: (isProduction && !isStaging) ? 'https://oss.imooc-lego.com/editor' : '/',
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#3E7FFF",
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  // 修改title，利于SEO
    chainWebpack: config => {
      config.plugin('html').tap(args => {
        args[0].title = '海报大师'
        args[0].desc = '一键生成海报'
        return args
      })
    }
};
