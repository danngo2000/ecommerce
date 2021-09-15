module.exports = {
  "plugins": [
    "postcss-flexbugs-fixes",
    "postcss-normalize",
    "precss",
    "lost",
    "postcss-import",
    "postcss-url",
    [
      "postcss-preset-env",
      {
        "autoprefixer": {
          "flexbox": "no-2009"
        },
        "stage": 3,
        "features": {
          "custom-properties": false
        }
      }
    ],
  ]
}
