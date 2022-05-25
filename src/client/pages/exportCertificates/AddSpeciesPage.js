import React, { Component, createRef } from 'react';
import {
  getAddedSpeciesPerUser,
  clearAddedSpeciesPerUser,
  addSpeciesPerUser,
  editAddedSpeciesPerUser,
  dispatchApiCallFailed,
  getExporterFromMongo,
  getStatesFromReferenceService,
  getPresentationsFromReferenceService,
  getCommodityCode,
  searchFishStates,
  dispatchClearErrors,
  speciesSelectedFromSearchResult,
  searchUkFish,
  getAllUkFish,
  saveAddedSpeciesPerUser,
} from '../../actions';
import qs from 'qs';
import { getLandingType } from '../../actions/landingsType.actions';
import { getAddedFavouritesPerUser } from '../../actions/favourites.actions';

import { connect } from 'react-redux';
import SpeciesBlock from '../../components/SpeciesBlock';
import SpeciesFavourites from '../../components/SpeciesFavourites';
import PageTitle from '../../components/PageTitle';
import Form from '../../components/elements/Form';
import ErrorIsland from '../../components/elements/ErrorIsland';
import BackLinkWithErrorClearOut from '../../components/elements/BackLinkWithErrorClearOut';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import HelpLink from '../../components/HelpLink';
import BackToProgressLink from '../../components/BackToProgressLink';

import { withTranslation } from 'react-i18next';
import {
  GridRow,
  GridCol,
  Header,
  H2,
  ListItem,
  UnorderedList,
  InsetText,
  Table
} from 'govuk-react';
import { TabGroup, Tab } from '@capgeminiuk/dcx-react-library'; // Need a Base component
import { isEmpty, toLower } from 'lodash';


import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import SecondaryButton from '../../components/elements/SecondaryButton';
import ContinueButton from '../../components/elements/ContinueButton';
import NotificationBanner from '../../components/NotificationBanner';
import { t } from 'i18next';

class AddSpeciesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      productId: undefined,
      editMode: false,
      activeTabKey: '',
      selectSpeciesFavourite: undefined,
      addedSpecies: undefined
    };

    this.tabRef = createRef();

    this.productFormRef = null;

    this.setProductFormRef = (element) => {
      this.productFormRef = element;
    };
  }

  unauthorised() {
    this.props.history.push('/forbidden');
  }

  displayLandingEntryOptions() {
    const documentNumber = this.props.match.params['documentNumber'];
    const { landingsEntryUri } = this.props.route;
    this.props.history.push(landingsEntryUri.replace(':documentNumber', documentNumber));
  }

  hasLandingEntryOption() {
    const { getAddedLandingsType } = this.props;
    return getAddedLandingsType && getAddedLandingsType.landingsEntryOption !== null && getAddedLandingsType.generatedByContent === false;
  }

  componentWillUnmount() {
    this.props.clearAddedSpeciesPerUser();
    this.props.dispatchClearErrors();
  }

  async componentDidMount() {
    const {summaryUri} = this.props.route;
    const documentNumber = this.props.match.params['documentNumber'];

    window.scrollTo(0, 0);

    try {
      await this.props.getAddedSpeciesPerUser(documentNumber);
      await this.props.getAddedFavouritesPerUser();
      await Promise.all([
        this.props.getExporterFromMongo(
          this.props.route.journey,
          documentNumber
        ),
        this.props.getStatesFromReferenceService(),
        this.props.getPresentationsFromReferenceService(),
        this.props.getAllUkFish(),
        this.props.getLandingType(documentNumber),
      ]);

      if (!this.hasLandingEntryOption()) {
        this.displayLandingEntryOptions();
      }

      await getAllPromisesForLookingUpCommodityCode(
        this.props.addedSpeciesPerUser || [],
        (species) => {
          return this.props.getCommodityCode(species);
        }
      );
    } catch (e) {
      console.error(e);
    }

    const { addedSpeciesPerUser, getAddedLandingsType = {} } = this.props;
    const isDirectLanding = getAddedLandingsType.landingsEntryOption === 'directLanding';

    if (isDirectLanding && hasAdminOverride(addedSpeciesPerUser)) {
      this.props.history.push(summaryUri.replace(':documentNumber', documentNumber));
    }

    const params = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    let clickParam = params.andClickId;

    if (clickParam) {
      let product_id = clickParam.split('_')[0].split('edit-prd-btn-')[1];
      this.setState({ productId: product_id, editMode: true });
      if (this.productFormRef) {
        setTimeout(() => {
          this.productFormRef.scrollIntoView({ behavior: 'smooth' });
          this.productFormRef.focus({ preventScroll: true });
        }, 100);
      }
    }

  }

  componentDidUpdate() {
    const {
      unauthorised
    } = this.props;

    if (
      unauthorised === true
    ) {
      this.unauthorised();
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.addedSpeciesPerUser && props.addedSpeciesPerUser.length !== state.products.length || state.productId) {
      return {
        products: props.addedSpeciesPerUser,
      };
    } else {
      return {
        ...state
      };
    }
  }

  renderContinueAndDraftButtons() {
    const documentNumber =
      this.props.match && this.props.match.params
        ? this.props.match.params['documentNumber']
        : undefined;

    const saveAsDraftFormActionUrl = '/orchestration/api/v1/saveAsDraftLink';
    const { journey, path, saveAsDraftUri } = this.props.route;
    const currentUri = path.replace(':documentNumber', documentNumber);

    return (
      <>
        <Form action="POST" currentUrl={currentUri} onSubmit={this.onSubmit}>
          <input type="hidden" name="journey" value={journey} />
          <input type="hidden" name="currentUri" value={path} />
          <input type="hidden" name="saveAsDraftUri" value={saveAsDraftUri} />
          <GridRow>
            <SaveAsDraftButton
              formactionUrl={saveAsDraftFormActionUrl}
              onClick={this.onSaveAsDraft}
            />
            <ContinueButton id="continue">{t('commonContinueButtonSaveAndContinueButton')}</ContinueButton>
          </GridRow>
        </Form>
      </>
    );
  }

  onSubmit = async (e) => {
    try {
      e.preventDefault();
      const { nextUri, directLandingsUri } = this.props.route;
      const { getAddedLandingsType } = this.props;

      const documentNumber = this.props.match.params['documentNumber'];
      await this.props.saveAddedSpeciesPerUser(documentNumber);

      const to = getAddedLandingsType && getAddedLandingsType.landingsEntryOption == 'directLanding' ? directLandingsUri : nextUri;
      this.props.history.push(to.replace(':documentNumber', documentNumber));
    } catch (err) {
      window.scrollTo(0, 0);
    }
  };

  onSaveAsDraft = (e) => {
    e.preventDefault();
    const { saveAsDraftUri } = this.props.route;

    this.props.history.push(saveAsDraftUri);
  };

  cancelButtonHandler = () => {
    this.setState({ productId: undefined, editMode: false, addedSpecies: undefined });
  }

  setAddedSpecies = (currentAddedSpecies) => {
    this.setState({ addedSpecies: currentAddedSpecies});
  }

  setSelectSpeciesFavourite = (currentAddedSpecies) => {
    this.setState({ selectSpeciesFavourite: currentAddedSpecies });
  }

  removeButtonHandler = async (event) => {
      const documentNumber = this.props.match.params.documentNumber;
      const redirectPath = this.props.route.path;
      const params = {
        cancel: event.currentTarget.id,
        redirect: redirectPath.replace(
          ':documentNumber',
          documentNumber
        ),
      };
      await this.props.addSpeciesPerUser(params, documentNumber);

      if (this.state.productId) {
        this.cancelButtonHandler();
      }
  }


  editButtonHandler = async (event) => {
    const foundProduct = !isEmpty(this.state.products) && this.state.products.find(product => product.id === event.currentTarget.id);

    this.setState({ productId: event.currentTarget.id, editMode: true, addedSpecies: undefined });

    this.tabRef.current.updateActiveTab('tab-pane-add-products');

    await this.props.searchFishStates(foundProduct.speciesCode);

    if (this.productFormRef) {
      setTimeout(() => {
        this.productFormRef.scrollIntoView({ behavior: 'smooth' });
        this.productFormRef.focus({ preventScroll: true });
      }, 100);
    }
  }

  addLinkToErrorMessage = (errorList) => {
    return errorList.errors.map((err) => ({
      message: (err.text === 'error.favourite.any.invalid') ? <>{t('ccWhatExportingFromNolongerValidError')}&nbsp;
      <span className="govuk-link-in-error-summary">
        <a href="/manage-favourites" aria-label={t('ccWhatExportingFromAboutYourFavorites')}>
        {toLower(t('ccRenderFavourites'))}
        </a>
      </span>
      .</> : t(err.text),
      key: err.targetName,
    }));
  }

  render() {
    const {
      dispatchClearErrors: _dispatchClearErrors,
      history,
      config,
      route,
      errors,
      addedFavouritesPerUser = []
    } = this.props;
    const { previousUri, progressUri } = this.props.route;
    const { maxLandingsLimit } = config;

    const documentNumber =
      this.props.match && this.props.match.params
        ? this.props.match.params['documentNumber']
        : '';

    const backUrl = previousUri.replace(':documentNumber', documentNumber);

    const hasSpecies =
      this.props.addedSpeciesPerUser &&
      this.props.addedSpeciesPerUser.length > 0;
    const hasPresentations =
      this.props.speciesPresentations &&
      this.props.speciesPresentations.length > 0;

    if (hasSpecies && !hasPresentations) {
      this.props.searchFishStates(
        this.props.addedSpeciesPerUser[
          this.props.addedSpeciesPerUser.length - 1
        ].speciesCode
      );
    }
    const submitText = this.state.editMode ? `${t('ccAddSpeciesPageUpdateproduct')}` : `${t('ccAddSpeciesPageAddButtonText')}`;

    const notificationMsgs = [];
    if(this.props.hasPartiallyFilledSpecies) notificationMsgs.push(`${t('ccAddSpeciesPageNotificationText')}`);
    if(this.props.addedFavouriteProduct && this.props.addedFavouriteProduct.addedToFavourites !== undefined) {
      const addedProductDesc = this.props.addedFavouriteProduct.species +', '
        + this.props.addedFavouriteProduct.stateLabel + ', '
        + this.props.addedFavouriteProduct.presentationLabel + ', '
        + this.props.addedFavouriteProduct.commodity_code;
      notificationMsgs.push(
        this.props.addedFavouriteProduct.addedToFavourites ?
          `${t('ccAddLandingProductLabel')} `
          + addedProductDesc
          + ` ${t('ccWhatExportingFromAddtoFavouriteNotification')}` :
          `${t('ccAddLandingProductLabel')} `
          + addedProductDesc
          + ` ${t('ccWhatExportingFromProductExistNotification')}`
      );
    }

    return (
      <div className="dashboard">
        <PageTitle
          title={`${
            this.props.errors.errors ? `${t('commonPageTitleErrorText')} ` : ''
          } ${t('ccAddSpeciesPageHeaderText')} - ${t('ccCommonTitle')}`}
        />
        {!isEmpty(errors) && errors.errors && errors.errors.length > 0 && (
          <ErrorIsland
            errors={this.addLinkToErrorMessage(errors)}
          />
        )}
        <GridRow>
          <GridCol>
            <BackLinkWithErrorClearOut
              backUri={backUrl}
              clearErrors={_dispatchClearErrors}
              history={history}
              labeltext={t('commonBackLinkBackButtonLabel')}
            />
          </GridCol>
        </GridRow>
        {!isEmpty(notificationMsgs) && notificationMsgs.length > 0  && (
          <NotificationBanner
            header={t('commonImportant')}
            messages={notificationMsgs}
          />
        )}
        <InsetText id="speciesAndLandingsGuidanceMessage">
          <p>{t('ccAddSpeciesPageGuidanceMessageHeaderText')}</p>
          <UnorderedList className="ul" listStyleType="disc">
            <ListItem>{t('ccAddSpeciesPageGuidanceMessageHeader1LiText')}.</ListItem>
            <ListItem>
              {t('ccAddSpeciesPageGuidanceMessageHeader2LiText', {maxLandingsLimit: maxLandingsLimit})}
            </ListItem>
          </UnorderedList>
        </InsetText>
        <Header>{t('ccAddSpeciesPageHeaderText')}</Header>
        <TabGroup
          containerClassName="fes-govuk-tabs"
          className="fes-govuk-tabs__list"
          tabClassName="fes-govuk-tabs__list-item"
          tabLinkClassName="fes-govuk-tabs__tab"
          activeTabClassName="fes-govuk-tabs__list-item--selected"
          contentClassName="fes-govuk-tabs__panel"
          activeKey={this.state.activeTabKey}
          ref={this.tabRef}
        >
          <Tab label={t('ccAddSpeciesPageH2Text')} eventKey="tab-pane-add-products">
            <H2>{t('ccAddSpeciesPageH2Text')}</H2>
            <SpeciesBlock
              primaryButtonLabel={submitText}
              onSubmitAction={'/orchestration/api/v1/fish/add'}
              errors={this.props.errors}
              formRef={this.setProductFormRef}
              products={this.state.products}
              productId={this.state.productId}
              speciesStates={this.props.speciesStates}
              speciesPresentations={this.props.speciesPresentations}
              getCommodityCode={this.props.getCommodityCode}
              commodityCodes={this.props.commodityCodes}
              searchFishStates={this.props.searchFishStates}
              fishStates={this.props.fishStates}
              addSpeciesUri={this.props.route.path}
              documentNumber={documentNumber}
              addSpeciesPerUser={this.props.addSpeciesPerUser}
              editAddedSpeciesPerUser={this.props.editAddedSpeciesPerUser}
              displayAddProduct={
                this.props.addedSpeciesPerUser &&
                this.props.addedSpeciesPerUser.length <
                  this.props.config.maxSpeciesLimit
              }
              clearErrors={_dispatchClearErrors}
              cancelEditing={this.cancelButtonHandler}
              showAddToFavouritesCheckbox={true}
              setAddedSpecies={this.setAddedSpecies}
              addedSpecies={this.state.addedSpecies}
            />
          </Tab>
          <Tab
            label={t('ccAddSpeciesPageFavouritesH2Text')}
            eventKey="tab-pane-add-products-from-favourites"
          >
            <H2>{t('ccAddSpeciesPageFavouritesH2Text')}</H2>
            <SpeciesFavourites
              documentNumber={documentNumber}
              addSpeciesPerUser={this.props.addSpeciesPerUser}
              errors={this.props.errors}
              products={addedFavouritesPerUser || []}
              setSelectedSpeciesFavourite={this.setSelectSpeciesFavourite}
              selectedSpeciesFavourite={this.state.selectSpeciesFavourite}
            />
          </Tab>
        </TabGroup>
        <h2 className="heading-large" id="productTableCaption">
          {t('ccAddSpeciesPageProductTableCaption')}
        </h2>
        <GridRow>
          <GridCol>
            <Table
              id="species-table"
              head={
                <Table.Row>
                  <Table.CellHeader>{t('ccFavouritesPageProductTableHeaderTwo')}</Table.CellHeader>
                  <Table.CellHeader>{t('commonCommodityCodeLabel')}</Table.CellHeader>
                  <Table.CellHeader style={{ textAlign: 'right' }}>
                    {t('commonDashboardAction')}
                  </Table.CellHeader>
                </Table.Row>
              }
              body={this.state.products.map((product, index) => (
                <Table.Row
                  id={`${t('ccAddSpeciesPageVhiddenSpeciesText')}${product.speciesCode}_${product.state}_${product.presentation}`}
                  key={index}
                >
                  <Table.Cell
                    style={{ verticalAlign: 'top', width: '40%' }}
                  ><p>{product.species},<br />{product.stateLabel},<br />{product.presentationLabel}</p></Table.Cell>
                  <Table.Cell style={{ verticalAlign: 'top', width: '50%' }}>
                    {`${product.commodity_code} ${
                      product.commodity_code_description
                        ? '- ' + product.commodity_code_description
                        : ''
                    }`.trim()}
                  </Table.Cell>
                  <Table.Cell style={{ verticalAlign: 'top', width: '10%' }}>
                    <GridRow style={{ margin: 0, placeContent: 'flex-end' }}>
                      <SecondaryButton
                        type="button"
                        id={product.id}
                        name="editProduct"
                        style={{ minWidth: '67px', wordBreak: 'normal' }}
                        onClick={this.editButtonHandler}
                      >
                        {t('commonEditLink')}
                        <span className="govuk-visually-hidden">
                          {`${t('ccAddSpeciesPageVhiddenSpeciesText')}${product.speciesCode}_${product.state}_${product.presentation}`}
                        </span>
                      </SecondaryButton>
                      <SecondaryButton
                        type="button"
                        id={product.id}
                        name="removeProduct"
                        style={{ minWidth: '100px' }}
                        onClick={this.removeButtonHandler}
                      >
                        {t('commonRemoveButton')}
                        <span className="govuk-visually-hidden">
                          {`${t('ccAddSpeciesPageVhiddenSpeciesText')}${product.speciesCode}_${product.state}_${product.presentation}`}
                        </span>
                      </SecondaryButton>
                    </GridRow>
                  </Table.Cell>
                </Table.Row>
              ))}
            />
          </GridCol>
        </GridRow>
        {this.renderContinueAndDraftButtons()}
        <BackToProgressLink
          progressUri={progressUri}
          documentNumber={documentNumber}
        />
        <HelpLink journey={route.journey} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    exporter: state.exporter,
    addedSpeciesPerUser: state.addedSpeciesPerUser.species,
    hasPartiallyFilledSpecies: state.addedSpeciesPerUser.partiallyFilledProductRemoved,
    unauthorised: state.addedSpeciesPerUser.unauthorised,
    addedSpeciesErrorState: state.addedSpeciesErrorState,
    speciesStates: state.speciesStates,
    speciesPresentations: state.speciesPresentations,
    commodityCodes: state.commodityCodes,
    fishStates: state.fishStates,
    errors: state.errors,
    searchResultsForSpecies: state.fish,
    config: state.config,
    getAddedLandingsType: state.landingsType,
    addedFavouriteProduct : state.addedSpeciesPerUser.addedFavouriteProduct,
    addedFavouritesPerUser: state.addedFavouritesPerUser.favourites,
  };
}

