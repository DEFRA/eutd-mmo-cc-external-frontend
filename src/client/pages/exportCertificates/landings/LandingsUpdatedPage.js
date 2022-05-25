import React from 'react';
import PageTitle from '../../../components/PageTitle';
import PageTemplateWrapper from '../../../components/PageTemplateWrapper';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  GridCol,
  GridRow,
  Header,
  Main
} from 'govuk-react';
import qs from 'qs';
import { includes, isEmpty } from 'lodash';
import {
  dispatchClearErrors,
  getExportPayload,
  clearExportPayload,
  validateExportPayload,
  validateLanding,
  removeProduct,
  removeLanding,
  addLanding,
  searchVessels,
  vesselSelectedFromSearchResult,
} from '../../../actions';
import { clearErrorsExportPayload } from '../../../actions/export-payload.actions';
import { getLandingType, validateLandingType } from '../../../actions/landingsType.actions';
import BackLinkWithErrorClearOut from '../../../components/elements/BackLinkWithErrorClearOut';
import ErrorIsland from '../../../components/elements/ErrorIsland';
import HelpLink from '../../../components/HelpLink';
import SaveAsDraftButton from '../../../components/SaveAsDraftButton';
import ContinueButton from '../../../components/elements/ContinueButton';
import NotificationBanner from '../../../components/NotificationBanner';
import LandingsDetailsTable from '../../../components/LandingsDetailsTable';
import ProductsTable from '../../../components/products-table.component';
import BackToProgressLink from '../../../components/BackToProgressLink';
import errorTransformer from '../../../helpers/errorTransformer';
import { onHandleErrorClick } from '../../utils/errorUtils';
import AddLandingsForm from './AddLandingsForm';
import LandingsGuidance from './LandingsGuidance';
import { withTranslation } from 'react-i18next';

class LandingsUpdatedPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initState();

    this.addLandingFormRef = null;

    this.setAddLandingFormRef = (element) => {
      this.addLandingFormRef = element;
    };
  }

  initState = () => {
    return {
      productId: undefined,
      landingId: undefined,
      editMode: ''
    };
  };

  unauthorised() {
    let { previousUri } = this.props.route;
    const documentNumber = this.props.match.params['documentNumber'];
    this.props.history.push(
      previousUri.replace(':documentNumber', documentNumber)
    );
  }

  redirectToForbidden() {
    this.props.history.push('/forbidden');
  }

  redirectToDashboard() {
    this.props.history.push(this.props.route.saveAsDraftUri);
  }

  async redirectToUploadPage() {
    try {
      let { uploadFileUri } = this.props.route;
      const documentNumber = this.props.match.params['documentNumber'];
      await this.props.validateLandingType('uploadEntry', documentNumber);
      this.props.history.push(uploadFileUri.replace(':documentNumber', documentNumber));
    } catch (e) {
      console.error(e.message);
    }
  }

  hasRequiredData() {
    let isValid = true;
    const result = this.props.exportPayload;

    if (Array.isArray(result.items) && result.items.length > 0) {
      result.items.map((item) => {
        if (item.product) {
          if (!item.product.commodityCode) isValid = false;
        } else {
          isValid = false;
        }
      });
    } else {
      isValid = false;
    }

    return isValid;
  }

  isDirectLanding() {
    const { landingsEntryOption } = this.props.landingsType;
    return landingsEntryOption === 'directLanding';
  }

  isAnyVesselOverriddenByAdmin(landings) {
    return (
      landings &&
      landings.some((landing) => landing.model?.vessel?.vesselOverriddenByAdmin)
    );
  }

  isOverriddenByAdmin(items) {
    return (
      items &&
      items.some(
        (item) =>
          item.landings && this.isAnyVesselOverriddenByAdmin(item.landings)
      )
    );
  }

  editLandingHandler = (productId, landingId) => {
    this.setState({ productId, landingId, editMode: `${landingId}-${uuidv4()}` });

    if (this.addLandingFormRef) {
      setTimeout(() => {
        this.addLandingFormRef.scrollIntoView({ behavior: 'smooth' });
        this.addLandingFormRef.focus({ preventScroll: true });
      }, 100);
    }

    this.props.clearErrorsExportPayload();
    this.props.dispatchClearErrors();
  };

  clearLandingHandler = (landing, product) => {
    this.setState({ landingId: landing, productId: product, editMode: '' });
    this.props.clearErrorsExportPayload();
    this.props.dispatchClearErrors();
  };

  upsertLandingHandler = async (product, model) => {
    const documentNumber = this.props.match.params['documentNumber'];

    this.props.dispatchClearErrors();
    return await this.props
      .validateLanding(product, model, documentNumber)
      .then(() => {
        this.setState({
          landingId: undefined,
          productId: undefined,
          editMode: '',
        });
      });
  };

  removeProductHandler = (product) => {
    const documentNumber = this.props.match.params['documentNumber'];
    this.props.dispatchClearErrors();
    this.props.removeProduct(product, documentNumber);

    this.setState({ landingId: undefined, productId: undefined, editMode: '' });
  };

  removeLandingHandler = (product, model) => {
    const documentNumber = this.props.match.params['documentNumber'];
    this.props.dispatchClearErrors();

    this.props.removeLanding(product, model, documentNumber);
    this.setState({ landingId: undefined, productId: undefined, editMode: '' });
  };

  onSubmit = async (e) => {
    try {
      e.preventDefault();
      window.scrollTo(0, 0);
      let { path, nextUri } = this.props.route;

      const documentNumber = this.props.match.params['documentNumber'];

      this.props.clearErrorsExportPayload();

      await this.props.validateExportPayload(
        path,
        nextUri,
        false,
        documentNumber
      );
      this.props.history.push(
        nextUri.replace(':documentNumber', documentNumber)
      );
    } catch (err) {
      window.scrollTo(0, 0);
    }
  };

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    try {
      const { path, saveAsDraftUri, nextUri } = this.props.route;
      const isLandingsSavedAsDraft = true;
      const documentNumber = this.props.match.params['documentNumber'];

      await this.props.validateExportPayload(
        path,
        nextUri,
        isLandingsSavedAsDraft,
        documentNumber
      );
      this.props.history.push(saveAsDraftUri);
    } catch (err) {
      window.scrollTo(0, 0);
    }
  };

  getErrors = (items = []) => {
    let errors = {};
    items.forEach((item) => {
      if (item.landings) {
        const invalidLanding = item.landings.find(
          (landing) => landing.error === 'invalid'
        );
        errors = invalidLanding ? invalidLanding.errors : {};
      }
    });

    return errors;
  };

  hasLandingEntryOption() {
    const { landingsEntryOption, generatedByContent } = this.props.landingsType;
    return landingsEntryOption !== null && generatedByContent === false;
  }

  displayLandingEntryOptions() {
    const documentNumber = this.props.match.params['documentNumber'];
    const { landingsEntryUri } = this.props.route;
    this.props.history.push(landingsEntryUri.replace(':documentNumber', documentNumber));
  }

  async componentDidMount() {
    const { progressUri } = this.props.route;
    window.scrollTo(0, 0);
    const documentNumber = this.props.match.params['documentNumber'];
    await this.props.getExportPayload(documentNumber);
    await this.props.getLandingType(documentNumber);

    const params = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    let clickParam = params.andClickId;

    if (clickParam) {
      let product_id = clickParam.split('_')[0].split('edit-lnd-btn-')[1];
      let landing_id = clickParam.split('_')[1];

      this.editLandingHandler(product_id, landing_id);
    }

    if (!this.hasLandingEntryOption()) {
      this.displayLandingEntryOptions();
    }

    if (this.isDirectLanding()) {
      this.redirectToDashboard();
    }

    if (!this.hasRequiredData()) {
      this.props.history.push(progressUri.replace(':documentNumber', documentNumber));
    }
  }

  componentDidUpdate() {
    const { exportPayload } = this.props;

    if (exportPayload.unauthorised === true) {
      this.redirectToForbidden();
    }
  }

  componentWillUnmount() {
    this.props.clearExportPayload();
  }

  canAddLandings(totalLandings) {
    return totalLandings < this.props.config.maxLandingsLimit;
  }

  isMaxLandingsExceeded(totalLandings) {
    const { exportPayload = {} } = this.props;
    const { items = [] } = exportPayload;
    return totalLandings >= this.props.config.maxLandingsLimit && items.some(item => !item.landings);
  }

  render() {
    const {
      exportPayload = {},
      errors,
      config,
      dispatchClearErrors: _dispatchClearErrors,
      history,
      match,
      t
    } = this.props;
    const { title, path, journey, saveAsDraftUri, previousUri, nextUri, progressUri } =
      this.props.route;
    const { errors: exportPayloadErrors, items } = exportPayload;
    const {
      maxLandingsLimit,
      offlineValidationTime,
      landingLimitDaysInTheFuture,
    } = config;
    const { params } = match;
    const postUrl =
      '/orchestration/api/v1/export-certificates/export-payload/validate';
    const saveAsDraftFormActionUrl =
      '/orchestration/api/v1/export-certificates/export-payload/validate/saveAsDraft';

    const documentNumber = params['documentNumber'];
    const heading = t('ccAddLandingHeader');
    let totalKg = 0;
    let totalLandings = 0;

    if (items && items.length > 0) {
      totalKg = items.reduce(function (accum, cur) {
        if (cur.landings && cur.landings.length > 0) {
          accum += cur.landings.reduce(function (accum1, cur1) {
            if (cur1.model && !isNaN(cur1.model.exportWeight)) {
              accum1 += Number(cur1.model.exportWeight);
            }
            return accum1;
          }, 0);
        }
        return accum;
      }, 0);
      totalKg = totalKg.toFixed(2);
    }

    if (items && items.length > 0) {
      totalLandings = items.reduce(function (accum, cur) {
        if (cur.landings && cur.landings.length > 0) {
          accum += cur.landings.reduce(function (accum1, cur1) {
            if (cur1.model) {
              accum1++;
            }
            return accum1;
          }, 0);
        }
        return accum;
      }, 0);
    }

    const landingErrors = !isEmpty(exportPayload)
      ? this.getErrors(exportPayload.items)
      : {};

    const errorsForLandingForm = (_errors) =>
      Object.keys(_errors).reduce(
        (acc, key) =>
          _errors[key] === 'error.dateLanded.date.max'
            ? {
                ...acc,
                [key]: {
                  key: _errors[key],
                  params: [landingLimitDaysInTheFuture],
                },
              }
            : { ...acc, [key]: _errors[key] },
        {}
      );
    const errorLandingMessages = errorTransformer(
      errorsForLandingForm(landingErrors)
    ).errors;

    const exportPayloadErrorMessages = !isEmpty(exportPayloadErrors)
      ? errorTransformer(errorsForLandingForm(exportPayloadErrors))
      : {};

    const allErrorMessages = [
      ...(!isEmpty(errors) && errors.errors ? errors.errors : []),
      ...(!isEmpty(landingErrors) ? errorLandingMessages : []),
      ...(!isEmpty(exportPayloadErrors)
        ? exportPayloadErrorMessages.errors
        : []),
    ];

    const targetSortOrder = ['product', 'dateLanded', 'faoArea', 'vessel.vesselName', 'exportWeight'];
    const sortedErrorMsgs = allErrorMessages.sort((a,b)=>(targetSortOrder.indexOf(a.targetName) - targetSortOrder.indexOf(b.targetName)));

    if (this.isMaxLandingsExceeded(totalLandings)) {
      sortedErrorMsgs.push({ text: t('ccAddLandingMaxLandingExceededError'), targetName: 'products-table' });
    }

    const showErrorIsland = () =>
      (!isEmpty(errors) && errors.errors && errors.errors.length > 0) ||
      (!isEmpty(exportPayloadErrorMessages) &&
        exportPayloadErrorMessages.errors &&
        exportPayloadErrorMessages.errors.length > 0) ||
      errorLandingMessages.length > 0 ||
      (!isEmpty(errors) && !isEmpty(errors.vessel_license)) ||
      this.isMaxLandingsExceeded(totalLandings);

    return (
      <Main>
        <PageTitle title={`${heading} - ${t(title)}`} />
        {showErrorIsland() && (
          <ErrorIsland
            errors={sortedErrorMsgs.map((err) => {
              const isErrorWithParams = (err.targetName == 'dateLanded' || includes(err.targetName, 'product_')) && !isEmpty(err.text) && err.text.split(/-(.*)/s);
              let message = t(err.text);
              if(err.targetName == 'vessel_license') message = t('commonContactSupportError');
              if(!isEmpty(isErrorWithParams)){
                if(err.targetName == 'dateLanded'){
                  const errParams = isErrorWithParams[0] === 'ccAddLandingDateLandedRestrictedError' ? {product: isErrorWithParams[1]} : {dynamicValue: isErrorWithParams[1]};
                  message = t(isErrorWithParams[0], errParams);
                } else if(includes(err.targetName, 'product_')){
                  message = t(isErrorWithParams[0], {product: isErrorWithParams[1]});
                }
              }

              return {
                message,
                key: err.targetName,
              };
            })}
            onHandleErrorClick={onHandleErrorClick}
          />
        )}
        <GridRow>
          <GridCol>
            <BackLinkWithErrorClearOut
              backUri={previousUri.replace(':documentNumber', documentNumber)}
              clearErrors={_dispatchClearErrors}
              history={history}
              labeltext={t('commonBackLinkBackButtonLabel')}
            />
            {this.isOverriddenByAdmin(items) && (
              <NotificationBanner
                header= {t('commonImportant')}
                messages={[
                  t('ccSummaryPageOverridenByAdminNotificationNonDirectLanding'),
                ]}
              />
            )}
            <LandingsGuidance
              maxLandingsLimit={maxLandingsLimit}
              offlineValidationTime={offlineValidationTime}
              landingLimitDaysInTheFuture={landingLimitDaysInTheFuture}
              t={t}
            />
            <Header>{heading}</Header>
            <AddLandingsForm
              landingFormRef={this.setAddLandingFormRef}
              productId={this.state.productId}
              landingId={this.state.landingId}
              exportPayload={exportPayload}
              errors={exportPayloadErrorMessages}
              vesselOptions={this.props.vesselOptions}
              searchVessels={this.props.searchVessels}
              vesselSelected={this.props.vesselSelectedFromSearchResult}
              upsertLanding={this.upsertLandingHandler}
              clearLanding={this.clearLandingHandler}
              totalLandings={totalLandings}
              maxLandingsLimit={maxLandingsLimit}
              editMode={this.state.editMode}
              t={t}
            />
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol>
            {this.canAddLandings(totalLandings) &&
              <Button
                id="upload-file"
                onClick={() =>
                  this.redirectToUploadPage()
                }>
                {t('ccAddLandingUploadProductsAndLandings')}
              </Button>
            }
            <h2 className="heading-large" id="productsTableCaption">
              {t('ccAddSpeciesPageProductTableCaption')}
            </h2>
            <ProductsTable
              exportPayload={exportPayload}
              weight={totalKg}
              removeProduct={this.removeProductHandler}
              t={t}
            />
            <h2 className="heading-large" id="landingsTableCaption">
              {t('ccAddLandingYourLandings')}
            </h2>
            <LandingsDetailsTable
              exportPayload={exportPayload}
              totalLandings={totalLandings}
              editLanding={this.editLandingHandler}
              removeLanding={this.removeLandingHandler}
              t={t}
            />
          </GridCol>
        </GridRow>
        <form
          action={postUrl}
          method="POST"
          onSubmit={(e) => this.onSubmit(e)}
          id="outer"
        >
          <input type="hidden" name="currentUri" value={path} />
          <input type="hidden" name="previousUri" value={previousUri} />
          <input type="hidden" name="nextUri" value={nextUri} />
          <input type="hidden" name="dashboardUri" value={saveAsDraftUri} />
          <input type="hidden" name="journey" value={journey} />
          <GridRow>
            <SaveAsDraftButton
              formactionUrl={saveAsDraftFormActionUrl}
              onClick={this.onSaveAsDraft}
            />
           {(!this.isMaxLandingsExceeded(totalLandings)) && <ContinueButton id="continue">{t('commonContinueButtonSaveAndContinueButton')}</ContinueButton>}
          </GridRow>
        </form>
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
  const { exportPayload } = state;

  let vesselOptions = state.vessels.map((vessel) => {
    const label = `${vessel.vesselName} (${vessel.pln})`;
    let domId = label.replace(/[\s,)]/g, '');
    domId = domId.replace('(', '-');
    return {
      ...vessel,
      label,
      domId,
    };
  });
  vesselOptions.sort((a, b) => {
    if (a.vesselName < b.vesselName) {
      return -1;
    }
    if (a.vesselName > b.vesselName) {
      return 1;
    }
    return 0;
  });
  return {
    exportPayload: exportPayload,
    vesselOptions: vesselOptions,
    errors: state.errors,
    config: state.config,
    landingsType: state.landingsType
  };
}

function loadData(store) {
  let promiseArray = [
    store.dispatch(getExportPayload(this.documentNumber)),
    store.dispatch(getLandingType(this.documentNumber))
  ];
  return Promise.all(promiseArray);
}

export const component = withRouter(
  connect(mapStateToProps, {
    getExportPayload,
    clearExportPayload,
    clearErrorsExportPayload,
    validateExportPayload,
    searchVessels,
    vesselSelectedFromSearchResult,
    validateLanding,
    removeProduct,
    removeLanding,
    addLanding,
    dispatchClearErrors,
    getLandingType,
    validateLandingType
  })(withTranslation() (LandingsUpdatedPage))
);

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
