
import logger from './logger';

export const fetchDynamicsToken = (idm) => {
  return idm.dynamics.getToken();
};

export const fetchUserDetails = (idm, credentials) => {
  let { claims } = credentials;
  const { sub } = claims;
  return idm.dynamics.readContacts({ b2cObjectId: sub });
};

export const fetchEmployerDetails = (idm, credentials) => {
  let { claims } = credentials;
  const { contactId } = claims;
  return idm.dynamics.readContactsEmployerLinks(contactId);
};

export const autoEnrollUserForService = async (idm, creds, request, appConfig) => {
  logger.info(`[Logger][Testing][time : ${new Date()}] ---  change no 1`);
  logger.info('[IDM][autoEnrollUserForService][STARTED]');
  try {
    let claims = await idm.getClaims(request);
    const mappings = idm.dynamics.getMappings();
    const { contactId } = claims;

    const logSanitisedMappings = mappings? {
      enrolmentStatus: mappings.enrolmentStatus,
      serviceUserLinkStatusCode : mappings.serviceUserLinkStatusCode,
    } : '' ;
    logger.info('[IDM][autoEnrollUserForService] mappings for logged in user', logSanitisedMappings);
    const logSanitisedClaims = claims ? {
      exp : claims.exp,
      nbf : claims.nbf,
      ver : claims.ver,
      iss : claims.iss,
      auth_time : claims.auth_time,
      sub : claims.sub
    } : '';
    logger.info('[IDM][autoEnrollUserForService] Claims for logged in user', logSanitisedClaims);

    if (!creds || !claims) {
      throw new Error('[IDM][autoEnrollUserForService][ERROR] User not authenticated');
    }

    const contactAccountLinks = await idm.dynamics.readContactsAccountLinks(contactId);

    if (!contactAccountLinks || !contactAccountLinks.length) {
      throw new Error(`[IDM][autoEnrollUserForService][ERROR] Contact record not linked to any accounts - contactId ${contactId}`);
    }

    // Get all unspent EnrolmentRequests
    const enrolmentRequests = await idm.dynamics.readEnrolmentRequests(appConfig.IDENTITY_SERVICEID, contactId);

    if (!enrolmentRequests.length) {
      logger.info(`[IDM][autoEnrollUserForService][IDENTITY_SERVICEID : ${appConfig.IDENTITY_SERVICEID}][IDENTITY_SERVICEROLEID [${appConfig.IDENTITY_SERVICEROLEID}][NO-ENROLMENTS]`);
      return;
    }
    logger.info(`[IDM][autoEnrollUserForService][IDENTITY_SERVICEID : ${appConfig.IDENTITY_SERVICEID}][IDENTITY_SERVICEROLEID [${appConfig.IDENTITY_SERVICEROLEID}][WITH-ENROLMENTS]`);

    // Create enrolments for all our unspent EnrolmentRequests
    await Promise.all(enrolmentRequests.map(enrolmentRequest => idm.dynamics.createEnrolment(contactId, enrolmentRequest.connectionDetailsId, mappings.enrolmentStatus.completeApproved, enrolmentRequest.accountId, appConfig.IDENTITY_SERVICEID, appConfig.IDENTITY_SERVICEROLEID)));

    // Refresh our token with new roles
    await idm.refreshToken(request);

  } catch (e) {

    throw new Error(`[Enrolment failed][${e}][${e.stack}]`);

  }

};
