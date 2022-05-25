import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from '../../../node_modules/govuk-react-components/components/forms/select.js';
import Details from './elements/Details';
import SpeciesDetails from './elements/SpeciesDetails';
import SpeciesAutocomplete from './SpeciesAutocomplete';
import SecondaryButton from './elements/SecondaryButton';
import { GridRow, GridCol } from 'govuk-react';
import { scrollToErrorIsland } from '../pages/utils';
import { isEmpty, throttle } from 'lodash';
import Checkbox from './elements/checkbox';
import { t } from 'i18next';

class SpeciesBlock extends Component {
  constructor(props) {
    super(props);
    this.state = this.init(props.addedSpecies);
    this.renderSpeciesBox = this.renderSpeciesBox.bind(this);
  }

  init(initialState) {
    if (!isEmpty(initialState)) {
      return initialState;
    }

    return ({
      id: '',
      species: '',
      speciesCode: '',
      scientificName: '',
      selectedState: '',
      selectedStateLabel: '',
      selectedPresentation: '',
      selectedPresentationLabel: '',
      selectedCommodityCode: '',
      selectedCommodityCodeLabel: '',
      commodityCodes: [],
      addToFavourites: false
    });
  }

  componentDidUpdate(prevProps) {
    const { errors, clearErrors, productId } = this.props;

    if (productId !== prevProps.productId && productId !== undefined && !isEmpty(errors)) {
      clearErrors();
    } else if (productId !== prevProps.productId && productId === undefined) {
      this.clearSelections();
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.productId !== state.id && props.productId !== undefined) {
      const foundProduct = !isEmpty(props.products) && props.products.find(product => product.id === props.productId);
      if (foundProduct) {
        return {
          id: props.productId,
          species: foundProduct.species,
          speciesCode: foundProduct.speciesCode,
          scientificName: foundProduct.scientificName,
          selectedState: foundProduct.state,
          selectedStateLabel: foundProduct.stateLabel,
          selectedPresentation: foundProduct.presentation,
          selectedPresentationLabel: foundProduct.presentationLabel,
          selectedCommodityCode: foundProduct.commodity_code,
          selectedCommodityCodeLabel: foundProduct.commodity_code_description,
          commodityCodes: [{ value: foundProduct.commodity_code, label: `${foundProduct.commodity_code} - ${foundProduct.commodity_code_description}` }],
          addToFavourites: foundProduct.addToFavourites == true
        };
      } else {
        return {
          ...state
        };
      }
    } else {
      return {
        ...state
      };
    }
  }

  onSubmit = async (e) => {
    const {
      selectedPresentation,
      selectedPresentationLabel,
      species,
      speciesCode,
      selectedState,
      selectedStateLabel,
      scientificName,
      selectedCommodityCode,
      selectedCommodityCodeLabel,
      addToFavourites
    } = this.state;
    const { onSubmitAction, clearErrors } = this.props;

    e.preventDefault();

    if (onSubmitAction.indexOf('favourite') > -1) {
      const selectedData =  {
        presentation: selectedPresentation,
        presentationLabel: selectedPresentationLabel,
        species: species,
        speciesCode: speciesCode,
        state: selectedState,
        stateLabel: selectedStateLabel,
        scientificName: scientificName,
        commodity_code: selectedCommodityCode,
        commodity_code_description: selectedCommodityCodeLabel.replace(
          selectedCommodityCode + ' - ',
          ''
        )
      };

      try {
        clearErrors();

        const response = await this.props.addFavourite(
          selectedData
        );

        if (response) {
          this.clearSelections();
        }
      }
      catch (err) {
        scrollToErrorIsland();
      }
    }
    else {
      try {
        const selectedData = {
          addToFavourites,
          btn_submit: '',
          presentation: selectedPresentation,
          presentationLabel: selectedPresentationLabel,
          redirect: '/create-catch-certificate/:documentNumber/what-are-you-exporting',
          species: species,
          speciesCode: speciesCode,
          state: selectedState,
          stateLabel: selectedStateLabel,
          scientificName: scientificName,
          commodity_code: selectedCommodityCode,
          commodity_code_description: selectedCommodityCodeLabel.replace(
            selectedCommodityCode + ' - ',
            ''
          )
        };

        let response;
        if (this.props.productId === undefined)  {
          response = await this.props.addSpeciesPerUser(
            selectedData,
            this.props.documentNumber
          );
        } else {
          selectedData.id = this.props.productId;
          response = await this.props.editAddedSpeciesPerUser(
            this.props.productId,
            selectedData,
            this.props.documentNumber
          );

          this.props.cancelEditing();
        }

        if (response.payload) {
          this.clearSelections();
        }
      } catch (err) {
        scrollToErrorIsland();
      }
    }
  };

  parseErrors(id) {
    if (this.props.errors) {
      if (Object.prototype.hasOwnProperty.call(this.props.errors, `${id}Error`))  {
        return t(this.props.errors[`${id}Error`]);
      }
      return null;
    }
  }

