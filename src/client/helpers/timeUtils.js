
export const generateMissingMonths = (givenDate, indexPosition) => {
  let arrayOfDates = new Array(4);

  arrayOfDates[indexPosition] = givenDate;
  for(let i=0; i<4; i++) {
    const x = arrayOfDates[i];

    if (x === undefined) {
      const monthBeforeOrAfter = i - indexPosition;
      arrayOfDates[i] = new Date(givenDate.getFullYear(), givenDate.getMonth() - monthBeforeOrAfter, 1);
    }
  }
  return arrayOfDates;
};

export const nextFourMonths = fromDate => {
  return [0, 1, 2, 3].map(x => {
    return getNextDate(fromDate, x);
  }).reverse();
};

export const previousFourMonths = fromDate => {
  return [0, 1, 2, 3].map(x => {
    return getPreviousDate(fromDate, x);
  });
};

const getPreviousDate = (fromDate, monthsBefore) => {
  const previousDate = new Date(fromDate.getFullYear(), fromDate.getMonth() - monthsBefore, 1);
  return previousDate;
};

const getNextDate = (fromDate, monthsNext) => {
  const nextDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + monthsNext, 1);
  return nextDate;
};

