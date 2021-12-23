import addLessLoader from './index';

describe('addLessLoader', () => {
  const findLessLoaderConf = loader => loader.test && loader.test.test('a.less');
  const findLessModuleLoaderConf = loader =>
    loader.test && loader.test.test('a.module.less') && !loader.test.test('a.less');
  const isCSSLoader = loader => /css-loader/.test(loader);
  const isLessLoader = loader => /less-loader.js$/.test(loader);

  const webpackEnv = process.env.NODE_ENV;
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  const shouldUseSourceMap = isEnvProduction
    ? process.env.GENERATE_SOURCEMAP !== 'false'
    : isEnvDevelopment;

  test('with options', () => {
    const inputConfig = {
      output: {
        publicPath: '.',
      },
      module: {
        rules: [
          {
            oneOf: [
              // last on loader is assets loader
              {
                exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                type: 'asset/resource',
              },
            ],
          },
        ],
      },
    };

    const finalConfig = addLessLoader({
      cssLoaderOptions: {
        onlyLocals: true,
        modules: {
          localIdentName: '[hash:base64:8]',
        },
      },
      lessLoaderOptions: {
        lessOptions: {
          strictMath: true,
        },
      },
    })(inputConfig);

    // all loaders
    const loaders = finalConfig.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;

    // find less loader
    const lessLoader = loaders.find(findLessLoaderConf);

    expect(lessLoader.use.find(loaderConf => isCSSLoader(loaderConf.loader)).options).toEqual({
      importLoaders: 2,
      sourceMap: shouldUseSourceMap,
      onlyLocals: true,
      modules: false,
    });
    expect(lessLoader.use.find(loaderConf => isLessLoader(loaderConf.loader)).options).toEqual({
      sourceMap: shouldUseSourceMap,
      lessOptions: {
        rewriteUrls: 'local',
        strictMath: true,
      },
    });

    // find less module loader
    const lessModuleLoader = loaders.find(findLessModuleLoaderConf);

    expect(lessModuleLoader.use.find(
      loaderConf => isCSSLoader(loaderConf.loader)).options,
    ).toEqual({
      importLoaders: 2,
      sourceMap: shouldUseSourceMap,
      onlyLocals: true,
      modules: {
        localIdentName: '[hash:base64:8]',
      },
    });
    expect(lessModuleLoader.use.find(
      loaderConf => isLessLoader(loaderConf.loader)).options,
    ).toEqual({
      sourceMap: shouldUseSourceMap,
      lessOptions: {
        rewriteUrls: 'local',
        strictMath: true,
      },
    });
  });

  test('without options', () => {
    const inputConfig = {
      output: {
        publicPath: '.',
      },
      module: {
        rules: [
          {
            oneOf: [
              // last on loader is assets loader
              {
                exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                type: 'asset/resource',
              },
            ],
          },
        ],
      },
    };

    const finalConfig = addLessLoader()(inputConfig);

    // all loaders
    const loaders = finalConfig.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;

    // find less loader
    const lessLoader = loaders.find(findLessLoaderConf);

    expect(lessLoader.use.find(loaderConf => isCSSLoader(loaderConf.loader)).options).toEqual({
      importLoaders: 2,
      sourceMap: shouldUseSourceMap,
      modules: false,
    });
    expect(lessLoader.use.find(loaderConf => isLessLoader(loaderConf.loader)).options).toEqual({
      sourceMap: shouldUseSourceMap,
      lessOptions: {
        rewriteUrls: 'local',
      },
    });

    // find less module loader
    const lessModuleLoaderRule = loaders.find(findLessModuleLoaderConf);
    const cssLoaderConf = lessModuleLoaderRule.use.find(
      loaderConf => isCSSLoader(loaderConf.loader),
    );
    expect(cssLoaderConf.options).toEqual({
      importLoaders: 2,
      sourceMap: shouldUseSourceMap,
      modules: {
        localIdentName: '[local]--[hash:base64:5]',
      },
    });
    const lessLoaderConf = lessModuleLoaderRule.use.find(
      loaderConf => isLessLoader(loaderConf.loader),
    );
    expect(lessLoaderConf.options).toEqual(
      {
        sourceMap: shouldUseSourceMap,
        lessOptions: {
          rewriteUrls: 'local',
        },
      },
    );
  });
});
