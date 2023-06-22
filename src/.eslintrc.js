module.exports = {
  "root": true,
  "extends": "@react-native-community",
  "plugins": ["simple-import-sort"],
  "rules": {
    "prettier/prettier": 0,
    "quotes": ["error", "double"],
    "quote-props": ["error", "consistent"],
    "eol-last": ["error", "always"],
    "linebreak-style": ["error", "unix"],
    "lines-between-class-members": ["error", "always"],
    "padding-line-between-statements": [
      "error",
      {
        "blankLine": "always",
        "prev": "*",
        "next": ["class"],
      },
    ],
    "simple-import-sort/imports": [
      "error",
      {
        "groups": [
          [
            "^react",
            "^@?\\w",
            "^\\u0000",

            "^\\.\\.(?!/?$)",
            "^\\.\\./?$",

            "^\\./(?=.*/)(?!/?$)",
            "^\\.(?!/?$)",
            "^\\./?$",
          ],
        ],
      },
    ],
    "simple-import-sort/exports": "error",
    //"import/first": "error",
    //"import/newline-after-import": "error",
    //"import/no-duplicates": "error",
  },
};
