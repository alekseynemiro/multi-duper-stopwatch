module.exports = {
  "presets": [
    "module:metro-react-native-babel-preset",
    "@babel/preset-typescript",
  ],
  "plugins": [
    "babel-plugin-transform-typescript-metadata",
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true,
      },
    ],
    [
      "@babel/plugin-transform-class-properties",
      {
        "loose": true,
      },
    ],
    [
      "@babel/plugin-transform-private-methods",
      {
        "loose": true,
      },
    ],
    [
      "@babel/plugin-transform-private-property-in-object",
      {
        "loose": true,
      },
    ],
    [
      require.resolve("babel-plugin-module-resolver"),
      {
        "alias": {
          "@components": "./Components",
          "@config": "./Config",
          "@data": "./Data",
          "@dto": "./Core/Dto",
          "@pages": "./Pages",
          "@services": "./Core/Services",
          "@styles": "./Styles",
          "@types": "./Types",
          "@utils": "./Utils",
          "@views": "./Views",
        },
      },
    ],
    ["react-native-reanimated/plugin"],
  ],
};
