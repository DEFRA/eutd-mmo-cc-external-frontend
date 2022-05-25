import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import { isEmpty } from 'lodash';
import BackToProgressLink from '../../components/BackToProgressLink';

import {
  Main,
  BackLink,
  InputField,
  Header,
  GridRow,
  GridCol,
  WarningText
} from 'govuk-react';

import {
  getExporterFromMongo,
  saveExporterToMongo,
  changeAddressExporter,
  clearChangeAddressExporter,
  clearUnauthorisedExporter,
  saveExporter,
  fetchUserDetailsFromDynamics,
  fetchAddressDetailsFromDynamics,
  fetchAccountDetailsFromDynamics,
  getDocument
} from '../../actions';

import { getLandingType } from '../../actions/landingsType.actions';
import ContinueButton from '../../components/elements/ContinueButton';
import { withTranslation, Trans } from 'react-i18next';
import { onHandleErrorClick } from '../utils';

import PageTitle from '../../components/PageTitle';
import HelpLink from '../../components/HelpLink';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import ErrorIsland from '../../components/elements/ErrorIsland';
import NotificationBanner from '../../components/NotificationBanner';
import { catchCertificateJourney } from '../../helpers/journeyConfiguration';

class ExporterDetailsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      submitted: false
    };
  }

  componentDidUpdate() {
    const { exporter } = this.props;

    if (exporter.unauthorised === true) {
      this.props.history.push('/forbidden');
    }
  }

  componentWillUnmount() {
    this.props.clearUnauthorisedExporter();
  }

  hasLandingEntryOption() {
    const { landingsType } = this.props;
    return landingsType && landingsType.landingsEntryOption !== null && landingsType.generatedByContent === false;
  }

  displayLandingEntryOptions() {
    const { documentNumber } = this.props.match.params;
    const { landingsEntryUri } = this.props.route;
    this.props.history.push(landingsEntryUri.replace(':documentNumber', documentNumber));
  }

  async componentDidMount() {

    const { route, match, config = {}, exporter = {} } = this.props;
    const { documentNumber } = match.params;
    const { journey } = route;
    const { enabledAccountDetailsFetch } = config;
    const {postcodeLookupAddress} = this.props.postcodeLookup || {};
    const exporterModel = exporter ? (exporter.model || {}) : {};
    let model = {...exporterModel, ...postcodeLookupAddress};

    if (!model.changeAddress) {
      await this.props.getExporterFromMongo(journey, documentNumber);
    }

    await this.props.getDocument(journey);

    if (journey === catchCertificateJourney) {
      await this.props.getLandingType(documentNumber);

      if (!this.hasLandingEntryOption()) {
        this.displayLandingEntryOptions();
      }
    }

    if (exporter.error) {
      window.scrollTo(0, 0);
    }

    let promiseArray = [];

    if (!model.changeAddress) {
      if (!model.preLoadedName) {
        promiseArray.push(this.props.fetchUserDetailsFromDynamics());
      }
      if (!model.preLoadedAddress) {
        promiseArray.push(this.props.fetchAddressDetailsFromDynamics());
      }
      if (!model.preLoadedCompanyName && enabledAccountDetailsFetch) {
        promiseArray.push(this.props.fetchAccountDetailsFromDynamics());
      }
    }

    this.props.clearChangeAddressExporter();

    await Promise.all(promiseArray);
  }

  async onSubmit(e) {
    try {
      e.preventDefault();
      const { journey } = this.props.route;
      let { nextUri, uploadFileUri, path } = this.props.route;

      const {exporter = {}, landingsType = {}} = this.props;
      const {landingsEntryOption} = landingsType;
      const {postcodeLookupAddress} = this.props.postcodeLookup || {};
      const exporterModel = exporter ? (exporter.model || {}) : {};
      let model = {...exporterModel, ...postcodeLookupAddress};
      model.isExporterDetailsSavedAsDraft = false;
      const documentNumber = this.props.match.params['documentNumber'];

      await this.props.saveExporterToMongo(
        model,
        journey,
        path,
        nextUri,
        documentNumber
      );

      if (journey === catchCertificateJourney && !isEmpty(landingsEntryOption) && landingsEntryOption === 'uploadEntry') {
        this.props.history.push(uploadFileUri.replace(':documentNumber', documentNumber));
      } else {
        this.props.history.push(nextUri.replace(':documentNumber', documentNumber));
      }
    } catch (err) {
      window.scrollTo(0, 0);
    }
  }

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const { journey, path, saveAsDraftUri } = this.props.route;
    const {exporter = {}} = this.props;
    const {postcodeLookupAddress} = this.props.postcodeLookup || {};
    const exporterModel = exporter ? (exporter.model || {}) : {};
    let model = {...exporterModel, ...postcodeLookupAddress};
    model.isExporterDetailsSavedAsDraft = true;
    const documentNumber = this.props.match.params['documentNumber'];

    try {
      await this.props.saveExporterToMongo(
        model,
        journey,
        path,
        saveAsDraftUri,
        documentNumber
      );

      this.props.history.push(saveAsDraftUri);
    } catch (err) {
      window.scrollTo(0, 0);
    }
  }

  onChange(e) {

    const { name, value } = e.target; // get the event target name and value properties into local constants
    const {exporter = {}} = this.props;
    const {postcodeLookupAddress} = this.props.postcodeLookup || {};
    const exporterModel = exporter ? (exporter.model|| {}) : {};
    let model = {...exporterModel, ...postcodeLookupAddress};
    model[name] = value;
    this.props.saveExporter(model);
  }

  hasErrors() {
    const { exporter = {} } = this.props;
    const { errors } = exporter;

    if (errors !== undefined) {
      return errors.errors && errors.errors.length > 0;
    }

    return false;
  }

  render() {
    const { exporter = {}, route, t } = this.props;
    const { error, errors = {} } = exporter;
    const { header = t('commonAddExporterDetailsAddYourCompanyDetails'), journey, path, previousUri, showResponsiblePerson, saveAsDraftUri, progressUri } = this.props.route;
    let { journeyText } = route;
    const {postcodeLookupAddress} = this.props.postcodeLookup || {};
    const exporterModel = exporter ? (exporter.model || {}) : {};
    let model = {...exporterModel, ...postcodeLookupAddress};
    let { nextUri, title } = this.props.route;
    const {
      exporterFullName = '',
      exporterCompanyName = '',
      preLoadedName = '',
      preLoadedAddress = '',
      preLoadedCompanyName = '',
      addressOne = '',
      townCity = '',
      postcode = ''
    } = model;

    const hasAddress = !isEmpty(addressOne) && !isEmpty(postcode);

    if (this.props.route.queryParams && this.props.route.queryParams.nextUri) {
      nextUri = this.props.route.queryParams.nextUri;
    }

    const postUrl = `/orchestration/api/v1/exporter/${journey}`;
    const saveAsDraftFormActionUrl = `/orchestration/api/v1/exporter/${journey}/saveAsDraftLink`;
    const documentNumber = this.props.match.params['documentNumber'];
    const changeUrl = this.props.route.changeAddressUri.replace(':documentNumber',documentNumber);

    const showAddressBanner = model._updated;

    return (
      <Main className="export-cert">
        <PageTitle title={`${this.hasErrors() ? `${t('commonPageTitleErrorText')} ` : ''}${t(header)} - ${t(title)}`} />
        {(error && !isEmpty(errors) && errors.errors.length > 0) && (
          <ErrorIsland
            errors={errors.errors.map(err => ({
              message: t(err.text),
              key: err.targetName
            }))}
            onHandleErrorClick={onHandleErrorClick}
          />
        )}
        <GridRow>
          <GridCol>
            <BackLink
              onClick={e => {
                e.preventDefault();
                this.props.history.push(previousUri.replace(':documentNumber', this.props.match.params['documentNumber']));
              }}
              href={previousUri}
            >
            {t('commonBackLinkBackButtonLabel')}
            </BackLink>
            {showAddressBanner && (
              <NotificationBanner
                header={t('commonImportant')}
                messages={[t('commonAddExporterDetailsNotificationContent')]} />
            )}
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol>
            <Header>
            {t(header)}
            </Header>
          <WarningText className="warning-message" >
            <Trans i18nKey="multiline">
                {t('commonAddExporterDetailsWarningContent', {journeyText: t(journeyText)})}
             </Trans>
            </WarningText>
          </GridCol>
        </GridRow>

        <form action={postUrl} method="POST" onSubmit={e => this.onSubmit(e)}>
          {showResponsiblePerson ?
            <GridRow>
              <GridCol columnTwoThirds>
                <InputField
                  meta={{ error: t(errors.exporterFullNameError), touched: true }}
                  htmlFor={'exporterFullName'}
                  input={{
                    id: 'exporterFullName',
                    className: 'formControl',
                    name: 'exporterFullName',
                    value: exporterFullName,
                    onChange: e => this.onChange(e),
                    onBlur: e => this.onChange(e)
                  }}
                >
                {t('ccAddExporterDetailsExporterNameOfPersonResponsible')}
              </InputField>
              </GridCol>
            </GridRow>
            : null
          }
          <GridRow>
            <GridCol columnTwoThirds>
              <InputField
                meta={{ error: t(errors.exporterCompanyNameError), touched: true }}
                htmlFor={'exporterCompanyName'}
                input={{
                  id: 'exporterCompanyName',
                  className: 'formControl',
                  name: 'exporterCompanyName',
                  value: exporterCompanyName,
                  onChange: e => this.onChange(e),
                  onBlur: e => this.onChange(e)
                }}
                hint={[t('commonAddExporterDetailsExporterCompanyNameHintText')]}
              >
                {t('commonAddExporterDetailsCompanyName')}
              </InputField>
            </GridCol>
          </GridRow>

          <Header level="2">
            {t('commonAddExporterDetailsAddressContent')}
          </Header>
                <GridRow>
                  <GridCol columnTwoThirds>
                      <div className={`exporter-address-data ${errors.addressError ? 'error' : ''}`} id="address">
                        {errors.addressError && (<p className="error-message">{t(errors.addressError)}</p>)}
                        {hasAddress
                          ?
                            <>
                              <p>
                                {addressOne}<br />
                                {townCity}<br />
                                {postcode}
                              </p>
                              <p>
                                <Link
                                  className="change-address-link"
                                  to={changeUrl}
                                  onClick={() => this.props.changeAddressExporter()}
                                  >
                                  {t('commonWhatExportersAddressChangeLink')}
                                  <span className="govuk-visually-hidden">
                                    {t('commonWhatExportersAddressExporterAddress')}
                                  </span>
                                </Link>
                              </p>
                            </>
                          :
                            <>
                              <p>
                                {t('commonAddExporterDetailsExporterAddressRegistration')}
                              </p>
                              <p>
                                <Link
                                  className="change-address-link"
                                  to={changeUrl}
                                  onClick={() => this.props.changeAddressExporter()}
                                  >
                                 {t('commonAddExporterDetailsAddTheExportersAddress')}
                                </Link>
                              </p>
                            </>
                          }
                      </div>
                  </GridCol>
                </GridRow>
          <input
            type="hidden"
            name="preLoadedName"
            value={preLoadedName}
          />
          <input
            type="hidden"
            name="preLoadedAddress"
            value={preLoadedAddress}
          />
          <input
            type="hidden"
            name="preLoadedCompanyName"
            value={preLoadedCompanyName}
          />
          <input type="hidden" name="journey" value={journey} />
          <input type="hidden" name="currentUri" value={path} />
          <input type="hidden" name="nextUri" value={nextUri} />
          <input type="hidden" name="dashboardUri" value={saveAsDraftUri} />
          <GridRow>
            <SaveAsDraftButton formactionUrl={saveAsDraftFormActionUrl} onClick={this.onSaveAsDraft}></SaveAsDraftButton>
            <ContinueButton id="continue"> {t('commonContinueButtonSaveAndContinueButton')}</ContinueButton>
          </GridRow>
        </form>
        <BackToProgressLink
          progressUri={progressUri}
          documentNumber={documentNumber}
        />
        <HelpLink journey={route.journey} />
      </Main>
    );
  }
}