const getSpeciesCode = (nameWithCode) => {
  let code = nameWithCode.split('(')[1];

  if (code) {
    code = code.substr(0, code.length - 1);
    return code;
  }

  return null;
};

export const hasAdminOverride = (species) => {
  const hasOverriddenLanding = (s) =>
    s.caughtBy &&
    s.caughtBy.length &&
    s.caughtBy.some(c => c.vesselOverriddenByAdmin === true);

  return !!(
    species &&
    species.length &&
    species.some(s => hasOverriddenLanding(s))
  );
};

const getAllPromisesForLookingUpCommodityCode = (
  addedSpeciesPerUser,
  getCommodityCodeFn
) => {

  const multiplePromises = addedSpeciesPerUser
    .map((species) => {
      if (
        species.species &&
        species.state !== undefined &&
        species.state !== '' &&
        species.presentation !== undefined &&
        species.presentation !== '' &&
        // check if commodity code is set already, only if it's not set try getting the code
        (species.commodity_code === undefined || species.commodity_code === '')
      ) {
        return getCommodityCodeFn({
          speciesCode: getSpeciesCode(species.species),
          state: species.state,
          presentation: species.presentation,
        });
      }
    })
    .filter((prom) => {
      return prom !== undefined;
    });
  return multiplePromises;
};

