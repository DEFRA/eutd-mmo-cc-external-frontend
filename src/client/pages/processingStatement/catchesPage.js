import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import BackToProgressLink from '../../components/BackToProgressLink';

import {
  Main,
  BackLink,
  Header,
  GridRow,
  GridCol, MultiChoice
} from 'govuk-react';

import {
  getProcessingStatementFromRedis,
  saveProcessingStatement,
  saveProcessingStatementToRedis
} from '../../actions';

import PageTitle from '../../components/PageTitle';

import SelectRadio from '../../components/elements/SelectRadio';
import {
  ChangeLinkTag,
  SummaryCellKey,
  SummaryCellLink,
  SummaryRow,
  SummaryTable
} from '../../components/Summary';
import Form from '../../components/elements/Form';
import { onHandleErrorClick, scrollToErrorIsland, toGovukErrors } from '../utils';
import ErrorIsland from '../../components/elements/ErrorIsland';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import HelpLink from '../../components/HelpLink';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';
import SecondaryButton from '../../components/elements/SecondaryButton';
import {withTranslation} from 'react-i18next';

class CatchesPage extends React.Component {

  goBack(e, page) {
    e.preventDefault();
    const processingStatement = _.cloneDeep((this.props.processingStatement || {}));
    this.props.save(processingStatement);
    this.props.history.push(page);
  }

  onContinue = async(e) => {
    e.preventDefault();
    const { processingStatement, route, match } = this.props;
    const { addAnotherCatch } = processingStatement;
    const documentNumber = match.params.documentNumber;

    if (addAnotherCatch === 'Yes') {
      const processingStatementClone = _.cloneDeep((processingStatement));
      processingStatementClone.errors = {};
      this.props.save(processingStatementClone);
      this.props.history.push(`/create-processing-statement/${documentNumber}/add-catch-details/${processingStatement.catches.length}`);
    } else {
      const response = await this.save();

      if (!_.isEmpty(response.errors)) {
        return scrollToErrorIsland();
      }

      this.props.history.push(route.nextUri.replace(':documentNumber', documentNumber));
    }
  }

  async save(nextUri){
    const { route, match } = this.props;
    const { saveAsDraftUri } = route;
    const documentNumber = match.params.documentNumber;
    const isSavedAsDraft = nextUri === saveAsDraftUri;

     return await this.props.saveToRedis({
        data: this.props.processingStatement || {},
        currentUrl: route.path,
        saveToRedisIfErrors: isSavedAsDraft,
        saveAsDraft: isSavedAsDraft,
        documentNumber: documentNumber
     });
  }

  removeStorageFacility(e, index) {
    e.preventDefault();
    const processingStatement = _.cloneDeep((this.props.processingStatement || {}));
    processingStatement.catches.splice(index, 1);
    this.props.save(processingStatement);
  }

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const { saveAsDraftUri } = this.props.route;

