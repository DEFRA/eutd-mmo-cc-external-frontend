import * as _  from 'lodash';

// filters the stoopid errors produced by Joi into a format that doesn't make my eyes bleed

function extractKey(errorAsString) {
  const str = errorAsString.match(/"([^"]*)"/g)[0] || errorAsString;
  return str.replace(/"/g, '');
}

function renderMessage(errorAsString, key) {
  let splitKey = (key.substring(0, key.lastIndexOf('_')) || key).replace(/_/g, ' ');
  if ((errorAsString.indexOf('is not allowed to be empty') !== -1) ||
    (errorAsString.indexOf('is required') !== -1)) {
    return `Please enter a ${splitKey}`;
  }

  if ((errorAsString.indexOf('invalid') !== -1)) {
    return `Please enter a valid ${splitKey}`;
  }

  if (errorAsString.indexOf('must be a string') !== -1) {
    return `Please enter a correct ${splitKey}`;
  }
  return `There's a problem with ${splitKey}`;
}

export default function (sillyJoiErrors) {
  if (!sillyJoiErrors) {
    return null;
  }
  if (sillyJoiErrors && (typeof sillyJoiErrors === 'object')) {
    return [sillyJoiErrors];
  }
  let filteredErrors = sillyJoiErrors.match(/\[(.*?)\]/gi);
  if (filteredErrors) {
    filteredErrors = _.map(filteredErrors, (er) => {
      let parsedError = er.replace('[', '').replace(']', '');
      let key = extractKey(parsedError);
      parsedError = {
        key: key,
        message: renderMessage(parsedError, key)
      };
      return parsedError;
    });
  }
  return filteredErrors;
}