import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
  saveConfirmDocumentVoid,
  addConfirmDocumentVoid,
  dispatchApiCallFailed
} from '../../actions';

import {
  Main,
  BackLink,
  Header,
  GridRow,
  GridCol,
  MultiChoice
} from 'govuk-react';

import PageTitle from '../../components/PageTitle';
import Form from '../../components/elements/Form';
import HelpLink from '../../components/HelpLink';
import ContinueButton from '../../components/elements/ContinueButton';
import ErrorIsland from '../../components/elements/ErrorIsland';

import { scrollToErrorIsland, onHandleErrorClick } from '../utils';
import i18n from '../../../../src/i18n';
import SelectRadio from '../../components/elements/SelectRadio';
import { withTranslation } from 'react-i18next';

class ConfimDocumentVoidPage extends React.Component {
  onChange = e => {
    const confirmDocumentVoid = _.cloneDeep(
      this.props.confirmDocumentVoid || {}
    );
    confirmDocumentVoid.documentVoid = e.target.value;
    this.props.addConfirmDocumentVoid(confirmDocumentVoid);
  };

  componentDidMount(){
    i18n.changeLanguage();
    this.forceUpdate();
  }

  onSubmit = async e => {
    e.preventDefault();

    try {
      const {path, journey, previousUri, nextUri} = this.props.route;
      const {documentNumber} = this.props.location;

      const documentVoid = await this.props.saveConfirmDocumentVoid(documentNumber, path, nextUri, journey);

      let to;
      if (documentVoid && documentVoid === 'Yes') {
        to = nextUri;
        //Clear the local redux store / state
      } else {
        to = previousUri;
      }

      this.props.history.push(to);
    } catch (error) {
      scrollToErrorIsland();
    }
  };

  render() {
    const {documentVoidError, errors} = this.props.errors;
    const {confirmDocumentVoid = {}, route, match, t} = this.props;
    const {path, previousUri, nextUri, journey, journeyText} = route;
    const title = t('commonConfirmDocumentVoidPageTitle', { journeyText: t(journeyText) });
    const h1Text = t('commonConfirmDocumentVoidPageHeader', { journeyText: t(journeyText) });
    const currentUri = path.replace(':documentNumber', match.params.documentNumber);

    return (
      <Main>
        {errors && (
          <ErrorIsland
            errors={errors.map(err => ({
              message: t(err.text),
              key: err.targetName
            }))}
            onHandleErrorClick={onHandleErrorClick}
        />
        )}

        <PageTitle
          title={`${!_.isEmpty(errors) ? 'Error: ' : ''}${title} - ${t(this.props.route.title)}`}
        />
        <GridRow>
          <GridCol columnTwoThirds>
            <BackLink onClick={e => { e.preventDefault(); this.props.history.push(previousUri); }} href={previousUri} >
              {t('commonBackLinkBackButtonLabel')}
            </BackLink>
          </GridCol>
        </GridRow>

        <Form action='/orchestration/api/v1/void-certificate' currentUrl={currentUri} onSubmit={this.onSubmit}>
          <GridRow>
            <GridCol columnTwoThirds>
              <GridRow>
                <GridCol>
                  <Header level='1'>
                    <legend>{h1Text}</legend>
                  </Header>
                </GridCol>
              </GridRow>
              <MultiChoice meta={{touched: t(documentVoidError), error: t(documentVoidError)}} id='documentVoid'>
                <fieldset>
                  <SelectRadio id="documentVoidYes" checked={confirmDocumentVoid.documentVoid === 'Yes'} value='Yes' name='documentVoid' inline onChange={this.onChange}>{t('Yes')}</SelectRadio >
                  <SelectRadio id="documentVoidNo" checked={confirmDocumentVoid.documentVoid === 'No'} value='No' name='documentVoid' inline onChange={this.onChange}>{t('No')}</SelectRadio>
                </fieldset>
              </MultiChoice>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol columnTwoThirds>
              <ContinueButton type='submit' id='continue'>{t('commonContinueButtonSaveAndContinueButton')}</ContinueButton>
            </GridCol>
          </GridRow>
          <input type="hidden" name="journey" value={journey} />
          <input type="hidden" name="currentUri" value={path} />
          <input type="hidden" name="nextUri" value={nextUri} />
          <input type="hidden" name="previousUri" value={previousUri} />
        </Form>
        <HelpLink journey={route.journey} />
      </Main>
    );
  }
}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    confirmDocumentVoid: state.confirmDocumentVoid
  };
}

function loadData(store) {
  if (Object.keys(this.queryParams).length !== 0) {
    store.dispatch(dispatchApiCallFailed(JSON.parse(this.queryParams.error)));
  }
}

export const component = withRouter(
  connect(
    mapStateToProps,
    {
      addConfirmDocumentVoid,
      saveConfirmDocumentVoid
    }
  )(withTranslation() (ConfimDocumentVoidPage))
);

ConfimDocumentVoidPage.propTypes = {
  confirmDocumentVoid: PropTypes.object.isRequired,
  errors: PropTypes.object
};

export default {
  loadData,
  component: component
};
