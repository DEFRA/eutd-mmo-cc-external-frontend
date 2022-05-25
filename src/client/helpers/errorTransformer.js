import lookupErrorText  from './lookupErrorText';

const errorTransformer = (object, state = {}) => {
  if(!object) {
    return state;
  }

  const errorState = {errors: []};

  Object.keys(object).forEach( key => {
    const errorMessage = lookupErrorText(object[key]);
    errorState.errors.push({
      targetName: key,
      text: errorMessage
    });

    errorState[`${key}Error`] = errorMessage;
  });

  return errorState;
};

export default errorTransformer;
