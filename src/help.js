/**
 * Created by covaciu on 10/27/2016.
 */

var Constants = require('./util/constants.js');


exports.getAvailableCommands = function (sendCallback, replyCallback) {
  var result = {};

  result.text = 'The available commands are:';

  var attachments = [];
  result.attachments = attachments;

  //Search
  var search = {
    pretext: '1. `search <display_label>`',
    mrkdwn_in: ['pretext', 'text'],
    title: 'Searches for CIs with the given display label',
    text: 'Returns the first *' + Constants.CONFIG.MAXIMUM_ATTACHMENTS + '* results.' + '\n' +
    '*Example*: search node',
    color: Constants.COLOR.GREEN,
    fallback: ''
  };
  attachments.push(search);

  //Get details
  var getDetails = {
    pretext: '2. `get details <global_id>`',
    mrkdwn_in: ['pretext', 'text'],
    title: 'Returns the properties for the specified CI.',
    text: '*Example:* get details 40081bf5623b04fa823f1ea996efc8b6',
    color: Constants.COLOR.GREY,
    fallback: ''
  };
  attachments.push(getDetails);

  //Impact
  var impact = {
    pretext: '3. `get impact <global_id> [severity <severity>] [bundles <bundles>]`',
    mrkdwn_in: ['pretext', 'text'],
    title: 'Returns the impact analysis result for the specified CI.',
    text: 'Optional parameters: \n' +
    '-severity: one of ' + Constants.AVAILABLE_SEVERITIES.join(', ') + '. If not specified, critical severity is used by default.' + '\n' +
    '-bundles: a list of bundles, separated by comma(,). If not specified, all bundles are used by default.' + '\n' +
    '*Example:* get impact 40081bf5623b04fa823f1ea996efc8b6 severity medium bundles bundle1, bundle2',
    color: Constants.COLOR.GREEN,
    fallback: ''
  };
  attachments.push(impact);

  //History
  var history = {
    pretext: '4. `get history <global_id> [last day/week/month]`',
    mrkdwn_in: ['pretext', 'text'],
    title: 'Returns the history changes for the specified CI.',
    text: 'Optional parameters: \n' +
    '-last day/week/month: if not specified, last week is used by default.' + '\n' +
    '*Example:* history 40081bf5623b04fa823f1ea996efc8b6 last day',
    color: Constants.COLOR.GREY,
    fallback: ''
  };
  attachments.push(history);

  sendCallback(result);
}
