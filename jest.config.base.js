module.exports = {
  globals: {
    __DEV__: true,
    caches: true,
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/setupJest.js'],
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testEnvironment: 'jsdom',
  timers: 'real',
  verbose: true,
  transformIgnorePatterns: ['node_modules/(?!(vega-lite|lodash-es))'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  }
};
