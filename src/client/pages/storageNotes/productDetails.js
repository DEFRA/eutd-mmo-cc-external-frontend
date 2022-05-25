import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import SpeciesAutocomplete from '../../components/SpeciesAutocomplete.js';

import { Main, GridRow, GridCol, Header, BackLink, InputField } from 'govuk-react';

import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import {
  toGovukErrors,
  onHandleErrorClick,
  scrollToErrorIsland
} from '../utils';
import ErrorIsland from '../../components/elements/ErrorIsland';
import PageTitle from '../../components/PageTitle';
import Form from '../../components/elements/Form';
import {
  getStorageNotesFromRedis,
  saveStorageNotes,
  saveStorageNotesToRedis,
  clearStorageNotes
} from '../../actions';

import SpeciesDetails from '../../components/elements/SpeciesDetails';
import HelpLink from '../../components/HelpLink';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';
import { getAllFish } from '../../actions';
import DateFieldWithPicker from '../../components/DateFieldWithPicker.js';
import { withTranslation } from 'react-i18next';
import BackToProgressLink from '../../components/BackToProgressLink';
class CatchDetailsPage extends React.Component {

  state = {};

  constructor(props) {
    super(props);
    this.setSpecies = this.setSpecies.bind(this);
    this.state = this.init(props.storageNotes, props);
  }

  init(data, props) {
    const storageNotes = _.cloneDeep(data || {});
    const index = +(props.match.params.productIndex) || 0;
    if (storageNotes.catches && index >= storageNotes.catches.length) {
      storageNotes.catches.push({}); // add new entry if needed
    }

    return ({
      index,
      storageNotes,
      errors: storageNotes.errors || {},
      species: '',
      scientificName: '',
      selectedDateOfUnloading: storageNotes.catches && storageNotes.catches[index] ? storageNotes.catches[index].dateOfUnloading : ''
    });

  }

  redirectToForbidden() {
    this.props.history.push('/forbidden');
  }
  componentDidUpdate() {
    const { storageNotes } = this.props;

    if (storageNotes.unauthorised === true) {
      this.redirectToForbidden();
    }
  }

  async componentDidMount() { // js land
    window.scrollTo(0, 0);

    const { documentNumber } = this.props.match.params;
    let data = await this.props.getFromRedis(this.props.match.params.documentNumber) || {};

    this.setState(this.init(data, this.props));

    const { index, storageNotes } = this.state;
    const product = storageNotes.catches[index];

    if (product === undefined) {
      this.props.history.push(`/create-storage-document/${documentNumber}/you-have-added-a-product`);
    }

    await Promise.all([
      this.props.getAllFish()
    ]);
  }

  componentWillUnmount() {
    this.props.clear();
  }

