import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Main,
  BackLink,
  Header,
  GridRow,
  GridCol,
  MultiChoice
} from 'govuk-react';

import {
  getStorageNotesFromRedis,
  saveStorageNotes,
  saveStorageNotesToRedis,
  clearStorageNotes
} from '../../actions';

import {clearPostcodeLookupAddress} from '../../actions/postcode-lookup.actions';

import PageTitle from '../../components/PageTitle';
import SelectRadio from '../../components/elements/SelectRadio';
import {
  ChangeLinkTag,
  SummaryCellKey,
  SummaryCellLink,
  SummaryRow,
  SummaryTable
} from '../../components/Summary';
import Form from '../../components/elements/Form';
import {
  onHandleErrorClick,
  scrollToErrorIsland,
  toGovukErrors
} from '../utils';
import ErrorIsland from '../../components/elements/ErrorIsland';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import HelpLink from '../../components/HelpLink';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';
import SecondaryButton from '../../components/elements/SecondaryButton';
import NotificationBanner from '../../components/NotificationBanner';
import {withTranslation} from 'react-i18next';
import BackToProgressLink from '../../components/BackToProgressLink';

class StorageFacilitiesPage extends React.Component {
  goBack(e, page) {
    e.preventDefault();
    const storageNotes = _.cloneDeep(this.props.storageNotes || {});
    this.props.save(storageNotes);
    this.props.history.push(page);
  }

  save(documentNumber) {
    return this.props.saveToRedis({
      data: this.props.storageNotes || {},
      currentUrl: `/create-storage-document/${documentNumber}/you-have-added-a-storage-facility`,
      documentNumber: documentNumber
    });
  }

  async onContinue() {
    const { storageNotes, match, route } = this.props;
    const { addAnotherStorageFacility } = storageNotes;
    const documentNumber = match.params.documentNumber;

    if (addAnotherStorageFacility === 'Yes') {
      const storageNotesClone = _.cloneDeep((storageNotes));
      storageNotesClone.errors = {};
      this.props.save(storageNotesClone);
      this.props.history.push(`/create-storage-document/${documentNumber}/add-storage-facility-details/${storageNotes.storageFacilities.length}`
      );
    } else {
      const response = await this.save(documentNumber);

      if (!_.isEmpty(response.errors)) {
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

      this.props.history.push(route.nextUri.replace(':documentNumber', documentNumber));
    }
  }

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const { saveAsDraftUri } = this.props.route;
    const { documentNumber } = this.props.match.params;

    await this.save(documentNumber);

    this.props.history.push(saveAsDraftUri);
  }

  removeStorageFacility(e, index) {
    e.preventDefault();
    const storageNotes = _.cloneDeep(this.props.storageNotes);
    storageNotes.storageFacilities.splice(index, 1);
    this.props.save(storageNotes);
    this.props.clearPostcodeLookupAddress();
  }


  componentDidUpdate() {
    const { storageNotes } = this.props;

    if (storageNotes.unauthorised === true) {
      this.props.history.push('/forbidden');
    }
  }

  async componentDidMount() {
    window.scrollTo(0, 0);

    const documentNumber = this.props.match.params.documentNumber;
    await this.props.getFromRedis(documentNumber);

    if (!this.hasRequiredData()) {
      this.displayAddStorageFacilityPage(documentNumber);
    }
  }

  componentWillUnmount() {
    this.props.clear();
  }


  hasRequiredData() {
    const { storageFacilities } = this.props.storageNotes;
    return !_.isEmpty(storageFacilities) && Array.isArray(storageFacilities) && storageFacilities.length > 0;
  }

  displayAddStorageFacilityPage(documentNumber) {
    this.props.history.push(`/create-storage-document/${documentNumber}/add-storage-facility-details`);
  }

  renderAddNewOptions = () => {
    const { storageNotes, t } = this.props;
    const types = ['Yes', 'No'];
    return types.map((type) => {
      return (
        <SelectRadio
          key={type}
          id={`addAnotherStorageFacility${type}`}
          value={type}
          name="addAnotherStorageFacility"
          defaultChecked={
            storageNotes && type === storageNotes.addAnotherStorageFacility
          }
          inline
        >
          {t(type)}
        </SelectRadio>
      );
    });
  };

