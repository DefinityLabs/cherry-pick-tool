const extra = {};

module.exports = {
  params: function() {
    return extra;
  },
  param: function(key, value) {
    extra[key] = value;
  }
};
