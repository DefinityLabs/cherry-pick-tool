module.exports = function() {
  const commands = [];

  return {
    get: function() {
      return commands;
    },

    add: function(command) {
      commands.push(command);
    },

    forEach: function(callback) {
      commands.forEach(callback);
    }
  };
};
