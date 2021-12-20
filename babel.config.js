module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ];

  return {
    plugins: ['@babel/plugin-proposal-nullish-coalescing-operator'],
    presets,
    sourceMaps: true,
    retainLines: true,
  };
};
