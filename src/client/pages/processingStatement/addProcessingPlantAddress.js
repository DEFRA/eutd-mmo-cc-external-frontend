import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Main,
  BackLink,
  InputField,
  Header,
  GridRow,
  GridCol
} from 'govuk-react';

import {
  getProcessingStatementFromRedis,
  saveProcessingStatement,
  saveProcessingStatementToRedis,
  clearProcessingStatement,
  changePlantAddress,
  clearChangePlantAddress,
  clearErrorsForPlantAddress
} from '../../actions';

import PageTemplateWrapper from '../../components/PageTemplateWrapper';

import {
  toGovukErrors,
  onHandleErrorClick,
  scrollToErrorIsland
} from '../utils';
import ErrorIsland from '../../components/elements/ErrorIsland';
import PageTitle from '../../components/PageTitle';
import Form from '../../components/elements/Form';
import {Link, withRouter} from 'react-router-dom';
import HelpLink from '../../components/HelpLink';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';
import NotificationBanner from '../../components/NotificationBanner';
import { withTranslation } from 'react-i18next';
import BackToProgressLink from '../../components/BackToProgressLink';

class AddProcessingPlantAddress extends React.Component {
  async save() {
    this.props.clearChangePlantAddress();

    const {route, match} = this.props;
    const documentNumber = match.params.documentNumber;

    const processingStatement = await this.props.saveToRedis({
        data: this.props.processingStatement || {},
        currentUrl: route.path,
        saveAsDraft: false,
        documentNumber: documentNumber
      });

    if (!_.isEmpty(processingStatement.errors)) return scrollToErrorIsland();

    this.props.clear();
    this.props.history.push(route.nextUri.replace(':documentNumber', documentNumber));
  }

  onChange(e) {
    let processingStatement = _.cloneDeep(this.props.processingStatement || {});
    processingStatement[e.target.name] = e.target.value;
    this.props.save(processingStatement);
  }

  goBack(e, page) {
    e.preventDefault();
    this.props.clear();
    this.props.history.push(page);
  }

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    this.props.clearChangePlantAddress();

    const {route, match} = this.props;
    await this.props.saveToRedis(
      {
        data: this.props.processingStatement || {},
        currentUrl: route.path,
        saveAsDraft: true,
        documentNumber: match.params.documentNumber
      });

    const { saveAsDraftUri } = this.props.route;

