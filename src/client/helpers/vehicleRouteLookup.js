export const forwardUri = (vehicle, route) => {
  const {truckCmrUri, planeDetailsUri, trainDetailsUri, containerVesselDetailsUri, summaryUri} = route;

  let nextUri = '';
  switch (vehicle) {
    case 'truck':
      nextUri = truckCmrUri;
      break;
    case 'plane':
      nextUri = planeDetailsUri;
      break;
    case 'train':
      nextUri = trainDetailsUri;
      break;
    case 'containerVessel':
      nextUri = containerVesselDetailsUri;
      break;
    case 'directLanding':
      nextUri = summaryUri;
      break;
  }

  return nextUri;
};

export const backUri = (vehicle, cmr, route) => {
  const {truckDetailsUri, truckCmrUri, planeDetailsUri, trainDetailsUri, containerVesselDetailsUri, transportSelectionUri} = route;

  let nextUri = '';
  switch (vehicle) {
    case 'truck':
      nextUri = cmr === 'true' ? truckCmrUri : truckDetailsUri;
      break;
    case 'plane':
      nextUri = planeDetailsUri;
      break;
    case 'train':
      nextUri = trainDetailsUri;
      break;
    case 'containerVessel':
      nextUri = containerVesselDetailsUri;
      break;
    case 'directLanding':
      nextUri = transportSelectionUri;
      break;
  }

  return nextUri;
};


