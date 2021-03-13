const getCurrentDay = () =>
  new Date(Date.now()).toLocaleString().split(', ').slice(0);

const getCurrentTime = () =>
  new Date(Date.now()).toLocaleString().split(', ').slice(-1);

module.exports = { getCurrentDay, getCurrentTime };
