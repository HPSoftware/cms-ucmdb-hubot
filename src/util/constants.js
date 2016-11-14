/**
 * Created by covaciu on 10/25/2016.
 */

const HTTP_METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
};

const API_PATH = {
  AUTHENTICATE: '/authenticate',
  TOPOLOGY_QUERY: '/topologyQuery',
  GET_CI: '/dataModel/ci/',
  IMPACT_ANALYSIS: '/impactAnalysis',
  GET_HISTORY: '/history/getChanges',
  CONVERT_TO_UCMDB_IDS: '/multipleCmdb/convertToUcmdbIds',
  CONVERT_TO_GLOBAL_IDS: 'multipleCmdb/convertToGlobalIds'
};

const CONFIG = {
  //slack
  MAXIMUM_ATTACHMENTS: 5,

  //excluded attributes
  EXCLUDED_PROPERTIES: ['display_label'],

  //priority properties
  PRIORITY_PROPERTIES: ['global_id'],

  //core properties
  CORE_PROPERTIES: ['global_id', 'root_class', 'last_modified_time'],
};

const COLOR = {
  GREEN: '#01a982',
  GREY: '#b3b3b3',
  YELLOW: '#e5e500',
  ORANGE: '#FF8C00',
  RED: '#FF0000'
};

const IMPACT = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

const UCMDB_IMPACT_SEVERITY = {
  [IMPACT.LOW]: 'Warning(2)',
  [IMPACT.MEDIUM]: 'Minor(6)',
  [IMPACT.HIGH]: 'Major(8)',
  [IMPACT.CRITICAL]: 'Critical'
}

const IMPACT_CONFIG = {
  [IMPACT.LOW]: {
    name: 'Low',
    color: COLOR.GREEN
  },
  [IMPACT.MEDIUM]: {
    name: 'Medium',
    color: COLOR.YELLOW
  },
  [IMPACT.HIGH]: {
    name: 'High',
    color: COLOR.ORANGE
  },
  [IMPACT.CRITICAL]: {
    name: 'Critical',
    color: COLOR.RED
  },
};

const AVAILABLE_SEVERITIES = [IMPACT.LOW, IMPACT.MEDIUM, IMPACT.HIGH, IMPACT.CRITICAL];

const HISTORY_DURATION = {
  LAST_DAY: 'last day',
  LAST_WEEK: 'last week',
  LAST_MONTH: 'last month'
};

const HISTORY_TYPE = {
  ADD_OBJECT: 'ADD_OBJECT',
  UPDATE_OBJECT: 'UPDATE_OBJECT'
};

const FIELDS_SEPARATOR = {
  title: '---------------------------------------------------------------------------------------------------',
  value: '',
  short: false
}

const AVAILABLE_HISTORY_TYPES = [HISTORY_TYPE.ADD_OBJECT, HISTORY_TYPE.UPDATE_OBJECT];

module.exports = {
  HTTP_METHOD,
  API_PATH,
  CONFIG,
  COLOR,
  IMPACT,
  UCMDB_IMPACT_SEVERITY,
  IMPACT_CONFIG,
  AVAILABLE_SEVERITIES,
  HISTORY_DURATION,
  HISTORY_TYPE,
  AVAILABLE_HISTORY_TYPES,
  FIELDS_SEPARATOR
};
