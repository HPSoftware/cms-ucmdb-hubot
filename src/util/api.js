/**
 * Created by covaciu on 10/25/2016.
 */

var Client = require('node-rest-client').Client;
var Promise = require('es6-promise');
var Constants = require('./constants.js');
var Utils = require('./utils.js');
var co = require('co');

var client = new Client();

exports.request = function(method, path, params, callback) {
  co(function* (){
    var result;
    result = yield callApi(method, path, params);

    if(Utils.isUserUnauthorized(result)){
      //token invalid => we need to generate another one
      var loginResult = yield login();
      global.token = loginResult.data.token;

      //token is now set => we call the same api method again
      result = yield callApi(method, path, params);
    }

    callback(result.data);
  });
}

function callApi(method, path, params){
  var args = {
    headers: {
      "Authorization": 'Bearer ' + global.token,
      "Content-Type": "application/json"
    },
    data: params
  };
  return new Promise((resolve, reject) => {
    client[method](global.restUrl + path, args, (data, response) => {
      var requestResult = {
        code: response.statusCode,
        data: data
      };
      resolve(requestResult);
    });
  });
}

function login() {
  var args = {
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      username: global.username,
      password: global.password,
      clientContext: 1,
      encrypted: true
    },
  };

  return new Promise((resolve, reject) => {
    client.post(global.restUrl + Constants.API_PATH.AUTHENTICATE, args, (data, response) => {
      var requestResult = {
        code: response.statusCode,
        data: data
      };
      resolve(requestResult);
    });
  });
};
