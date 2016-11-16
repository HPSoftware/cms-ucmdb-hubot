config = require '../src/util/config.js';

help = require '../src/help.js';
search = require '../src/search.js';
details = require '../src/details.js';
impact = require '../src/impact.js';
history = require '../src/history.js';

module.exports = (robot) ->
#check if hubot-enterprise is loaded
  if not robot.e
    robot.logger.error 'hubot-enterprise not present, ucmdbot cannot run'
    return
  robot.logger.info 'ucmdbot initialized'

  # register integration
  robot.e.registerIntegration {
    name: 'ucmdbot',
    short_desc: 'what this integration does',
    long_desc: 'how this integration does it'
  }

  #Init REST connection parameters
  config.initApiParameters();

  #Help
  robot.respond /help\s*/i, (res) ->
    help.getAvailableCommands ((result) -> res.send result), ((result) -> res.reply result)

  #Search
  robot.respond /search\s+(.*)/i, (res) ->
    searchString = res.match[1];
    search.search searchString, ((result) -> res.send result), ((result) -> res.reply result)

  #Get details
  robot.respond /get\s+details\s+(.*)/i, (res) ->
    globalId = res.match[1];
    details.getCiDetails globalId, ((result) -> res.send result), ((result) -> res.reply result)

  #Impact
  robot.respond /get\s+impact\s+(.*?(?=\sseverity\s|\sbundles\s|$))\s?(?:severity)?\s?((?!bundles)[^\s]*)\s?(?:bundles)?\s?(.*)/i, (res) ->
    globalId = res.match[1];
    severity = res.match[2];
    bundles = res.match[3];
    impact.calculateImpact globalId, severity, bundles, ((result) -> res.send result), ((result) -> res.reply result)

  #History
  robot.respond /get\s+history\s+([^\s]*)\s?(.*)/i, (res) ->
    globalId = res.match[1];
    duration = res.match[2];
    history.getHistory globalId, duration, ((result) -> res.send result), ((result) -> res.reply result)
