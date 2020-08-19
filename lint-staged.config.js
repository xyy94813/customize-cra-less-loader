module.exports = {
  '*.{json,html,md}': [
    './node_modules/.bin/prettier --write',
    'git add --patch',
  ],
  '*.{js,jsx}': ['./node_modules/.bin/eslint --fix'],
};
