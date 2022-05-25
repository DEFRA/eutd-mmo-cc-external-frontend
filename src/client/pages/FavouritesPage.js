import React from 'react';
import {
  Main,
  Header,
  BackLink,
  GridRow,
  GridCol,
  Table
} from 'govuk-react';
import PageTitle from '../components/PageTitle';
import FavouritesDetails from '../components/elements/FavouritesDetails';
import { connect } from 'react-redux';
import PageTemplateWrapper from '../components/PageTemplateWrapper';
import {
  dispatchApiCallFailed,
  getStatesFromReferenceService,
  getPresentationsFromReferenceService,
  getCommodityCode,
  searchFishStates,
  speciesSelectedFromSearchResult,
  searchUkFish,
  getAllUkFish,
  dispatchClearErrors
} from '../actions';
import { addFavourite, getAddedFavouritesPerUser, removeFavourite } from '../actions/favourites.actions';
import SpeciesBlock from '../components/SpeciesBlock';
import ErrorIsland from '../components/elements/ErrorIsland';
import { withTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import SecondaryButton from '../components/elements/SecondaryButton';
import errorTransformer from '../helpers/errorTransformer';

export class FavouritesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favouriteId: undefined,
    };
    this.favouriteFormRef = null;

    this.setFavouriteFormRef = (element) => {
      this.favouriteFormRef = element;
    };
  }

  async componentDidMount() {
    try {
      await this.props.getAddedFavouritesPerUser();
    } catch (e) {
      console.error(e);
    }
  }

  unauthorised() {
    this.props.history.push('/forbidden');
  }

  componentDidUpdate() {
    const {
      unauthorised,
    } = this.props;

    if (
      unauthorised === true
    ) {
      this.unauthorised();
    }
  }

  goBackHandler = (event)=>{
    event.preventDefault();
    this.props.history.goBack();
  }

  removeFavouriteHandler = (event) => {
    const productId = event.currentTarget.id;
    this.props.removeFavourite(productId);
    this.setState({ favouriteId: undefined });
  };

  splitErrorParams = (error) => {
    const { t } = this.props;
    const isErrorWithParams = error.text.includes('-');
    const splitError = error.text.split('-');

    return isErrorWithParams ? t(splitError[0], { dynamicValue: splitError[1] }) : t(error.text);
  };

  formatErrors = (errors) => {
    return errors.map((error) => (
      { message: this.splitErrorParams(error), key: error.targetName }
    )
    );
  };

  render() {
    const { addedFavouritesPerUser = [], t } = this.props;
    const errors = errorTransformer(this.props.errors);

    return (
      <Main>
        <div className="favourites">
          <PageTitle title={t('ccFavouritesPageHeader')} />
          {!isEmpty(errors) && errors.errors && errors.errors.length > 0 && (
            <ErrorIsland
              errors={this.formatErrors(errors.errors)}
            />
          )}
          <GridRow>
            <GridCol>
              <BackLink
                onClick={(event) => this.goBackHandler(event)} href="#"
              >{t('commonBackLinkBackButtonLabel')}
              </BackLink>
              <Header>{t('ccFavouritesPageHeader')}</Header>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol>
            <FavouritesDetails />
        <SpeciesBlock
          primaryButtonLabel={t('ccFavouritesPageFormCommodityCodeAddProductFavourites')}
          onSubmitAction={'/orchestration/api/v1/favourites/add'}
          errors={errors}
          formRef={this.setFavouriteFormRef}
          products={addedFavouritesPerUser || []}
          productId={this.state.favouriteId}
          speciesStates={this.props.speciesStates}
          speciesPresentations={this.props.speciesPresentations}
          getCommodityCode={this.props.getCommodityCode}
          commodityCodes={this.props.commodityCodes}
          searchFishStates={this.props.searchFishStates}
          fishStates={this.props.fishStates}
          displayAddProduct={true}
          cancelEditing={() => null}
          addFavourite={this.props.addFavourite}
          clearErrors={this.props.dispatchClearErrors}
        />
          <h2 className="heading-large" id="productTableCaption">
          {t('ccFavouritesPageProductTableCaption')}
        </h2>
        <GridRow>
          <GridCol>
            <Table
              id='product-favourites'
              head={(
                <Table.Row>
                  <Table.CellHeader>{t('ccFavouritesPageProductTableHeaderOne')}</Table.CellHeader>
                  <Table.CellHeader>{t('ccFavouritesPageProductTableHeaderTwo')} </Table.CellHeader>
                  <Table.CellHeader style={{ textAlign: 'right' }}>{t('ccFavouritesPageProductTableHeaderThree')}</Table.CellHeader>
                </Table.Row>
              )}
              body={(
                addedFavouritesPerUser.map((product, index) => (
                  <Table.Row id={`productfavourites_${product.id}`} key={index}>
                    <Table.Cell style={{ verticalAlign: 'top', width: '20%' }}>{product.id}</Table.Cell>
                    <Table.Cell style={{ verticalAlign: 'top', width: '50%'  }}><strong>{t('ccFavouritesPageProductTableRowSpecies')}</strong>: {product.species} <br/>
                                                                                <strong>{t('ccFavouritesPageProductTableRowState')}</strong>: {product.stateLabel} <br/>
                                                                                <strong>{t('ccFavouritesPageProductTableRowPresentation')}</strong>: {product.presentationLabel} <br/>
                                                                                <strong>{t('ccFavouritesPageProductTableRowCommodityCode')}</strong>: {`${product.commodity_code} ${product.commodity_code_description ? '- '  + product.commodity_code_description : ''}`.trim()}
                                                                               </Table.Cell>
                    <Table.Cell style={{ verticalAlign: 'top', width: '10%'  }}>
                    <GridRow style={{ margin: 0, placeContent: 'flex-end' }}>
                    <SecondaryButton
                        type="button"
                        id={product.id}
                        name="removeProduct"
                        style={{ minWidth: '100px' }}
                        onClick={this.removeFavouriteHandler}
                      >
                        {t('ccFavouritesPageProductTableRowRemoveButton')}
                        <span className="govuk-visually-hidden">
                          {`productfavourites_${product.id}`}
                        </span>
                      </SecondaryButton>
                      </GridRow>
                    </Table.Cell>
                  </Table.Row>
               ))
            )}
            />
          </GridCol>
        </GridRow>
       </GridCol>
          </GridRow>
        </div>
      </Main>
    );
  }
}

