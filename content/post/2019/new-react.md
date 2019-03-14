---
title: "Create a New React App"
tags: ["react"]
date: 2019-03-14T10:45:23+08:00
licensed: true
draft: false
---

Create a react app from scratch.

<!--more-->

```shell
yarn init
```

```shell
yarn add react react-dom
```

```shell
yarn add webpack webpack-cli webpack-dev-server --dev
```

```shell
yarn add @babel/core @babel/preset-env @babel/preset-react --dev
```

```shell
yarn add babel-loader style-loader css-loader --dev
```

Add scripts in `package.json`:

```js
  "scripts": {
    "start": "webpack-dev-server --mode development",
    "build": "webpack --mode production"
  },
```

Create `.babel.rc`:

```js
{
  "presets": [
      "@babel/preset-env",
      "@babel/preset-react"
  ]
}
```

Create `public/index.html`:

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Procram</title>
</head>

<body>
  <div id="root"></div>
  <noscript>
    You need to enable JavaScript to run this app.
  </noscript>
  <script src="../dist/bundle.js"></script>
</body>

</html>
```

Create `src/index.js`:

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

ReactDOM.render(<App />, document.getElementById("root"));
```

Create `src/App.js`:

```js
import React from "react";

const App = () => <div>Hello World!</div>

export default App;
```

Create `webpack.config.js`. The entry is set to `src/index.js`.

```js
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src", "index.js"),
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/preset-env"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    port: 3000
  }
};
```
