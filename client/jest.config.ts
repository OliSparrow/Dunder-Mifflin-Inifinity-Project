import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  coverageProvider: 'v8',

  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.app.json',  // Move ts-jest config here
    }],
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  testEnvironment: 'jest-environment-jsdom',

  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },

  transformIgnorePatterns: ['<rootDir>/node_modules/'],

  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
};

export default config;
