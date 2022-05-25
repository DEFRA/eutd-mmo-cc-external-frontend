import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
  BackLink,
  GridCol,
  GridRow,
  H1,
  H2,
  ListItem,
  Main,
  OrderedList,
  UnorderedList,
} from 'govuk-react';
import HelpLink from '../../components/HelpLink';
import ContinueButton from '../../components/elements/ContinueButton';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import PageTitle from '../../components/PageTitle';
import SecondaryButton from '../../components/elements/SecondaryButton';
import ErrorIsland from '../../components/elements/ErrorIsland';
import ProgressItem from '../../components/ProgressItem';
import {
  getProgress,
  clearProgress,
  checkProgress,
  clearErrors
} from '../../actions/progress.actions';
import { scrollToErrorIsland, onHandleErrorClick } from '../utils';
import { getLandingType } from '../../actions/landingsType.actions';
import { getTransportDetails, clearTransportDetails } from '../../actions';
import { forwardUri } from '../../helpers/vehicleRouteLookup';
import { withTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

const ProgressPage = ({ transport = {}, unauthorised = false, ...props}) => {
  const pageTitle =  props.t('progressTitleText');
  const {
    previousUri,
    dashboardUri,
    nextUri,
    journey,
    addUserReferenceUri,
    addExporterDetailsCatchCertificateUri,
    addSpeciesUri,
    uploadFileUri,
    directLandingUri,
    addLandingsUpdatedUri,
    whoseWatersUri,
    whereExportingUri,
    transportSelectionUri,
    title,
  } = props.route;
  const { params } = props.match;
  const { documentNumber } = params;
  const { completedSections, requiredSections, progress, t, errors } = props;

  const transportVehicle = transport.vehicle ? transport.vehicle : '';
  const landingDetailsUrl =
    props.landingsType === 'directLanding'
      ? directLandingUri
      : addLandingsUpdatedUri;

  const progressData = progress || {};

  const links = {
    reference: addUserReferenceUri.replace(':documentNumber', documentNumber),
    exporter: addExporterDetailsCatchCertificateUri.replace(
      ':documentNumber',
      documentNumber
    ),
    dataUpload: uploadFileUri.replace(':documentNumber', documentNumber),
    products: addSpeciesUri.replace(':documentNumber', documentNumber),
    landings: landingDetailsUrl.replace(':documentNumber', documentNumber),
    conservation: whoseWatersUri.replace(':documentNumber', documentNumber),
    exportJourney: whereExportingUri.replace(':documentNumber', documentNumber),
    transportType: transportSelectionUri.replace(
      ':documentNumber',
      documentNumber
    ),
    transportDetails: forwardUri(transportVehicle, props.route).replace(
      ':documentNumber',
      documentNumber
    ),
  };

  const onLinkClick = (link) => (e) => {
    e.preventDefault();
    if (!isEmpty(errors)) props.clearErrors();
    props.history.push(link);
  };

  const handleBackLinkClick = (event) => {
    event.preventDefault();
    props.history.push(previousUri.replace(':documentNumber', documentNumber));
  };

  const handleReturnToDashboard = (event) => {
    event.preventDefault();
    props.history.push(dashboardUri);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await props.checkProgress(documentNumber, journey);
      props.history.push(nextUri.replace(':documentNumber', documentNumber));
    } catch (e) {
      scrollToErrorIsland();
    }
  };

  useEffect(async () => {
    props.getLandingType(documentNumber);
    await props.getProgress(documentNumber, journey);
    await props.getTransportDetails(journey, documentNumber);
  }, []);

  useEffect(() => {
    if (props.generatedByContent === false && props.landingsType === null) {
      props.history.push(
        previousUri.replace(':documentNumber', documentNumber)
      );
    }
  }, [props.landingsType]);

  useEffect(() => {
    return () => {
      props.clearProgress();
      props.clearTransportDetails();
      props.clearErrors();
    };
  }, []);

  useEffect(() => {
    if (unauthorised) {
      props.history.push('/forbidden');
    } else if (progress === null) {
      props.history.push(
        previousUri.replace(':documentNumber', documentNumber)
      );
    }
  }, [unauthorised, progress]);

  return (
    <Main>
      <PageTitle title={`${pageTitle} - ${t(title)}`} />
      {!isEmpty(errors) && errors.errors && errors.errors.length > 0 && (
        <ErrorIsland
          errors={errors.errors.map((err) => ({
            message: t(err.text),
            key: err.targetName,
          }))}
          onHandleErrorClick={onHandleErrorClick}
        />
      )}
      <GridRow>
        <GridCol>
          <BackLink
            onClick={handleBackLinkClick}
            href={previousUri.replace(':documentNumber', documentNumber)}
          >
            {t('commonBackLinkBackButtonLabel')}
          </BackLink>
          <H1>{t('progressTitleText')}</H1>
          <H2
            className="govuk-heading-m progess-h1text"
            data-testid="Progress-heading"
          >
            {`${t('ccCatchCertificateApplication')}:`}
            {documentNumber}
          </H2>
          <br />
          <br />
          <div className="task-list-info">
            <H2
              className="govuk-heading-m"
              data-testid="ApplicationIncomplete-heading"
            >
              {completedSections === requiredSections
                ? t('ccProgressPageApplicationComplete')
                : t('ccProgressPageApplicationIncomplete')}
            </H2>
            <p data-testid="completedSections">
              {t('ccProgressPageCompletedSectionContent', {
                completedSections,
                requiredSections,
              })}
            </p>
          </div>
          <OrderedList className="app-task-list">
            <ListItem>
              <H2
                className="app-task-list__section"
                data-testid="Exporter-heading"
              >
                <span className="app-task-list__section-number">1.</span>
                {t('ccProgressPageExporter')}
              </H2>
              <UnorderedList className="app-task-list__items">
                <div className="grey-border-top"></div>
                <ProgressItem
                  title={t('ccProgressPageExporterYourReference')}
                  testId="yourReference"
                  optional={true}
                  status={progressData.reference}
                  href={links.reference}
                  onClick={onLinkClick(links.reference)}
                />
                <ProgressItem
                  title={t('ccProgressPageExporterDetails')}
                  id="exporter"
                  error={errors.exporterError}
                  status={progressData.exporter}
                  testId="exporterDetails"
                  href={links.exporter}
                  onClick={onLinkClick(links.exporter)}
                />
              </UnorderedList>
            </ListItem>
            <br />
            <br />
            <ListItem>
              <H2
                className="app-task-list__section"
                data-testid="ProductsAndLandings-heading"
              >
                <span className="app-task-list__section-number">2.</span>
                {t('ccProgressPageProductsOrLandings')}
              </H2>
              <UnorderedList className="app-task-list__items">
                <div className="grey-border-top"></div>
                <ProgressItem
                  title={t('ccProgressPageProductsOrLandingsDataUpload')}
                  status={progressData.dataUpload}
                  testId="dataUpload"
                  href={links.dataUpload}
                  onClick={onLinkClick(links.dataUpload)}
                />
                <ProgressItem
                  title={t('ccProgressPageProductsDetails')}
                  id="products"
                  error={errors.productsError}
                  status={progressData.products}
                  testId="productDetails"
                  href={links.products}
                  onClick={onLinkClick(links.products)}
                />
                <ProgressItem
                  title={t('ccProgressPageLandingsDetails')}
                  id="landings"
                  error={errors.landingsError}
                  status={progressData.landings}
                  testId="landingDetails"
                  href={links.landings}
                  onClick={onLinkClick(links.landings)}
                />
                <ProgressItem
                  title={t('ccProgressPageProductsOrLandingsCatchWaters')}
                  id="conservation"
                  error={errors.conservationError}
                  status={progressData.conservation}
                  testId="catchWaters"
                  href={links.conservation}
                  onClick={onLinkClick(links.conservation)}
                />
              </UnorderedList>
            </ListItem>
            <br />
            <br />
            <ListItem>
              <H2
                className="app-task-list__section"
                data-testid="Transportation-heading"
              >
                <span className="app-task-list__section-number">3.</span>
                {t('ccProgressPageTransportation')}
              </H2>
              <UnorderedList className="app-task-list__items">
                <div className="grey-border-top"></div>
                <ProgressItem
                  title={t('ccProgressPageTransportationExportJourney')}
                  id="exportJourney"
                  error={errors.exportJourneyError}
                  status={progressData.exportJourney}
                  testId="exportJourney"
                  href={links.exportJourney}
                  onClick={onLinkClick(links.exportJourney)}
                />
                <ProgressItem
                  title={t('ccProgressPageTransportationTransportType')}
                  id="transportType"
                  error={errors.transportTypeError}
                  status={progressData.transportType}
                  testId="transportType"
                  href={links.transportType}
                  onClick={onLinkClick(links.transportType)}
                />
                <ProgressItem
                  title={t('ccProgressPageTransportationTransportDetails')}
                  id="transportDetails"
                  error={errors.transportDetailsError}
                  status={progressData.transportDetails}
                  testId="transportDetails"
                  href={links.transportDetails}
                  onClick={onLinkClick(links.transportDetails)}
                />
              </UnorderedList>
            </ListItem>
          </OrderedList>
          <br />
          <br />
          <GridRow>
            <SecondaryButton
              type="button"
              id="returnToYourDashboard"
              name="returnToYourDashboard"
              value="returnToYourDashboard"
              className="govuk-button govuk-button--secondary"
              onClick={handleReturnToDashboard}
            >
              {t('ccProgressPageReturnToYourDashboard')}
            </SecondaryButton>
            <ContinueButton onClick={handleSubmit} id="continue">
              {t('ccProgressPageContinueButtonLabel')}
            </ContinueButton>
          </GridRow>
          <HelpLink journey={journey} />
        </GridCol>
      </GridRow>
    </Main>
  );
};

function mapStateToProps(state) {
  const progress = state.progress;
  const landingsType = state.landingsType;

  return {
    progress: progress.progress,
    generatedByContent: landingsType.generatedByContent,
    landingsType: landingsType.landingsEntryOption,
    transport: state.transport,
    completedSections: progress.completedSections,
    requiredSections: progress.requiredSections,
    unauthorised: progress.unauthorised,
    errors: state.errors,
  };
}

function loadData(store, journey) {
  return Promise.all([
    store.dispatch(getProgress(this.documentNumber, journey)),
    store.dispatch(getLandingType(this.documentNumber)),
    store.dispatch(getTransportDetails(journey, this.documentNumber)),
  ]);
}

export const component = withRouter(
  connect(mapStateToProps, {
    getProgress,
    getLandingType,
    getTransportDetails,
    clearProgress,
    clearTransportDetails,
    checkProgress,
    clearErrors
  })(withTranslation()(ProgressPage))
);

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
