const config = {
  verbose: true,
  testResultsProcessor: "jest-sonar-reporter",
};

module.exports = config;

// Or async function
module.exports = async () => {
  return {
    verbose: true,
    testResultsProcessor: "jest-sonar-reporter",
  };
};
