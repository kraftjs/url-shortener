const config = {
    preset: 'ts-jest',
    clearMocks: true,
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/test/truncateDb.ts', '<rootDir>/test/seedDb.ts', '<rootDir>/test/disconnectDb.ts'],
};

module.exports = config;
