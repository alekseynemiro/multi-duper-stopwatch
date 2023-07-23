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
    "^@components(.*)$": "<rootDir>/Components/$1",
    "^@config(.*)$": "<rootDir>/Config/$1",
    "^@data(.*)$": "<rootDir>/Data/$1",
    "^@dto(.*)$": "<rootDir>/Core/Dto/$1",
    "^@pages(.*)$": "<rootDir>/Pages/$1",
    "^@services(.*)$": "<rootDir>/Core/Services/$1",
    "^@styles(.*)$": "<rootDir>/Styles/$1",
    "^@types(.*)$": "<rootDir>/Types/$1",
    "^@utils(.*)$": "<rootDir>/Utils/$1",
  },
  "cacheDirectory": ".jest/cache",
};
