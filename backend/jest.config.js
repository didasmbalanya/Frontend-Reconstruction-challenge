module.exports = {
  //collectCoverageFrom: ["functions/s/*.{js}", "!**/node_modules/**", "!**/vendor/**"],
  setupFiles: ['./tests/setup.ts', 'dotenv/config'],
  setupFilesAfterEnv: ['./tests/setup.after-env.ts','jest-json-matchers/register'],
  globals: {
  },

  testEnvironment: "node", // https://github.com/axios/axios/issues/1180
  testPathIgnorePatterns: ['/node_modules/', '/__fixtures__/','/.build/']
}
