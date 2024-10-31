const isUndefinedOrEmpty = (str) => {
  return str == undefined || str.trim() == "";
};

module.exports = isUndefinedOrEmpty;