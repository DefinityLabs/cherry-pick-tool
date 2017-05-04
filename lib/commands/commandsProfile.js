const commands = require('./commands');

const profiles = {};

let currentProfile;

module.exports = {
  get: function(name) {
    let _commands = profiles[name];
    if (!_commands) {
      _commands = new commands();
      profiles[name] = _commands;
    }
    return _commands;
  },
  define: function(name) {
    currentProfile = name;
  },
  current: function() {
    return profiles[currentProfile];
  }
};
