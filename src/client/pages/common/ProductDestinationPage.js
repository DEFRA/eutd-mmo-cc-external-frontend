import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import { Main, BackLink, Header, GridRow, GridCol } from 'govuk-react';

import {
  addSelectedExportCountry,
  saveExportCountry,
  getExportCountry,
  getAllCountries,
  clearExportCountry
} from '../../actions';

import Form from '../../components/elements/Form';
import HelpLink from '../../components/HelpLink';
import PageTitle from '../../components/PageTitle';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';
import ExportDestination from '../../components/ExportDestination';
import ErrorIsland from '../../components/elements/ErrorIsland';
import BackToProgressLink from '../../components/BackToProgressLink';
import { onHandleErrorClick } from '../utils';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import { withTranslation } from 'react-i18next';

class ProductDestinationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exportDestination: '',
    };
  }

  doSubmit = async (isSaveAsDraft) => {
    const { path, nextUri } = this.props.route;
    const documentNumber =
      this.props.match && this.props.match.params
        ? this.props.match.params['documentNumber']
        : '';

    await this.props.saveExportCountry(
      path,
      nextUri,
      documentNumber,
      isSaveAsDraft
    );
  };

  onDestinationChange = (countryName) => {
    const exportLocation = _.cloneDeep(
      this.props.exportLocation || {}
    );

    exportLocation.exportedTo = countryName;

    this.props.addSelectedExportCountry(exportLocation);
  };

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const { saveAsDraftUri } = this.props.route;

    await this.doSubmit(true);
    this.props.history.push(saveAsDraftUri);
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const { nextUri } = this.props.route;
    const documentNumber =
      this.props.match && this.props.match.params
        ? this.props.match.params['documentNumber']
        : '';

    await this.doSubmit(false);
    this.props.history.push(nextUri.replace(':documentNumber', documentNumber));
  };

  componentWillUnmount() {
    this.props.clearExportCountry();
  }

  componentDidMount = async () => {
    window.scrollTo(0, 0);

    this.setState({ jsEnabled: true });

    const documentNumber = this.props.match.params['documentNumber'];

    try {
      await this.props.getExportCountry(documentNumber);
      await this.props.getAllCountries();
    } catch (e) {
      console.error(e);
    }

    if (this.props.exportLocation.unauthorised === true) {
      this.props.history.push('/forbidden');
    }
  };

  render = () => {
    const { route, match, countries, exportLocation, errors, t } = this.props;
    const { title, header, path, nextUri, previousUri, journey, progressUri } = route;
    const { documentNumber } = match.params;

    const saveAsDraftFormActionUrl =
      '/orchestration/api/v1/exportDestination/saveAsDraftLink';
    const backLink = previousUri.replace(':documentNumber', documentNumber);

    const exportedTo =
      exportLocation && exportLocation.exportedTo
        ? exportLocation.exportedTo
        : null;
    if (!exportLocation.loaded) return null;

    const exportDestinationError =
      errors && Object.prototype.hasOwnProperty.call(errors, 'exportDestinationError')
        ? this.props.errors['exportDestinationError']
        : null;

    return (
      <Main>
        <PageTitle title={`${t(header)} - ${t(title)}`} />
        {!_.isEmpty(errors) && errors.errors && errors.errors.length > 0 && (
          <ErrorIsland
            errors={errors.errors.map((err) => ({
              message: t(err.text),
              key: err.targetName,
            }))}
            onHandleErrorClick={onHandleErrorClick}
          />
        )}
        <BackLink href={backLink}>
          {t('commonBackLinkBackButtonLabel')}
        </BackLink>
        <Header>{t(header)}</Header>
        <Form
          action="/orchestration/api/v1/exportDestination"
          currentUrl={path}
          nextUrl={nextUri}
          onSubmit={this.onSubmit}
        >
          <input type="hidden" name="journey" value={journey} />
          <input type="hidden" name="currentUri" value={path} />
          <GridRow>
            <GridCol columnTwoThirds>
              <ExportDestination
                name="exportDestination"
                exportDestination={exportedTo}
                countries={countries}
                onChange={this.onDestinationChange}
                error={exportDestinationError}
              />
            </GridCol>
          </GridRow>
          <GridRow>
            <SaveAsDraftButton
              formactionUrl={saveAsDraftFormActionUrl}
              onClick={this.onSaveAsDraft}
            />
            <ContinueButton type="submit" id="continue">
              {t('commonContinueButtonSaveAndContinueButton')}
            </ContinueButton>
          </GridRow>
        </Form>
        <BackToProgressLink
          progressUri={progressUri}
          documentNumber={documentNumber}
        />
        <HelpLink journey={journey} />
      </Main>
    );
  };
}

function mapStateToProps(state) {
  return {
    exportLocation: state.exportLocation,
    countries: state.global.allCountries,
    errors: state.errors,
  };
}

function loadData(store) {
  return store
    .dispatch(getExportCountry(this.documentNumber))
    .then(() => store.dispatch(getAllCountries()));
}

export const component = withRouter(
  connect(mapStateToProps, {
    addSelectedExportCountry,
    saveExportCountry,
    getExportCountry,
    getAllCountries,
    clearExportCountry
  })(withTranslation() (ProductDestinationPage))
);

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
