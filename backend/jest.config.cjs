module.exports = {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },

  moduleFileExtensions: ["ts", "tsx", "js", "json"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  testMatch: ["**/*.test.ts"],
};