    this.props.clear();
    this.props.history.push(saveAsDraftUri);
  }

  unauthorised() {
    const { documentNumber } = this.props.match.params;
    const { previousUri } = this.props.route;

    this.props.history.push(previousUri.replace(':documentNumber', documentNumber));
  }



  componentDidUpdate() {
    const { processingStatement } = this.props;
    if (processingStatement && processingStatement.unauthorised === true) {
      this.unauthorised();
    }
  }

  componentWillUnmount() {
    this.props.clearErrorsForPlantAddress();
  }

  async componentDidMount() {
    const model = this.props.processingStatement;

    if (!model.changeAddress) {
      await this.props.getFromRedis(this.props.match.params.documentNumber);
    }
  }

  render() {

    const { processingStatement = {}, history, route, match, t } = this.props;
    const { previousUri, path, nextUri, saveAsDraftUri, journey, changeAddressUri, progressUri, title } = route;
    const documentNumber = match.params.documentNumber;
    const errors = (processingStatement && processingStatement.errorsUrl === history.location.pathname && processingStatement.errors) ? processingStatement.errors : {}; // only display errors for this URL
    const {plantName = '', plantAddressOne = '', plantTownCity = '', plantPostcode = ''} = processingStatement;
    const saveAsDraftFormActionUrl = `/orchestration/api/v1/processingStatement/saveAndValidate?c=${path}&n=${nextUri}&saveAsDraftUrl=${saveAsDraftUri}`;
    const backUrl = previousUri.replace(':documentNumber', documentNumber);
    const showAddressBanner = processingStatement._plantDetailsUpdated;
    const hasAddress = plantAddressOne && plantAddressOne != '';
    const changeAddressLink = changeAddressUri.replace(':documentNumber', documentNumber);

    return (
      <Main className="processing-statement">
        <PageTitle title={`${!_.isEmpty(errors) ? 'Error: ' : ''}${t('psAddProcessingPlantAddressDetailsAddressText')} - ${t(title)}`} />
        <ErrorIsland errors={toGovukErrors(errors)} onHandleErrorClick={onHandleErrorClick}/>
        <GridRow>
          <GridCol>
            <BackLink onClick={e => this.goBack(e, backUrl)} href={backUrl}>
             {t('commonBackLinkBackButtonLabel')}
            </BackLink>
            {showAddressBanner && (
              <NotificationBanner
                header={t('commonImportant')}
                messages={[t('psAddProcessingPlantAddressDetailsNotificationText')]} />
            )}
            <Header>{t('psAddProcessingPlantAddressDetailsAddressText')}</Header>
          </GridCol>
        </GridRow>
        <Form
          action="/orchestration/api/v1/processingStatement/saveAndValidate"
          currentUrl={path}
          nextUrl={nextUri}
          onSubmit={e => e.preventDefault()}
        >
          <GridRow>
            <GridCol columnTwoThirds>
              <InputField
                id="plantName"
                meta={{error: t(errors['plantName']), touched: true}}
                htmlFor={'plantName'}
                input={{
                  autoComplete: 'off',
                  className: 'formControl',
                  name: 'plantName',
                  id: 'plantName',
                  value: plantName,
                  onChange: e => this.onChange(e, 'plantName')
                }}>{t('psAddProcessingPlantAddressDetailsPlantNameText')}</InputField>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol columnTwoThirds>
              {hasAddress
                ?
                  <>
                    <p id="plant-address">
                      {plantAddressOne}<br />
                      {plantTownCity}<br />
                      {plantPostcode}
                    </p>
                    <p id="address-link-wrapper">
                      <Link
                        id="plant-address-link"
                        className="change-address-link"
                        to={changeAddressLink}
                        onClick={() => this.props.changePlantAddress()}
                        >
                         {t('commonWhatExportersAddressChangeLink')}
                        <span className="govuk-visually-hidden">
                          {t('psAddProcessingPlantAddressDetailsAddTheProcessingPlantAddressLinktext')}
                        </span>
                      </Link>
                    </p>
                  </>
                :
                  <>
                    <p id="plant-address">{t('psAddProcessingPlantAddressDetailsAnAddressMustBeAddedForThisProcessingPlant')}</p>
                    <p id="address-link-wrapper">
                      <Link
                        id="plant-address-link"
                        className="change-address-link"
                        to={changeAddressLink}
                        onClick={() => this.props.changePlantAddress()}
                        >
                        {t('psAddProcessingPlantAddressDetailsAddTheProcessingPlantAddressLinktext')}
                      </Link>
                    </p>
                  </>
              }
            </GridCol>
          </GridRow>
          <GridRow>
            <SaveAsDraftButton formactionUrl={saveAsDraftFormActionUrl} onClick={this.onSaveAsDraft} />
            <input type="hidden" name="journey" value={journey} />
            <input type="hidden" name="currentUri" value={path} />
            <ContinueButton id="continue" onClick={() => this.save()}>
            {t('commonContinueButtonSaveAndContinueButton')}
            </ContinueButton>
          </GridRow>
        </Form>
        <BackToProgressLink
          progressUri={progressUri}
          documentNumber={documentNumber}
        />
        <HelpLink journey={journey}/>
      </Main>
    );
  }
}


function mapStateToProps(state) {
  const {postcodeLookupAddress} = state.postcodeLookup || {};
  return {
    processingStatement: {...state.processingStatement, ...postcodeLookupAddress}
  };
}

function loadData(store) {
  return store.dispatch(getProcessingStatementFromRedis(this.documentNumber));
}

export const component = withRouter(
  connect(mapStateToProps, {
    save: saveProcessingStatement,
    clear: clearProcessingStatement,
    saveToRedis: saveProcessingStatementToRedis,
    getFromRedis: getProcessingStatementFromRedis,
    changePlantAddress,
    clearChangePlantAddress,
    clearErrorsForPlantAddress
  })(withTranslation() (AddProcessingPlantAddress) ));

export default {
  loadData,
  component: PageTemplateWrapper( component )
};
