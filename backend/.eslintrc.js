module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'eslint:recommended', // Use ESLint's recommended rules
    'plugin:@typescript-eslint/recommended', // Use the recommended rules from @typescript-eslint
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },
  rules: {
  }s
};