async function loadData(store, journey) {
  const hasErrorParams =
    this.queryParams &&
    this.queryParams.error &&
    Object.keys(this.queryParams.error).length;
  if (hasErrorParams) {
    store.dispatch(dispatchApiCallFailed(JSON.parse(this.queryParams.error)));
  }

  await Promise.all([
    store.dispatch(getExporterFromMongo(journey ,this.documentNumber)),
    store.dispatch(getAddedSpeciesPerUser(this.documentNumber)),
    store.dispatch(getStatesFromReferenceService()),
    store.dispatch(getPresentationsFromReferenceService()),
    store.dispatch(getAllUkFish()),
    store.dispatch(getLandingType(this.documentNumber)),
    store.dispatch(getAddedFavouritesPerUser)
  ]);

  const addedSpeciesPerUser = store.getState().addedSpeciesPerUser.species || [];
  const allPromisesForCommodityCode = getAllPromisesForLookingUpCommodityCode(
    addedSpeciesPerUser,
    (species) => {
      return store.dispatch(getCommodityCode(species));
    }
  );

  return Promise.all(allPromisesForCommodityCode);
}

export const component = connect(mapStateToProps, {
  getAddedSpeciesPerUser,
  clearAddedSpeciesPerUser,
  addSpeciesPerUser,
  editAddedSpeciesPerUser,
  getExporterFromMongo,
  getStatesFromReferenceService,
  getPresentationsFromReferenceService,
  getCommodityCode,
  searchFishStates,
  dispatchClearErrors,
  speciesSelectedFromSearchResult,
  searchUkFish,
  getAllUkFish,
  saveAddedSpeciesPerUser,
  getLandingType,
  getAddedFavouritesPerUser
})(withTranslation() (AddSpeciesPage));

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
