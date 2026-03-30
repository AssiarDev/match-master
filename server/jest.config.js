export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['@swc/jest', { jsc: { parser: { syntax: 'typescript' } } }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
};
