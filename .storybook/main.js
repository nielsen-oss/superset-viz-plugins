const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    // disable gzip compression for cache files
    // faster when there are millions of small files
    cacheCompression: false,
    plugins: ['@babel/plugin-proposal-nullish-coalescing-operator'],
  },
};
module.exports = {
  webpackFinal: async config => {
    config.module.rules.unshift({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });
    config.module.rules.unshift({
      test: /\.(ts|js)x?$/,
      use: [
        babelLoader,
        {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
          },
        },
      ],
    });
    return {
      ...config,
      resolve: {
        ...config.resolve,
        plugins: [
          new TsconfigPathsPlugin({
            configFile: path.resolve(__dirname, '../tsconfig.json'),
          }),
          ...config.resolve.plugins,
        ],
        alias: {
          ...config.resolve.alias,
          '@emotion/core': require.resolve('@emotion/react'),
          'emotion-theming': require.resolve('@emotion/react'),
          '@emotion/styled': require.resolve('@emotion/styled'),
        },
      },
    };
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: prop => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
};
