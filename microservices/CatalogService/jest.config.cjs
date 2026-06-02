module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/test/**/*.test.js"],
  transform: {
    "^.+\\.ts$": "<rootDir>/jest.ts-transformer.cjs",
  },
  clearMocks: true,
  restoreMocks: true,
};
