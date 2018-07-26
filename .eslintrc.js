module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/airbnb"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-sparse-arrays": 0,
    "no-plusplus": 0,
    "no-multi-assign": 1,
    "import/no-unresolved": 1,
    "import/extensions": 1,
    "no-unused-vars": 1,
    "import/prefer-default-export": 0,
    "no-param-reassign": 0
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  globals: {
    $: true,
    jQuery: true
  }
};
