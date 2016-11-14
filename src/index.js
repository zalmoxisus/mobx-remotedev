import getDecorator from './getDecorator';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./dev').default; // eslint-disable-line global-require
} else {
  module.exports = getDecorator(store => store);
}
