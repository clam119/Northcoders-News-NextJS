// module.exports = {
//     setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
//     testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
//   };

import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
};

export default config;