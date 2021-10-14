module.exports = {
  webpackFinal: async (config) => {

    config.module.rules.unshift({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });

    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          "@emotion/core": require.resolve('@emotion/react'),
          "emotion-theming": require.resolve('@emotion/react'),
          "@emotion/styled": require.resolve('@emotion/styled'),
        },
      },
    }
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ]
}