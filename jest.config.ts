// module.exports = {
//     setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
//   };

import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: "./",
  moduleNameMapper: {
    '^@db/(.*)': '<rootDir>/db/$1',
    '^@lib/(.*)': '<rootDir>/lib/$1',
    '^@pages/(.*)': '<rootDir>/pages/$1',
    '^@controllers/(.*)': '<rootDir>/controllers/$1',
    '^@models/(.*)': '<rootDir>/models/$1',
    '^@public/(.*)': '<rootDir>/public/$1',
  }
};

export default config;