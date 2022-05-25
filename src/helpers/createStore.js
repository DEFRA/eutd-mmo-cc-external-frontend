import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

import reducers from '../client/reducers';
import config from '../config';
import {getProxiedOrchestrationServiceUrl} from '../proxy/orchestration-service.proxy';
import {getProxiedReferenceServiceUrl} from '../proxy/reference-service.proxy';
import {getProxiedDynamixServiceUrl} from '../proxy/dynamix.proxy';

export default (req, loginUrl, search, accountId) => {
  //set ga params to config
  if (search !== undefined)
    config.gaParams = search;

  let url = getProxiedOrchestrationServiceUrl(config);
  const axiosInstance = axios.create({
    baseURL: url,
    headers: {
      cookie: req.headers['cookie'] || ''
    }
  });

  let referenceServiceUrl = getProxiedReferenceServiceUrl(config);
  const axiosInstanceForRefServices = axios.create({
    baseURL: referenceServiceUrl,
    headers: {
      cookie: req.headers['cookie'] || ''
    }
  });

  let dynamixServiceUrl = getProxiedDynamixServiceUrl(config);
  const axiosInstanceForDynamixServices = axios.create({
    baseURL: dynamixServiceUrl,
    headers: {
      cookie: req.headers['cookie'] || ''
    }
  });


  return createStore(
    reducers,
    {
      config: {
        idleTimeout: config.IDLE_TIME_OUT_IN_MILLISECONDS,
        warningTimeout: config.WARNING_T0_TIME_OUT_IN_MILLISECONDS,
        axiosTimeout: config.AXIOS_TIMEOUT,
        catchCertHelpUrl: config.CATCH_CERT_HELP_URL,
        storageDocHelpUrl: config.STORAGE_DOC_HELP_URL,
        processingStatementHelpUrl: config.PROCESSING_STATEMENT_HELP_URL,
        instrumentationKey: config.INSTRUMENTATION_KEY,
        gaTrackingId: config.GA_TRACKING_ID,
        gaParams: '',
        enableErrorPage:  config.ENABLE_ERROR_PAGE,
        feedbackUrl: config.FEEDBACK_URL,
        maximumConcurrentDrafts: config.MAXIMUM_CONCURRENT_DRAFTS,
        maxLandingsLimit: config.LIMIT_ADD_LANDINGS,
        maxSpeciesLimit: config.LIMIT_ADD_SPECIES,
        landingLimitDaysInTheFuture: config.LANDING_LIMIT_DAYS_IN_THE_FUTURE,
        offlineValidationTime: config.OFFLINE_PROCESSING_TIME_IN_MINUTES,
        versionInfo: {
          gitHash: config.GIT_HASH
        },
        loginUrl: loginUrl,
        enabledAccountDetailsFetch: !!accountId,
        enableTranslation:config.ENABLE_TRANSLATION,
        languages: config.languages
      }
    },
    applyMiddleware(
      thunk.withExtraArgument({ orchestrationApi: axiosInstance, referenceServiceApi: axiosInstanceForRefServices, dynamixApi: axiosInstanceForDynamixServices})
    )
  );
};
