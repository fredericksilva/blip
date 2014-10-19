/**
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

var _ = require('lodash');
var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var getInitialState = function() {
  return {
    requests: {},
    usersById: {}
  };
};

var UserStore = merge(EventEmitter.prototype, {

  _state: getInitialState(),

  reset: function() {
    this._state = getInitialState();
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function(userId) {
    return this._state.usersById[userId];
  }

});

UserStore.dispatchToken = AppDispatcher.register(function(payload) {
  switch(payload.type) {

    case AppConstants.api.COMPLETED_GET_GROUPS:
      _.forEach(payload.groups, function(group) {
        UserStore._state.usersById[group.userid] = {
          userid: group.userid,
          profile: _.cloneDeep(group.profile)
        };
      });
      UserStore.emitChange();
      break;

    default:
      // Do nothing
  }

});

module.exports = UserStore;