import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import BackToProgressLink from '../../components/BackToProgressLink';

import {
  InputField,
  Header,
  GridRow,
  GridCol,
  Main,
  BackLink
} from 'govuk-react';

import {
  getProcessingStatementFromRedis,
  saveProcessingStatement,
  saveProcessingStatementToRedis,
  clearProcessingStatement,
  getAllFish
} from '../../actions';

import PageTitle from '../../components/PageTitle';
import ErrorIsland from '../../components/elements/ErrorIsland';
import { onHandleErrorClick, scrollToErrorIsland, toGovukErrors } from '../utils';
import Form from '../../components/elements/Form';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import HelpLink from '../../components/HelpLink';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';
import SpeciesAutocomplete from '../../components/SpeciesAutocomplete.js';
import SpeciesDetails from '../../components/elements/SpeciesDetails';
import { withTranslation } from 'react-i18next';

class AddCatchDetailsPage extends React.Component {

  state = {}

  goBack(e, page) {
    e.preventDefault();
    const processingStatementClone = _.cloneDeep((this.props.processingStatement || {}));
    processingStatementClone.errors = {};
    this.props.save(processingStatementClone);
    this.props.history.push(page);
  }

  constructor(props) {
    super(props);
    this.state = this.init(props);
  }

  init(props) {
    const processingStatement = _.cloneDeep(props.processingStatement || {});
    const index = +(this.props.match.params.catchIndex) || 0;

    if (processingStatement.catches && index >= processingStatement.catches.length) {
      processingStatement.catches.push({});
    } // add new entry if needed

    return ({
      index,
      processingStatement,
      scientificName: '',
      speciesCode: '',
      errors: processingStatement.errors || {},
      errorsUrl: processingStatement.errorsUrl
    });
  }

  redirectToForbiddenPage() {
    this.props.history.push('/forbidden');
  }

  hasRequiredData() {
    return this.props.processingStatement && this.props.processingStatement.consignmentDescription;
  }

  componentWillUnmount() {
    this.props.clear();
  }

  componentDidUpdate() {
    const { processingStatement } = this.props;
    if (processingStatement.unauthorised === true) {
      this.redirectToForbiddenPage();
    }
  }

  async componentDidMount() {
    const { documentNumber } = this.props.match.params;
    await this.props.getFromRedis(documentNumber);
    await this.props.getAllFish();
    this.setState(this.init(this.props));

    const { index, processingStatement } = this.state;
    const catchDetails = processingStatement.catches[index];

    if (processingStatement.unauthorised) {
      return;
    }

    if (catchDetails === undefined) {
      this.props.history.push(`/create-processing-statement/${documentNumber}/catch-added`);
    }
  }

  onChange(e, name) {
    const { processingStatement, index, scientificName } = this.state;
    const catchDetails = processingStatement.catches[index];
    catchDetails[name] = (name === 'species' ? e : e.target.value);

    if (name === 'species') {
      catchDetails['scientificName'] = scientificName;
    }

    this.setState({ processingStatement });
  }

  onContinue = async (e) => {
    e.preventDefault();

    const documentNumber = this.props.match.params.documentNumber;

    const { index } = this.state;
    const { route } = this.props;
    const currentUrl = this.props.route.firstCatch ? route.path : `/create-processing-statement/${documentNumber}/add-catch-details/${index}`;
    const processingStatement = await this.props.saveToRedis({
      saveToRedisIfErrors: false,
      data: this.state.processingStatement,
      currentUrl: currentUrl,
      documentNumber: documentNumber
    });

    if (!_.isEmpty(processingStatement.errors)) {
      this.setState({
        errors: processingStatement.errors,
        errorsUrl: processingStatement.errorsUrl
      });
      return scrollToErrorIsland();
    }

    const nextUri = this.props.route.firstCatch ? route.nextUri.replace(':documentNumber', documentNumber) : `/create-processing-statement/${documentNumber}/add-catch-weights/${index}`;
    this.props.history.push(nextUri);
  };

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const { index } = this.state;
    const { route, match } = this.props;
    const { firstCatch, path, saveAsDraftUri } = route;
    const documentNumber = match.params.documentNumber;
    const currentUrl = firstCatch ? path.replace(':documentNumber', documentNumber)
      : `/create-processing-statement/${documentNumber}/add-catch-details/${index}`;
    const processingStatement = await this.props.saveToRedis({
      saveToRedisIfErrors: true,
      data: this.state.processingStatement,
      currentUrl: currentUrl,
      saveAsDraft: true,
      documentNumber: documentNumber
    });

    if (!_.isEmpty(processingStatement.errors)) {
      this.setState({
        errors: processingStatement.errors,
        errorsUrl: processingStatement.errorsUrl
      });
    }

