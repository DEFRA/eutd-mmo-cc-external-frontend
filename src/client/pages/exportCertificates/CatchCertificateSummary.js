import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { formatAddress } from '../utils';
import ErrorIsland from '../../components/elements/ErrorIsland';
import LinkTargetBlank from '../../components/elements/LinkTargetBlank';
import {getProgress} from '../../actions/progress.actions';
import { withTranslation } from 'react-i18next';

import {
  Main,
  Header,
  WarningText,
  BackLink,
  GridRow,
  GridCol,
  LabelText
} from 'govuk-react';

import PageTitle from '../../components/PageTitle';
import {
  createExportCertificate,
  getDocument
} from '../../actions';
import { getSummaryCertificate } from '../../actions/certificate.actions';

import ConfirmationForm from '../../components/ConfirmationForm';

import {
  ChangeLinkTag,
  SummaryTable,
  SummaryRow,
  SummaryCellKey,
  SummaryCellValue,
  SummaryCellLink
} from '../../components/Summary';

import NotificationBanner from '../../components/NotificationBanner';

import { scrollToFieldName } from '../utils';
import { backUri } from '../../helpers/vehicleRouteLookup';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import HelpLink from '../../components/HelpLink';
import TransportSummary from '../common/transport/TransportSummary';
import { isEmpty, lowerCase } from 'lodash';
import { t } from 'i18next';

class CatchCertificateSummary extends Component {

  state = {
    isSubmitDisabled: false
  }

  constructor(props) {
    super(props);
  }

  hasTransportDetails(transport) {
    if (!transport)
      return false;

    let hasRequiredTransportDetails;

    switch (transport.vehicle) {
      case 'truck':
        if (transport.cmr === undefined || transport.cmr === 'false') {
          hasRequiredTransportDetails = ['nationalityOfVehicle', 'registrationNumber', 'departurePlace'].every(prop => !isEmpty(transport[prop]));
          break;
        }

        hasRequiredTransportDetails = true;
        break;
      case 'plane':
        hasRequiredTransportDetails = ['flightNumber', 'containerNumber', 'departurePlace'].every(prop => !isEmpty(transport[prop]));
        break;
      case 'train':
        hasRequiredTransportDetails = ['railwayBillNumber', 'departurePlace'].every(prop => !isEmpty(transport[prop]));
        break;
      case 'containerVessel':
        hasRequiredTransportDetails = ['vesselName', 'flagState', 'containerNumber', 'departurePlace'].every(prop => !isEmpty(transport[prop]));
        break;
      case 'directLanding':
        hasRequiredTransportDetails = true;
        break;
      default:
        return false;
    }

    return hasRequiredTransportDetails;
  }

  unauthorised() {
    this.props.history.push('/forbidden');
  }

  hasRequiredData() {

    const { exportPayload, exportLocation, conservation, transport } = this.props;

    const hasExporterDetails = this.hasExporterDetails(this.props.exporter);
    const hasExportProduct = !isEmpty(exportPayload.items) && exportPayload.items.some(item => !isEmpty(item.product));
    const hasTransport = !isEmpty(transport) && this.hasTransportDetails(transport);
    const hasExportLocation = !isEmpty(exportLocation);
    const hasConservation = !isEmpty(conservation);

    return hasExporterDetails && hasExportProduct && this.hasExportLandings() && this.hasFinishedProduct() && hasTransport && hasExportLocation && hasConservation;
  }

  hasSystemFailure(validationErrors) {
    return Array.isArray(validationErrors) && validationErrors.some(validationError => validationError.error === 'SYSTEM_ERROR');
  }

  hasFinishedProduct() {
    const { exportPayload } = this.props;
    return exportPayload.items.every(item => item.product.state && item.product.presentation && item.landings && item.landings.length >= 1);
  }

  hasExportedTo() {
    const { exportLocation } = this.props;
    return !isEmpty(exportLocation) && exportLocation.exportedTo;
  }

  hasExporterDetails(exporter) {
    return !isEmpty(exporter) && ['exporterFullName', 'exporterCompanyName', 'addressOne', 'postcode'].every(prop => !isEmpty(exporter[prop]));
  }

  hasExportLandings() {
    const { exportPayload } = this.props;
    return !isEmpty(exportPayload.items) && exportPayload.items.some(item => !isEmpty(item.landings) && item.landings.length > 0)
      && exportPayload.items.every(item => item.landings ? item.landings.every(landing => landing.model.exportWeight && landing.model.exportWeight != '' && isNaN(landing.model.exportWeight) === false) : false);
  }

