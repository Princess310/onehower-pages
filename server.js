const serve = require('serve');

const server = serve(__dirname, {
  port: 5000,
  ignore: ['node_modules']
})