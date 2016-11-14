/**
 * Created by covaciu on 11/3/2016.
 */

var fs = require('fs');

exports.initApiParameters = function () {
  var configFile = process.env.CONFIG_FILE;
  var fileContent = fs.readFileSync(configFile, 'utf8');
  var configuration = JSON.parse(fileContent);

  var defaultServer = configuration.config.ucmdb.servers.default;
  var server = configuration.config.ucmdb.servers[defaultServer];

  var protocol = server.protocol;
  var endpoint = server.endpoint;
  var port = server.port;
  var username = server.account;
  var password = server.password;

  var restUrl = protocol + '://' + endpoint + ':' + port + '/rest-api';
  global.restUrl = restUrl;
  global.username = username;
  global.password = password;
};
