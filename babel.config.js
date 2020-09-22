module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "12.18"
        }
      }
    ],
    "@babel/preset-typescript",
  ],
  "plugins": [
    ["@babel/proposal-decorators", {
      decoratorsBeforeExport: true,
    }],
    ["@babel/plugin-proposal-class-properties", {
      loose: true
    }],
    "@babel/plugin-transform-runtime",
    [
      "module-resolver",
      {
        alias: {
          "@": "./src",
          "@arguments": "./src/_internals/arguments",
          "@commands": "./src/_internals/commands",
          "@datapack": "./src/_internals/datapack",
          "@resources": "./src/_internals/resources",
          "@variables": "./src/_internals/variables",
          "@flow": "./src/_internals/flow",
        }
      }
    ],
  ]
}
