import { IAppState, rootReducer } from './store';

const createLogger = require('redux-logger');

export {
  IAppState,
  rootReducer,
};

export let middleware = [];

middleware.push(
  createLogger({
  level: 'info',
  collapsed: true,
}));
