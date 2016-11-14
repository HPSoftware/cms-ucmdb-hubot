/**
 * Created by covaciu on 11/1/2016.
 */

var api = require('./util/api.js');
var Constants = require('./util/constants.js');
var Utils = require('./util/utils.js');
var UcmdbId = require('./ucmdbId.js');

exports.getHistory = function (globalId, duration, callback) {
  globalId = globalId.trim();
  duration = duration.trim();

  callback({text: 'Retrieving history for *' + globalId + '* ...'});

  UcmdbId.getUcmdbId(globalId, (ucmdbId) => {
    if (ucmdbId == null) {
      callback({text: 'No CI was found with the specified global id'});
      return;
    }

    var dates = getDatesAccordingInput(duration);
    var historyUrlSufix = '?id=' + ucmdbId + '&from=' + dates.from + '&to=' + dates.to;
    Constants.AVAILABLE_HISTORY_TYPES.forEach((historyType) => {
      historyUrlSufix += '&changeType=' + historyType;
    });

    api.request(Constants.HTTP_METHOD.GET, Constants.API_PATH.GET_HISTORY + historyUrlSufix, null, (historyResult) => {
      if(historyResult == null || historyResult.history == null || historyResult.history.length == 0 || historyResult.history[0].changes == null || historyResult.history[0].changes.length == 0){
        callback({text: 'No history events were found for the specified CI'});
        return;
      }

      var result = {};

      var changes = historyResult.history[0].changes;

      var attachment = {
        color: Constants.COLOR.GREEN,
        pretext: 'History changes: ' + changes.length,
        fallback: '',
        fields: []
      };

      changes.forEach((historyChange, index) => {
        attachment.fields = attachment.fields.concat(buildFieldsForHistoryChange(historyChange, index));
        if(index != changes.length - 1){
          attachment.fields.push(Constants.FIELDS_SEPARATOR);
        }
      });

      result.attachments = [attachment];
      callback(result);
    });
  });
};

function getDatesAccordingInput(duration) {
  var result = {};

  if (duration == null || duration == '') {
    //default value
    duration = Constants.HISTORY_DURATION.LAST_WEEK;
  }

  var from = new Date();
  var to = new Date();

  duration = duration.toLowerCase();
  switch (duration) {
    case Constants.HISTORY_DURATION.LAST_DAY:
      from.setDate(to.getDate() - 1);
      break;
    case Constants.HISTORY_DURATION.LAST_MONTH:
      from.setMonth(to.getMonth() - 1);
      break;
    case Constants.HISTORY_DURATION.LAST_WEEK:
    default:
      from.setDate(to.getDate() - 7);
  }

  result.from = from.getTime();
  result.to = to.getTime();

  return result;
}

function buildFieldsForHistoryChange(historyChange, index){
  var result = [];

  result.push({
    title: (index + 1) + '. ' +historyChange.changeType,
    value: Utils.formatDate(new Date(historyChange.time)),
    short: false
  });

  var propertiesChanges = historyChange.data.properties;
  if(propertiesChanges == null){
    return result;
  }

  if(historyChange.changeType == Constants.HISTORY_TYPE.UPDATE_OBJECT){
    for(var property in propertiesChanges){
      if(!propertiesChanges.hasOwnProperty(property)){
        continue;
      }
      result.push({
        title: property,
        value: propertiesChanges[property] + '',
        short: 'true'
      });
    }
  }

  return result;
}
