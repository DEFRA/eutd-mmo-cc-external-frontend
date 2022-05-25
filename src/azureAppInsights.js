import config from './config';
import * as appInsights from 'applicationinsights';

export default () => {

  if (config.INSTRUMENTATION_KEY) {
    appInsights.setup(config.INSTRUMENTATION_KEY)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true)
      .setUseDiskRetryCaching(true);
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = config.INSTRUMENTATION_CLOUD_ROLE;
    appInsights.start();
    console.info(`Application insights enabled with key: ${config.INSTRUMENTATION_KEY}`);
  } else {
    console.info('Application insights disabled');
  }

};
