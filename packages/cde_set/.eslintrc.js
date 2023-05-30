module.exports = {
  extends: ['../../.eslintrc.js'],
  ignorePatterns: ['jest.config.js', '.eslintrc.js', 'build.js'],
  parserOptions: {
    project: './tsconfig.json',
  },
};
