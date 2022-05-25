import _ from 'lodash';

export const PLANE_KEY                   = 'plane';
export const TRUCK_KEY                   = 'truck';
export const TRAIN_KEY                   = 'train';
export const CONTAINER_VESSEL_KEY        = 'containerVessel';
export const DIRECT_LANDING_KEY          = 'directLanding';
export const DESTINATION_KEY             = 'departurePlace';
export const RAILWAY_BILL_NUMBER_KEY     = 'railwayBillNumber';
export const FLIGHT_NUMBER_KEY           = 'flightNumber';
export const CONTAINER_NUMBER_KEY        = 'containerNumber';
export const FLAG_STATE_KEY              = 'flagState';
export const VESSEL_NAME_KEY             = 'vesselName';
export const REGISTRATION_NUMBER_KEY     = 'registrationNumber';
export const NATIONALITY_OF_VEHICLE_KEY  = 'nationalityOfVehicle';
export const TRANSPORT_TYPE_KEY          = 'vehicle';
export const TRANSPORT_SELECTION_KEY     = 'transportSelection';

export const ALL_SUPPORTED_VEHICLE_TYPES = [
  TRUCK_KEY,
  PLANE_KEY,
  TRAIN_KEY,
  CONTAINER_VESSEL_KEY,
  DIRECT_LANDING_KEY
];

export const ALL_SUPPORTED_VEHICLE_TYPES_NO_DIRECT_LANDING = [
  TRUCK_KEY,
  PLANE_KEY,
  TRAIN_KEY,
  CONTAINER_VESSEL_KEY
];

export const capitalizeFirstLetter = word => {
  return word.toLowerCase().split(' ').map(_.capitalize).join(' ');
};

export const VEHICLE_TYPE_FIELDS = {
  [PLANE_KEY]: [DESTINATION_KEY, TRANSPORT_TYPE_KEY, FLIGHT_NUMBER_KEY, CONTAINER_NUMBER_KEY],
  [TRUCK_KEY]: [DESTINATION_KEY, TRANSPORT_TYPE_KEY, REGISTRATION_NUMBER_KEY, NATIONALITY_OF_VEHICLE_KEY],
  [TRAIN_KEY]: [DESTINATION_KEY, TRANSPORT_TYPE_KEY, RAILWAY_BILL_NUMBER_KEY],
  [CONTAINER_VESSEL_KEY]: [DESTINATION_KEY, TRANSPORT_TYPE_KEY, VESSEL_NAME_KEY, FLAG_STATE_KEY, CONTAINER_NUMBER_KEY],
  [DIRECT_LANDING_KEY]: []
};