  isLocked() {
    const { status } = this.props;
    return status === 'LOCKED';
  }

  hasVesselNotFound() {
    const { exportPayload } = this.props;
    const isVesselNotFoundInTheArray = !isEmpty(exportPayload.items)  && exportPayload.items.some(item =>  !isEmpty(item.landings) && item.landings.find(landing => landing.model.vessel.vesselNotFound));
    return isVesselNotFoundInTheArray;
  }

  hasSameVesselAndLandingDate = () => {
    const { exportPayload } = this.props;
    const isVesselAndLandingDateSame = !isEmpty(exportPayload.items) && exportPayload.items.every((item) => {
      return item.landings && item.landings.every((landing) => {
        return landing.model.vessel.label === exportPayload.items[0].landings[0].model.vessel.label &&
          landing.model.dateLanded === exportPayload.items[0].landings[0].model.dateLanded;
      });
    });
    return isVesselAndLandingDateSame;
  }

  isDirectLanding = () => {
    const { transport } = this.props;
    return !!(transport.vehicle === 'directLanding' && this.hasSameVesselAndLandingDate());
  }

  hasExporterAddressBeenUpdated(exporter) {
    return exporter._updated;
  }

  isOverriddenByAdmin() {
    const { items } = this.props.exportPayload;
    return items && items.some(item => item.landings && this.isAnyVesselOverriddenByAdmin(item.landings));
  }

  isAnyVesselOverriddenByAdmin(landings) {
    return landings && landings.some(landing => this.isVesselOverriddenByAdmin(landing));
  }

  isVesselOverriddenByAdmin(landing) {
    return landing?.model?.vessel?.vesselOverriddenByAdmin;
  }

  async componentDidMount() {
    const documentNumber = this.props.match.params['documentNumber'];
    const { journey, landingsEntryUri } = this.props.route;

    await this.props.getSummaryCertificate(journey, documentNumber);
    await this.props.getProgress(documentNumber, journey);

    if (!documentNumber)
      await this.props.getDocument(journey);

    if(this.props.progress.completedSections !== this.props.progress.requiredSections) {
      this.props.history.push(`/create-catch-certificate/${documentNumber}/progress`);
    } else if (this.props.landingsEntryOption === null) {
      this.props.history.push(landingsEntryUri.replace(':documentNumber', documentNumber));
    } else if (!this.hasFinishedProduct()) {
      this.props.history.push(`/create-catch-certificate/${documentNumber}/what-are-you-exporting`);
    } else if (!this.hasExportLandings()) {
      this.props.history.push(`/create-catch-certificate/${documentNumber}/add-landings`);
    } else if (!this.hasExportedTo()) {
      this.props.history.push(`/create-catch-certificate/${documentNumber}/what-export-journey`);
    }  else if (!this.hasExporterDetails(this.props.exporter)) {
      this.props.history.push(`/create-catch-certificate/${documentNumber}/add-exporter-details`);
    } else if (!this.hasRequiredData()) {
      this.unauthorised();
    }
  }

  componentDidUpdate() {
    const { exportPayload } = this.props;

    if (exportPayload.unauthorised === true || exportPayload.items === undefined) {
      this.unauthorised();
    }
  }

  renderContinueButton() {
    const { path, completeUri, pendingUri, redirectUri, journey } = this.props.route;

    const documentNumber = (this.props.match && this.props.match.params)
      ? this.props.match.params['documentNumber']
      : undefined;

    const completeUrl = completeUri.replace(':documentNumber', documentNumber);
    const pendingUrl = pendingUri.replace(':documentNumber', documentNumber);
    const redirectUrl = redirectUri.replace(':documentNumber', documentNumber);

    return (
      <ConfirmationForm
        currentUri={path}
        completeUri={completeUrl}
        pendingUri={pendingUrl}
        redirectUri={redirectUrl}
        journey={journey}
        noOfVessels={this.getTotalNumberOfVessels()}
        documentNumber={documentNumber}
        createExportCertificate={this.props.createExportCertificate}
        disableSubmit={this.disableSubmit.bind(this)}
      />
    );
  }

  disableSubmit() {
    this.setState({ isSubmitDisabled: true });
  }

