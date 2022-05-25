import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { Main, BackLink, Header, GridCol, GridRow, WarningText, LabelText } from 'govuk-react';

import {
  generateProcessingStatementPdf,
  getExporterFromMongo,
  getProcessingStatementFromRedis,
  saveProcessingStatement,
  saveProcessingStatementToRedis,
  getDocument
} from '../../actions';
import {
  ChangeLinkTag,
  SummaryTable,
  SummaryRow,
  SummaryCellKey,
  SummaryCellValue,
  SummaryCellLink
} from '../../components/Summary';

import NotificationBanner from '../../components/NotificationBanner';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import { formatAddress, scrollToField, scrollToFieldName, scrollToErrorIsland } from '../utils';
import PageTitle from '../../components/PageTitle';
import Form from '../../components/elements/Form';
import moment from 'moment';
import HelpLink from '../../components/HelpLink';
import ErrorIsland from '../../components/elements/ErrorIsland';
import TransportSummary from '../common/transport/TransportSummary';
import { withTranslation } from 'react-i18next';


class SummaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { submitIsDisabled: false };
  }

  unauthorised() {
    this.props.history.push('/');
  }

  hasRequiredData() {
    const { exporter } = this.props;
    const {
      healthCertificateNumber, healthCertificateDate, catches,
      consignmentDescription, personResponsibleForConsignment, plantApprovalNumber,
      plantName, plantAddressOne, plantTownCity, plantPostcode, _plantDetailsUpdated, exportedTo
    } = this.props.processingStatement;
    const hasExporterDetails = this.hasExporterDetails(exporter);
    const hasHealthCertificateNumber = (!isEmpty(healthCertificateNumber) && this.validateExportHealthCertificateFormat(healthCertificateNumber));
    const hasHealthCeritificateDate = (!isEmpty(healthCertificateDate) && this.validateDate(healthCertificateDate));
    const hasConsignmentDescription = !isEmpty(consignmentDescription);
    const hasPersonResponsible = !isEmpty(personResponsibleForConsignment);
    const hasPlantApprovalNumber = !isEmpty(plantApprovalNumber);
    const hasPlantName = !isEmpty(plantName);

    const hasPlantAddressOne = !isEmpty(plantAddressOne);
    const hasPlantTownCity = !isEmpty(plantTownCity);
    const hasPlantPostcode = !isEmpty(plantPostcode);
    const hasPlantAddress = _plantDetailsUpdated || (hasPlantAddressOne && hasPlantTownCity && hasPlantPostcode);

    const hasExportedTo = !isEmpty(exportedTo);
    const hasCatches = !isEmpty(catches) && Array.isArray(catches) && catches.every(item => !isEmpty(item.species)
      && !isEmpty(item.catchCertificateNumber) && !isEmpty(item.totalWeightLanded) && !isEmpty(item.exportWeightBeforeProcessing) && !isEmpty(item.exportWeightAfterProcessing));

    return hasHealthCertificateNumber && hasHealthCeritificateDate && hasExporterDetails && hasConsignmentDescription && hasPersonResponsible && hasPlantApprovalNumber
      && hasPlantName && hasPlantAddress && hasCatches && hasExportedTo;
  }

  hasExporterDetails(exporter) {
    return !isEmpty(exporter) && ['exporterCompanyName', 'addressOne', 'postcode'].every(prop => !isEmpty(exporter[prop]));
  }

  hasExporterAddressBeenUpdated(exporter) {
    return exporter._updated;
  }

  componentDidUpdate() {
    const { processingStatement } = this.props;

    if (processingStatement.unauthorised === true) {
      this.unauthorised();
    }
  }

  validateExportHealthCertificateFormat(str) {
    const regex = /^\d{2}\/\d\/\d{6}$/;
    return regex.test(str);
  }

  validateDate(date) {
    const formattedDate = moment(
      date,
      ['DD/MM/YYYY', 'DD/M/YYYY', 'D/MM/YYYY', 'D/M/YYYY'],
      true
    );
    return formattedDate.isValid() && formattedDate.isBefore(moment(new Date()).add(8, 'days'));
  }

  async componentDidMount() {
    const { documentNumber } = this.props.match.params;
    await this.props.getExporterFromMongo('processingStatement', documentNumber);
    await this.props.getFromRedis(documentNumber);

    if (!documentNumber) {
      await this.props.getDocument(this.props.route.journey);
    }

    if (!this.hasRequiredData()) {
      this.props.history.push(`/create-processing-statement/${documentNumber}/progress`);
    }

    if (this.props.processingStatement._plantDetailsUpdated) {
      this.props.history.push(`/create-processing-statement/${documentNumber}/add-processing-plant-address`);
    }
  }

  goBack(e, page) {
    e.preventDefault();
    this.props.history.push(page);
  }


  checkForCatchError(validationErrors, ctch) {
    if (Array.isArray(validationErrors)) {
      for (let error of validationErrors) {
        if (ctch && ctch.catchCertificateNumber) {
          if ((error.certificateNumber === ctch.catchCertificateNumber.toUpperCase()) && error.product === ctch.species) {
            if (this.state.submitIsDisabled) {
              return true;
            }
          }
        }
      }
    }

    return false;

  }

  catchesForeignCertCheck(ps) {
    return ps
    && ps.healthCertificateNumber && ps.healthCertificateNumber.length
    && ps.catches && ps.catches.length ?
      ps.catches.map((dta, idx) => dta.catchCertificateNumber == ps.healthCertificateNumber ?
        {
          key: `catches-in-consignment-${idx}`,
          message: `Catch certificate number  for ${dta.species} cannot be the same as the health certificate number`
        } : undefined
      ) : [];
  }

  checkPreSubmitErrors(ps) {

    let listOfErrors = [
      ...this.catchesForeignCertCheck(ps)
    ];

    return listOfErrors.filter(err => err !== undefined);
  }

  checkValidationErrors(errors) {
    let translatedObject = [];
    if(!isEmpty(errors)) {
      for (let error of errors) {
        const errorObject = {};
        errorObject["message"] = this.props.t(error.message);
        errorObject["key"] = error.key;
        translatedObject.push(errorObject);
      }
      return translatedObject;
    } else {
      return errors;
    }
  }

  render() {
    const { processingStatement = {}, exporter = {}, route, match, t } = this.props;
    const { previousUri, path, nextUri, journey } = route;
    const backUrl = previousUri.replace(':documentNumber', match.params.documentNumber);
    const submitUri = nextUri.replace(':documentNumber', match.params.documentNumber);
    const thisPath = path.replace(':documentNumber', match.params.documentNumber);

    const validationErrorsMain = {
      message: t('commonSummaryPageCatchesValidationErrorsMessage'),
      key: 'validationError'
    };

    const catchesErrors = this.checkPreSubmitErrors(processingStatement);

    const validationErrors = this.checkValidationErrors(processingStatement.validationErrors.length ? (processingStatement.validationErrors.filter(type => type.key === "dateValidationError")) : []);

    const dateFieldErrorMsg = processingStatement.validationErrors.length ? (processingStatement.validationErrors.filter(type => type.key === "dateFieldError")) : [];

    const displayValidationErrorMessage = (validationErrorsToCheck) =>
      Array.isArray(validationErrorsToCheck) && validationErrorsToCheck.some(validationErrorToCheck => !isEmpty(validationErrorToCheck));

    const errorIslandErrorMessages = [
      displayValidationErrorMessage (processingStatement.validationErrors) && this.state.submitIsDisabled ? validationErrorsMain : undefined,
      ...catchesErrors,
      ...validationErrors
    ].filter(err => err !== undefined);

    return (
      <Main>
        <PageTitle title={t('psSummaryPageTitle')}/>
        <GridRow>
          <GridCol>
            <BackLink href={backUrl} onClick={e => this.goBack(e, backUrl)}>{t('psSummaryPageBackLink')}</BackLink>
            {this.hasExporterAddressBeenUpdated(exporter) &&
            <NotificationBanner header={t('commonImportant')}
                                messages={[t('commonSummaryPageNotificationBannerMessage0')]}/>
            }
            {errorIslandErrorMessages.length > 0 &&
            <ErrorIsland errors={errorIslandErrorMessages}/>
            }
            <Header>{t('commonSummaryPageMainHeader', {journey: t(journey)})}</Header>
          </GridCol>
        </GridRow>

        <GridRow>
          <GridCol>
            <Header level="2">{t('commonSummaryPageDocumentDetailsHeader')}</Header>
            {this.renderDocumentNumber(t)}
          </GridCol>
        </GridRow>

        <GridRow>
          <GridCol>
            <Header level="2">{t('commonSummaryPageExporterHeader')}</Header>
            {this.renderExporterDetailsSummary(t)}
          </GridCol>
        </GridRow>

        <Form
          action="/orchestration/api/v1/processingStatement/generatePdf"
          nextUrl={submitUri}
          currentUrl={thisPath}
          onSubmit={e => this.onCreate(e)}
        >
          <GridRow>
            <GridCol>
              <Header level="2">{t('psSummaryPageConsignmentHeader')}</Header>
              <SummaryTable id="consignment-details">
                <SummaryRow>
                  <SummaryCellKey>{t('psSummaryPageConsignmentDesc')}</SummaryCellKey>
                  <SummaryCellValue>{processingStatement.consignmentDescription}</SummaryCellValue>
                  <SummaryCellLink>
                    <ChangeLinkTag
                      id="change-consignmentDescription"
                      onClick={() => scrollToField('consignmentDescription')}
                      to={`/create-processing-statement/${match.params.documentNumber}/add-consignment-details`}>
                      {t('commonSummaryPageChangeLink')}
                      <span className="govuk-visually-hidden">
                        {t('psSummaryPageConsignmentDesc').toLowerCase()}
                      </span>
                    </ChangeLinkTag>
                  </SummaryCellLink>
                </SummaryRow>
                <SummaryRow>
                  <SummaryCellKey>{t('psSummaryPageConsignmentHealthCertNumber')}</SummaryCellKey>
                  <SummaryCellValue>
                    {processingStatement.healthCertificateNumber}
                  </SummaryCellValue>
                  <SummaryCellLink>
                    <ChangeLinkTag
                      id="change-healthCertificateNumber"
                      onClick={() => scrollToField('healthCertificateNumber')}
                      to={`/create-processing-statement/${match.params.documentNumber}/add-health-certificate`}>
                      {t('commonSummaryPageChangeLink')}
                      <span className="govuk-visually-hidden">
                        {t('psSummaryPageConsignmentHealthCertNumber').toLowerCase()}
                      </span>
                    </ChangeLinkTag>
                  </SummaryCellLink>
                </SummaryRow>
              </SummaryTable>
              <SummaryTable id="health-certificate-date">
                {!isEmpty(dateFieldErrorMsg) ?
                  dateFieldErrorMsg.map((errorMsg, index) => {
                  return <Fragment key={index}>
                    <div id={index}
                         className={`catch-row error`}>
                      <LabelText
                        className="error-message">{t(errorMsg.message)}</LabelText>
                      <div className="catch-table">
                        <SummaryRow>
                        <SummaryCellKey>
                          {t('psSummaryPageConsignmentHealthCertDate')}</SummaryCellKey>
                        <SummaryCellValue>{moment(processingStatement.healthCertificateDate, 'DD/MM/YYYY').format('D MMMM YYYY')}</SummaryCellValue>
                        <SummaryCellLink>
                          <ChangeLinkTag
                            id="change-healthCertificateDate"
                            onClick={() => scrollToField('healthCertificateDate')}
                            to={`/create-processing-statement/${match.params.documentNumber}/add-health-certificate`}>
                            {t('commonSummaryPageChangeLink')}
                            <span className="govuk-visually-hidden">
                              {t('psSummaryPageConsignmentHealthCertDate').toLowerCase()}
                            </span>
                          </ChangeLinkTag>
                        </SummaryCellLink>
                        </SummaryRow>
                      </div>
                    </div>
                  </Fragment>;
                }): 
                <SummaryRow>
                <SummaryCellKey>
                  {t('psSummaryPageConsignmentHealthCertDate')}</SummaryCellKey>
                <SummaryCellValue>{moment(processingStatement.healthCertificateDate, 'DD/MM/YYYY').format('D MMMM YYYY')}</SummaryCellValue>
                <SummaryCellLink>
                  <ChangeLinkTag
                    id="change-healthCertificateDate"
                    onClick={() => scrollToField('healthCertificateDate')}
                    to={`/create-processing-statement/${match.params.documentNumber}/add-health-certificate`}>
                    {t('commonSummaryPageChangeLink')}
                    <span className="govuk-visually-hidden">
                      {t('psSummaryPageConsignmentHealthCertDate').toLowerCase()}
                    </span>
                  </ChangeLinkTag>
                </SummaryCellLink>
                </SummaryRow>
                }
              </SummaryTable>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol>
              <Header level="2">{t('psSummaryPageCatchesHeader')}</Header>
              <SummaryTable id="catches-in-consignment">
                {processingStatement.catches.map((ctch, index) => {
                  const hiddenTextSpecies = `${t('psSummaryPageCatchesHiddenTextSpecies')} ${ctch.species}`;
                  const hiddenTextCC = `${t('psSummaryPageCatchesHiddenTextCC')} ${ctch.species}`;
                  const hiddenTextLanded = `${t('psSummaryPageCatchesHiddenTextLanded')} ${ctch.species} `;
                  const hiddenTextWeightExported = `${t('psSummaryPageCatchesHiddenTextWeightExported')} ${ctch.species} `;
                  const hiddenTextWeightProcessed = `${t('psSummaryPageCatchesHiddenTextWeightProcessed')} ${ctch.species}`;
                  const catchRowId = `catches-in-consignment-${index}`;
                  const validationErrorsMessage = t('commonSummaryPageCatchesValidationErrorsMessage');
                  const catchErrorMessage = () =>
                    catchesErrors && catchesErrors.length && catchesErrors.some(err => err.key == catchRowId) ?
                      catchesErrors.filter((err) => err.key == catchRowId)[0].message : '';
                  return <Fragment key={index}>
                    <div id={catchRowId}
                         className={`catch-row ${this.checkForCatchError(processingStatement.validationErrors, ctch) || catchErrorMessage().length > 0 ? 'error' : ''}`}>
                      {this.checkForCatchError(processingStatement.validationErrors, ctch) === true || catchErrorMessage().length > 0 &&
                      <LabelText
                        className="error-message">{catchErrorMessage().length > 0 ? catchErrorMessage() : validationErrorsMessage}</LabelText>
                      }
                      <div className="catch-table">
                        <SummaryRow>
                          <SummaryCellKey noSeperator>{t('commonSummaryPageCatchesSpecies')}</SummaryCellKey>
                          <SummaryCellValue noSeperator>{ctch.species}</SummaryCellValue>
                          <SummaryCellLink noSeperator>
                            <ChangeLinkTag
                              id={`change-catches-${index}-species`}
                              onClick={() => scrollToField(`catches-${index}-species`)}
                              to={`/create-processing-statement/${match.params.documentNumber}/add-catch-details/${index}`}>
                              {t('commonSummaryPageChangeLink')}
                              <span className="govuk-visually-hidden">
                                {hiddenTextSpecies}
                              </span>
                            </ChangeLinkTag>
                          </SummaryCellLink>
                        </SummaryRow>
                        <SummaryRow>
                          <SummaryCellKey noSeperator>{t('psSummaryPageCatchesCatchCertNumber')}</SummaryCellKey>
                          <SummaryCellValue noSeperator>{ctch.catchCertificateNumber}</SummaryCellValue>
                          <SummaryCellLink noSeperator>
                            <ChangeLinkTag
                              id={`change-catches-${index}-catchCertificateNumber`}
                              onClick={() => scrollToField(`catches-${index}-catchCertificateNumber`)}
                              to={`/create-processing-statement/${match.params.documentNumber}/add-catch-details/${index}`}>
                              {t('commonSummaryPageChangeLink')}
                              <span className="govuk-visually-hidden">
                                {hiddenTextCC}
                              </span>
                            </ChangeLinkTag>
                          </SummaryCellLink>
                        </SummaryRow>

                        <SummaryRow>
                          <SummaryCellKey noSeperator>{t('psSummaryPageCatchesTotalWeight')}</SummaryCellKey>
                          <SummaryCellValue noSeperator>{ctch.totalWeightLanded}kg</SummaryCellValue>
                          <SummaryCellLink noSeperator>
                            <ChangeLinkTag
                              id={`change-catches-${index}-totalWeightLanded`}
                              onClick={() => scrollToField(`catches-${index}-totalWeightLanded`)}
                              to={`/create-processing-statement/${match.params.documentNumber}/add-catch-weights/${index}`}>
                              {t('commonSummaryPageChangeLink')}
                              <span className="govuk-visually-hidden">
                                {hiddenTextLanded}
                              </span>
                            </ChangeLinkTag>
                          </SummaryCellLink>
                        </SummaryRow>

                        <SummaryRow>
                          <SummaryCellKey noSeperator>{t('psSummaryPageCatchesWeightBefore')}</SummaryCellKey>
                          <SummaryCellValue noSeperator>{ctch.exportWeightBeforeProcessing}kg</SummaryCellValue>
                          <SummaryCellLink noSeperator>
                            <ChangeLinkTag
                              id={`change-catches-${index}-exportWeightBeforeProcessing`}
                              onClick={() => scrollToField(`catches-${index}-exportWeightBeforeProcessing`)}
                              to={`/create-processing-statement/${match.params.documentNumber}/add-catch-weights/${index}`}>
                              {t('commonSummaryPageChangeLink')}
                              <span className="govuk-visually-hidden">
                                {hiddenTextWeightExported}
                              </span>
                            </ChangeLinkTag>
                          </SummaryCellLink>
                        </SummaryRow>

                        <SummaryRow>
                          <SummaryCellKey noSeperator>{t('psSummaryPageCatchesWeightAfter')}</SummaryCellKey>
                          <SummaryCellValue noSeperator>{ctch.exportWeightAfterProcessing}kg</SummaryCellValue>
                          <SummaryCellLink noSeperator>
                            <ChangeLinkTag
                              id={`change-catches-${index}-exportWeightAfterProcessing`}
                              onClick={() => scrollToField(`catches-${index}-exportWeightAfterProcessing`)}
                              to={`/create-processing-statement/${match.params.documentNumber}/add-catch-weights/${index}`}>
                              {t('commonSummaryPageChangeLink')}
                              <span className="govuk-visually-hidden">
                                {hiddenTextWeightProcessed}
                              </span>
                            </ChangeLinkTag>
                          </SummaryCellLink>
                        </SummaryRow>
                      </div>
                    </div>
                    <div className="seperationLine"></div>
                    {processingStatement.catches.length - 1 > index && <br/>}
                  </Fragment>;
                })}
              </SummaryTable>
            </GridCol>
          </GridRow>

          <Header level="2">{t('psSummaryPagePlantHeader')}</Header>
          <GridRow>
            <GridCol>
              <SummaryTable className="summary">

                <SummaryRow>
                  <SummaryCellKey>{t('psSummaryPagePlantPersonResponsible')}</SummaryCellKey>
                  <SummaryCellValue>{processingStatement.personResponsibleForConsignment}</SummaryCellValue>
                  <SummaryCellLink>
                    <ChangeLinkTag
                      id="change-personResponsibleForConsignment"
                      onClick={() => scrollToField('personResponsibleForConsignment')}
                      to={`/create-processing-statement/${match.params.documentNumber}/add-processing-plant-details`}>
                      {t('commonSummaryPageChangeLink')}
                      <span className="govuk-visually-hidden">
                        {t('psSummaryPagePlantPersonResponsible').toLowerCase()}
                      </span>
                    </ChangeLinkTag>
                  </SummaryCellLink>
                </SummaryRow>

                <SummaryRow>
                  <SummaryCellKey>{t('psSummaryPagePlantApprovalNumber')}</SummaryCellKey>
                  <SummaryCellValue>{processingStatement.plantApprovalNumber}</SummaryCellValue>
                  <SummaryCellLink>
                    <ChangeLinkTag
                      id="change-plantApprovalNumber"
                      onClick={() => scrollToField('plantApprovalNumber')}
                      to={`/create-processing-statement/${match.params.documentNumber}/add-processing-plant-details`}>
                      {t('commonSummaryPageChangeLink')}
                      <span className="govuk-visually-hidden">
                        {t('psSummaryPagePlantApprovalNumber').toLowerCase()}
                      </span>
                    </ChangeLinkTag>
                  </SummaryCellLink>
                </SummaryRow>

                <SummaryRow>
                  <SummaryCellKey>{t('psSummaryPagePlantName')}</SummaryCellKey>
                  <SummaryCellValue>{processingStatement.plantName}</SummaryCellValue>
                  <SummaryCellLink>
                    <ChangeLinkTag
                      id="change-plantName"
                      onClick={() => scrollToField('plantName')}
                      to={`/create-processing-statement/${match.params.documentNumber}/add-processing-plant-details`}>
                      {t('commonSummaryPageChangeLink')}
                      <span className="govuk-visually-hidden">
                      {t('psSummaryPagePlantName').toLowerCase()}
                      </span>
                    </ChangeLinkTag>
                  </SummaryCellLink>
                </SummaryRow>

                <SummaryRow>
                  <SummaryCellKey>{t('psSummaryPagePlantAddress')}</SummaryCellKey>
                  <SummaryCellValue>{formatAddress(processingStatement.plantAddressOne, processingStatement.plantAddressTwo, processingStatement.plantTownCity, processingStatement.plantPostcode)}</SummaryCellValue>
                  <SummaryCellLink>
                    <ChangeLinkTag
                      id={'change-plant-address'}
                      onClick={() => scrollToField('plantAddressOne')}
                      to={`/create-processing-statement/${match.params.documentNumber}/add-processing-plant-details`}>
                      {t('commonSummaryPageChangeLink')}
                      <span className="govuk-visually-hidden">
                      {t('psSummaryPagePlantAddressTag')}
                      </span>
                    </ChangeLinkTag>
                  </SummaryCellLink>
                </SummaryRow>
              </SummaryTable>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol>
              <Header level="2">{t('commonSummaryPageTransportHeader')}</Header>
              <SummaryTable id="transport-details">
                <TransportSummary path="/create-processing-statement" exportedTo={processingStatement.exportedTo}
                                  isLocked={false} documentNumber={match.params.documentNumber} journey={journey} t={t}/>

                {/*{this.renderExportDestination()}*/}
              </SummaryTable>
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
              <button id="continue" className={'button button-start'} type="submit"
                      disabled={this.state.submitIsDisabled || catchesErrors && catchesErrors.length}>
                {t('commonSummaryPageMainCreateBtn', {journey : t(journey)})}
              </button>
            </GridCol>
          </GridRow>
        </Form>
        <br/>
        <HelpLink journey={journey}/>
      </Main>
    );
  }
  renderExportDestination() {
    const { path, documentNumber, isLocked, journey, exportedTo } = this.props;

    return (
      <SummaryRow id="destination-country">
        <SummaryCellKey>{(journey === 'catchCertificate') ? 'Destination country' : 'What is the export destination?'}</SummaryCellKey>
        <SummaryCellValue>{exportedTo?.officialCountryName || ''}</SummaryCellValue>
        <SummaryCellLink>
          {!isLocked &&
          <ChangeLinkTag
            id="change-exportedTo"
            onClick={() => scrollToField('exportedTo')}
            to={(journey === 'catchCertificate') ?
              `${path}/${documentNumber}/what-export-journey` :
              `${path}/${documentNumber}/what-export-destination`}
          >
            Change
            <span className="govuk-visually-hidden">
            {t('TransportSummarySummaryCellKeyCCVersion').toLowerCase()}
                </span>
          </ChangeLinkTag>
          }
        </SummaryCellLink>
      </SummaryRow>
    );
  }

  renderExporterDetailsSummary(t) {
    const { exporter = {}, match } = this.props;
    return (
      <SummaryTable id="exporter-details" className="summary">
        <SummaryRow>
          <SummaryCellKey>{t('commonSummaryPageExporterCompanyName')}</SummaryCellKey>
          <SummaryCellValue>{exporter.exporterCompanyName}</SummaryCellValue>
          <SummaryCellLink>
            <ChangeLinkTag
              id="change-exporterCompanyName"
              onClick={() => scrollToFieldName('exporterCompanyName')}
              to={`/create-processing-statement/${match.params.documentNumber}/add-exporter-details`}>
              {t('commonSummaryPageChangeLink')}
              <span className="govuk-visually-hidden">
                {t('psSummaryPageExporterCompanyNameChangeTag')}
              </span>
            </ChangeLinkTag>
          </SummaryCellLink>
        </SummaryRow>
        <SummaryRow>
          <SummaryCellKey>{t('commonSummaryPageExporterCompanyAddress')}</SummaryCellKey>
          <SummaryCellValue>{formatAddress(exporter.addressOne, exporter.addressTwo, exporter.townCity, exporter.postcode)}</SummaryCellValue>
          <SummaryCellLink>
            <ChangeLinkTag
              id="change-exporterAddress"
              onClick={() => scrollToFieldName('addressOne')}
              to={`/create-processing-statement/${match.params.documentNumber}/add-exporter-details`}>
              {t('commonSummaryPageChangeLink')}
              <span className="govuk-visually-hidden">
                {t('psSummaryPageExporterCompanyAddressChangeTag')}
              </span>
            </ChangeLinkTag>
          </SummaryCellLink>
        </SummaryRow>
      </SummaryTable>
    );
  }

  renderDocumentNumber(t) {
    const documentNumber = this.props.match.params.documentNumber;

    if (documentNumber) {

      return (
        <SummaryTable>
          <SummaryRow>
            <SummaryCellKey>{t('commonDocumentNumber')}</SummaryCellKey>
            <SummaryCellValue>{documentNumber}</SummaryCellValue>
          </SummaryRow>
        </SummaryTable>
      );
    }
  }

  async onCreate(e) {
    this.setState({ submitIsDisabled: true });
    const { documentNumber } = this.props.match.params;

    e.preventDefault();
    try {
      await this.props.generatePdf('/create-processing-statement/check-your-information', documentNumber);
      this.setState({ submitIsDisabled: false });
      this.props.history.push(`/create-processing-statement/${documentNumber}/processing-statement-created`);
    } catch (error) {
      scrollToErrorIsland();
    }
  }
}

function mapStateToProps(state) {
  const { exporter = {} } = state;
  return {
    exporter: exporter.model,
    processingStatement: state.processingStatement,
    document: state.document
  };
}


function loadData(store, journey) {
  return store.dispatch(getExporterFromMongo(journey, this.documentNumber)).then(() => {
    return store.dispatch(getProcessingStatementFromRedis(this.documentNumber)).then(() => {
      return store.dispatch(getDocument(journey));
    });
  });
}

export const component = withRouter(
  connect(
    mapStateToProps,
    {
      save: saveProcessingStatement,
      saveToRedis: saveProcessingStatementToRedis,
      getFromRedis: getProcessingStatementFromRedis,
      getExporterFromMongo,
      generatePdf: generateProcessingStatementPdf,
      getDocument: getDocument
    }
  )(withTranslation()(SummaryPage)));

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
