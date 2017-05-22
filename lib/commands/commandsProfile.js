const Commands = require('./commands');

const profiles = {};

let currentProfile;

module.exports = {
  get: function(name) {
    let profile = profiles[name];
    if (!profile) {
      profile = new Profile();
      profiles[name] = profile;
    }
    return profile;
  },
  remove: function(name) {
    delete profiles[name];
  },
  define: function(name) {
    currentProfile = name;

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(profiles[currentProfile].getRawMode());
    }
  },
  current: function() {
    return profiles[currentProfile];
  }
};

function Profile() {
  const _commands = new Commands();
  let _rawMode = false;

  return {
    getRawMode: function() {
      return _rawMode;
    },
    setRawMode: function(rawMode) {
      _rawMode = rawMode;
    },
    commands: function() {
      return _commands;
    }
  };
}