  renderConservationManagement() {
    const { caughtInUKWaters, caughtInEUWaters, caughtInOtherWaters, otherWaters } = this.props.conservation;
    const { conservationManagementUri } = this.props.route;
    const conservationManagementUrl = conservationManagementUri.replace(':documentNumber', this.props.match.params['documentNumber']);
    const whoseWaters = [];

    if (caughtInUKWaters === 'Y') whoseWaters.push('UK, British Isles');
    if (caughtInEUWaters === 'Y') whoseWaters.push('EU');
    if (caughtInOtherWaters === 'Y') whoseWaters.push(otherWaters);

    if (whoseWaters.length) {
      return (
        <SummaryTable>
          <SummaryRow>
            <SummaryCellKey>{t('ccWhoseWatersWereTheyCaughtInHeaderText')}</SummaryCellKey>
            <SummaryCellValue>{whoseWaters.map((location, index) => <Fragment key={index}>{location}<br /></Fragment>)}</SummaryCellValue>
            <SummaryCellLink>
              {!this.isLocked() &&
                <ChangeLinkTag id="change-whose-waters" to={conservationManagementUrl}>{t('commonSummaryPageChangeLink')}
                <span className="govuk-visually-hidden">
                    {t('ccSummaryVHiddenTextCatchLocationsText')}
                </span>
                </ChangeLinkTag>
              }
            </SummaryCellLink>
          </SummaryRow>
        </SummaryTable>
      );
    }
  }

  totalWeight() {
    const { exportPayload = { items: [] } } = this.props;
    if (exportPayload.items !== undefined) {
      return exportPayload.items.reduce(function (accum, cur) {
        if (cur.landings && cur.landings.length > 0) {
          accum += cur.landings.reduce(function (accum1, cur1) {
            if (cur1.model && !isNaN(cur1.model.exportWeight)) {
              accum1 += Number(cur1.model.exportWeight);
            }
            return accum1;
          }, 0);
        }
        return accum;
      }, 0);
    }
  }

  getTotalNumberOfVessels() {
    const { exportPayload = { items: [] } } = this.props;
    let totalNumberOfVessels = 0;

    if (exportPayload.items !== undefined) {
      if (exportPayload.items.length > 0) {
        exportPayload.items.forEach(vessel => {
          if (vessel.landings !== undefined) {
            totalNumberOfVessels += vessel.landings.length;
          }
        });
      }
    }

    return totalNumberOfVessels;
  }

  isLandingInvalid(product, landing) {
    const { validationErrors } = this.props;
    if (Array.isArray(validationErrors) && validationErrors.length > 0 && Object.keys(validationErrors[0]).length > 0) {
      return validationErrors.some((validationError) => {
        return (validationError.state === product.state.code &&
          validationError.species === product.species.code &&
          validationError.presentation === product.presentation.code &&
          moment(validationError.date).isSame(landing.model.dateLanded, 'day') &&
          validationError.vessel === landing.model.vessel.vesselName);
      });
    }
    return false;
  }

  getValidationError(product, landing) {
    const { validationErrors } = this.props;
    if (Array.isArray(validationErrors) && validationErrors.length > 0 && Object.keys(validationErrors[0]).length > 0) {
      return validationErrors.find((validationError) => {
        return (validationError.state === product.state.code &&
          validationError.species === product.species.code &&
          validationError.presentation === product.presentation.code &&
          moment(validationError.date).isSame(landing.model.dateLanded, 'day') &&
          validationError.vessel === landing.model.vessel.vesselName);
      });
    }
    return null;
  }

  getItem(validationError) {
    const { exportPayload = { items: [] } } = this.props;
    if (exportPayload.items !== undefined) {
      if (exportPayload.items.length > 0 && this.hasRequiredData()) {
        return exportPayload.items.find(item => {
          return (validationError.state === item.product.state.code &&
            validationError.species === item.product.species.code &&
            validationError.presentation === item.product.presentation.code &&
            item.landings.some(landing => moment(validationError.date).isSame(landing.model.dateLanded, 'day') &&
              validationError.vessel === landing.model.vessel.vesselName));
        });
      }
    }
    return null;
  }



