import CONFIG from '../config';

const Cryptr = require('cryptr');
const KeyVault = require('azure-keyvault');
const cryptr = new Cryptr(CONFIG.KEY_VAULT_ENCRYPTION_KEY);
const AuthenticationContext = require('adal-node').AuthenticationContext;

const createClient = (clientId, clientSecret) => {
    const authenticator = function(challenge, callback) {
    let context = new AuthenticationContext(challenge.authorization);

    return context.acquireTokenWithClientCredentials(challenge.resource, clientId, clientSecret, function(err, tokenResponse) {
        if (err) {
            throw err;
        }

        let authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
        return callback(null, authorizationValue);
        });
    };

    const credentials = new KeyVault.KeyVaultCredentials(authenticator);
    return new KeyVault.KeyVaultClient(credentials);
};

export const getSecretByName = async (secretName) => {
    const decryptedClientId = cryptr.decrypt(CONFIG.CLIENT_ID);
    const decryptedClientSecret = cryptr.decrypt(CONFIG.CLIENT_SECRET);
    const decryptedVaultUrl = cryptr.decrypt(CONFIG.KEY_VAULT_URL);
    const client = createClient(decryptedClientId, decryptedClientSecret);

    try {
        const response = await client.getSecret(decryptedVaultUrl, secretName, '');
        return response.value;
    } catch(err) {
        console.log(`Error(statusCode=${err.statusCode},code=${err.code},message=${err.message})`);
        throw new Error(err.message);
    }
};
