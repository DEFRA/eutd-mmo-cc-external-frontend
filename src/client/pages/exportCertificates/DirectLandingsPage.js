import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GridRow, GridCol, Main, BackLink, Header } from 'govuk-react';
import { isEmpty } from 'lodash';
import { searchVessels, vesselSelectedFromSearchResult } from '../../actions';
import { onHandleErrorClick, scrollToErrorIsland } from '../utils';
import errorTransformer from '../../helpers/errorTransformer';
import {
  getDirectLandings,
  clearDirectLanding,
  upsertDirectLanding
} from '../../actions/direct-landing.actions';
import PageTitle from '../../components/PageTitle';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import AddVesselForm from './landings/AddVesselForm';
import LandingsGuidance from './landings/LandingsGuidance';
import ProductWeights from './landings/ProductWeights';
import ContinueButton from '../../components/elements/ContinueButton';
import ErrorIsland from '../../components/elements/ErrorIsland';
import Form from '../../components/elements/Form';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import BackToProgressLink from '../../components/BackToProgressLink';
import HelpLink from '../../components/HelpLink';
import { getLandingType } from '../../actions/landingsType.actions';
import { withTranslation } from 'react-i18next';

class DirectLandingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      faoArea: 'FAO27',
      species: [],
      vessels: [],
      vessel: { label: '' },
      dateLanded: '',
    };
  }

  hasRequiredData() {
    const { directLandings } = this.props;
    return (
      directLandings &&
      directLandings.weights &&
      directLandings.weights.length &&
      directLandings.weights.every((_) => _.speciesId)
    );
  }

  componentWillUnmount() {
    this.props.clearDirectLanding();
  }

  redirectToForbiddenPage() {
    this.props.history.push('/forbidden');
  }

  onWeightChange = (speciesId, weight) => {
    const species = this.state.species.map((product) => {
      const exportWeight = weight !== '' ? weight : undefined;

      return product.speciesId === speciesId
        ? { ...product, exportWeight: exportWeight }
        : product;
    });

    this.setState({ species: species });
  };

  onSaveAsDraft = async (e) => {
    e.preventDefault();

    const { saveAsDraftUri } = this.props.route;

    try {
      await this.doSubmit();
      this.props.history.push(saveAsDraftUri);
    } catch (err) {
      scrollToErrorIsland();
    }
  };

  onFaoChange = (e) => {
    e.preventDefault();
    this.setState({ faoArea: e.target.value });
  };

  onVesselChange = (vessel) => {
    this.setState({ vessel: vessel });
  };

  onDateChange = (e) => {
    this.setState({ dateLanded: e.target.value });
  };

  displayLandingEntryOptions() {
    const documentNumber = this.props.match.params['documentNumber'];
    const { landingsEntryUri } = this.props.route;
    this.props.history.push(landingsEntryUri.replace(':documentNumber', documentNumber));
  }

  hasLandingEntryOption() {
    const { landingsType } = this.props;
    return landingsType && landingsType.landingsEntryOption !== null && landingsType.generatedByContent === false;
  }

  async componentDidMount() {
    const { documentNumber } = this.props.match.params;
    const { summaryUri, saveAsDraftUri, progressUri } = this.props.route;

    try {
      await this.props.getDirectLandings(documentNumber);
      await this.props.getLandingType(documentNumber);

      if (!this.hasLandingEntryOption()) {
        this.displayLandingEntryOptions();
        return;
      }

      const { directLandings = {}, history } = this.props;
      const { landingsEntryOption } = this.props.landingsType;
      this.setState({ dateLandedStringValue: directLandings.dateLanded});

      if (directLandings.unauthorised) {
        return;
      } else if (landingsEntryOption !== 'directLanding'){
        history.push(saveAsDraftUri);
      } else if (!this.hasRequiredData()) {
        history.push(progressUri.replace(':documentNumber', documentNumber));
      } else if (
        directLandings
        && directLandings.vessel
        && directLandings.vessel.vesselOverriddenByAdmin) {
        history.push(summaryUri.replace(':documentNumber', documentNumber));
      }

      const initialState = parseState(directLandings);

      this.setState(initialState);
    } catch (e) {
      this.redirectToForbiddenPage();
    }
  }

  componentDidUpdate() {
    const { directLandings } = this.props;

    if (directLandings && directLandings.unauthorised) {
      this.redirectToForbiddenPage();
    }
  }

  doSubmit = async () => {
    const { match } = this.props;
    const { vessel, dateLanded, faoArea, species } = this.state;

    await this.props.upsertDirectLanding(
      {
        vessel,
        dateLanded,
        faoArea,
        weights: species,
      },
      match.params['documentNumber']
    );
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const { route, match } = this.props;
    const { nextUri } = route;

    try {
      await this.doSubmit();

      const { unauthorised } = this.props.directLandings;

      if (unauthorised) {
        this.redirectToForbiddenPage();
      } else {
        this.props.history.push(nextUri.replace(':documentNumber', match.params['documentNumber']));
      }
    } catch (err) {
      scrollToErrorIsland();
    }
  };

  splitErrorParams = (error) => {
    const { t } = this.props;
    const isErrorWithParams = error.text.includes('-');
    const splitError = error.text.split('-');
    if(error.targetName == 'dateLanded'){
      const splitErrorText = error.text.split(/-(.*)/s);
      const params = splitErrorText[0] === "ccAddLandingDateLandedRestrictedError" ? {product: splitErrorText[1]} : {dynamicValue: splitErrorText[1]}
      return t(splitErrorText[0], params);
    }
    
    return isErrorWithParams ? t(splitError[0], {dynamicValue :splitError[1],param1 :splitError[2],param2 :splitError[3],param3 :splitError[4]}) : t(error.text);
  };

  formatErrors = (errors) => {
    return errors.map((error) => (
      { message: this.splitErrorParams(error), key: error.targetName } 
    )
    );
  };

  render() {
    const { config, match, route, errors, errorObject, t} = this.props;
    const { landingLimitDaysInTheFuture } = config;
    const { previousUri, title, progressUri, journey } = route;
    const { documentNumber } = match.params;
    const { species, faoArea, vessel, dateLanded, dateLandedStringValue } = this.state;

    const heading = t('ccDirectLandingAddYourLandingTitle');
    const pageTitle = `${heading} - ${t(title)}`;
    const backUri = previousUri.replace(':documentNumber', documentNumber);
    const saveAsDraftFormActionUrl = '/orchestration/api/v1/saveAsDraftLink';

    return (
      <Main>
        {errors.length > 0 && (
          
          <ErrorIsland
           errors={this.formatErrors(errors)}
            onHandleErrorClick={onHandleErrorClick}
          />
        )}
        <PageTitle title={pageTitle} />
        <BackLink
          onClick={(e) => {
            e.preventDefault();
            this.props.history.push(backUri);
          }}
          href={backUri}
        >{t('commonBackLinkBackButtonLabel')}</BackLink>
        <Form
          action="/orchestration/api/v1/export-certificates/direct-landing/validate"
          method="POST"
          onSubmit={this.onSubmit}
        >
          <GridRow>
            <GridCol>
              <LandingsGuidance
                landingLimitDaysInTheFuture={landingLimitDaysInTheFuture}
                t={t}
              />
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol>
              <Header>{heading}</Header>
              <AddVesselForm
                dateLanded={dateLanded}
                onDateChange={this.onDateChange}
                dateLandedValue={dateLandedStringValue}
                faoArea={faoArea}
                onFaoChange={this.onFaoChange}
                vessel={vessel}
                vesselOptions={this.props.vesselOptions}
                searchVessels={this.props.searchVessels}
                onVesselChange={this.onVesselChange}
                clearSearchResults={this.props.vesselSelectedFromSearchResult}
                errors={errorObject}
              />
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol>
              <ProductWeights
                species={species}
                onWeightChange={this.onWeightChange}
                errors={errors}
              />
            </GridCol>
          </GridRow>
          <GridRow>
            <SaveAsDraftButton
              formactionUrl={saveAsDraftFormActionUrl}
              onClick={this.onSaveAsDraft}
            ></SaveAsDraftButton>
            <ContinueButton id="continue" type="submit">
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
  const { errors, errorObject } = getErrors(
    state.exportPayload || {},
    state.config.landingLimitDaysInTheFuture
  );

  return {
    directLandings: state.directLandings,
    vesselOptions: mapVesselsOptions(state.vessels),
    errors: errors,
    errorObject: errorObject,
    config: state.config,
    landingsType: state.landingsType
  };
}

export const getLandingErrorsFromExportPayload = (exportPayload) => {
  let errors = {};

  if (!isEmpty(exportPayload) && exportPayload.items) {
    exportPayload.items.forEach((item) => {
      if (item.landings) {
        const invalidLanding = item.landings.find(
          (landing) => landing.error === 'invalid'
        );
        errors = invalidLanding ? invalidLanding.errors : {};
      }
    });
  }

  return errors;
};

export const transformError = (
  errors,
  errorKey,
  products,
  landingLimitDaysInTheFuture
) => {
  if (errorKey === 'dateLanded') {
    return {
      [errorKey]: {
        key: errors[errorKey],
        params: [landingLimitDaysInTheFuture],
      },
    };
  } else if (errorKey.includes('exportWeight')) {
    const index = errorKey.split('.')[1];
    const product = products[index].product;

    return {
      [errorKey]: {
        key: errors[errorKey].replace(/\.[0-9]+/, ''),
        params: [
          product.species.label,
          product.state.label,
          product.presentation.label,
          product.commodityCode,
        ],
      },
    };
  } else {
    return {
      [errorKey]: errors[errorKey],
    };
  }
};

export const transformAllErrors = (
  errors,
  products,
  landingLimitDaysInTheFuture
) => {
  const reduceFn = (acc, errorKey) => ({
    ...acc,
    ...transformError(errors, errorKey, products, landingLimitDaysInTheFuture),
  });

  return Object.keys(errors).reduce(reduceFn, {});
};

export const getErrors = (exportPayload, landingLimitDaysInTheFuture) => {
  const rawErrors = exportPayload.errors || {};
  const transformedErrors = transformAllErrors(
    rawErrors,
    exportPayload.items,
    landingLimitDaysInTheFuture
  );
  const errorsWithMessages = errorTransformer(transformedErrors).errors;

  return {
    errors: errorsWithMessages,
    errorObject: errorsWithMessages.reduce(
      (prev, curr) => ({ ...prev, [curr.targetName + 'Error']: curr.text }),
      {}
    ),
  };
};

export const parseState = (directLandings) => {
  const { dateLanded, faoArea, vessel, weights } = directLandings;
  let result = { species: weights };

  if (!isEmpty(faoArea)) {
    result = { ...result, faoArea };
  }

  if (!isEmpty(vessel)) {
    const label = `${vessel.vesselName} (${vessel.pln})`;
    const domId = label.replace(/[\s,)]/g, '').replace(/\(/g, '-');
    const selectedVessel = {
      ...vessel,
      label,
      domId,
    };

    result = { ...result, vessel: selectedVessel };
  }

  if (dateLanded && dateLanded !== 'Invalid date') {
    result = {
      ...result,
      dateLanded: dateLanded,
    };
  }

  return result;
};

export const mapVesselsOptions = (input) => {
  const vessels = input || [];

  return vessels
    .map((vessel) => {
      const label = `${vessel.vesselName} (${vessel.pln})`;
      const domId = label.replace(/[\s,)]/g, '').replace(/\(/g, '-');
      return {
        ...vessel,
        label,
        domId,
      };
    })
    .sort((a, b) => (a.label > b.label ? 1 : -1));
};

async function loadData(store) {
  const documentNumber = this.documentNumber;
  let promiseArray = [
    await store.dispatch(getDirectLandings(documentNumber)),
    await store.dispatch(getLandingType(documentNumber)),
  ];
  return Promise.all(promiseArray);
}

export const component = connect(mapStateToProps, {
  searchVessels,
  vesselSelectedFromSearchResult,
  upsertDirectLanding,
  getDirectLandings,
  clearDirectLanding,
  getLandingType,
})(withTranslation() (DirectLandingsPage));

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
