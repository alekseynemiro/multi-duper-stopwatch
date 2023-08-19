module.exports = (e) => {
  const env = e.env();
  const plugins = [];

  if (env === "production") {
    plugins.push([
      "transform-remove-console",
      {
        "exclude": [
          "error",
          "warn",
        ],
      },
    ]);
  }

  return {
    "presets": [
      "module:metro-react-native-babel-preset",
      "@babel/preset-typescript",
    ],
    "plugins": [
      "@babel/plugin-transform-flow-strip-types",
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
            "@images": "./Images",
            "@localization": "./Localization",
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
      ...plugins,
    ],
  };
};