function mapStateToProps(state) {
  const { exporter, postcodeLookup, landingsType } = state;

  return {
    exporter,
    postcodeLookup,
    landingsType
  };
}

function loadData(store, journey) {
  const { exporter = {} } = store.getState();
  const { model = {} } = exporter;

  const { config = {} } = store.getState();
  const { enabledAccountDetailsFetch = false } = config;
  let promiseArray = [store.dispatch(getExporterFromMongo(journey, this.documentNumber))];
  if (!model.preLoadedName) {
    promiseArray.push(store.dispatch(fetchUserDetailsFromDynamics()));
  }
  if (!model.preLoadedAddress) {
    promiseArray.push(store.dispatch(fetchAddressDetailsFromDynamics()));
  }
  if (!model.preLoadedCompanyName && enabledAccountDetailsFetch) {
    promiseArray.push(store.dispatch(fetchAccountDetailsFromDynamics()));
  }

  return Promise.all(promiseArray);
}

export const component = withRouter(
  connect(
    mapStateToProps,
    {
      getExporterFromMongo,
      changeAddressExporter,
      clearChangeAddressExporter,
      clearUnauthorisedExporter,
      saveExporter,
      saveExporterToMongo,
      fetchUserDetailsFromDynamics,
      fetchAddressDetailsFromDynamics,
      fetchAccountDetailsFromDynamics,
      getDocument,
      getLandingType
    }
  )(withTranslation()(ExporterDetailsPage))
);

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
