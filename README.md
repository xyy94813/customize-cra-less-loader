# customize-cra-less-loader

Add less loader to any `create-react-app` using `customize-cra`.
Support with `css-loader` v3.

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
