export default function normalizeErrorMiddleware() {
  return () => next => (action) => {
    if (action && action.type.endsWith('_REJECTED') && action.payload) {
      let error = 'Unknown Server Error';
      if (action.payload.code === 'ECONNABORTED') {
        error = 'The connectioned timed out.';
      } else if (action.payload.data && action.payload.data.error) {
        error = action.payload.data.error;
      } else if (action.payload.error) {
        error = action.payload.error;
      } else if (action.payload.response && action.payload.response.data) {
        error = action.payload.response.data;
      }

      if (error && error.message) {
        error = error.message;
      }

      if (error && error.error_description) {
        error = error.error_description;
      }

      if (error && error.original) {
        error = error.original;
      }

      action.errorMessage = error // eslint-disable-line no-param-reassign
        || action.payload.statusText
        || action.payload.status
        || 'Unknown Server Error';
    }

    next(action);
  };
}
