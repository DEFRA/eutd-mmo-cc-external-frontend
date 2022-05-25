import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
  Main,
  BackLink,
  Header,
  GridRow,
  GridCol,
  MultiChoice,
  WarningText,
} from 'govuk-react';

import { onHandleErrorClick, scrollToErrorIsland } from '../../utils';
import {
  clearLandingsType,
  confirmChangeLandingsType,
  onLoadComponentRedirect,
  clearChangedLandingsType,
 } from '../../../actions/landingsType.actions';
import { dispatchApiCallFailed, dispatchClearErrors } from '../../../actions';
import { withTranslation } from 'react-i18next';
import PageTitle from '../../../components/PageTitle';
import Form from '../../../components/elements/Form';
import HelpLink from '../../../components/HelpLink';
import SecondaryButton from '../../../components/elements/SecondaryButton';
import ContinueButton from '../../../components/elements/ContinueButton';
import ErrorIsland from '../../../components/elements/ErrorIsland';
import SelectRadio from '../../../components/elements/SelectRadio';
import PageTemplateWrapper from '../../../components/PageTemplateWrapper';

class LandingsTypesConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLandingsType: ''
    };
    this.unauthorised.bind(this);
  }

  onChange = e => {
    this.setState({ confirmLandingsType: e.target.value });
  };

  onClear = (e) => {
    e.preventDefault();
    const { history, route, match } = this.props;

    this.props.dispatchClearErrors();
    history.push(route.previousUri.replace(':documentNumber', match.params.documentNumber));
  }

  displayDashboardOptions() {
    const { history, route } = this.props;
    history.push(route.dashboardUri);
  }

  componentDidMount() {
    const { landingsType = {}, changedLandingsType } = this.props;

    if (landingsType.unauthorised) {
      this.unauthorised();
    }

    if (changedLandingsType === '') {
      this.displayDashboardOptions();
    }
  }

  unauthorised() {
    this.props.history.push('/forbidden');
  }

  onSubmit = async e => {
    e.preventDefault();

    try {
      const { route, match } = this.props;
      const documentNumber = match.params['documentNumber'];
      const { changedLandingsType } = this.props;
      const data = {
        landingsEntryOption: changedLandingsType,
        landingsEntryConfirmation: this.state.confirmLandingsType
      };
      await this.props.confirmChangeLandingsType(data, route.journey, route.path, documentNumber);
      if (this.state.confirmLandingsType === 'Yes') {
        this.props.history.push(route.nextUri.replace(':documentNumber', documentNumber));
      } else {
        this.props.history.push(route.previousUri.replace(':documentNumber', documentNumber));
      }
    } catch (error) {
      scrollToErrorIsland();
    }
  };

  componentWillUnmount() {
    this.props.clearLandingsType();
    this.props.clearChangedLandingsType();
  }

  render() {
    const { confirmLandingsChangeError, errors } = this.props.errors;
    const { route, match, history, t } = this.props;
    const { confirmLandingsType } = this.state;
    const { path, previousUri, title } = route;
    const heading = t('ccLandingsTypeConfirmationHeaderText');
    const currentUri = path.replace(
      ':documentNumber',
      match.params.documentNumber
    );
    return (
      <Main>
        {errors && (
          <ErrorIsland
            errors={errors.map((err) => ({
              message: t(err.text),
              key: err.targetName,
            }))}
            onHandleErrorClick={onHandleErrorClick}
          />
        )}

        <PageTitle
          title={`${
            !_.isEmpty(errors) ? `${t('commonPageTitleErrorText')} ` : ''
          }${heading} - ${t(title)}`}
        />
        <GridRow>
          <BackLink
            onClick={(e) => {
              e.preventDefault();
              this.props.dispatchClearErrors();
              history.push(previousUri.replace(':documentNumber', match.params.documentNumber));
            }}
            href={previousUri.replace(':documentNumber', match.params.documentNumber)}
          >{t('commonBackLinkBackButtonLabel')}</BackLink>
        </GridRow>

        <Form
          action="/orchestration/api/v1/confirm-change-landings-type"
          currentUrl={currentUri}
          onSubmit={this.onSubmit}
        >
            <GridCol columnFull>
              <GridRow>
                <Header level="1">
                  <legend>{heading}</legend>
                </Header>
              </GridRow>
              <GridRow>
                <WarningText className="warning-message">
                  {t('ccLandingsTypeConfirmationWarningText')}
                </WarningText>
              </GridRow>
              <GridRow>
                <MultiChoice
                  meta={{
                    touched: confirmLandingsChangeError,
                    error: confirmLandingsChangeError,
                  }}
                  id="confirmLandingsChange"
                >
                  <fieldset>
                    <SelectRadio
                      id="landingsTypeYes"
                      checked={confirmLandingsType === 'Yes'}
                      value="Yes"
                      name="confirmLandingsChange"
                      onChange={this.onChange}
                    >
                      {t('ccLandingsTypeConfirmationOptionYesText')}
                    </SelectRadio>
                    <SelectRadio
                      id="landingsTypeNo"
                      checked={confirmLandingsType === 'No'}
                      value="No"
                      name="confirmLandingsChange"
                      onChange={this.onChange}
                    >
                      {t('ccLandingsTypeConfirmationOptionNoText')}
                    </SelectRadio>
                  </fieldset>
                </MultiChoice>
              </GridRow>
            </GridCol>
          <GridRow>
            <SecondaryButton
              type="button"
              id="cancel"
              name="cancel"
              value="cancel"
              onClick={this.onClear}
            >
               {t('commonSecondaryButtonCancelButton')}
            </SecondaryButton>
            <ContinueButton type="submit" id="continue">
              {t('commonContinueButtonContinueButtonText')}
            </ContinueButton>
          </GridRow>
          <input type="hidden" name="confirmLandingsType" value={confirmLandingsType} />
        </Form>
        <HelpLink journey={route.journey} />
      </Main>
    );
  }
}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    landingsType: state.landingsType,
    changedLandingsType: state.changedLandingsType,
  };
}

function loadData(store) {
  if (Object.keys(this.queryParams).length !== 0) {
    store.dispatch(dispatchApiCallFailed(JSON.parse(this.queryParams.error)));
  }
  store.dispatch(onLoadComponentRedirect());
}

export const component = withRouter(
  connect(mapStateToProps, {
    clearLandingsType,
    confirmChangeLandingsType,
    dispatchClearErrors,
    clearChangedLandingsType
  })(withTranslation() (LandingsTypesConfirmationPage))
);

LandingsTypesConfirmationPage.propTypes = {
  errors: PropTypes.object,
};

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
