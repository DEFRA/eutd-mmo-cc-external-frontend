export const getContactsAccountLinksFromIdmWithCreds = async (idm, creds) => {
  const { claims = {}} = creds;
  const { contactId } = claims;
  let contactAccountLinks;
  if (contactId) {
    contactAccountLinks = await idm.dynamics.readContactsAccountLinks(contactId);
  }
  return contactAccountLinks;
};

export const getContactsAccountLinksFromIdm = async (idm, request) => {
  let creds = await idm.getCredentials(request);
  // If the user has credentials and they are expired, call the refresh method
  if (creds && creds.isExpired()) {
    await idm.refreshToken(request);
    creds = await idm.getCredentials(request);
  }
  return getContactsAccountLinksFromIdmWithCreds(idm, creds);
};

export const getContactsAccountLinks = async(request) => {
  let contactAccountLinks = {}; // User details and any other info that the FE app might need
  const { idm } = request.server.methods;
  if (idm) {
    contactAccountLinks = await getContactsAccountLinksFromIdm(idm, request);
  }
  return contactAccountLinks;
};

export const getCredentialsFromIdm = async (idm, request) => {
  let creds = await idm.getCredentials(request);
  // If the user has credentials and they are expired, call the refresh method
  if (creds && creds.isExpired()) {
    await idm.refreshToken(request);
    creds = await idm.getCredentials(request);
  }
  return creds;
};

export const getCredentials = async(request) => {
  let creds = {}; // User details and any other info that the FE app might need
  const { idm } = request.server.methods;
  if (idm) {
    creds = await getCredentialsFromIdm(idm, request);
  }
  return creds;
};

export const getDynamicsToken = async(request) => {
  let dynamicsToken; // User details and any other info that the FE app might need
  const { idm } = request.server.methods;

  if (idm) {
    const { getToken } = idm.dynamics;
    dynamicsToken = await getToken();
  }
  return dynamicsToken;
};
