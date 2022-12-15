// Import in the connection to db, seed itself and development data to seed
import devData from '../data/development-data/index';
import testData from '../data/test-data';
import seed from './seed';
import db from '../connection';

const runTestSeed = () => {
  return seed(testData).then(() => db.end());
};

const runDevSeed = () => {
  return seed(devData).then(() => db.end());
}

runTestSeed();
runDevSeed();