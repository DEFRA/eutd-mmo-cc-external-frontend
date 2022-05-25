import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { GridCol } from 'govuk-react';
import FavouritesAutocomplete from './FavouritesAutocomplete';
import { scrollToErrorIsland } from '../pages/utils';
import { withTranslation } from 'react-i18next';
import { t } from 'i18next';
import ManageYourProductFavouritesLink from './ManageYourProductFavouritesLink';
export class SpeciesFavourites extends Component {
  constructor(props) {
    super(props);
    this.state = this.init(props.selectedSpeciesFavourite);
  }

  init(initialState) {
    if (!isEmpty(initialState)) {
      return initialState;
    }

    return ({
      commodity_code: '',
      commodity_code_description: '',
      id: '',
      selectedState: '',
      selectedStateLabel: '',
      selectedCommodityCode: '',
      selectedCommodityCodeLabel: '',
      selectedPresentation: '',
      selectedPresentationLabel: '',
      species: '',
      speciesCode: '',
      scientificName: '',
      selectedFavourite: '',
    });
  }

  setSpecies =  (favouriteObj) => {
    if (favouriteObj) {
      this.setState({
        selectedFavourite: `${favouriteObj.species} ${favouriteObj.stateLabel}, ${favouriteObj.presentationLabel}, ${favouriteObj.commodity_code}`,
        ...favouriteObj,
      }, () => {
        this.props.setSelectedSpeciesFavourite(this.state);
      });
    } else {
      this.setState({
        species: '',
        selectedFavourite: '',
      });
    }
  };

  addButtonHandler = async () => {
    try {
      const selectedData = {
        btn_submit: '',
        isFavourite: true,
        redirect:
          '/create-catch-certificate/:documentNumber/what-are-you-exporting',
        ...this.state,
      };

      const response = await this.props.addSpeciesPerUser(
        selectedData,
        this.props.documentNumber
      );

      if (response.payload) {
        this.setState({selectedFavourite: ''});
      }
    } catch (e) {
      scrollToErrorIsland();
    }
  };


  render() {
    const { products, errors } = this.props;
    return (
      <>
        <div id="0" className="adding-species">
          <div className="properties-group input-species-block">
            <FavouritesAutocomplete
              label={t('ccFavouritesPageProductTableHeaderTwo')}
              defaultValue={this.state.selectedFavourite}
              id="product"
              name="product"
              error={errors}
              onChange={this.setSpecies}
              htmlFor={'product'}
              allFavourites={products}
            />
          </div>
          <ManageYourProductFavouritesLink />
          <GridCol>
            <button
              id="submit"
              name="submit"
              className="button"
              style={{ marginLeft: '-0.8em ', marginTop: '1.5em' }}
              onClick={this.addButtonHandler}
            >
              {t('ccSpeciesFavouriteButtonText')}
            </button>
          </GridCol>
        </div>
      </>
    );
  }
}


SpeciesFavourites.propTypes = {
  documentNumber: PropTypes.string,
  addSpeciesPerUser: PropTypes.func,
  errors: PropTypes.object,
  products: PropTypes.array,
  selectedSpeciesFavourite: PropTypes.object,
  setSelectedSpeciesFavourite: PropTypes.func
};

export default withTranslation() (SpeciesFavourites);