import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Main,
  BackLink,
  Header,
  GridRow,
  GridCol, MultiChoice
} from 'govuk-react';

import {
  getStorageNotesFromRedis,
  saveStorageNotes,
  saveStorageNotesToRedis,
  clearStorageNotes
} from '../../actions';

import PageTitle from '../../components/PageTitle';

import SelectRadio from '../../components/elements/SelectRadio';
import SecondaryButton from '../../components/elements/SecondaryButton';
import {
  ChangeLinkTag,
  SummaryCellKey,
  SummaryCellLink,
  SummaryRow,
  SummaryTable
} from '../../components/Summary';
import Form from '../../components/elements/Form';
import { onHandleErrorClick, scrollToErrorIsland, toGovukErrors } from '../utils';
import ErrorIsland from '../../components/elements/ErrorIsland';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import HelpLink from '../../components/HelpLink';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';
import {withTranslation} from 'react-i18next';
import BackToProgressLink from '../../components/BackToProgressLink';

class ProductDetails extends React.Component {

  goBack(e, page) {
    e.preventDefault();
    const storageNotes = _.cloneDeep((this.props.storageNotes || {}));
    this.props.save(storageNotes);
    this.props.history.push(page);
  }

  save () {
    const documentNumber = this.props.match.params.documentNumber;
    return this.props.saveToRedis({
      data: this.props.storageNotes || {},
      currentUrl: `/create-storage-document/${documentNumber}/you-have-added-a-product`,
      documentNumber: documentNumber
    });
  }
  async onContinue() {
    const { storageNotes, match } = this.props;
    const { addAnotherProduct } = storageNotes;
    const documentNumber = match.params.documentNumber;

    if (addAnotherProduct === 'Yes') {
      const storageNotesClone = _.cloneDeep((storageNotes));
      storageNotesClone.errors = {};
      this.props.save(storageNotesClone);
      this.props.history.push(`/create-storage-document/${documentNumber}/add-product-to-this-consignment/${storageNotes.catches.length}`);
    }
    else {
      const doc = await this.save();

      if (!_.isEmpty(doc.errors)) {
        scrollToErrorIsland();
        setTimeout(() => document.getElementById('errorIsland').scrollIntoView({ behavior: 'smooth' }), 0);
        return;
      }

      this.props.history.push(`/create-storage-document/${documentNumber}/add-storage-facility-details`);
    }
  }

  hasRequiredData() {
    const { catches } = this.props.storageNotes;
    return !_.isEmpty(catches) && Array.isArray(catches) && catches.length > 0;
  }

  renderAddProductToThisConsignmentPage() {
    const { match } = this.props;
    const documentNumber = match.params.documentNumber;
    this.props.history.push(`/create-storage-document/${documentNumber}/add-product-to-this-consignment`);
  }

  async componentDidMount() {
    window.scrollTo(0, 0);

    await this.props.getFromRedis(this.props.match.params.documentNumber);

    // route history may be empty so check if store has requiredData for this page
    if (!this.hasRequiredData()) {
     this.renderAddProductToThisConsignmentPage();
    }
  }

  componentWillUnmount() {
    this.props.clear();
  }

