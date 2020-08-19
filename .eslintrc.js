module.exports = {
  extends: ['airbnb-base'],
  rules: {
    'arrow-parens': ['warn', 'as-needed'],
    'object-curly-newline': ['off'],
    'no-confusing-arrow': ['off'],
    'implicit-arrow-linebreak': ['off'],
    'function-paren-newline': ['off'],
  },
  env: {
    jest: true,
  },
};