  renderLandingsBlock() {
    const { route } = this.props;
    const { exportPayload = { items: [] }, landingsEntryOption } = this.props;
    const { landingsEntryOptions = [] } = route;
    const documentNumber = this.props.match.params['documentNumber'];
    const addSpeciesUrl = route.addSpeciesUri.replace(':documentNumber', documentNumber);
    const landingsEntryUri  = route.landingsEntryUri.replace(':documentNumber', documentNumber);
    const addSpeciesRedirectUrl = documentNumber ?
      '&nextUri=/create-catch-certificate/:documentNumber/check-your-information&previousUri=/create-catch-certificate/:documentNumber/check-your-information'
      : '&nextUri=/create-catch-certificate/check-your-information&previousUri=/create-catch-certificate/check-your-information';
    const landingEntry = landingsEntryOptions.find(landingOption => landingOption.value === landingsEntryOption) || {};

    if (exportPayload.items !== undefined) {
      {
        return (
          <SummaryTable>
            <div className="catch-row">
              <div className="catch-table">
                <SummaryRow>
                  <SummaryCellKey>{t('ccLandingsEntryPageTitle')}</SummaryCellKey>
                  <SummaryCellValue>{!isEmpty(landingEntry) ? t(landingEntry.label) : ''}</SummaryCellValue>
                  <SummaryCellLink>
                    {!this.isLocked() && <ChangeLinkTag id='landing-entry' to={landingsEntryUri}>{t('commonSummaryPageChangeLink')}</ChangeLinkTag>}
                  </SummaryCellLink>
                </SummaryRow>
              </div>
            </div>
            {
              exportPayload.items.map((item, index) => {
                const speciesChangeLinkUri =  `${addSpeciesUrl}?andClickId=edit-prd-btn-${item.product.id}${addSpeciesRedirectUrl}`;
                return (
                  <>
                    <div className="catch-row" key={index}>
                      <div className="catch-table">
                      <SummaryRow>
                          <SummaryCellKey>{t('commonSummaryPageCatchesSpecies')}</SummaryCellKey>
                          <SummaryCellValue>{item.product.species.label}</SummaryCellValue>
                          <SummaryCellLink>
                            {(!this.isLocked() && !(this.isDirectLanding() && this.isOverriddenByAdmin())) &&
                              <ChangeLinkTag id={`change-species-${index}`} to={`${speciesChangeLinkUri}`}>{t('commonSummaryPageChangeLink')}
                                <span className="govuk-visually-hidden">
                                  {`${t('commonSummaryPageCatchesSpecies').toLowerCase()} ${item.product.species.label}, ${item.product.state ? item.product.state.label : null}, ${item.product.presentation ? item.product.presentation.label : null}`}
                                </span>
                              </ChangeLinkTag>
                            }
                          </SummaryCellLink>
                      </SummaryRow>
                      <SummaryRow>
                          <SummaryCellKey>{t('ccSpeciesBlockLabelPresentationText')}</SummaryCellKey>
                          <SummaryCellValue>{item.product.presentation ? item.product.presentation.label : null}</SummaryCellValue>
                          <SummaryCellLink></SummaryCellLink>
                      </SummaryRow>
                      <SummaryRow>
                          <SummaryCellKey>{t('ccSpeciesBlockLabelStateText')}</SummaryCellKey>
                          <SummaryCellValue>{item.product.state ? item.product.state.label : null}</SummaryCellValue>
                          <SummaryCellLink></SummaryCellLink>
                      </SummaryRow>
                      <SummaryRow>
                          <SummaryCellKey>{t('commonCommodityCodeLabel')}</SummaryCellKey>
                          <SummaryCellValue>{item.product.commodityCode ? item.product.commodityCode : null}</SummaryCellValue>
                          <SummaryCellLink></SummaryCellLink>
                      </SummaryRow>
                      </div>
                      {this.renderVesselsBlock(item, index)}
                    </div>
                    <br />
                  </>
                );
              })
            }
          </SummaryTable>
        );
      }
    }
  }

