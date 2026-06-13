export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['@swc/jest', { jsc: { parser: { syntax: 'typescript' } } }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  maxWorkers: 1,
  globalSetup: './tests/setup/globalSetup.ts',
  globalTeardown: './tests/setup/globalTeardown.ts',
  setupFilesAfterEnv: ['./tests/setup/jestSetup.ts'],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'controllers/**/*.ts',
    'service/**/*.ts',
    'middleware/**/*.ts',
    'repositories/**/*.ts',
    'utils/**/*.ts',
    'lib/tokenBlacklist.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
