/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */
export default (loaderOptions = {}) => config => {
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const postcssNormalize = require('postcss-normalize');

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
  const { publicPath } = config.output;
  const shouldUseRelativeAssetPaths = publicPath.startsWith('.');

  // copy from react-scripts
  // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js#L93
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `publicPath` can be a relative path
        options: shouldUseRelativeAssetPaths ? { publicPath: '../../' } : {},
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            postcssNormalize(),
          ],
          sourceMap: shouldUseSourceMap,
        },
      },
    ].filter(Boolean);

    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: shouldUseSourceMap,
          },
        },
        preProcessor, // pre processor can use more option
      );
    }
    return loaders;
  };

  const lessLoader = {
    loader: require.resolve('less-loader'),
    // not the same as react-scripts
    options: {
      sourceMap: shouldUseSourceMap,
      ...lessLoaderOptions,
    },
  };

  const defaultCSSLoaderOption = {
    importLoaders: 2,
    sourceMap: shouldUseSourceMap,
  };

  const loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;

  // Insert less-loader as the penultimate item of loaders (before file-loader)
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
