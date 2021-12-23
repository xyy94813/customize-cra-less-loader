/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */
const fs = require('fs');
const path = require('path');
const paths = require('react-scripts/config/paths');

const useTailwind = fs.existsSync(
  path.join(paths.appPath, 'tailwind.config.js'),
);

module.exports = (loaderOptions = {}) => config => {
  /* eslint-disable import/no-extraneous-dependencies */
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');

  const cssLoaderOptions = loaderOptions.cssLoaderOptions || {};
  const lessLoaderOptions = loaderOptions.lessLoaderOptions || {};

  const lessRegex = /\.less$/;
  const lessModuleRegex = /\.module\.less$/;

  const webpackEnv = process.env.NODE_ENV;
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  const shouldUseSourceMap = isEnvProduction
    ? process.env.GENERATE_SOURCEMAP !== 'false'
    : isEnvDevelopment;

  // reference from react-scripts
  // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js#L118
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const postcssPlugins = [
      'postcss-flexbugs-fixes',
      [
        'postcss-preset-env',
        {
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
        },
      ],
    ];

    if (useTailwind) {
      postcssPlugins.unshift('tailwindcss');
    } else {
      postcssPlugins.push('postcss-normalize');
    }

    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        options: paths.publicUrlOrPath.startsWith('.')
          ? { publicPath: '../../' }
          : {},
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            config: false,
            plugins: postcssPlugins,
          },
          sourceMap: shouldUseSourceMap,
        },
      },
    ].filter(Boolean);

    if (preProcessor) {
      // not the same as react-scripts
      loaders.push(preProcessor);
    }

    return loaders;
  };

  const lessLoader = {
    loader: require.resolve('less-loader'),
    // not the same as react-scripts
    options: {
      sourceMap: shouldUseSourceMap,
      ...lessLoaderOptions,
      lessOptions: {
        rewriteUrls: 'local', // https://github.com/bholloway/resolve-url-loader/issues/200#issuecomment-999545339
        ...(lessLoaderOptions.lessOptions || {}),
      },
    },
  };

  const defaultCSSLoaderOption = {
    importLoaders: 2,
    sourceMap: shouldUseSourceMap,
  };

  const loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf))
    .oneOf;

  // https://github.com/facebook/create-react-app/blob/9673858a3715287c40aef9e800c431c7d45c05a2/packages/react-scripts/config/webpack.config.js#L590-L596
  // insert less loader before resource loader
  // https://webpack.js.org/guides/asset-modules/
  loaders.splice(
    loaders.length - 1,
    0,
    {
      test: lessRegex,
      exclude: lessModuleRegex,
      use: getStyleLoaders(
        { ...defaultCSSLoaderOption, ...cssLoaderOptions, modules: false },
        lessLoader,
      ),
    },
    {
      test: lessModuleRegex,
      use: getStyleLoaders(
        {
          ...defaultCSSLoaderOption,
          ...cssLoaderOptions,
          modules: {
            localIdentName: '[local]--[hash:base64:5]',
            ...cssLoaderOptions.modules,
          },
        },
        lessLoader,
      ),
    },
  );

  return config;
};
