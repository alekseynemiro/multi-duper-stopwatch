module.exports = {
  "preset": "react-native",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
  ],
  "moduleNameMapper": {
    "^(typeorm)$": "<rootDir>/node_modules/$1",
    "^uuid$": "<rootDir>/node_modules/react-native-uuid",
  },
  "cacheDirectory": ".jest/cache",
};