function mapStateToProps(state) {
  return {
    exporter: state.exporter,
    addedFavouritesPerUser: state.addedFavouritesPerUser.favourites,
    addedSpeciesErrorState: state.addedSpeciesErrorState,
    speciesStates: state.speciesStates,
    unauthorised: state.addedFavouritesPerUser.unauthorised,
    speciesPresentations: state.speciesPresentations,
    commodityCodes: state.commodityCodes,
    fishStates: state.fishStates,
    errors: state.addedFavouritesPerUser.errors,
    searchResultsForSpecies: state.fish,
    config: state.config,
  };
}

async function loadData(store) {
  const hasErrorParams =
    this.queryParams &&
    this.queryParams.error &&
    Object.keys(this.queryParams.error).length;
  if (hasErrorParams) {
    store.dispatch(dispatchApiCallFailed(JSON.parse(this.queryParams.error)));
  }

  await Promise.all([
    store.dispatch(getStatesFromReferenceService()),
    store.dispatch(getAddedFavouritesPerUser),
    store.dispatch(getPresentationsFromReferenceService()),
    store.dispatch(getAllUkFish())
  ]);
}

export const component = connect(mapStateToProps, {
  getStatesFromReferenceService,
  getPresentationsFromReferenceService,
  getCommodityCode,
  searchFishStates,
  speciesSelectedFromSearchResult,
  searchUkFish,
  getAllUkFish,
  addFavourite,
  removeFavourite,
  dispatchClearErrors,
  getAddedFavouritesPerUser,
})(withTranslation() (FavouritesPage));

export default {
  loadData,
  component: PageTemplateWrapper(component),
};