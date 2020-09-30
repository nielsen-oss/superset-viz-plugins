module.exports = {
  globals: {
    __DEV__: true,
    caches: true,
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  roots: ['<rootDir>/packages', '<rootDir>/plugins'],
  setupFilesAfterEnv: ['<rootDir>/setupJest.js'],
  testEnvironment: 'jsdom',
  timers: 'real',
  verbose: false,
  transformIgnorePatterns: ['node_modules/(?!(vega-lite|lodash-es))'],
};