  renderVesselsBlock(item, product) {
    const { route, validationErrors } = this.props;
    const validationErrorExists = validationErrors && validationErrors[0] ? (Object.keys(validationErrors[0]).length > 0) ? true : false : false;
    const documentNumber = this.props.match.params['documentNumber'];
    const addLandingsUrl = route.addLandingsUpdatedUri.replace(':documentNumber', documentNumber);
    const addLandingsRedirectUrl = (documentNumber) ?
      '&nextUri=/create-catch-certificate/:documentNumber/check-your-information&previousUri=/create-catch-certificate/:documentNumber/check-your-information'
      : '&nextUri=/create-catch-certificate/check-your-information&previousUri=/create-catch-certificate/check-your-information';

    if (item.landings !== undefined) {
      return (
        item.landings.map((landing, index) => {
          const hasError = validationErrorExists && this.isLandingInvalid(item.product, landing);
          const validationError = hasError ? this.getValidationError(item.product, landing) : null;
          const indexOfError = hasError ? validationErrors.indexOf(validationError) : -1;
          const changeLinkUri = !this.isVesselOverriddenByAdmin(landing) ? `${addLandingsUrl}?andClickId=edit-lnd-btn-${item.product.id}_${landing.model.id}${addLandingsRedirectUrl}` : `${addLandingsUrl}?${addLandingsRedirectUrl}`;
          const dateLandedLabelTrans = t('ccAddLandingDateLandedLabel').split(" ");
          const dateLandedLabel = `${dateLandedLabelTrans[0]} ${dateLandedLabelTrans[1].toLowerCase()}`;

          return (
            <Fragment key={index}>
              <SummaryTable key={index} className="summary" style={{ borderBottom: '#bfc1c3 solid 1px', padding: '7.5px 0' }}>
                <div id="validationError" className={`catch-row ${hasError ? 'error' : ''}`}>
                  {hasError ?
                    <LabelText id={`error-message-${indexOfError}`} className="error-message">
                      {this.getErrorMessage(validationError.rules[0], {
                        species: item.product.species.label,
                        vessel: landing.model.vessel.label,
                        dateLanded: moment(landing.model.dateLanded).format('DD/MM/YYYY')
                      })}
                    </LabelText>
                    : ''
                  }
                  <div className="catch-table">
                    <SummaryRow noSeperator="true">
                      <SummaryCellKey noSeperator="true">
                        <div style={{ borderLeft: '10px #eee solid', paddingLeft: '20px', lineHeight: '30px' }}>
                          {t('ccAddLandingVesselNameLabel')}<br />
                          {t('ccAddLandingCatchAreaLabel')}<br />
                          {dateLandedLabel}<br />
                          {t('sdCheckYourInformationExportWeightLabel')}
                        </div>
                      </SummaryCellKey>
                      <SummaryCellValue noSeperator="true">
                        <div style={{ lineHeight: '30px' }}>
                          {landing.model.vessel.label}<br />
                          {landing.model.faoArea}<br />
                          {moment(landing.model.dateLanded).format('D MMMM YYYY')}<br />
                          {`${landing.model.exportWeight}kg`}
                        </div>
                      </SummaryCellValue>
                      <SummaryCellLink noSeperator="true">
                        {(!this.isLocked() && !(this.isDirectLanding() && this.isOverriddenByAdmin())) &&
                          <ChangeLinkTag id={`change-${product}-landing-${index}`} to={`${this.isDirectLanding() ? `/create-catch-certificate/${documentNumber}/direct-landing`: changeLinkUri}`}>{t('commonSummaryPageChangeLink')}
                            <span className="govuk-visually-hidden">
                              {`${t('ccAddLandingLandingColLabel').toLowerCase()} ${landing.model.dateLanded} ${landing.model.vessel.label} for ${item.product.species.label}, ${item.product.state.label}, ${item.product.presentation.label}`}
                            </span>
                          </ChangeLinkTag>
                        }
                      </SummaryCellLink>
                    </SummaryRow>
                  </div>
                </div>
              </SummaryTable>
            </Fragment>
          );
        })
      );
    }
  }

  getErrorMessage(key, { species, vessel, dateLanded }) {
    const messages = {
      '3C': t('ccSummaryPage3CValidationError', {species, vessel, dateLanded}),
      '3D': t('ccSummaryPage3DValidationError', {species, vessel, dateLanded}),
      '4A': t('ccSummaryPage4AValidationError', {species, vessel, dateLanded}),
      'noDataSubmitted': t('ccSummaryPageNoDataSubmittedError', {species, vessel, dateLanded}),
      'vesselNotFound': t('ccSummaryPageVesselNotFoundForSpeciesCaughtOnLandingDate', {species, vessel, dateLanded}),
      'invalidLandingDate': t('ccSummaryPageInvalidLandingDateError')
     };

     const errorMessage = (key === 'vesselNotFound' || key === 'invalidLandingDate') ? messages[key] : <> {messages[key]} {t('ccSummaryPageErrorFurtherGuidanceLink')}&nbsp;
     <span className="govuk-link-in-error-summary">
       <LinkTargetBlank href="https://www.gov.uk/government/publications/catch-certificate-error-messages" ariaLabel="Opens a new link with information about catch certificate errors" text="GOV.UK"/>
     </span>
     .</>;

    return errorMessage;
  }