  clearState() {
    this.setState({
      id: '',
      addToFavourites: false,
      species: '',
      speciesCode: '',
      scientificName: '',
      selectedState: '',
      selectedStateLabel: '',
      selectedPresentation: '',
      selectedPresentationLabel: '',
      selectedCommodityCode: '',
      selectedCommodityCodeLabel: '',
      commodityCodes: [],
    }, () => {
      if (this.props.setAddedSpecies) this.props.setAddedSpecies(this.state);
    });
  }

  clearSelections() {
    this.clearState();

    // Clear autocomplete and hidden select
    const speciesEl = document.getElementsByName('species')[0];
    speciesEl.value = '';

    // Needed to collapse menu
    speciesEl.click();
    speciesEl.focus();
    speciesEl.blur();
  }

  handlerClear = (event) => {
    event.preventDefault();
    const { errors, clearErrors, cancelEditing } = this.props;

    this.clearSelections();
    cancelEditing();

    if(errors) clearErrors();

    // Return focus to the button
    event.currentTarget.focus();
  };

  setSpecies = async (speciesName, speciesObj) => {
    if (speciesName) {
      if (this.props.productId) {
        this.props.cancelEditing();
      }

      await this.props.searchFishStates(
        speciesObj ? speciesObj.faoCode : speciesName
      );

      // the species code is generated as id in getItems, that's what we are looking up here
      this.setState(
        {
          addToFavourites: false,
          selectedState: '',
          selectedStateLabel: '',
          selectedCommodityCode: '',
          selectedCommodityCodeLabel: '',
          selectedPresentation: '',
          selectedPresentationLabel: '',
          commodityCodes: [],
          species: speciesName,
          speciesCode: speciesObj ? speciesObj.faoCode : speciesName,
          scientificName: speciesObj?.scientificName,
        },
        () => {
          if (this.props.setAddedSpecies)
            this.props.setAddedSpecies(this.state);
        }
      );
    } else {
      this.clearState();
    }
  };

  renderSpeciesBox = () => {
    return (
      <div className="properties-group input-species-block">
        <SpeciesAutocomplete
          hintText={t('ccSpeciesBlockHintText')}
          defaultValue={this.state.species}
          label={t('ccFavouritesPageFormCommonNameField')}
          id="species"
          name="species"
          error={this.props.errors}
          onChange={this.setSpecies}
          htmlFor={'species'}
        />
      </div>
    );
  };

  renderStateAndPresentation = () => {
    const {
      selectedState,
      selectedPresentation,
      selectedStateLabel,
      selectedPresentationLabel,
      species,
      speciesCode,
    } = this.state;
    const { fishStates, speciesStates } = this.props;



    const stateOptions =  species
      ? (fishStates && fishStates.length && fishStates.map((fs) => fs.state)) ||
        speciesStates
      :  [];

    let presentationOptions =
      fishStates &&
      fishStates.length &&
      (
        fishStates.find((s) => s.state.value === selectedState) || {
          presentations: [],
        }
      ).presentations;

    // Remove Below Minimum Size presentation option
    if (presentationOptions)
      presentationOptions = presentationOptions.filter(
        (p) => p.value !== 'BMS'
      );
    const nojsPresentationOptions = (
      this.props.speciesPresentations || []
    ).filter((p) => p.value !== 'BMS');

    const presOptions = selectedState
      ? presentationOptions || nojsPresentationOptions
      : [];


    return (
      <div>
        <Select
          label={t('ccFavouritesPageProductTableRowState')}
          name="state"
          id="state"
          error={this.parseErrors('state')}
          options={stateOptions}
          onChange={(e) => {
            this.setState({
              selectedState: e.target.value,
              selectedStateLabel: e.target[e.target.selectedIndex].text,
              selectedPresentation: '',
              selectedCommodityCode: '',
              commodityCodes: [],
            }, () => {
              if (this.props.setAddedSpecies) this.props.setAddedSpecies(this.state);
            });
            this.getCommodityCodes(e.target.value, selectedPresentation);
          }}
          nullOption={t('ccFavouritesPageFormStateFieldPlaceholder')}
          value={selectedState}
        />
        <input type="hidden" name="species" value={species} />
        <input type="hidden" name="speciesCode" value={speciesCode} />
        <input type="hidden" name="stateLabel" value={selectedStateLabel} />
        <input
          type="hidden"
          name="presentationLabel"
          value={selectedPresentationLabel}
        />
        <Select
          label={t('ccFavouritesPageProductTableRowPresentation')}
          name="presentation"
          id="presentation"
          error={this.parseErrors('presentation')}
          options={presOptions}
          onChange={(e) => {
            this.setState({
              selectedPresentation: e.target.value,
              selectedPresentationLabel: e.target[e.target.selectedIndex].text,
              commodityCodes: [],
              selectedCommodityCode: ''
            }, () => {
              if (this.props.setAddedSpecies) this.props.setAddedSpecies(this.state);
            });
            this.getCommodityCodes(selectedState, e.target.value);
          }}
          nullOption={t('ccFavouritesPageFormStateFieldPlaceholder')}
          value={selectedPresentation}
        />
      </div>
    );
  };

