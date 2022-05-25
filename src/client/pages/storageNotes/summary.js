import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import { Main, BackLink, Header, GridRow, GridCol, WarningText, LabelText } from 'govuk-react';

import {
  generateStorageNotesPdf,
  getStorageNotesFromRedis,
  saveStorageNotes,
  saveStorageNotesToRedis,
  getTransportDetails,
  getExporterFromMongo
} from '../../actions';
import {formatAddress, scrollToField, scrollToFieldName, scrollToErrorIsland } from '../utils';
import {
  ChangeLinkTag,
  SummaryTable,
  SummaryRow,
  SummaryCellKey,
  SummaryCellValue,
  SummaryCellLink,
} from '../../components/Summary';

import NotificationBanner from '../../components/NotificationBanner';
import PageTitle from '../../components/PageTitle';
import Form from '../../components/elements/Form';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import HelpLink from '../../components/HelpLink';
import TransportSummary from '../common/transport/TransportSummary';
import ErrorIsland from '../../components/elements/ErrorIsland';
import { withTranslation } from 'react-i18next';
class StorageNotesSummaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitIsDisabled: false
    };
  }

  goBack(e, page) {
    e.preventDefault();
    const storageNotes = cloneDeep(this.props.storageNotes);
    storageNotes.errors = {};
    this.props.save(storageNotes);
    this.props.history.push(page);
  }

  hasExporterDetails(exporter) {
    return !isEmpty(exporter) && ['exporterCompanyName', 'addressOne', 'postcode'].every(prop => !isEmpty(exporter[prop]));
  }

  hasExportedTo(transport) {
    if (!Object.prototype.hasOwnProperty.call(transport, 'exportedTo'))
      return false;


    return ['isoCodeAlpha2','isoCodeAlpha3','isoNumericCode','officialCountryName'].every(prop => !isEmpty(transport.exportedTo[prop]));
  }

  hasTransportDetails(transport) {
    if (!transport || !this.hasExportedTo(transport))
      return false;

    let hasRequiredTransportDetails;

    switch (transport.vehicle) {
      case 'truck':
        if (transport.cmr === undefined || transport.cmr === 'false') {
          hasRequiredTransportDetails = ['nationalityOfVehicle', 'registrationNumber', 'departurePlace', 'exportDate'].every(prop => !isEmpty(transport[prop]));
          break;
        }

        hasRequiredTransportDetails = true;
        break;
      case 'plane':
        hasRequiredTransportDetails = ['flightNumber', 'containerNumber', 'departurePlace', 'exportDate'].every(prop => !isEmpty(transport[prop]));
        break;
      case 'train':
        hasRequiredTransportDetails = ['railwayBillNumber', 'departurePlace', 'exportDate'].every(prop => !isEmpty(transport[prop]));
        break;
      case 'containerVessel':
        hasRequiredTransportDetails = ['vesselName', 'flagState', 'containerNumber', 'departurePlace', 'exportDate'].every(prop => !isEmpty(transport[prop]));
        break;
      default:
        return false;
    }

    return hasRequiredTransportDetails;
  }

  validateDate(date) {
    const formattedDate = moment(
      date,
      ['DD/MM/YYYY', 'DD/M/YYYY', 'D/MM/YYYY', 'D/M/YYYY'],
      true
    );
    return formattedDate.isValid() && formattedDate.isBefore(moment(new Date()));
  }

  hasCatchDetails(catchDetails) {
    if (!Array.isArray(catchDetails) || catchDetails.length === 0)
      return false;

    return catchDetails.every(catchDetail => {
      return ['product', 'commodityCode', 'productWeight', 'dateOfUnloading', 'placeOfUnloading', 'transportUnloadedFrom', 'certificateNumber', 'weightOnCC'].every(prop => {
        if (prop === 'dateOfUnloading') {
          return !isEmpty(catchDetail[prop]) && this.validateDate(catchDetail[prop]);
        }

        return !isEmpty(catchDetail[prop]);
      });
    });
  }

  hasStorageFacilitiesDetails(storageFacilitiesDetails) {
    if (!Array.isArray(storageFacilitiesDetails) || storageFacilitiesDetails.length === 0)
      return false;

    return storageFacilitiesDetails.every(storageFacilityDetail => {
      return ['facilityName', 'facilityAddressOne', 'facilityTownCity', 'facilityPostcode'].every(prop => !isEmpty(storageFacilityDetail[prop]));
    });
  }

  displayDashboardOptions() {
    this.unauthorised();
  }

  unauthorised() {
    this.props.history.push('/');
  }

  hasRequiredData() {
    const { transport, exporter } = this.props;
    const { catches, storageFacilities } = this.props.storageNotes;
    const hasExporterDetails = this.hasExporterDetails(exporter);
    const hasCatches = this.hasCatchDetails(catches);
    const hasStorageFacilities = this.hasStorageFacilitiesDetails(storageFacilities);
    const hasTransport = !isEmpty(transport) && this.hasTransportDetails(transport);

    return hasExporterDetails && hasCatches && hasStorageFacilities && hasTransport;
  }

  componentDidUpdate() {
    const { storageNotes } = this.props;

    if (storageNotes.unauthorised === true) {
      this.unauthorised();
    }
  }

  async componentDidMount() {
    const { journey } = this.props.route;
    const { documentNumber } = this.props.match.params;

    await this.props.getExporterFromMongo(journey, documentNumber);
    await this.props.getFromRedis(documentNumber);
    await this.props.getTransportDetails(journey, documentNumber);

    const storageNotes = cloneDeep(this.props.storageNotes);
    this.props.save(storageNotes);

    const storageFacilitiesArray = this.props.storageNotes.storageFacilities;
    const index = storageFacilitiesArray.findIndex(fac => fac._facilityUpdated);

    if (!this.hasRequiredData()) {
      this.props.history.push(`/create-storage-document/${documentNumber}/progress`);
    }

    if (storageFacilitiesArray.some(fac => fac._facilityUpdated)) {
      this.props.history.push(`/create-storage-document/${documentNumber}/add-storage-facility-details/${index}`);
    }
  }

  goBackHref(documentNumber) {
    const { vehicle, cmr } = this.props.transport;

    if (vehicle === 'truck' && cmr === 'true') return `/create-storage-document/${documentNumber}/do-you-have-a-road-transport-document`;
    if (vehicle === 'containerVessel') return `/create-storage-document/${documentNumber}/add-transportation-details-container-vessel`;
    return `/create-storage-document/${documentNumber}/add-transportation-details-${vehicle}`;
  }

  checkForCatchError(validationErrors, ctch) {

    if (Array.isArray(validationErrors)) {
      for (let error of validationErrors ) {
        if (ctch && ctch.certificateNumber) {
          if ((error.certificateNumber === ctch.certificateNumber.toUpperCase()) && error.product === ctch.product) {
            if (this.state.submitIsDisabled) {
              return true;
            }
          }
        }
      }
    }

    return false;

  }

  hasExporterAddressBeenUpdated(exporter) {
    return exporter._updated;
  }

  render() {
    const { storageNotes = {}, exporter = {}, route, transport, t } = this.props;
    const documentNumber = this.props.match.params.documentNumber;
    const { journey } = route;
    const backLink = this.goBackHref(documentNumber);
    const displayValidationErrorMessage = (validationErrorsToCheck) =>
      Array.isArray(validationErrorsToCheck) && validationErrorsToCheck.some(validationErrorToCheck => !isEmpty(validationErrorToCheck));

    return (
      <Main>
        <PageTitle title={`${t('commonCheckYourInformationTitle')} - ${t('sdCommonTitle')}`} />
        <GridRow>
          <GridCol>
            <BackLink onClick={e => this.goBack(e, backLink)} href={`/orchestration/api/v1/storageNotes/back?n=${backLink}`}>
              {t('commonBackLinkBackButtonLabel')}
            </BackLink>
            {this.hasExporterAddressBeenUpdated(exporter) &&
              <NotificationBanner header={t('commonImportant')}
              messages={[t('commonSummaryPageNotificationBannerMessage0')]}/>
            }
            {displayValidationErrorMessage(storageNotes.validationErrors) && this.state.submitIsDisabled &&
              <ErrorIsland errors={[{message: t('commonSummaryPageCatchesValidationErrorsMessage'), key: 'validationError'}]}/>
            }
           <Header>{t('commonSummaryPageMainHeader', {journey: t(journey)})}</Header>
          </GridCol>
        </GridRow>
        <Form
          action="/orchestration/api/v1/storageNotes/generatePdf"
          nextUrl={`/create-storage-document/${documentNumber}/storage-document-created`}
          onSubmit={e => this.onCreate(e)}
        >

          <GridRow>
            <GridCol>
              <Header level="2">
              {t('commonSummaryPageDocumentDetailsHeader')}
              </Header>
              {this.renderDocumentNumber(documentNumber)}
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol>
              <Header level="2">{t('commonSummaryPageExporterHeader')}</Header>
              {this.renderExporterDetailsSummary(documentNumber)}
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol>
              <Header level="2">{t('sdCheckYourInformationProductsConsignment')}</Header>
              {storageNotes.catches.map((ctch, index) => (
                <Fragment key={index}>
                  <div id="validationError" className={`catch-row ${this.checkForCatchError(storageNotes.validationErrors, ctch) ? 'error' : ''}`}>
                    {this.checkForCatchError(storageNotes.validationErrors, ctch) === true &&
                      <LabelText className="error-message">{t('psSummaryPageCatchesValidationErrorsMessage')}</LabelText>
                    }
                    <div className="catch-table">
                      {this.renderProductsSummary(index, ctch, documentNumber)}
                    </div>
                  </div>
                  <div className="seperationLine"></div>
                  <br/>
                </Fragment>
              ))}
            </GridCol>
          </GridRow>

          <Header level="2">{t('sdCheckYourInformationStorageDetailsText')}</Header>
          {storageNotes.storageFacilities.map((facility, index) => {
            const hiddenText = `${t('sdFacilityDetailsVHiddenChangeText')} ${facility.facilityName}`;

            return <Fragment key={index}>
              <GridRow>
                <GridCol>
                  <SummaryTable className="summary">
                    <SummaryRow>
                      <SummaryCellKey>{t('sdCommonFacilityNameTitle')}</SummaryCellKey>
                      <SummaryCellValue>{facility.facilityName}</SummaryCellValue>
                      <SummaryCellLink>
                        <ChangeLinkTag
                          id={`change-storageFacilities-${index}-facilityName`}
                          onClick={() => scrollToField(`storageFacilities-${index}-facilityName`)}
                          to={`/create-storage-document/${documentNumber}/add-storage-facility-details/${index}`}>
                           {t('commonSummaryPageChangeLink')}
                          <span className="govuk-visually-hidden">
                            { hiddenText }
                          </span>
                        </ChangeLinkTag>
                      </SummaryCellLink>
                    </SummaryRow>
                    <SummaryRow>
                      <SummaryCellKey>{t('commonAddExporterDetailsAddressContent')}</SummaryCellKey>
                      <SummaryCellValue>{formatAddress(facility.facilityAddressOne, facility.facilityAddressTwo, facility.facilityTownCity, facility.facilityPostcode)}</SummaryCellValue>
                      <SummaryCellLink></SummaryCellLink>
                    </SummaryRow>
                  </SummaryTable>
                </GridCol>
              </GridRow>
              <br />
            </Fragment>;
          })}

          <GridRow>
            <GridCol>
              <Header level="2">{t('commonSummaryPageTransportHeader')}</Header>
              <TransportSummary path="/create-storage-document" transport={transport}  isLocked={false} documentNumber={documentNumber} journey={journey} exportedTo={transport.exportedTo}  t={t}  showExportDate/>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol className="warning-message">
              <WarningText>
              {t('commonSummaryPageWarning',{journey: t(journey)})}
             </WarningText>
             </GridCol>
          </GridRow>

          <GridRow>
            <GridCol>
              <button id="continue" className={'button button-start'} type="submit" disabled={this.state.submitIsDisabled}>
              {t('commonSummaryPageMainCreateBtn', {journey : t(journey)})}
              </button>
            </GridCol>
          </GridRow>
        </Form>
        <br/>
        <HelpLink journey={route.journey}/>
      </Main>
    );
  }

  renderExporterDetailsSummary(documentNumber) {
    const { exporter = {}, t } = this.props;
    const hiddenText = t('commonSummaryPageExporterHeader').toLowerCase();

    return (
      <SummaryTable id="exporter-details" className="summary">
        <SummaryRow>
          <SummaryCellKey>{t('commonSummaryPageExporterCompanyName')}</SummaryCellKey>
          <SummaryCellValue>{exporter.exporterCompanyName}</SummaryCellValue>
          <SummaryCellLink>
            <ChangeLinkTag
              id="change-exporterCompanyName"
              onClick={() => scrollToFieldName('exporterCompanyName')}
              to={`/create-storage-document/${documentNumber}/add-exporter-details`}>
               {t('commonSummaryPageChangeLink')}
              <span className="govuk-visually-hidden">
                { hiddenText }
              </span>
            </ChangeLinkTag>
          </SummaryCellLink>
        </SummaryRow>
        <SummaryRow>
          <SummaryCellKey>{t('commonSummaryPageExporterCompanyAddress')}</SummaryCellKey>
          <SummaryCellValue>{formatAddress(exporter.addressOne, exporter.addressTwo, exporter.townCity, exporter.postcode )}</SummaryCellValue>
          <SummaryCellLink></SummaryCellLink>
        </SummaryRow>
      </SummaryTable>
    );
  }

  renderProductsSummary(index, ctch, documentNumber) {
    const hiddenText = `${this.props.t('commonProducttext')} ${ctch.product}`;

    return (
      <SummaryTable>
        <SummaryRow noSeperator>
          <SummaryCellKey noSeperator>{ctch.product}</SummaryCellKey>
          <SummaryCellValue noSeperator></SummaryCellValue>
          <SummaryCellLink noSeperator>
            <ChangeLinkTag
              id={`change-catches-${index}-product`}
              onClick={() => scrollToField(`catches-${index}-product`)}
              to={`/create-storage-document/${documentNumber}/add-product-to-this-consignment/${index}`}>
               {this.props.t('commonSummaryPageChangeLink')}
              <span className="govuk-visually-hidden">
                { hiddenText }
              </span>
            </ChangeLinkTag>
          </SummaryCellLink>
        </SummaryRow>

        <SummaryRow noSeperator>
          <SummaryCellValue noSeperator>{this.props.t('commonCommodityCodeLabel')}</SummaryCellValue>
          <SummaryCellValue noSeperator>{ctch.commodityCode}</SummaryCellValue>
          <SummaryCellLink noSeperator></SummaryCellLink>
        </SummaryRow>


        <SummaryRow noSeperator>
          <SummaryCellValue noSeperator>{this.props.t('sdCheckYourInformationExportWeightLabel')}</SummaryCellValue>
          <SummaryCellValue noSeperator>{ctch.productWeight}kg</SummaryCellValue>
          <SummaryCellLink noSeperator></SummaryCellLink>
        </SummaryRow>

        <SummaryRow noSeperator>
          <SummaryCellValue noSeperator>{this.props.t('sdCheckYourInformationUkentryText')} {this.props.t('sdCheckYourInformationDateText')}</SummaryCellValue>
          <SummaryCellValue noSeperator>
            {moment(ctch.dateOfUnloading, 'DD/MM/YYYY').format('D MMMM YYYY')}
          </SummaryCellValue>
          <SummaryCellLink noSeperator></SummaryCellLink>
        </SummaryRow>

        <SummaryRow>
          <SummaryCellValue noSeperator>{this.props.t('sdCheckYourInformationUkentryText')} {this.props.t('sdCheckYourInformationPlaceText')}</SummaryCellValue>
          <SummaryCellValue noSeperator>{ctch.placeOfUnloading}</SummaryCellValue>
          <SummaryCellLink noSeperator></SummaryCellLink>
        </SummaryRow>

        <SummaryRow>
          <SummaryCellValue noSeperator>{this.props.t('sdCheckYourInformationUkentryText')} {this.props.t('commonSummaryPageTransportHeader')}</SummaryCellValue>
          <SummaryCellValue noSeperator>{ctch.transportUnloadedFrom}</SummaryCellValue>
          <SummaryCellLink noSeperator></SummaryCellLink>
        </SummaryRow>

        <SummaryRow >
          <SummaryCellValue noSeperator>{this.props.t('sdCheckYourInformationUkentryText')} {this.props.t('commonDocumentNumber')}</SummaryCellValue>
          <SummaryCellValue noSeperator>{ctch.certificateNumber}</SummaryCellValue>
          <SummaryCellLink noSeperator></SummaryCellLink>
        </SummaryRow>

        <SummaryRow >
          <SummaryCellValue noSeperator>{this.props.t('sdCheckYourInformationUkentryText')} {this.props.t('sdCheckYourInformationWeightDocumentText')}</SummaryCellValue>
          <SummaryCellValue noSeperator>{ctch.weightOnCC}kg</SummaryCellValue>
          <SummaryCellLink noSeperator></SummaryCellLink>
        </SummaryRow>

      </SummaryTable>
    );
  }


  renderDocumentNumber(documentNumber) {
    if (documentNumber) {
      return (
        <SummaryTable>
          <SummaryRow>
            <SummaryCellKey>{this.props.t('commonDocumentNumber')}</SummaryCellKey>
            <SummaryCellValue>{documentNumber}</SummaryCellValue>
          </SummaryRow>
        </SummaryTable>
      );
    }
  }

  async onCreate(e) {
    const documentNumber = this.props.match.params.documentNumber;

    this.setState({ submitIsDisabled: true });
    e.preventDefault();
    try {
      await this.props.generatePdf(`/create-storage-document/${documentNumber}/check-your-information`, documentNumber);
      this.setState({ submitIsDisabled: false });
      this.props.history.push(`/create-storage-document/${documentNumber}/storage-document-created`);
    } catch (error) {
      scrollToErrorIsland();
    }
  }
}

function mapStateToProps(state) {
  const { exporter = {} } = state;
  return {
    exporter: exporter.model,
    storageNotes: state.storageNotes,
    transport: state.transport,
    document: state.document
  };
}

function loadData(store, journey) {
  return store
    .dispatch(getExporterFromMongo(journey, this.documentNumber))
    .then(() => {
      return store.dispatch(getStorageNotesFromRedis(this.documentNumber));
    })
    .then(() => {
      return store.dispatch(getTransportDetails(journey, this.documentNumber));
    });
}

export const component = withRouter(
  connect(
    mapStateToProps,
    {
      save: saveStorageNotes,
      saveToRedis: saveStorageNotesToRedis,
      getExporterFromMongo,
      generatePdf: generateStorageNotesPdf,
      getFromRedis: getStorageNotesFromRedis,
      getTransportDetails
    }
  )(withTranslation() (StorageNotesSummaryPage))
);

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