    await this.save(saveAsDraftUri);
    this.props.history.push(saveAsDraftUri);
  }

  unauthorised() {
    const { documentNumber } = this.props.match.params;
    const { previousUri } = this.props.route;

    this.props.history.push(previousUri.replace(':documentNumber', documentNumber));
  }

  isUnauthorised() {
    const { processingStatement } = this.props;
    return processingStatement.unauthorised === true;
  }

  hasRequiredData() {
    const { processingStatement } = this.props;
    if (processingStatement.catches && processingStatement.catches.length > 0) {
      return processingStatement.catches.some(catchDetail => {
        return [
          'species',
          'catchCertificateNumber',
          'totalWeightLanded',
          'exportWeightBeforeProcessing',
          'exportWeightAfterProcessing'].every(prop => !_.isEmpty(catchDetail[prop]));
      });
    }

    return false;
  }

  componentDidUpdate() {
    if (this.isUnauthorised()) {
      this.unauthorised();
    }
  }

  async componentDidMount() {
    await this.props.getFromRedis(this.props.match.params.documentNumber);

    if (!this.hasRequiredData()) {
      this.unauthorised();
    }
  }

  renderAddNewOptions = () => {
    const {processingStatement, t} = this.props;
    const types = ['Yes', 'No'];
    return types.map(type => {
      if (processingStatement && type === processingStatement.addAnotherCatch) {
        return (
          <SelectRadio
            key={type}
            id={`addAnotherCatch${type}`}
            value={type}
            name="addAnotherCatch"
            defaultChecked
            inline
          >
            {t(type)}
          </SelectRadio>
        );
      }
      return (
        <SelectRadio
          key={type}
          id={`addAnotherCatch${type}`}
          value={type}
          name="addAnotherCatch"
          inline
        >
          {t(type)}
        </SelectRadio>
      );
    });
  };

  render() {
    const { processingStatement, history, route, match, t } = this.props;
    const { documentNumber } = match.params;
    const { previousUri, path, saveAsDraftUri, journey, progressUri } = route;
    const title = (processingStatement.catches.length > 1 ? t('psCatchAddedMultiCatchTitle', {count: processingStatement.catches.length}) : t('psCatchAddedSingleCatchTitle', {count: processingStatement.catches.length}));
    const errors = (processingStatement.errorsUrl === history.location.pathname && processingStatement.errors) || {};
    const backUrl = previousUri.replace(':documentNumber', documentNumber);
    const saveAsDraftFormActionUrl = `/orchestration/api/v1/processingStatement/saveAndValidate?c=${path}&saveAsDraftUrl=${saveAsDraftUri}`;
    const addAnotherCatchError = Object.keys(errors)
      .filter(key => key === 'addAnotherCatch')
      .reduce((obj, key) => {
        obj[key] = errors[key];
        return obj;
      }, {});
    const removeButtonStyle = {
      marginBottom: '10px'
    };

    return (
      <Main className="processing-statement">
        <ErrorIsland errors={toGovukErrors(addAnotherCatchError)} onHandleErrorClick={onHandleErrorClick}/>
        <PageTitle title={`${!_.isEmpty(errors) ? 'Error: ' : ''}${title} - ${t(this.props.route.title)}`} />
        <GridRow>
          <GridCol>
            <BackLink href={`/orchestration/api/v1/processingStatement/back?n=${backUrl}`}
              onClick={(e) => this.goBack(e, backUrl)}
            >{t('commonBackLinkBackButtonLabel')}</BackLink>
            <Header>{title}</Header>
          </GridCol>
        </GridRow>
        <Form action="/orchestration/api/v1/processingStatement/saveAndValidate"
          currentUrl={path}
          onSubmit={(e) => e.preventDefault()}>

          <Header level="2">{t('psCatchAddedSpeciesAndDescription')}</Header>
          {processingStatement.catches.map((speciesAndDescription, index) => {
            const { species } = speciesAndDescription || {};
            const keys = [
              `catches-${index}-species`,
              `catches-${index}-catchCertificateNumber`,
              `catches-${index}-totalWeightLanded`,
              `catches-${index}-exportWeightBeforeProcessing`,
              `catches-${index}-exportWeightAfterProcessing`
            ];
            const hiddenText = `${t('psCatchConsignmentVHiddenCatchText')} ${ species }`;

            const catchErrors = Object.keys(errors)
              .filter(key => keys.includes(key))
              .reduce((obj, key) => {
                obj[key] = errors[key];
                return obj;
              }, {});
            return (
              <Fragment key={index}>
                {catchErrors && (<ErrorIsland errors={toGovukErrors(catchErrors)} onHandleErrorClick={key => {
                  this.props.history.push(`/create-processing-statement/${documentNumber}/${key.includes('Weight') ? 'add-catch-weights' : 'add-catch-details'}/${index}`);
                }}/>)}
                <SummaryTable>
                  <SummaryRow >
                    <SummaryCellKey>{species}</SummaryCellKey>
                    <SummaryCellLink>
                      <ChangeLinkTag
                        id={`edit-species-${index}`}
                        to={`/create-processing-statement/${documentNumber}/add-catch-details/${index}`}>
                        {t('commonEditLink')}
                        <span className="govuk-visually-hidden">
                          {hiddenText}
                        </span>
                      </ChangeLinkTag>
                    </SummaryCellLink>
                    <SummaryCellLink>
                      {processingStatement.catches.length > 1 &&
                        <SecondaryButton
                          id={`remove-species-${index}`}
                          style={removeButtonStyle}
                          onClick={(e) => this.removeStorageFacility(e, index)}
                          formAction={`/orchestration/api/v1/processingStatement/removeKey?n=${path}&key=catches.${index}`}
                        >
                          {t('commonRemoveButton')}
                          <span className="govuk-visually-hidden">
                            {hiddenText}
                          </span>
                        </SecondaryButton>}
                    </SummaryCellLink>
                  </SummaryRow>
                </SummaryTable>
              </Fragment>
            );
            })}
          <br />
          <br />
          <GridRow>
            <GridCol>
              <Header level="2">{t('psCatchAddedAddAnotherCatchCertificate')}</Header>
              <MultiChoice
                meta={{ touched: true, error: t(errors.addAnotherCatch) }}
                id="addAnotherCatch"
                onChange={(e) => {
                  const newProcessingStatement = _.cloneDeep((this.props.processingStatement || {}));
                  newProcessingStatement.addAnotherCatch = e.target.value;
                  this.props.save(newProcessingStatement);
                }
              }>
                <fieldset>
                  <legend className="visually-hidden">{t('psCatchAddedAddAnotherCatchCertificate')}</legend>
                  {this.renderAddNewOptions()}
                </fieldset>
              </MultiChoice>
            </GridCol>
          </GridRow>
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
        <HelpLink journey={journey}/>
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
  return store.dispatch(getProcessingStatementFromRedis(this.documentNumber));
}

export const component = withRouter(
  connect(mapStateToProps, {
      save: saveProcessingStatement,
      saveToRedis: saveProcessingStatementToRedis,
      getFromRedis: getProcessingStatementFromRedis
     })(withTranslation() (CatchesPage)));

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
