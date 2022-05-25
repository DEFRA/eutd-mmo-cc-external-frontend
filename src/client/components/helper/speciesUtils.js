export const findSpeciesState = (stateCode, speciesStates) => {
  speciesStates = speciesStates || [];

  return speciesStates.find(s => {
    return s.value === stateCode;
  });
};

export const findPresentation = (presentationCode, speciesPresentations) => {
  speciesPresentations = speciesPresentations || [];

  return speciesPresentations.find(p => {
    return p.value === presentationCode;
  });
};

export const findCommodity = (commodityCode, commodityCodes) => {
  commodityCodes = commodityCodes || [];

  return commodityCodes.find(commodity => {
    return commodity.code === commodityCode;
  });
};
