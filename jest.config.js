const config = {
    preset: 'ts-jest',
    clearMocks: true,
    testEnvironment: 'node',
    globalSetup: '<rootDir>/test/migrateDb.ts',
    setupFilesAfterEnv: ['<rootDir>/test/truncateDb.ts', '<rootDir>/test/seedDb.ts', '<rootDir>/test/disconnectDb.ts'],
};

module.exports = config;
