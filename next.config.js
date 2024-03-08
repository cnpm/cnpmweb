const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const styleLoader = require('style-loader');

const path = require('path');

const nextConfig = {
  transpilePackages: [
    '@codeblitzjs/ide-core',
    '@codeblitzjs/ide-common',
    '@codeblitzjs/ide-registry',
    '@codeblitzjs/ide-sumi-core',
    '@codeblitzjs/ide-plugin',
    '@codeblitzjs/ide-i18n',

  ],
  env: {},
  // https://github.com/vercel/next.js/issues/36251#issuecomment-1212900096
  httpAgentOptions: {
    keepAlive: false,
  },
  output: 'export',
  lessLoaderOptions: {
    lessOptions: {
      javascriptEnabled: true,
      paths: [
        path.resolve(__dirname, 'node_modules', '@opensumi'),
        path.resolve(__dirname, 'node_modules', '@codeblitzjs'),
      ],
    },
  },

  webpack: (config, options) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      child_process: false,
      http: false,
      https: false,
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
    };
    /**
     *  配置 webpack 以支持服务端渲染 CodeBlitz
     *  使用动态引入组件 vercel 预览失败 https://github.com/cnpm/cnpmweb/pull/64#issuecomment-1925669277
     *  TODO 目前
     */
    config.module.rules.push(
      {
        test: /\.module.less$/,
        include: /@opensumi[\\/]ide|@codeblitzjs[\\/]ide/,
        use: [
          {
            loader: 'style-loader',
            options: {
              esModule: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
              esModule: false,
              modules: {
                mode: 'local',
                localIdentName: '[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        include: /@opensumi[\\/]ide|@codeblitzjs[\\/]ide/,
        exclude: /\.module.less$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              esModule: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
              esModule: false,
              modules: {
                mode: 'local',
                localIdentName: '[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              esModule: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp|ico|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[ext]',
              // require 图片的时候不用加 .default
              esModule: false,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  esModule: false,
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              esModule: false,
              publicPath: './',
            },
          },
        ],
      },
      {
        test: /\.(txt|text|md)$/,
        use: 'raw-loader',
      },
    );
    return config;
  },
};

// module.exports = nextConfig;

module.exports = {
  env: {},
  // https://github.com/vercel/next.js/issues/36251#issuecomment-1212900096
  httpAgentOptions: {
    keepAlive: false,
  },
  output: 'export',
};
