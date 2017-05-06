let extra;

module.exports = {
  load: function(args) {
    extra = {};

    for (let i = 2; i < args.length; i++) {
      let arg = args[i];
      if (arg === '--before') {
        extra['before'] = args[++i];
      } else if (arg === '--after') {
        extra['after'] = args[++i];
      } else if (arg === '--no-emoji') {
        extra['noEmoji'] = true;
      }
    }
  },
  params: function() {
    return extra;
  }
};
