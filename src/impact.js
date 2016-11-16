/**
 * Created by covaciu on 10/27/2016.
 */

var api = require('./util/api.js');
var Constants = require('./util/constants.js');
var Utils = require('./util/utils.js');
var UcmdbId = require('./ucmdbId.js');

exports.calculateImpact = function (globalId, severity, bundles, sendCallback, replyCallback) {
  globalId = globalId.trim();
  severity = severity.trim();
  bundles = bundles.trim();

  replyCallback('Calculating impact for *' + globalId + '* ...');

  UcmdbId.getUcmdbId(globalId, (ucmdbId) => {
    if (ucmdbId == null) {
      sendCallback({text: 'No CI was found with the specified global id'});
      return;
    }

    severity = Utils.covertToUcmdbSeverity(severity);
    if(severity == null){
      sendCallback({text: 'Invalid severity. Please use one of available severities: ' + Constants.AVAILABLE_SEVERITIES.join(', ')});
      return;
    }

    var params = {
      "triggerCIs": [
        {
          "triggerId": ucmdbId,
          "severity": severity
        }
      ],
      "properties": ["display_label", "global_id", "root_class"]
    };

    if(bundles != null && bundles != ''){
      //removes white spaces
      bundles = bundles.replace(/\s/g, '');
      params.bundles = bundles.split(',');
    }

    api.request(Constants.HTTP_METHOD.POST, Constants.API_PATH.IMPACT_ANALYSIS, params, (apiResult) => {
      var result = {};

      var affectedCis = apiResult.affectedCIs;
      result.text = buildResultAffectedCisCountText(affectedCis);
      if(affectedCis == null){
        sendCallback(result);
        return;
      }

      var groupedImpactResult = groupAffectedCisBySeverityAndCiType(affectedCis);
      var attachments = [];

      for(var severity in groupedImpactResult){
        var severityGroup = groupedImpactResult[severity];
        if(!groupedImpactResult.hasOwnProperty(severity) ||  Object.keys(severityGroup).length == 0){
          continue;
        }

        var attachment ={
          color: Constants.IMPACT_CONFIG[severity].color,
          fallback: '',
          mrkdwn_in: ["pretext"],
          fields: []
        };

        var severityCount = 0;
        for(var ciType in severityGroup){
          if(!severityGroup.hasOwnProperty(ciType)){
            continue;
          }
          severityCount += severityGroup[ciType].length;
          var fields = generateFields(ciType, severityGroup[ciType]);
          attachment.fields = attachment.fields.concat(fields);
        }

        if(severityCount > 0){
          attachment.pretext = '*' + Constants.IMPACT_CONFIG[severity].name + ': ' + severityCount + '*';
          attachments.push(attachment);
        }
      }
      result.attachments = attachments;
      sendCallback(result);
    });
  });
};

function buildResultAffectedCisCountText(affectedCis) {
  var result = 'Affected CIs: ';
  if (affectedCis == null) {
    result += '*0*';
  } else {
    result += '*' + affectedCis.length + '*';
  }
  return result;
}

function groupAffectedCisBySeverityAndCiType(affectedCis){
  var result ={
    [Constants.IMPACT.CRITICAL]: {},
    [Constants.IMPACT.HIGH]: {},
    [Constants.IMPACT.MEDIUM]: {},
    [Constants.IMPACT.LOW]: {}
  };

  affectedCis.forEach((affectedCi) => {
    var severity = Utils.convertFromUcmdbSeverity(affectedCi.severity);
    var ciType = affectedCi.properties.root_class;
    if(result[severity][ciType] == null){
      result[severity][ciType] = [affectedCi];
    } else {
      result[severity][ciType].push(affectedCi);
    }
  });

  return result;
}

function generateFields(ciType, cis) {
  var result = [];

  result.push({
    title: ciType + ': ' + cis.length,
    value: '',
    short: false
  });

  cis.forEach((ci) => {
    result.push({
      title: 'display_label',
      value: ci.properties.display_label,
      short: 'true'
    });

    result.push({
      title: 'global_id',
      value: ci.properties.global_id,
      short: 'true'
    });
  });

  return result;
}