  componentDidUpdate() {
    const { storageNotes } = this.props;

    if (storageNotes.unauthorised === true) {
      this.props.history.push('/forbidden');
    }
  }


  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const { saveAsDraftUri } = this.props.route;
    await this.save();
    this.props.history.push(saveAsDraftUri);
  }

  removeProduct(e, index) {
    e.preventDefault();
    const storageNotes = _.cloneDeep((this.props.storageNotes || {}));
    storageNotes.catches.splice(index, 1);
    this.props.save(storageNotes);
  }

  renderAddNewOptions = () => {
    const { storageNotes, t } = this.props;
    const types = ['Yes', 'No'];
    return types.map((type) => {
      return (
        <SelectRadio
          key={type}
          id={`addAnotherProduct${type}`}
          value={type}
          name="addAnotherProduct"
          defaultChecked={
            storageNotes && type == storageNotes.addAnotherProduct
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

    const title = (storageNotes.catches.length > 1 ? t('sdYouAddedProductAddedMultiProductsTitle', {count: storageNotes.catches.length}) : t('sdYouAddedProductAddedSingleProductsTitle', {count: storageNotes.catches.length}));
    const errors = (storageNotes.errorsUrl === history.location.pathname && storageNotes.errors) || {}; // only display errors for this URL
    const documentNumber = match.params.documentNumber;

    const backLink = route.previousUri.replace(':documentNumber', documentNumber);
    const saveAsDraftFormActionUrl = `/orchestration/api/v1/storageNotes/saveAndValidate?saveAsDraftUrl=${route.saveAsDraftUri}&c=${path}`;
    const productsAddedError = Object.keys(errors)
    .filter(key => key === 'addAnotherProduct')
    .reduce((obj, key) => {
      obj[key] = errors[key];
      return obj;
    }, {});

    return (
      <Main>
        <ErrorIsland errors={toGovukErrors(productsAddedError)} onHandleErrorClick={onHandleErrorClick}/>
        <PageTitle title={`${!_.isEmpty(errors) ? 'Error: ' : ''}${title} - ${t(this.props.route.title)}`} />
        <GridRow>
          <GridCol>
            <BackLink href={`/orchestration/api/v1/storageNotes/back?n=${backLink}`}
              onClick={(e) => this.goBack(e, backLink)}
            >{t('commonBackLinkBackButtonLabel')}</BackLink>
            <Header>{title}</Header>
          </GridCol>
        </GridRow>
        <Form action="/orchestration/api/v1/storageNotes/saveAndValidate"
          currentUrl={path}
          onSubmit={(e) => e.preventDefault()}>
          <Header level="2">{t('sdYouAddedProductProductStoredTitle')}</Header>
          {storageNotes.catches.map((ctch, index) => {
            const keys = [
              `catches-${index}-product`,
              `catches-${index}-commodityCode`,
              `catches-${index}-productWeight`,
              `catches-${index}-dateOfUnloading`,
              `catches-${index}-placeOfUnloading`,
              `catches-${index}-transportUnloadedFrom`,
              `catches-${index}-certificateNumber`,
              `catches-${index}-weightOnCC`
            ];

            const productErrors = Object.keys(errors)
              .filter(key => keys.includes(key))
              .reduce((obj, key) => {
                obj[key] = errors[key];
                return obj;
              }, {});

            const hiddenText = t('sdYouAddedProductHiddenProductText', {productName: ctch.product});

            return (
              <Fragment key={index}>
                {productErrors && (
                  <ErrorIsland
                    errors={toGovukErrors(productErrors)}
                    onHandleErrorClick={() => {
                      this.props.history.push(
                        `/create-storage-document/${documentNumber}/add-product-to-this-consignment/${index}`
                      );
                    }}
                  />
                )}
                <SummaryTable>
                  <SummaryRow>
                    <SummaryCellKey>{ctch.product}</SummaryCellKey>
                    <SummaryCellLink>
                      <ChangeLinkTag
                        id={`edit-product-${index}`}
                        to={`/create-storage-document/${documentNumber}/add-product-to-this-consignment/${index}`}
                      >
                        {t('commonEditLink')}
                        <span className="govuk-visually-hidden">
                          {hiddenText}
                        </span>
                      </ChangeLinkTag>
                    </SummaryCellLink>
                    <SummaryCellLink>
                      {storageNotes.catches.length > 1 && (
                        <SecondaryButton
                          id={`remove-product-${index}`}
                          onClick={(e) => this.removeProduct(e, index)}
                          style={{ marginLeft: '0.5em ' }}
                          formAction={`/orchestration/api/v1/storageNotes/removeKey?n=/create-storage-document/${documentNumber}/you-have-added-a-product&key=product.${index}`}
                        >
                          {t('commonRemoveButton')}
                          <span className="govuk-visually-hidden">
                            {hiddenText}
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
              <Header level="2">{t('sdYouAddedProductNeedToAddProductTitle')}</Header>
              <MultiChoice
                onChange={(e) => {
                  const newStorageNotes = _.cloneDeep((this.props.storageNotes || {}));
                  newStorageNotes.addAnotherProduct = e.target.value;
                  this.props.save(newStorageNotes);
                  }}
                id="addAnotherProduct"
                meta={{ touched: true, error: errors.addAnotherProduct }}>
                <fieldset>
                  <legend className="visually-hidden">{t('sdYouAddedProductNeedToAddProductTitle')}</legend>
                  {this.renderAddNewOptions()}
                </fieldset>
              </MultiChoice>
            </GridCol>
          </GridRow>
          <GridRow>
            <SaveAsDraftButton formactionUrl={saveAsDraftFormActionUrl} onClick={this.onSaveAsDraft} />
            <input type="hidden" name="journey" value={journey} />
            <input type="hidden" name="currentUri" value={path} />
            <ContinueButton type="submit" id="continue" onClick={() => this.onContinue()}>{t('commonContinueButtonSaveAndContinueButton')}</ContinueButton>
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
  connect(
    mapStateToProps, {
      save: saveStorageNotes,
      saveToRedis: saveStorageNotesToRedis,
      getFromRedis: getStorageNotesFromRedis,
      clear: clearStorageNotes
    }
  )((withTranslation() (ProductDetails)))
);

export default {
  loadData,
  component: PageTemplateWrapper(component)
};