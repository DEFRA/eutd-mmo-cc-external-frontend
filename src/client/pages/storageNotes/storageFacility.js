import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {withRouter} from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import {
  InputField,
  Header,
  GridRow,
  GridCol,
  Main,
  BackLink,
} from 'govuk-react';

import {
  getStorageNotesFromRedis,
  saveStorageNotes,
  saveStorageNotesToRedis,
  clearStorageNotes,
  changeStorageFacilityAddress
} from '../../actions';
import {clearPostcodeLookupAddress} from '../../actions/postcode-lookup.actions';

import PageTitle from '../../components/PageTitle';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import ErrorIsland from '../../components/elements/ErrorIsland';
import {
  onHandleErrorClick,
  scrollToErrorIsland,
  toGovukErrors
} from '../utils';
import Form from '../../components/elements/Form';
import HelpLink from '../../components/HelpLink';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';
import  LookupAddress  from '../../components/LookupAddress';
import NotificationBanner from '../../components/NotificationBanner';
import BackToProgressLink from '../../components/BackToProgressLink';

class StorageFacility extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.init(props.storageNotes, props);
  }

  init(data, props) {

    const storageNotes = _.cloneDeep(data || {});
    const index = +(props.match.params.facilityIndex) || 0;

    if (storageNotes.storageFacilities && index >= storageNotes.storageFacilities.length) {
      storageNotes.storageFacilities.push({});
    }

    const postcodeLookupAddress = (this.props.postcodeLookup && this.props.postcodeLookup.postcodeLookupAddress)
      ? this.props.postcodeLookup.postcodeLookupAddress
      : {};

    if (!_.isEmpty(postcodeLookupAddress)) {
      storageNotes.storageFacilities[index] = {
        ...storageNotes.storageFacilities[index],
        ...postcodeLookupAddress
      };
    }

    return ({
      index,
      storageNotes,
      errors: storageNotes.errors || {},
      errorsUrl: storageNotes.errorsUrl,
      species: ''
    });

  }

  goBack(e, page) {
    e.preventDefault();
    const storageNotesClone = _.cloneDeep(this.props.storageNotes || {});
    storageNotesClone.errors = {};
    this.props.save(storageNotesClone);
    this.props.history.push(page);
  }

  onChange(e, name) {
    const {index, storageNotes} = this.state;
    if(storageNotes && storageNotes.storageFacilities[index]){
      storageNotes.storageFacilities[index][name] = e.target.value;
      this.props.save(storageNotes);
      this.setState({unsavedFacilityName: e.target.value});
      this.setState({storageNotes});
    }
  }

  async onContinue(nextUri) {
    const {index} = this.state;
    const {documentNumber} = this.props.match.params;

    const currentUrl = this.props.route.firstStorageFacility ?
      `/create-storage-document/${documentNumber}/add-storage-facility-details`
      : `/create-storage-document/${documentNumber}/add-storage-facility-details/${index}`;

    const {saveAsDraftUri} = this.props.route;
    const isStorageFacilitySavedAsDraft = nextUri === saveAsDraftUri ? true : false;
    const storageNotes = await this.props.saveToRedis({
      saveToRedisIfErrors: isStorageFacilitySavedAsDraft,
      data: this.state.storageNotes,
      currentUrl: currentUrl,
      documentNumber: documentNumber,
    });

    if (!isStorageFacilitySavedAsDraft && !_.isEmpty(storageNotes.errors)) {
      this.setState({
        errors: storageNotes.errors,
        errorsUrl: storageNotes.errorsUrl
      });
      scrollToErrorIsland();
      setTimeout(
        () =>
          document
            .getElementById('errorIsland')
            .scrollIntoView({behavior: 'smooth'}),
        0
      );
      return;
    }
    this.props.clearPostcodeLookupAddress();
    this.props.history.push(nextUri.replace(':documentNumber', documentNumber));
  }

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const {saveAsDraftUri} = this.props.route;
   await this.onContinue(saveAsDraftUri);
  }

  unauthorised() {
    this.props.history.push('/forbidden');
  }

  componentDidUpdate() {
    const { storageNotes } = this.props;

    if (storageNotes.unauthorised === true) {
      this.unauthorised();
    }
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    const {documentNumber} = this.props.match.params;

    if (!this.props.storageNotes.changeAddress) {
      const data = await this.props.getFromRedis(this.props.match.params.documentNumber);
      this.setState(this.init(data, this.props));
    }
    const {index, storageNotes} = this.state;
    const facility = storageNotes.storageFacilities[index];
    if (facility === undefined) {
      this.props.history.push(`/create-storage-document/${documentNumber}/you-have-added-a-storage-facility`);
    }
  }

  componentWillUnmount() {
    this.props.clear();
  }

  render() {

    const {history, route, match, t} = this.props;

    const {journey, saveAsDraftUri, path, changeAddressUri, progressUri} = route;
    const {documentNumber} = match.params;
    const {errors, errorsUrl, index, storageNotes} = this.state;
    const facility = storageNotes.storageFacilities && storageNotes.storageFacilities[index];

    const currentUri = path.replace(':facilityIndex', index);
    const changeAddressLink = changeAddressUri.replace(':documentNumber', documentNumber).replace(':facilityIndex', parseInt(index));

    if (!facility) return null;
    const {
      facilityName = '',
      facilityAddressOne = '',
      facilityTownCity = '',
      facilityPostcode = '',
    } = facility;

    const errs = (errorsUrl === history.location.pathname && errors) || {}; // only display errors for this URL
    const backLink = this.props.route.firstStorageFacility
      ? `${documentNumber}/you-have-added-a-product`
      : `${documentNumber}/you-have-added-a-storage-facility`;

    const hasFacilityAddressOne = () => storageNotes.changeAddress
      && storageNotes.storageFacilities
      && storageNotes.storageFacilities[index]
      && storageNotes.storageFacilities[index].facilityAddressOne;

    const hasFacilityUpdatedFlag = () => storageNotes.storageFacilities
      && storageNotes.storageFacilities[index]
      && storageNotes.storageFacilities[index]._facilityUpdated;

    const facilitiesUpdated = !hasFacilityAddressOne()
      && hasFacilityUpdatedFlag();

    const saveAsDraftFormActionUrl = `/orchestration/api/v1/storageNotes/saveAndValidate?saveAsDraftUrl=${saveAsDraftUri}&c=/create-storage-document/add-storage-facility-details/${index}&n=/create-storage-document/you-have-added-a-storage-facility`;

    return (
      <Main className="create-storage-document">
        <ErrorIsland
          errors={toGovukErrors(errs)}
          onHandleErrorClick={onHandleErrorClick}
        />
        <PageTitle
          title={`${
            !_.isEmpty(errors) ? 'Error: ' : ''
          }${t('sdAddStorageDetailsHeader')} - ${t('sdCommonTitle')}`}
        />

        <GridRow>
          <GridCol>
            <BackLink
              href={`/orchestration/api/v1/storageNotes/back?n=/create-storage-document/${backLink}`}
              onClick={(e) =>
                this.goBack(e, `/create-storage-document/${backLink}`)
              }
            >
              {t('commonBackLinkBackButtonLabel')}
            </BackLink>
            {facilitiesUpdated && (
              <NotificationBanner
              header={t('commonImportant')}
              messages={[t('sdYouAddedStorageNotificationText')]} />
            )}
            <Header>{t('sdAddStorageDetailsHeader')}</Header>
          </GridCol>
        </GridRow>
        <Form
          action="/orchestration/api/v1/storageNotes/saveAndValidate"
          currentUrl={`/create-storage-document/${documentNumber}/add-storage-facility-details/${index}`}
          nextUrl={`/create-storage-document/${documentNumber}/you-have-added-a-storage-facility`}
          onSubmit={(e) => e.preventDefault()}
        >
          <GridRow>
            <GridCol columnTwoThirds>
              <InputField
                id={`storageFacilities-${index}-facilityName`}
                htmlFor={`storageFacilities.${index}.facilityName`}
                meta={{
                  error: t(errs[`storageFacilities-${index}-facilityName`]),
                  touched: true,
                }}
                input={{
                  autoComplete: 'off',
                  className: 'formControl',
                  id: `storageFacilities.${index}.facilityName`,
                  name: `storageFacilities.${index}.facilityName`,
                  value: _.isEmpty(facilityName) ? storageNotes.unsavedFacilityName : facilityName,
                  onChange: (e) => this.onChange(e, 'facilityName'),
                }}
              >
                {t('sdCommonFacilityNameTitle')}
              </InputField>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol columnTwoThirds>
              <LookupAddress
                addressOne={facilityAddressOne}
                townCity={facilityTownCity}
                postcode={facilityPostcode}
                addressType='storage facility'
                changeAddressLink={changeAddressLink}
                changeAddressHandler={this.props.changeStorageFaclityAddress}
                unsavedFacilityName={this.state.unsavedFacilityName}
              />
            </GridCol>
          </GridRow>

          <GridRow>
            <SaveAsDraftButton
              formactionUrl={saveAsDraftFormActionUrl}
              onClick={this.onSaveAsDraft}
            />
            <input type="hidden" name="journey" value={journey} />
            <input type="hidden" name="currentUri" value={currentUri} />
            <ContinueButton
              type="submit"
              id="continue"
              onClick={() =>
                this.onContinue(
                  `/create-storage-document/${documentNumber}/you-have-added-a-storage-facility`
                )
              }
            >
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
  }
}

function mapStateToProps(state) {
  return {
    storageNotes: state.storageNotes,
    postcodeLookup: state.postcodeLookup
  };
}

function loadData(store) {
  return store.dispatch(getStorageNotesFromRedis(this.documentNumber));
}

export const component = withRouter(
  connect(mapStateToProps, {
    save: saveStorageNotes,
    saveToRedis: saveStorageNotesToRedis,
    getFromRedis: getStorageNotesFromRedis,
    clear: clearStorageNotes,
    clearPostcodeLookupAddress,
    changeStorageFaclityAddress: changeStorageFacilityAddress
  }
  )(withTranslation()(StorageFacility))
);

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
