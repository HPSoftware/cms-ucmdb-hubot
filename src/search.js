/**
 * Created by covaciu on 10/25/2016.
 */

var api = require('./util/api.js');
var Constants = require('./util/constants.js');
var Utils = require('./util/utils.js');

exports.search = function (searchString, callback) {
  searchString = searchString.trim();

  callback({text: 'Searching for *' + searchString + '* ...'});

  var params = {
    "nodes": [
      {
        "type": "configuration_item",
        "queryIdentifier": "configuration_item1",
        "visible": true,
        "includeSubtypes": true,
        "layout": [
          "global_id",
          "root_class",
          "display_label",
          "last_modified_time"
        ],
        "attributeConditions": [
          {
            "attribute": "display_label",
            "value": "%" + searchString + "%",
            "operator": "like"
          }
        ]
      }
    ],
    "relations": []
  };

  api.request(Constants.HTTP_METHOD.POST, Constants.API_PATH.TOPOLOGY_QUERY, params, (apiResult) => {
    var result = {};
    var attachments = [];
    var cis = apiResult.cis;

    //result count
    result.text = buildSearchResultCountText(cis);

    if (cis == null) {
      callback(result);
      return result;
    }

    var cisToSend = cis.length > Constants.CONFIG.MAXIMUM_ATTACHMENTS ? cis.slice(0, Constants.CONFIG.MAXIMUM_ATTACHMENTS) : cis;
    cisToSend.forEach((ci, index) => {
      attachments.push(Utils.buildCiEntry(ci, index % 2 == 0));
    });
    result.attachments = attachments;

    callback(result);
  });
};

function buildSearchResultCountText(cis) {
  var result = 'Result count: ';
  if (cis == null) {
    result += '*0*';
  } else {
    result += '*' + cis.length + '*';
    if (cis.length > Constants.CONFIG.MAXIMUM_ATTACHMENTS) {
      result += "\nDisplaying first " + Constants.CONFIG.MAXIMUM_ATTACHMENTS + " results. Please try to search for something more specific!";
    }
  }
  return result;
}
