export const camelCaseToSpacedUpperCase = word => {
  return camelCaseToSpaced(word).toLowerCase().replace(/^./, str => str.toUpperCase());
};


export const camelCaseToSpacedLowerCase = word => {
  return camelCaseToSpaced(word).toLowerCase();
};


const camelCaseToSpaced = word => {
  if (word) {
    return word
      // insert a space between lower & upper
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // space before last upper in a sequence followed by lower
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3');
  } else {
    return '';
  }
};
