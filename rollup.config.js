const path = require('path');
const { terser } = require('rollup-plugin-terser');

const pkg = require('./package.json');

const deps = [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(pkg.dependencies || {})];

const external = id => deps.includes(id) || /@babel\/runtime\//.test(id);

const inputPath = path.join(__dirname, 'src', 'index.js');

const getBasicConf = () => ({
  input: inputPath,
  external,
});

const getDistLib = moduleType => {
  switch (moduleType) {
    case 'cjs':
      return 'dist';
    case 'es':
      return 'es';
    default:
      throw Error('Unknown Module Type');
  }
};

const getConf = (env, moduleType) => {
  const distLib = getDistLib(moduleType);
  const fileName = `${pkg.name}.${env}.js`;
  const outputPath = path.join(distLib, fileName);
  const isProduction = env === 'production';
  const plugins = [];

  if (isProduction) {
    plugins.push(terser());
  }

  return {
    ...getBasicConf(),
    output: {
      file: outputPath,
      format: moduleType,
    },
    plugins,
  };
};

module.exports = [
  getConf('development', 'cjs'),
  getConf('production', 'cjs'),
  getConf('development', 'es'),
];