  render() {
    const { storageNotes, history, route, match, t } = this.props;
    let { journey, progressUri, path } = route;
    const title = (storageNotes.storageFacilities.length > 1 ? t('sdYouAddedStorageFacilityMultiStorageTitle', {count: storageNotes.storageFacilities.length}) : t('sdYouAddedStorageFacilitySingleStorageTitle', {count: storageNotes.storageFacilities.length}));
    const errors =
      (storageNotes.errorsUrl === history.location.pathname &&
        storageNotes.errors) ||
      {}; // only display errors for this URL
    const documentNumber = match.params.documentNumber;
    let backLink = (storageNotes.storageFacilities.length) ? 'add-storage-facility-details/' : 'add-products-to-this-export';

    backLink = `${documentNumber}/${backLink}`;

    const saveAsDraftFormActionUrl = `/orchestration/api/v1/storageNotes/saveAndValidate?saveAsDraftUrl=${route.saveAsDraftUri}&c=/create-storage-document/${documentNumber}/you-have-added-a-storage-facility`;

    const errorsForIsland = toGovukErrors(errors).map(e => {
      const target = e.targetName.replace(/-facility([A-Za-z])+$/, '');

      return {
        ...e,
        key: target,
        targetName: target
      };
    });

    return (
      <Main className="create-storage-document">
        <PageTitle
          title={`${!_.isEmpty(errors) ? 'Error: ' : ''}${title} - ${t(this.props.route.title)}`}
        />
        <GridRow>
          <GridCol>
            <BackLink
              href={`/orchestration/api/v1/storageNotes/back?n=/create-storage-document/${backLink}`}
              onClick={e => this.goBack(e, `/create-storage-document/${backLink}`)}
            >{t('commonBackLinkBackButtonLabel')}
            </BackLink>
            {storageNotes.storageFacilities.some(facility => facility._facilityUpdated) && (
              <NotificationBanner
               header={t('commonImportant')}
                messages={[t('sdYouAddedStorageNotificationText')]} />
            )}
            {errors &&
              <ErrorIsland errors={errorsForIsland} onHandleErrorClick={onHandleErrorClick}/>
            }
            <Header>{title}</Header>
          </GridCol>
        </GridRow>
        <Form
          action="/orchestration/api/v1/storageNotes/saveAndValidate"
          currentUrl={`/create-storage-document/${documentNumber}/you-have-added-a-storage-facility`}
          onSubmit={e => e.preventDefault()}>
          <Header level="2">{t('sdCommonFacilityNameTitle')}</Header>
          {storageNotes.storageFacilities.map((facility, index) => {
            const { facilityName } = facility || {};

            const storageFacilityErrors = Object.keys(errors)
              .filter(key => key.match(`storageFacilities-${index}-`))
              .reduce((obj, key) => {
                obj[key] = errors[key];
                return obj;
              }, {});

            const hasErrors = !_.isEmpty(storageFacilityErrors);
            const tableClass = hasErrors ? 'form-group-error' : '';

            const hiddenText = `${t('sdFacilityDetailsVHiddenChangeText')} ${facilityName}`;
            return (
              <Fragment key={index}>
                <SummaryTable>
                  <SummaryRow id={`storageFacilities-${index}`} className="rowWithValidation">
                    <SummaryCellKey id={`storageFacilities-${index}-facilityName`}>
                      <span className={tableClass}>
                        {hasErrors &&
                          <span className="error-message">
                            {toGovukErrors(storageFacilityErrors).map(e => e.message)}<br />
                          </span>
                        }
                        {facilityName}
                      </span>
                    </SummaryCellKey>
                    <SummaryCellLink>
                      <ChangeLinkTag
                        id={`edit-facility-${index}`}
                        to={`/create-storage-document/${documentNumber}/add-storage-facility-details/${index}`}>
                        {t('commonEditLink')}
                        <span className="govuk-visually-hidden">
                          { hiddenText }
                        </span>
                      </ChangeLinkTag>
                    </SummaryCellLink>
                    <SummaryCellLink>
                      {storageNotes.storageFacilities.length > 1 && (
                        <SecondaryButton
                          id={`remove-facility-${index}`}
                          onClick={e => this.removeStorageFacility(e, index)}
                          formAction={`/orchestration/api/v1/storageNotes/removeKey?n=/create-storage-document/${documentNumber}/add-storage-facility-details&key=storageFacilities.${index}`}>
                          {t('commonRemoveButton')}
                          <span className="govuk-visually-hidden">
                            { hiddenText }
                          </span>
                        </SecondaryButton>
                      )}
                    </SummaryCellLink>
                  </SummaryRow>
                </SummaryTable>
              </Fragment>
            );
          })}

          <br />
          <br />
          <GridRow>
            <GridCol>
              <Header level="2">{t('sdYouAddedStorageFacilityAddAnotherStorageTitle')}</Header>
              <MultiChoice
                meta={{ touched: true, error: errors.addAnotherStorageFacility }}
                id="addAnotherStorageFacility"
                onChange={e => {
                  const newStorageNotes = _.cloneDeep(this.props.storageNotes);
                  newStorageNotes.addAnotherStorageFacility = e.target.value;
                  this.props.save(newStorageNotes);
                }}
              >
                <fieldset>
                  <legend className="visually-hidden">{t('sdYouAddedStorageFacilityAddAnotherStorageTitle')}</legend>
                  {this.renderAddNewOptions()}
                </fieldset>
              </MultiChoice>
            </GridCol>
          </GridRow>
          <GridRow>
            <SaveAsDraftButton formactionUrl={saveAsDraftFormActionUrl} onClick={this.onSaveAsDraft} />
            <input type="hidden" name="journey" value={journey} />
            <input type="hidden" name="currentUri" value={path} />
            <ContinueButton
              type="submit"
              id="continue"
              onClick={() => this.onContinue()}
            >
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
  return {
    storageNotes: state.storageNotes
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
    clearPostcodeLookupAddress
  }
  )(withTranslation() (StorageFacilitiesPage))
);

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
