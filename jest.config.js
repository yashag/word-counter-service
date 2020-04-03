module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // collectCoverage: true,
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  transform: {
    ".ts": "ts-jest"
  },
  moduleFileExtensions: [
    "ts",
    "js",
    "json"
  ]
};