---
title: "从头开始新建 React 应用"
tags: [React, Node.js, JavaScript, Babel, webpack, Yarn]
date: 2019-03-14T10:45:23+08:00
licensed: true
draft: false
---

根据
[React 官方文档](https://reactjs.org/docs/create-a-new-react-app.html)，
新建 React 应用的一种方式是使用
[Create React App](https://github.com/facebookincubator/create-react-app)。

```shell
yarn create react-app new-app
cd new-app
yarn start
```

Create React App 提供了一个基本的框架，使用
[react-scripts](https://github.com/facebook/create-react-app/tree/master/packages/react-scripts)
简化配置流程。
在此基础上可以很方便的继续进行 React 应用开发。

不过 react-scripts 隐藏了很多细节，也可能带来了一些不必要的组件。
如果想要更精准地控制应用，了解更多细节，最好还是从头开始新建应用。

下面记录了从零开始创建 React 应用的过程，
这里也使用 [webpack](https://webpack.js.org/) 对资源进行打包，
同时需要创建 webpack 配置文件。


## 新建工程目录

创建空的目录作为 React 应用的目录：

```shell
mkdir new-app
cd new-app
yarn init
```

这将生成 package.json 文件。

添加 React 依赖：

```shell
yarn add react react-dom
```

以下这些都是开发时会用到的包：

```shell
yarn add webpack webpack-cli webpack-dev-server --dev
```

```shell
yarn add @babel/core @babel/preset-env @babel/preset-react --dev
```

```shell
yarn add babel-loader style-loader css-loader --dev
```

在 `package.json` 中添加以下脚本:

```js
  "scripts": {
    "start": "webpack-dev-server --mode development",
    "build": "webpack --mode production"
  },
```

这样就可以使用 `yarn start` 命令快捷启动开发服务。


## 静态文件

所有静态文件都放在 `public` 目录下面。

创建 `public/index.html`:

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Title</title>
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


## React 应用文件

所有 React 程序文件都放在 `src` 目录下面。

创建 React 应用入口 `src/index.js`:

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

ReactDOM.render(<App />, document.getElementById("root"));
```

创建应用主文件 `src/App.js`:

```js
import React from "react";

const App = () => <div>Hello World!</div>

export default App;
```


## webpack 配置

创建 webpack 配置文件 `webpack.config.js`。入口文件设置为 `src/index.js`，
最终构建生成的文件放在 `dist` 目录下。

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
        options: {
          presets: [
            "@babel/preset-env",
            "@babel/preset-react"
          ]
        }
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

> 这里并不需要再新建一个 `.babelrc` 文件，因为以上配置文件中的 `options`
> 里已经包含了相关的选项。


## 参考

[Creating a React App… From Scratch.](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)
