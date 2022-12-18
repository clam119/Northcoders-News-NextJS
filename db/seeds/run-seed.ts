// Import in the connection to db, seed itself and development data to seed
import devData from '@db/data/development-data/index';
import testData from '@db/data/test-data/index';
import seed from '@db/seeds/seed';
import db from '@db/connection';

const runTestSeed = () => {
  return seed(testData).then(() => db.end());
};

const runDevSeed = () => {
  return seed(devData).then(() => db.end());
}

runTestSeed();
runDevSeed();