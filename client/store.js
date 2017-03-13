import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { compose, createStore, applyMiddleware } from 'redux';

import rootReducer from './reducers';
import DevTools from './containers/DevTools';

import logger from './middlewares/logger';
import normalizeErrorMiddleware from './middlewares/normalizeError';

export default function configureStore(middlewares = [], initialState = { }) {
  const pipeline = [
    applyMiddleware(
      promiseMiddleware(),
      thunkMiddleware,
      normalizeErrorMiddleware(),
      logger(),
      ...middlewares
    )
  ];

  if (process.env.NODE_ENV !== 'production') {
    pipeline.push(DevTools.instrument());
  }

  const finalCreateStore = compose(...pipeline)(createStore);
  const store = finalCreateStore(rootReducer, initialState);

  // Enable Webpack hot module replacement for reducers.
  if (module.hot) {
    module.hot.accept('./reducers', () =>
      System.import('./reducers')
        .then((reducerModule) => {
          store.replaceReducer(reducerModule.default);
        })
    );
  }

  return store;
}
