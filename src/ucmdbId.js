/**
 * Created by covaciu on 10/27/2016.
 */

var api = require('./util/api.js');
var Constants = require('./util/constants.js');
var Utils = require('./util/utils.js');

exports.getUcmdbId = function(globalId, callback){
  var params = [globalId];

  api.request(Constants.HTTP_METHOD.POST, Constants.API_PATH.CONVERT_TO_UCMDB_IDS, params, (apiResult) => {
    var ids = apiResult.ids;

    if(ids == null || ids.length == 0){
      callback(null);
      return;
    }

    var ucmdbId = ids[0].ucmdbId;
    callback(ucmdbId);
  });
};

exports.getUcmdbIds = function(globalIds, callback){
  var params = globalIds;

  api.request(Constants.HTTP_METHOD.POST, Constants.API_PATH.CONVERT_TO_UCMDB_IDS, params, (apiResult) => {
    var ids = apiResult.ids;

    if(ids == null || ids.length == 0){
      callback(null);
      return;
    }

    callback(ids);
  });
};
