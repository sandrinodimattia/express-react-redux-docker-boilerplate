import Immutable, { Map, List } from 'immutable';

export default function createReducer(initialState, actionHandlers) {
  return (state = initialState, action) => {
    let currentState = state;
    if (!Map.isMap(currentState) && !List.isList(currentState)) {
      currentState = Immutable.fromJS(currentState);
    }

    const handler = actionHandlers[action.type];
    if (!handler) {
      return currentState;
    }

    currentState = handler(currentState, action);
    if (!Map.isMap(currentState) && !List.isList(currentState)) {
      throw new TypeError('Reducers must return Immutable objects.');
    }

    return currentState;
  };
}
