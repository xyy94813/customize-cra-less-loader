import addLessLoader from './index';

describe('addLessLoader', () => {
  const findLessLoaderConf = loader => loader.test && loader.test.test('a.less');
  const findLessModuleLoaderConf = loader =>
    loader.test && loader.test.test('a.module.less') && !loader.test.test('a.less');
  const isCSSLoader = loader => /css-loader.js$/.test(loader);
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
              // last on loader is file loader
              {
                loader: 'file-loader',
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
    const lessLoder = loaders.find(findLessLoaderConf);

    expect(lessLoder.use.find(loaderConf => isCSSLoader(loaderConf.loader)).options).toEqual({
      importLoaders: 2,
      sourceMap: shouldUseSourceMap,
      onlyLocals: true,
      modules: false,
    });
    expect(lessLoder.use.find(loaderConf => isLessLoader(loaderConf.loader)).options).toEqual({
      sourceMap: shouldUseSourceMap,
      lessOptions: {
        strictMath: true,
      },
    });

    // find less module loader
    const lessModuleLoder = loaders.find(findLessModuleLoaderConf);

    expect(lessModuleLoder.use.find(loaderConf => isCSSLoader(loaderConf.loader)).options).toEqual({
      importLoaders: 2,
      sourceMap: shouldUseSourceMap,
      onlyLocals: true,
      modules: {
        localIdentName: '[hash:base64:8]',
      },
    });
    expect(lessModuleLoder.use.find(loaderConf => isLessLoader(loaderConf.loader)).options).toEqual(
      {
        sourceMap: shouldUseSourceMap,
        lessOptions: {
          strictMath: true,
        },
      },
    );
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
              // last on loader is file loader
              {
                loader: 'file-loader',
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
    const lessLoder = loaders.find(findLessLoaderConf);

    expect(lessLoder.use.find(loaderConf => isCSSLoader(loaderConf.loader)).options).toEqual({
      importLoaders: 2,
      sourceMap: shouldUseSourceMap,
      modules: false,
    });
    expect(lessLoder.use.find(loaderConf => isLessLoader(loaderConf.loader)).options).toEqual({
      sourceMap: shouldUseSourceMap,
    });

    // find less module loader
    const lessModuleLoder = loaders.find(findLessModuleLoaderConf);

    expect(lessModuleLoder.use.find(loaderConf => isCSSLoader(loaderConf.loader)).options).toEqual({
      importLoaders: 2,
      sourceMap: shouldUseSourceMap,
      modules: {
        localIdentName: '[local]--[hash:base64:5]',
      },
    });
    expect(lessModuleLoder.use.find(loaderConf => isLessLoader(loaderConf.loader)).options).toEqual(
      {
        sourceMap: shouldUseSourceMap,
      },
    );
  });
});
