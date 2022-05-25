import Boom from '@hapi/boom';
import { Issuer } from 'openid-client';
import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import Iron from '@hapi/iron';
import config from './config';

const ADMIN_LOGIN                 = '/admin-login';
const redirectUri                 = '/auth/openid/returnUri';
export const REDIRECT_URL         = `${config.BASE_URL}${redirectUri}`;

Issuer.defaultHttpOptions = {
  timeout: 5000,
  retries: 2
};

export const getClient = async () => {
  const clientId = config.AAD_CLIENTID;
  const clientSecret = config.AAD_CLIENTSECRET;
  const tenantId = config.AAD_TENANTID;

  const discoveryUri = `https://login.microsoftonline.com/${tenantId}/.well-known/openid-configuration`;

  console.log('Instantiating issuer...');

  const issuer = await Issuer.discover(discoveryUri);

  console.log('Issuer instantiated');
  console.log('Instantiating client...');

  const client = new issuer.Client({
    client_id: clientId,
    client_secret: clientSecret
  });

  console.log('Client instantiated');

  return client;
};

export const setupAADAuth = async (server) => {
  const tenantId = config.AAD_TENANTID;
  const url = `https://login.microsoftonline.com/${tenantId}/.well-known/openid-configuration`;
  const issuer = await Issuer.discover(url);
  const jwksUri = issuer.metadata.jwks_uri;
  const client = jwksClient({
    cache: true,
    jwksUri
  });

  const getSigningKey = (kid) => {
    return new Promise((res, rej) => {
      client.getSigningKey(kid, (err, key) => {
        if(err) rej(err);
        res(key);
      });
    });
  };

  const scheme = function () {
    return {
      authenticate: async (request, h) => {
        if (request.state && request.state.id) {
          try {
            const token = request.state.id;
            const unencrypted = await Iron.unseal(token, config.IDENTITY_COOKIEPASSWORD, Iron.defaults);
            const decoded = jwt.decode(unencrypted, {
              complete: true
            });

            const key = await getSigningKey(decoded.header.kid);
            // this checks the expiry time as well and throws an error
            jwt.verify(unencrypted, key.publicKey, { algorithms: ['RS256'] });
            return h.authenticated({
              credentials: {
                id: token
              }
            });

          } catch(e) {
            console.error(e);
            if (e.name === 'TokenExpiredError') {
              // user had a token but expired so we can get user to log back in by redirecting them back to admin login
              // TODO: Possibly use this hook to refresh credentials.
              const resp = h.response('You are being redirected...');
              // TODO: We could add the original path so that user returns to the exact point where they initiated the call
              return resp.takeover().redirect(ADMIN_LOGIN);
            }
            return h.unauthenticated(Boom.unauthorized(null, 'custom'));
          }
        } else {
          return h.unauthenticated(Boom.unauthorized(null, 'custom'));
        }

      }
    };
  };
  server.auth.scheme('custom', scheme);
  server.auth.strategy('admin', 'custom');
};


export const setupAADRoutes = server => {
  server.route([
    {
      method: 'GET',
      path: ADMIN_LOGIN,
      options: {
        auth: false // 'admin'
      },
      handler: async (req, h) => {
        const cl = await getClient();

        const redirectTo = cl.authorizationUrl({
          redirect_uri: REDIRECT_URL,
          scope: 'openid',
          response_mode: 'form_post',
        });

        return h.redirect(redirectTo);
      }
    },
    {
      method: ['GET', 'POST'],
      path: redirectUri,
      options: {
        auth: false
      },
      handler: async (request, h) => {
        try {
          const { payload } = request;
          const cl = await getClient();
          const { state } = payload;
          return cl.callback(REDIRECT_URL, payload, { state }).then((tokenSet) => {

            const returnScript = `<script nonce=${config.CSP_SCRIPT_NONCE.eccServiceRedirect} type="application/javascript" >( function() { setTimeout(function() { window.location = "${config.BASE_URL}" }, 200 ) })()</script>`;
            h.state('id', tokenSet.id_token, {
              encoding: 'iron',
              password: config.IDENTITY_COOKIEPASSWORD,
              path: '/',
              isSameSite: 'Lax',
              isSecure: config.APP_USES_HTTPS,
              isHttpOnly: true,
              ignoreErrors: true
            });
            return h.response(returnScript);
          });

        } catch (e) {
          console.error(`[AAD Error][${redirectUri}]`, e, request);
        }
      }
    }
  ]);
  console.log('setupAADRoutes...');
};