    this.props.history.push(saveAsDraftUri);
  }

  render() {
    const { history, route, match, t } = this.props;
    const { previousUri, path, nextUri, saveAsDraftUri, journey, progressUri, title } = route;
    const { processingStatement, errors, errorsUrl, index } = this.state;
    const catchDetails = processingStatement.catches[index];
    const documentNumber = match.params.documentNumber;
    const { catchCertificateNumber = '', species = '' } = catchDetails || [];
    const errs = (errorsUrl === history.location.pathname && errors) || {}; // only display errors for this URL
    const backLink = previousUri.replace(':documentNumber', documentNumber);
    const currentUrl = route.path.replace(':catchIndex', index);
    const nextUrl = route.nextUri.replace(':catchIndex', index);


    const saveAsDraftFormActionUrl = `/orchestration/api/v1/processingStatement/saveAndValidate?c=${currentUrl}&n=${nextUri}&saveAsDraftUrl=${saveAsDraftUri}`;
    return (
      <Main className="storage-notes">
        <ErrorIsland errors={toGovukErrors(errs)} onHandleErrorClick={onHandleErrorClick} />
        <PageTitle title={`${!_.isEmpty(errors) ? 'Error: ' : ''}${t('psAddCatchDetailsHeading')} - ${t(title)}`} />

        <Form action="/orchestration/api/v1/processingStatement/saveAndValidate"
          currentUrl={currentUrl}
          nextUrl={nextUrl}
          onSubmit={(e) => e.preventDefault()}>
          <GridRow>
            <GridCol>
              <BackLink href={`/orchestration/api/v1/processingStatement/back?n=${backLink}`}
                onClick={(e) => this.goBack(e, backLink)}>{t('commonBackLinkBackButtonLabel')}</BackLink>
              <Header>{t('psAddCatchDetailsHeading')}</Header>
            </GridCol>
          </GridRow>
          <Fragment>
            <GridRow>
              <GridCol>
                <div className={'input-species-ps autocomplete-ps ' + ((errors[`catches-${index}-species`]) ? 'error' : '')}>
                  <SpeciesAutocomplete
                    hintText={t('psAddCatchDetailsSpeciesAutocompleteHint')}
                    defaultValue={species || ''}
                    label={t('psAddCatchDetailsSpeciesAutocompleteLabel')}
                    id={`catches-${index}-species`}
                    name={`catches.${index}.species`}
                    errorName="autoFillError"
                    error={{ errors: [{ targetName: `catches.${index}.species`, text: t(errors[`catches-${index}-species`]) }], autoFillError: t(errors[`catches-${index}-species`]) }}
                    onChange={(e, speciesObj) => {
                      this.setState({ speciesCode: speciesObj ? speciesObj.faoCode : species, scientificName: speciesObj?.scientificName }, () => {
                        this.onChange(e, 'species');
                      });
                    }}
                    htmlFor={`catches.${index}.species`}
                  />
                  <input type="hidden" name="speciesCode" value={this.state.speciesCode || ''} />
                  <input type="hidden" name="scientificName" value={this.state.scientificName || ''} />
                </div>
                <br />
                <SpeciesDetails exemptFrom={t('psAddCatchDetailsExemptFromProcessingStatements')} />
              </GridCol>
            </GridRow>
            <GridRow>
              <GridCol columnTwoThirds>
                <InputField
                  id={`catches-${index}-catchCertificateNumber`}
                  meta={{ error: t(errs[`catches-${index}-catchCertificateNumber`]), touched: true }}
                  htmlFor={`catches.${index}.catchCertificateNumber`}
                  input={{
                    autoComplete: 'off',
                    className: 'formControl',
                    maxLength: '54',
                    id: `catches.${index}.catchCertificateNumber`,
                    name: `catches.${index}.catchCertificateNumber`,
                    value: catchCertificateNumber,
                    onChange: (e) => this.onChange(e, 'catchCertificateNumber')
                  }}>
                  {t('commonCatchCertificateNumber')}
                </InputField>
              </GridCol>
            </GridRow>
          </Fragment>
          <GridRow>
            <SaveAsDraftButton formactionUrl={saveAsDraftFormActionUrl} onClick={this.onSaveAsDraft} />
            <input type="hidden" name="journey" value={journey} />
            <input type="hidden" name="currentUri" value={path} />
            <ContinueButton type="submit" id="continue" onClick={this.onContinue}>{t('commonContinueButtonSaveAndContinueButton')}</ContinueButton>
          </GridRow>
        </Form>
        <BackToProgressLink
          progressUri={progressUri}
          documentNumber={documentNumber}
        />
        <HelpLink journey={journey} />

      </Main>
    );
  }
}

function mapStateToProps(state) {
  return {
    processingStatement: state.processingStatement
  };
}

function loadData(store) {
  return store.dispatch(getProcessingStatementFromRedis(this.documentNumber))
    .then(() => store.dispatch(getAllFish()));
}

export const component = withRouter(
  connect(mapStateToProps, {
    save: saveProcessingStatement,
    clear: clearProcessingStatement,
    saveToRedis: saveProcessingStatementToRedis,
    getFromRedis: getProcessingStatementFromRedis,
    getAllFish
  }
  )(withTranslation() (AddCatchDetailsPage))
);

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
