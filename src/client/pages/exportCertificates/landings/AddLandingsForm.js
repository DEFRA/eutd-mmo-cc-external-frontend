import moment from 'moment';
import React from 'react';
import { GridRow, GridCol, LabelText, ErrorText } from 'govuk-react';
import { scrollToErrorIsland } from '../../utils';
import { WeightInput } from '../../../components/elements/WeightInput';
import Details from '../../../components/elements/Details';
import GovukVesselsAutocomplete from '../../../components/GovukVesselsAutocomplete';
import SecondaryButton from '../../../components/elements/SecondaryButton';
import DateFieldWithPicker from '../../../components/DateFieldWithPicker';
import Select from '../../../../../node_modules/govuk-react-components/components/forms/select.js';
import { isEmpty } from 'lodash';
import { withTranslation } from 'react-i18next';
import { t } from 'i18next';

const initialState = {
  model: {
    id: undefined,
    vessel: { label: '' },
    faoArea: 'FAO27',
    exportWeight: '',
    dateLanded: '',
    editMode: '',
  },
  product: '',
  dateValue: ''
};

class AddLandingsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      product: props.productId || '',
    };
  }

  changeHandler = (event) => {
    const { model } = this.state;
    event.preventDefault();
    if (event.currentTarget.name === 'weight') {
      this.setState({
        model: {
          ...model,
          exportWeight: event.currentTarget.value !== '' ?  event.currentTarget.value : undefined,
        },
      });
      return;
    }
    if (event.currentTarget.name === 'faoArea') {
      this.setState({
        model: {
          ...model,
          faoArea: event.currentTarget.value,
        },
      });
      return;
    }

    this.setState({ [event.currentTarget.name]: event.currentTarget.value });
    this.props.clearLanding(undefined, event.currentTarget.value);
  };

  addHandler = async (event) => {
    const { product } = this.state;
    try {
      event.preventDefault();
      event.currentTarget.blur();

      const model = { ...this.state.model, editMode: undefined };

      model.dateLanded = model.dateLanded
        ? model.dateLanded
        : undefined;

      await this.props.upsertLanding(product, model);

      const { exportPayload } = this.props;
      const { errors = {} } = exportPayload;
      this.setState({ dateValue: null });

      if (isEmpty(errors)) this.setState({ ...initialState, product });
    } catch (err) {
      scrollToErrorIsland();
    }
  };

  onDateChange = (e) => {
     const { model } = this.state;

     this.setState({
       model: {
         ...model,
         dateLanded: e.target.value
       }
     });
  }

  getItems = (vessels) => {
    const { model } = this.state;

    if (
      !model.dateLanded ||
      model.dateLanded === 'Invalid date'
    ) {
      vessels = [];
    }

    if (
      Array.isArray(vessels) &&
      vessels.length === 0 &&
      (!model.vessel.label || model.vessel.label.length < 2)
    ) {
      vessels.push({
        label:
          model.dateLanded &&
          (model.dateLanded !== 'Invalid date')
            ? t('ccAddVesselFormVesselQueryPrompt')
            : t('ccAddVesselFormVesselDateQueryPrompt')
      });
    }
    return vessels;
  };

  getItem = (vessel) => {
    return vessel.label;
  };

  setVessel = (term, item) => {
    if (term !== t('ccAddVesselFormVesselQueryPrompt') && term !== t('ccAddVesselFormVesselDateQueryPrompt')) {
      if (item && item.vesselName) {
        let model = { ...this.state.model };
        model.vessel = item;
        this.setState({ model });
      } else {
        this.setState((prevState) => ({
          ...prevState,
          model: {
            ...prevState.model,
            vessel: { label: term },
          },
        }));
      }
    }
  };

  cancelHandler = (event) => {
    event.preventDefault();
    event.currentTarget.blur();

    this.setState({ ...initialState, dateValue: null  });

    this.props.clearLanding();
  };

  isEditMode = (landingId, product) => {
    const { exportPayload = {} } = this.props;
    const { items = [] } = exportPayload;
    if (!isEmpty(exportPayload)) {
      const foundItem = items.find((item) => item.product.id === product);
      if (foundItem && foundItem.landings) {
        return foundItem.landings.some(
          (landing) => landing.model && landing.model.id === landingId
        );
      }
      return false;
    }
    return false;
  };

  static getDerivedStateFromProps(props, state) {
    const intialiseState = (exportPayload, productId, landingId, editMode) => {
      if (exportPayload && exportPayload.items && exportPayload.items.length) {
        const item = exportPayload.items.find((_) => {
          return _.product.id === productId;
        });

        if (item && item.landings && item.landings.length) {
          const landing = item.landings.find((_) => {
            return _.model.id === landingId;
          });

          if (landing) {
            return {
              model: {
                id: landing.model.id,
                vessel: landing.model.vessel || { label: '' },
                exportWeight: landing.model.exportWeight || '',
                faoArea: landing.model.faoArea || 'FAO27',
                dateLanded: landing.model.dateLanded ? landing.model.dateLanded : '',
                editMode,
              },
              dateValue: landing.model.dateLanded,
              product: item.product.id,
            };
          } else {
            return {
              ...initialState,
              product: item.product.id,
            };
          }
        }
      }

      return {
        ...initialState,
        product: productId,
      };
    };

    const hasLandingChanged = () =>
      props.landingId !== state.model.id ||
      props.editMode !== state.model.editMode;

    if (hasLandingChanged()) {
      return intialiseState(
        props.exportPayload,
        props.productId,
        props.landingId,
        props.editMode
      );
    } else {
      return {
        ...state,
      };
    }
  }

  render() {
    const {
      exportPayload = {},
      searchVessels,
      vesselSelected,
      landingFormRef,
      landingId,
      errors
    } = this.props;
    const faoAreas = [
      'FAO18',
      'FAO21',
      'FAO27',
      'FAO31',
      'FAO34',
      'FAO37',
      'FAO41',
      'FAO47',
      'FAO48',
      'FAO51',
      'FAO57',
      'FAO58',
      'FAO61',
      'FAO67',
      'FAO71',
      'FAO77',
      'FAO81',
      'FAO87',
      'FAO88',
    ];
    const productOptions = exportPayload.items
      ? exportPayload.items.map((item) => {
          return {
            value: item.product.id,
            label: `${item.product.species.label}, ${item.product.state.label}, ${item.product.presentation.label}, ${item.product.commodityCode}`,
          };
        })
      : [];

    const { model, product, dateValue } = this.state;
    const editMode = this.isEditMode(landingId, product);
    const submitText = editMode ? t('ccAddLandingUpdateLandingBtnLabel') : t('ccAddLandingAddLandingBtnLabel');

    const vesselLandedDate =
      model.dateLanded && model.dateLanded !== 'Invalid date' ? model.dateLanded : undefined;

    let dateLandedRestrictionError;
    if (errors.dateLandedError) {
      let params = {};
      const dateLandedErrArray = errors.dateLandedError.split('-');
      if (dateLandedErrArray[0] == 'ccAddLandingDateLandedRestrictedError') {
        params = { product: dateLandedErrArray[1] };
      } else if (
        dateLandedErrArray[0] ==
        'ccUploadFilePageTableDateLandedFutureMaximumDaysError'
      ) {
        params = { dynamicValue: dateLandedErrArray[1] };
      }

      dateLandedRestrictionError = t(dateLandedErrArray[0], params);
    }

    return (
      <form className="add-landings-form" tabIndex="0" ref={landingFormRef}>
        <Select
          label= {t('ccFavouritesPageProductTableHeaderTwo')}
          name="product"
          id="product"
          value={product || ''}
          error={t(errors.productError)}
          options={productOptions}
          defaultValue={product || ''}
          onChange={this.changeHandler}
          nullOption= {t('ccAddLandingNullOption')}
        />

        <DateFieldWithPicker
          id='dateLanded'
          errors={dateLandedRestrictionError || errors.dateLandedError}
          onDateChange={this.onDateChange}
          dateFormat='YYYY-MM-DD'
          date={dateValue}
          labelText={t('ccAddLandingDateLandedLabel')}
          labelTextClass='label-landings-form'
        >
        </DateFieldWithPicker>
        <LabelText className="label-landings-form">{t('ccAddLandingCatchAreaLabel')}</LabelText>
        {errors.faoAreaError && <ErrorText>{t(errors.faoAreaError)}</ErrorText>}
        <select
          className={`autocomplete__input--default faoArea ${errors.faoAreaError ? 'autocomplete__error' : 'autocomplete__input'}`}
          id="select-faoArea"
          name="faoArea"
          value={model.faoArea}
          onChange={this.changeHandler}
          style={{ backgroundColor: 'white' }}
        >
          {faoAreas.map((faoArea) => (
            <option key={faoArea} id={'faoArea_' + faoArea} value={faoArea}>
              {faoArea}
            </option>
          ))}
        </select>
        <LabelText className="label-landings-form">
          {t('ccAddLandingVesselNameLabel')}
        </LabelText>
        <GovukVesselsAutocomplete
          onChange={this.setVessel}
          error={errors}
          hideErrorMessage={false}
          search={searchVessels}
          selectedItemName={model.vessel.label || ''}
          searchResults={this.getItems(this.props.vesselOptions || [])}
          getItem={this.getItem}
          clearSearchResults={vesselSelected}
          controlName="vessel.vesselName"
          controlId="select-vessel"
          dateLanded={moment(vesselLandedDate)}
          hideBorder={true}
          translate={t}
        />
        <Details
          summary={t('ccAddLandingHelpSectionLinkText')}
          details={t('ccAddLandingHelpSectionContent')}
        />
        <WeightInput
          label={t('ccAddLandingExportWeightFieldLabel')}
          value={model.exportWeight}
          onChange={this.changeHandler}
          hint={t('ccAddLandingExportWeightFieldHint')}
          error={t(errors.exportWeightError)}
          unit={t('ccDirectLandingProductWeightTableExportWeightInputUnit')}
        />
        <GridRow style={{ marginBottom: '0' }}>
          <SecondaryButton
            type="button"
            id="cancel"
            name="cancel"
            value="cancel"
            onClick={this.cancelHandler}
          >
            {t('commonSecondaryButtonCancelButton')}
          </SecondaryButton>
          {(this.props.totalLandings < this.props.maxLandingsLimit ||
            editMode) && (
            <GridCol>
              <button
                id="submit"
                name="submit"
                onClick={this.addHandler}
                className="button"
              >
                {submitText}
              </button>
            </GridCol>
          )}
        </GridRow>
      </form>
    );
  }
}

export default withTranslation() (AddLandingsForm);
