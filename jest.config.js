const config = {
    testEnvironment: 'node',
    globalSetup: 'migrate',
    setupFilesAfterEnv: ['truncate', 'seed', 'disconnect']
};

module.exports = config;