  async save(nextUri) {
    const { index } = this.state;
    const { documentNumber } = this.props.match.params;

    const currentUrl = this.props.route.firstProduct
      ? `/create-storage-document/${documentNumber}/add-product-to-this-consignment`
      : `/create-storage-document/${documentNumber}/add-product-to-this-consignment/${index}`;

    const { saveAsDraftUri } = this.props.route;
    const isCatchDetailsSavedAsDraft = nextUri === saveAsDraftUri ? true : false;
    const storageNotes = await this.props.saveToRedis({
      saveToRedisIfErrors: isCatchDetailsSavedAsDraft,
      data: this.state.storageNotes,
      currentUrl: currentUrl,
      documentNumber: documentNumber
    });

    if (!isCatchDetailsSavedAsDraft && !_.isEmpty(storageNotes.errors)) {
      this.setState({
        errors: storageNotes.errors,
        errorsUrl: storageNotes.errorsUrl
      });
      scrollToErrorIsland();
      setTimeout(
        () =>
          document
            .getElementById('errorIsland')
            .scrollIntoView({ behavior: 'smooth' }),
        0
      );
      return;
    }

    this.props.history.push(nextUri);
  }

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const { saveAsDraftUri } = this.props.route;
    await this.save(saveAsDraftUri);
  }

  goBack(e, page) {
    e.preventDefault();
    const storageNotes = _.cloneDeep(this.props.storageNotes);
    storageNotes.errors = {};
    this.props.save(storageNotes);
    this.props.history.push(page);
  }


  setSpecies(speciesName, speciesObj) {
    // the species code is generated as id in getItems, that's what we are looking up here
    this.setState({ species: speciesName, speciesCode: speciesObj ? speciesObj.faoCode : speciesName, scientificName: speciesObj?.scientificName }, function () {
      this.onChange(speciesName, 'product');
    });
  }

  onChange(e, name) {
    const { storageNotes, index, scientificName } = this.state;
    const ctch = storageNotes.catches[index];

    const value =  e.target ? e.target.value : null;

    if (name === 'product') {
      ctch[name] = e;
      ctch['scientificName'] = scientificName;
    }else{
      ctch[name] = value;
    }

    this.setState({ storageNotes });
  }

  getErrorsObject(error) {
    let errorObject = {};
    if(!_.isEmpty(error)) {
      Object.keys(error).forEach(key => {
        return errorObject[key] = this.getExtractedError(error[key]);
      });
    }
    return errorObject;
  }

  getExtractedError(error) {
    const {t} = this.props;
    if (!_.isEmpty(error)) {
      const splitDynamicErrors = error.split('-');
      if (splitDynamicErrors.length > 0) {
        return t(splitDynamicErrors[0], {CONSTANT_VALUE: splitDynamicErrors[1]});
      }
    }
    return t(error);
  }

  render = () => {
    const { history, route, match, t } = this.props;
    const { storageNotes, errors, errorsUrl, index, selectedDateOfUnloading } = this.state;
    let { previousUri, progressUri, path } = route;
    const { journey, saveAsDraftUri, title } = route;

    path = path.replace(':productIndex', index);
    previousUri = previousUri.replace(':documentNumber', match.params.documentNumber);

    if (!storageNotes || !storageNotes.addAnotherProduct) return null;
    const ctch = storageNotes.catches[index];
    if (!ctch) return null;
    const {
      product = '',
      commodityCode = '',
      certificateNumber = '',
      productWeight = '',
      weightOnCC = '',
      placeOfUnloading = '',
      transportUnloadedFrom = ''
    } = ctch;

    const errs = (errorsUrl === history.location.pathname && errors) || {}; // only display errors for this URL
    const saveAsDraftFormActionUrl = `/orchestration/api/v1/storageNotes/saveAndValidate?saveAsDraftUrl=${saveAsDraftUri}&c=/create-storage-document/add-product-to-this-consignment/${index}&n=${'/create-storage-document/you-have-added-a-product'}`;

    return (
      <Main>
        <PageTitle title={`${!_.isEmpty(errors) ? 'Error: ' : ''}${t('sdAddProductToThisConsignmentPageTitle')} - ${t(title)}`} />
        <ErrorIsland
          errors={toGovukErrors(this.getErrorsObject(errs))}
          onHandleErrorClick={onHandleErrorClick}
        />
        <GridRow>
          <GridCol>
            <BackLink href={`/orchestration/api/v1/processingStatement/back?n=${previousUri}`}
              onClick={(e) => this.goBack(e, previousUri)}
            >{t('commonBackLinkBackButtonLabel')}</BackLink>
            <Header>{ t('sdAddProductToThisConsignmentPageTitle') }</Header>
          </GridCol>
        </GridRow>
        <Form
          action="/orchestration/api/v1/storageNotes/saveAndValidate"
          currentUrl={`/create-storage-document/${match.params.documentNumber}/add-product-to-this-consignment/${index}`}
          nextUrl={`/create-storage-document/${match.params.documentNumber}/you-have-added-a-product`}
          onSubmit={e => e.preventDefault()}
        >
          <GridRow>
            <GridCol>
              <div className={'input-species-ps properties-group autocomplete-sd ' + ((errors[`catches-${index}-product`]) ? 'error' : '')}>
                <SpeciesAutocomplete
                  hintText={t('sdAddProductToThisConsignmentAutoCompleteHint')}
                  defaultSelectMessage=''
                  defaultValue={product}
                  label={t('sdAddProductToThisConsignmentAutoCompleteLabel')}
                  id={`catches-${index}-product`}
                  name={`catches.${index}.product`}
                  errorName="autoFillError"
                  onChange={this.setSpecies}
                  error={{ errors: [{ targetName: `catches.${index}.product`, text: t(errors[`catches-${index}-product`]) }], autoFillError: t(errors[`catches-${index}-product`]) }}
                  index={index}
                  unauthorised={this.props.storageNotes.unauthorised}
                  htmlFor={`catches.${index}.product`}
                />
                <input type="hidden" name="productCode" value={this.state.species || ''} />
              </div>
              <br />
              <SpeciesDetails exemptFrom={t('sdAddProductToConsignmenStorageDocument')} />
              <br/>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol columnTwoThirds>
              <InputField
                style={{ marginTop: '-1em' }}
                id={`catches-${index}-commodityCode`}
                htmlFor={`catches.${index}.commodityCode`}
                meta={{ error: t(errors[`catches-${index}-commodityCode`]), touched: true }}
                input={{ autoComplete: 'off', className: 'formControl mediumInput', value: commodityCode, id: `catches.${index}.commodityCode`, name: `catches.${index}.commodityCode`, onChange: (e) => this.onChange(e, 'commodityCode') }}>{t('commonCommodityCodeLabel')}</InputField>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol columnTwoThirds>
              <InputField
                id={`catches-${index}-productWeight`}
                htmlFor={`catches.${index}.productWeight`}
                meta={{ error: t(errors[`catches-${index}-productWeight`]), touched: true }}
                input={{ autoComplete: 'off', className: 'formControl smallInput', value: productWeight, id: `catches.${index}.productWeight`, name: `catches.${index}.productWeight`, onChange: (e) => this.onChange(e, 'productWeight') }}>{t('sdAddProductToThisConsignmentExportWeightLabel')}</InputField>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol>
              <Header>{t('sdAddProductToThisConsignmentUKEntryDocumentTitle')}</Header>
              <p style={{ color: '#6f777b' }}>{t('sdAddProductToThisConsignmentUKEntryDocumentParagraph')}</p>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol columnTwoThirds>
              <DateFieldWithPicker
                id={`catches-${index}-dateOfUnloading`}
                errors={t(errors[`catches-${index}-dateOfUnloading`])}
                onDateChange={(e)=>this.onChange(e, 'dateOfUnloading')}
                name="dateOfUnloading"
                dateFormat='DD/MM/YYYY'
                date={selectedDateOfUnloading}
                labelText={t('sdAddProductToThisConsignmentDatePickerLabel')}
                labelTextClass='label-product-details-form'
              />
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol columnTwoThirds>
              <InputField
                id={`catches-${index}-placeOfUnloading`}
                htmlFor={`catches.${index}.placeOfUnloading`}
                style={{ marginTop: '-2em' }}
                meta={{ error: t(errors[`catches-${index}-placeOfUnloading`]), touched: true }}
                hint={t('sdAddProductToThisConsignmentPortHint')}
                input={{ autoComplete: 'off', className: 'formControl mediumInput', value: placeOfUnloading, id: `catches.${index}.placeOfUnloading`, name: `catches.${index}.placeOfUnloading`, onChange: (e) => this.onChange(e, 'placeOfUnloading') }}>{t('sdAddProductToThisConsignmentPortLabel')}</InputField>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol columnTwoThirds>
              <InputField
                id={`catches-${index}-transportUnloadedFrom`}
                htmlFor={`catches.${index}.transportUnloadedFrom`}
                meta={{ error: this.getExtractedError(errors[`catches-${index}-transportUnloadedFrom`]), touched: true }}
                hint={t('sdAddProductToThisConsignmentTransportHint')}
                input={{ autoComplete: 'off', className: 'formControl', value: transportUnloadedFrom, id: `catches.${index}.transportUnloadedFrom`, name: `catches.${index}.transportUnloadedFrom`, onChange: (e) => this.onChange(e, 'transportUnloadedFrom') }}>{t('sdAddProductToThisConsignmentTransportLabel')}</InputField>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol columnTwoThirds>
              <InputField
                id={`catches-${index}-certificateNumber`}
                htmlFor={`catches.${index}.certificateNumber`}
                meta={{ error: this.getExtractedError(errors[`catches-${index}-certificateNumber`]), touched: true }}
                hint={t('sdAddProductToThisConsignmentDocumentNumberHint')}
                input={{ autoComplete: 'off', maxLength: '54', className: 'formControl largeInput', value: certificateNumber, id: `catches.${index}.certificateNumber`, name: `catches.${index}.certificateNumber`, onChange: (e) => this.onChange(e, 'certificateNumber') }}>{t('commonDocumentNumber')}</InputField>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol columnTwoThirds>
              <InputField
                id={`catches-${index}-weightOnCC`}
                htmlFor={`catches.${index}.weightOnCC`}
                meta={{ error: t(errors[`catches-${index}-weightOnCC`]), touched: true }}
                input={{ autoComplete: 'off', className: 'formControl smallInput', value: weightOnCC, id: `catches.${index}.weightOnCC`, name: `catches.${index}.weightOnCC`, onChange: (e) => this.onChange(e, 'weightOnCC') }}>{t('sdAddProductToThisConsignmentWeightOnDocumentLabel')}</InputField>
            </GridCol>
          </GridRow>

          <GridRow>
            <SaveAsDraftButton formactionUrl={saveAsDraftFormActionUrl} onClick={this.onSaveAsDraft} />
            <input type="hidden" name="journey" value={journey} />
            <input type="hidden" name="currentUri" value={path} />
            <ContinueButton id="continue" onClick={() => this.save(`/create-storage-document/${match.params.documentNumber}/you-have-added-a-product`)}>
              {t('commonContinueButtonSaveAndContinueButton')}
            </ContinueButton>
          </GridRow>
        </Form>
        <BackToProgressLink
          progressUri={progressUri}
          documentNumber={match.params.documentNumber}
        />
        <HelpLink journey={journey} />
      </Main>
    );
  };
}

function mapStateToProps(state) {
  return {
    storageNotes: state.storageNotes
  };
}

function loadData(store) {
  return store.dispatch(getAllFish())
    .then(store.dispatch(getStorageNotesFromRedis(this.documentNumber)));
}

export const component = withRouter(
  connect(
    mapStateToProps, {
    save: saveStorageNotes,
    saveToRedis: saveStorageNotesToRedis,
    getFromRedis: getStorageNotesFromRedis,
    clear: clearStorageNotes,
    getAllFish
  }
  )(withTranslation() (CatchDetailsPage))
);

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