  getCommodityCodes = async (state, presentation) => {
    let speciesStateAndPresParams = {};
    if (this.state.speciesCode && state && presentation) {
      speciesStateAndPresParams.speciesCode = this.state.speciesCode;
      speciesStateAndPresParams.state = state;
      speciesStateAndPresParams.presentation = presentation;

      await this.props.getCommodityCode(speciesStateAndPresParams);

      const singleCommodityCode = Array.isArray(this.props.commodityCodes) && this.props.commodityCodes.length === 1;

      this.setState({
        commodityCodes: this.props.commodityCodes,
        selectedCommodityCode: (singleCommodityCode && this.state.selectedPresentation ? this.props.commodityCodes[0].value : ''),
        selectedCommodityCodeLabel: (singleCommodityCode && this.state.selectedPresentation ? this.props.commodityCodes[0].label : '')
      }, () => {
        if (this.props.setAddedSpecies) this.props.setAddedSpecies(this.state);
      });
    }
  };

  renderCommodityCode = () => {
    const defaultValue = this.state.selectedCommodityCode  || null;
    const nullOption = defaultValue ? '' : t('ccFavouritesPageFormStateFieldPlaceholder');

    return (
      <Select
        label={t('ccFavouritesPageFormCommodityCodeField')}
        name="commodity_code"
        id="commodity_code"
        error={this.parseErrors('commodity_code')}
        options={this.state.commodityCodes}
        onChange={(c) => {
          this.setState({
            selectedCommodityCode: (c && c.target.value) || '',
            selectedCommodityCodeLabel:
              (c && c.target[c.target.selectedIndex].text) || '',
          }, () => {
            if (this.props.setAddedSpecies) this.props.setAddedSpecies(this.state);
          });
        }}
        defaultValue={defaultValue || ''}
        nullOption={nullOption}
        value={this.state.selectedCommodityCode}
      />
    );
  };

  addToFavouritesHandler = (e)=>{
    this.setState({ addToFavourites: e.currentTarget.checked }, () => {
      if (this.props.setAddedSpecies) this.props.setAddedSpecies(this.state);
    });
  }

  render() {
    const { formRef, primaryButtonLabel, onSubmitAction } = this.props;

    return (
      <form
        method="POST"
        action={onSubmitAction}
        onSubmit={this.onSubmit}
        className="add-products-form"
        tabIndex="0"
        ref={formRef}
      >
        <div id="0" className="adding-species">
          {this.renderSpeciesBox()}
          <SpeciesDetails exemptFrom={t('ccFavouritesDetailsExemptFromCatchCertificate')} />
          {this.renderStateAndPresentation()}
          {this.renderCommodityCode()}
          <Details
            summary={t('ccFavouritesPageFormCommodityCodeSummary')}
            details={t('ccFavouritesPageFormCommodityCodeDetails',{contactinfo:'0330 159 1989'})}
          />
          {this.props.showAddToFavouritesCheckbox && <Checkbox
            id="addToFavourites"
            value={this.state.addToFavourites}
            checked={this.state.addToFavourites}
            name="addToFavourites"
            inline
            onChange={this.addToFavouritesHandler}
          >
            {t('ccSpeciesBlockLabelCheckBoxLabelText')}
          </Checkbox>}

          <GridRow style={{ marginBottom: '0' }}>
            <SecondaryButton
              type="button"
              id="cancel"
              name="cancel"
              value="cancel"
              onClick={this.handlerClear}
            >
              {t('commonSecondaryButtonCancelButton')}
            </SecondaryButton>
            {this.props.displayAddProduct && (
              <GridCol>
                <button
                  id="submit"
                  name="submit"
                  onClick={throttle(this.onSubmit, 300)}
                  className="button"
                >
                  {primaryButtonLabel}
                </button>
              </GridCol>
            )}
          </GridRow>
        </div>
        <input type="hidden" value={this.props.addSpeciesUri} name="redirect" />
      </form>
    );
  }
}

SpeciesBlock.propTypes = {
  errors: PropTypes.object,
  speciesStates: PropTypes.array.isRequired,
  speciesPresentations: PropTypes.array.isRequired,
  getCommodityCode: PropTypes.func.isRequired,
  commodityCodes: PropTypes.array,
  searchFishStates: PropTypes.func.isRequired,
  fishStates: PropTypes.array,
  addSpeciesUri: PropTypes.string,
  displayAddProduct: PropTypes.bool,
  clearErrors: PropTypes.func,
  cancelEditing: PropTypes.func,
  addedSpecies: PropTypes.object,
  setAddedSpecies: PropTypes.func
};

export default SpeciesBlock;
