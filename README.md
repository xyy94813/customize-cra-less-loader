# customize-cra-less-loader

[![Github Build Status](https://github.com/xyy94813/customize-cra-less-loader/workflows/Test%20And%20Build/badge.svg)](https://github.com/xyy94813/customize-cra-less-loader/actions?query=workflow%3A%22Test+And+Build%22)
[![Codecov](https://img.shields.io/codecov/c/github/xyy94813/customize-cra-less-loader/master.svg?style=flat-square)](https://codecov.io/gh/xyy94813/customize-cra-less-loader/branch/master)
[![Dependencies](https://img.shields.io/david/xyy94813/customize-cra-less-loader.svg)](https://david-dm.org/xyy94813/customize-cra-less-loader)
[![DevDependencies](https://img.shields.io/david/dev/xyy94813/customize-cra-less-loader.svg)](https://david-dm.org/xyy94813/customize-cra-less-loader?type=dev)

[![npm package](https://img.shields.io/npm/v/customize-cra-less-loader.svg?style=flat-square)](https://www.npmjs.org/package/customize-cra-less-loader)
[![npm downloads](https://img.shields.io/npm/dm/customize-cra-less-loader.svg?style=flat-square)](http://npmjs.com/customize-cra-less-loader)

Add less loader to any `create-react-app` using `customize-cra`.
Support with `css-loader` v3.

> Only support `react-scripts` version >= `v3.3.0`.

> If [PR 255](https://github.com/arackaf/customize-cra/pull/255) been merged into master,
> you don't need this modules

## Usage

First, install less and less-loader packages:

```sh
npm i -D less less-loader
// or yarn add --dev less less-loader
```

After it's done, call addLessLoader in override like below:

```js
const { override } = require("customize-cra");
const addLessLoader = require("customize-cra-less-loader");

module.exports = override(addLessLoader(loaderOptions));
```

`loaderOptions` is optional. If you have Less specific options, you can pass to it. For example:

```js
const { override } = require("customize-cra");
const addLessLoader = require("customize-cra-less-loader");

module.exports = override(
  addLessLoader({
    cssLoaderOptions: {
      onlyLocals: true,
      modules: {
        localIdentName: "[hash:base64:8]",
      },
    },
    lessLoaderOptions: {
      lessOptions: {
        strictMath: true,
      },
    },
  })
);
```

Check Less document for all available specific options you can use.

Once `less-loader` is enabled, you can import `.less` file in your project.

And `.module.less` will use CSS Modules.

> if you use TypeScript (npm init react-app my-app --typescript) with CSS Modules, you should edit react-app-env.d.ts.

```ts
declare module "*.module.less" {
  const classes: { [key: string]: string };
  export default classes;
}
```

## Contribution

DefinitelyTyped only works because of contributions by users like you!

### Git Message

[Follow the Angular git commit message specification](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits)

But, you can ignore the `scope`

## Lisense

MIT RoXoM <xyy94813@sina.com>
