if (process.env.NODE_ENV === 'development') {
  module.exports = require('./dev').default; // eslint-disable-line global-require
} else {
  module.exports = store => store;
}
