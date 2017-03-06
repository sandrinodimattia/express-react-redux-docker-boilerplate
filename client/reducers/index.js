import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

export default combineReducers({
  lastAction: (state = null, action) => action,
  routing: routerReducer,
  form: formReducer
});
