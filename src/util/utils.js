/**
 * Created by covaciu on 10/26/2016.
 */

var Constants = require('./constants.js');

module.exports = {
  isUserUnauthorized: function (response) {
    return response.code == 401;
  },

  buildCiEntry: function (ci, isEven) {
    var result = {
      pretext: '*' + ci.properties.display_label + '*',
      fallback: '',
      color: isEven ? Constants.COLOR.GREEN : Constants.COLOR.GREY,
      mrkdwn_in: ["pretext"],
      fields: buildPropertiesPanel(ci.properties)
    };
    return result;
  },

  convertFromUcmdbSeverity: function (severity) {
    switch (severity) {
      case 'Normal':
      case 'Warning(1)':
      case 'Warning(2)':
        return Constants.IMPACT.LOW;
      case 'Minor(3)':
      case 'Minor(4)':
      case 'Minor(5)':
      case 'Minor(6)':
        return Constants.IMPACT.MEDIUM;
      case 'Major(7)':
      case 'Major(8)':
        return Constants.IMPACT.HIGH;
      case 'Critical':
        return Constants.IMPACT.CRITICAL;
      default:
        return Constants.IMPACT.CRITICAL;
    }
    ;
  },

  covertToUcmdbSeverity: function (severity) {
    if (severity == null || severity == '') {
      return Constants.UCMDB_IMPACT_SEVERITY[Constants.IMPACT.CRITICAL];
    }

    severity = severity.toLowerCase();
    return Constants.UCMDB_IMPACT_SEVERITY[severity];
  },

  formatDate: function (date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " - " + strTime;
  }
};

function buildPropertiesPanel(properties) {
  var result = [];
  for (var property in properties) {
    if (isExcludedProperty(property)) {
      continue;
    }

    var fullLineProperty = isPriorityProperty(property);
    var propertyResult = {
      title: property,
      value: properties[property],
      short: fullLineProperty ? false : 'true'
    };

    if (fullLineProperty) {
      result.splice(0, 0, propertyResult);
    } else {
      result.push(propertyResult);
    }
  }
  return result;
}

function isExcludedProperty(property) {
  return arrayContainsElement(Constants.CONFIG.EXCLUDED_PROPERTIES, property);
}

function isPriorityProperty(property) {
  return arrayContainsElement(Constants.CONFIG.PRIORITY_PROPERTIES, property);
}

function arrayContainsElement(array, element) {
  return array.indexOf(element) >= 0;
}
