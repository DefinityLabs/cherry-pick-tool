module.exports = {
  canProcess: function(ch, key) {
    return ch === 'o';
  },
  help: {
    keys: 'o',
    description: 'Display the options'
  },
  execute: function() {
    console.log('Options:');
    console.log('  ', extra);
    console.log('');
  }
};