  render() {
    const { route, validationErrors } = this.props;
    const { transport, exporter = {}, exportLocation } = this.props;
    const previousPage = backUri(transport.vehicle, transport.cmr, this.props.route);
    const { journey, whereExportingUri } = route;

    const validationErrorExists = validationErrors && validationErrors[0] ?
      (validationErrors[0].state || validationErrors[0].species) ? true : false
      : false;

    const messages = validationErrorExists ? validationErrors.map((validationError, index) => {
      const item = this.getItem(validationError);
      if (item) {
        const landing = item.landings.find(_landing => (moment(validationError.date).isSame(_landing.model.dateLanded, 'day') &&
          validationError.vessel === _landing.model.vessel.vesselName));

        return {
          message: this.getErrorMessage(validationError.rules[0], {
            species: item.product.species.label,
            vessel: landing.model.vessel.label,
            dateLanded: moment(landing.model.dateLanded).format('DD/MM/YYYY')
          }),
          key: 'error-message-' + index
        };
      }

      return {};

    }) : [];

    const documentNumber = this.props.match.params.documentNumber;
    const addExporterDetailsUrl = route.addExporterDetailsUri.replace(':documentNumber', documentNumber);
    const backTo = this.isLocked() ? '/create-catch-certificate/catch-certificates'
      : this.isDirectLanding() ? whereExportingUri.replace(':documentNumber', documentNumber) : previousPage.replace(':documentNumber', documentNumber);
    const notificationMsgs = [];

    let notificationMsg = this.isLocked() ? t('ccSummaryPageDocumentLockedNotification')
      : this.hasVesselNotFound() ? t('ccSummaryPageVesselNotFound')
        : this.isOverriddenByAdmin() && this.isDirectLanding() ? t('ccSummaryPageOverridenByAdminNotificationDirectLanding')
          : this.isOverriddenByAdmin() ? t('ccSummaryPageOverridenByAdminNotificationNonDirectLanding') : '';

    if(notificationMsg !== '') {
      notificationMsgs.push(notificationMsg);
    }

    if (this.hasExporterAddressBeenUpdated(exporter)) {
      notificationMsgs.push(t('commonSummaryPageNotificationBannerMessage0'));
    }

    if (this.hasSystemFailure(validationErrors)) {
      notificationMsgs.push(t('ccSummaryPageSystemError'));
    }

    return (
      <Main>
        <PageTitle title={t('ccSummaryPageTitle')} />
        <GridRow>
          <GridCol>
            <BackLink href={backTo} onClick={e => {
              e.preventDefault();
              this.props.history.push(backTo);
            }}
            >{t('commonBackLinkBackButtonLabel')}</BackLink>
            {(this.isLocked() || this.isOverriddenByAdmin() || this.hasVesselNotFound() || this.hasExporterAddressBeenUpdated(exporter) || this.hasSystemFailure(validationErrors))
              && <NotificationBanner header={t('commonImportant')} messages={notificationMsgs} />}
            {validationErrorExists && messages.some(msg => !isEmpty(msg)) ? <ErrorIsland
              errors={messages} />
              : ''}
            <Header>{t('commonSummaryPageMainHeader', {journey: t(journey)})}</Header>
          </GridCol>
        </GridRow>
        <SummaryTable>
          <SummaryRow>
            <SummaryCellKey>{t('commonDocumentNumber')}</SummaryCellKey>
            <SummaryCellValue>{documentNumber}</SummaryCellValue>
          </SummaryRow>
        </SummaryTable>
        <br />
        <Header level="2">{t('psProgressExporterDetails')}</Header>
        <SummaryTable id="exporter-details" className="summary">

          <SummaryRow>
            <SummaryCellKey>{t('ccAddExporterDetailsExporterNameOfPersonResponsible')}</SummaryCellKey>
            <SummaryCellValue>{exporter.exporterFullName}</SummaryCellValue>
            <SummaryCellLink>
              {!this.isLocked() &&
                <ChangeLinkTag id="change-exporterFullName" onClick={() => scrollToFieldName('exporterFullName')} to={`${addExporterDetailsUrl}`}>{t('commonSummaryPageChangeLink')}
                <span className="govuk-visually-hidden">
                    {lowerCase(t('ccAddExporterDetailsExporterNameOfPersonResponsible'))}
                </span>
                </ChangeLinkTag>
              }
            </SummaryCellLink>
          </SummaryRow>

          <SummaryRow>
            <SummaryCellKey>{t('commonSummaryPageExporterCompanyName')}</SummaryCellKey>
            <SummaryCellValue>{exporter.exporterCompanyName}</SummaryCellValue>
            <SummaryCellLink>
              {!this.isLocked() &&
                <ChangeLinkTag id="change-exporterCompanyName" onClick={() => scrollToFieldName('exporterCompanyName')} to={`${addExporterDetailsUrl}`}>{t('commonSummaryPageChangeLink')}
                <span className="govuk-visually-hidden">
                    {t('commonAddExporterDetailsCompanyName').toLowerCase()}
                </span>
                </ChangeLinkTag>
              }
            </SummaryCellLink>
          </SummaryRow>
          <SummaryRow>
            <SummaryCellKey>{t('commonSummaryPageExporterCompanyAddress')}</SummaryCellKey>
            <SummaryCellValue>{formatAddress(exporter.addressOne, exporter.addressTwo, exporter.townCity, exporter.postcode)}</SummaryCellValue>
            <SummaryCellLink>
              {!this.isLocked() &&
                <ChangeLinkTag id="change-exporterAddress" onClick={() => scrollToFieldName('addressOne')} to={`${addExporterDetailsUrl}`}>{t('commonSummaryPageChangeLink')}
                 <span className="govuk-visually-hidden">
                    {lowerCase(t('commonSummaryPageExporterCompanyAddress'))}
                 </span>
                </ChangeLinkTag>
              }
            </SummaryCellLink>
          </SummaryRow>
        </SummaryTable>

        <br />
        <Header level="2">{t('ccSummaryPageLandingDetails')}</Header>
        {this.renderLandingsBlock()}

        <SummaryTable className="totalExportWeight">
          <SummaryRow>
            <SummaryCellKey>{t('ccAddLandingTotalExportWeight')}</SummaryCellKey>
            <SummaryCellValue>{this.totalWeight().toFixed(2)}{t('ccDirectLandingProductWeightTableExportWeightInputUnit')}</SummaryCellValue>
            <SummaryCellLink></SummaryCellLink>
          </SummaryRow>
        </SummaryTable>
        <br />
        <br />

        <GridRow>
          <GridCol>
            <Header level="2">
              {t('ccSummaryPageTransportationDetails')}
            </Header>
            <TransportSummary path="/create-catch-certificate" transport={transport} location={exportLocation} isLocked={this.isLocked()} documentNumber={documentNumber} journey={journey} exportedTo={exportLocation.exportedTo} isDirectLanding={this.isDirectLanding()} t={t}/>
          </GridCol>
        </GridRow>

        <GridRow>
          <GridCol>
            <Header level="2">{t('ccSummaryPageConservationAndManagement')}</Header>
            {this.renderConservationManagement()}
          </GridCol>
        </GridRow>

        <GridRow>
          <GridCol className="warning-message">
            <WarningText>
              {t('ccSummaryPageWarning')}
            </WarningText>
          </GridCol>
        </GridRow>

        <GridRow>
          <GridCol>{!this.isLocked() && this.renderContinueButton()}</GridCol>
        </GridRow>
        <br />
        <HelpLink journey={route.journey} />
      </Main>
    );
  }
}

function mapStateToProps(state) {
  const {
    exporter = {},
    exportPayload,
    transport,
    conservation,
    exportLocation,
    validationErrors,
    status,
    landingsEntryOption
  } = state.summaryDocument;

  return {
    exporter: exporter.model,
    exportPayload,
    landingsEntryOption,
    transport,
    conservation,
    document: state.document,
    exportLocation,
    validationErrors,
    status,
    progress: state.progress
  };
}

function loadData(store, journey) {
  return store
    .dispatch(getSummaryCertificate(journey, this.documentNumber))
    .then(() => {
      Promise.all([
      store.dispatch(getProgress(this.documentNumber, journey))
      ]);
      if (!this.documentNumber) {
        return store.dispatch(getDocument(journey));
      }
    });
}

export const component = withRouter(
  connect(
    mapStateToProps,
    {
      getProgress,
      createExportCertificate,
      getDocument,
      getSummaryCertificate
    }
  )(withTranslation() (CatchCertificateSummary))
);

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
