import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],

  clearMocks: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['./src/controllers/*.ts', './src/useCases/*.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/dist/'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/*.test.ts', '**/*.e2e-spec.ts', '**/*.spec.ts'],

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['json', 'text', 'lcov', 'clover', 'text-summary'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),

  // Use this configuration option to add custom reporters to Jest
  reporters: [
    'default',
    [
      'jest-sonar',
      {
        outputDirectory: 'coverage',
        outputName: 'sonar.xml',
      },
    ],
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  testEnvironment: 'node',

  // Automatically reset mock state between every test
  resetMocks: true,

  // The root directory that Jest should scan for tests and modules within
  rootDir: './',
};

export default config;
