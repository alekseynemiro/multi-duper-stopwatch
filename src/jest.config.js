module.exports = {
  "preset": "react-native",
  "testRegex": ".*Tests.ts$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
  ],
  "moduleNameMapper": {
    "^(typeorm)$": "<rootDir>/node_modules/$1",
    "^uuid$": "<rootDir>/node_modules/react-native-uuid",
    "^@data(.*)$": "<rootDir>/Data/$1",
    "^@config(.*)$": "<rootDir>/Config/$1",
    "^@dto(.*)$": "<rootDir>/Core/Dto/$1",
    "^@services(.*)$": "<rootDir>/Core/Services/$1",
  },
  "cacheDirectory": ".jest/cache",
};
