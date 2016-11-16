/**
 * Created by covaciu on 10/27/2016.
 */

var api = require('./util/api.js');
var Constants = require('./util/constants.js');
var Utils = require('./util/utils.js');
var UcmdbId = require('./ucmdbId.js');

exports.getCiDetails = function (globalId, sendCallback, replyCallback) {
  globalId = globalId.trim();

  replyCallback('Retrieving details for *' + globalId + '* ...');

  UcmdbId.getUcmdbId(globalId, (ucmdbId) => {
    if (ucmdbId == null) {
      replyCallback('No CI was found with the specified global id');
      return;
    }

    api.request(Constants.HTTP_METHOD.GET, Constants.API_PATH.GET_CI + ucmdbId, null, (ci) => {
      var result = {
        attachments: [Utils.buildCiEntry(ci, true)]
      };
      sendCallback(result);
    });
  });
};

