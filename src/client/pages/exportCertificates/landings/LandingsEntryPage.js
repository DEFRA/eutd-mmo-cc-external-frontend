import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { BackLink, GridCol, GridRow, H1, Main, MultiChoice } from 'govuk-react';
import { onHandleErrorClick, scrollToErrorIsland } from '../../utils';
import { getLandingType, validateLandingType, clearLandingsType, dispatchSaveChangedLandingsType } from '../../../actions/landingsType.actions';
import ContinueButton from '../../../components/elements/ContinueButton';
import Details from '../../../components/elements/Details';
import ErrorIsland from '../../../components/elements/ErrorIsland';
import Form from '../../../components/elements/Form';
import HelpLink from '../../../components/HelpLink';
import PageTemplateWrapper from '../../../components/PageTemplateWrapper';
import PageTitle from '../../../components/PageTitle';
import SelectRadio from '../../../components/elements/SelectRadio';
import NotificationBanner from '../../../components/NotificationBanner';
import { withTranslation } from 'react-i18next';
import { t } from 'i18next';

const LandingsEntryPage = (props) => {
  const pageTitle = t('ccLandingsEntryPageTitle');
  const {
    previousUri,
    path,
    nextUri,
    landingsEntryOptions,
    journey,
    landingsTypeConfirmationUri,
    title
  } = props.route;
  const { params } = props.match;
  const confirmCopyDocument = props.confirmCopyDocument;
  const { documentNumber } = params;

  const [landingsEntryValue, setLandingsEntryValue] = useState(props.landingsEntryOption);

  useEffect(() => {
    window.scrollTo(0, 0);
    props.getLandingType(documentNumber);

    return () => {
      props.clearLandingsType();
    };
  }, []);

  useEffect(() => {
    if (props.unauthorised)
      props.history.push('/forbidden');

    setLandingsEntryValue(props.landingsEntryOption);
  }, [props.landingsEntryOption]);

  const handleBackLinkClick = (event) => {
    event.preventDefault();
    props.history.push(previousUri.replace(':documentNumber', documentNumber));
  };

  const handleLandingsOptionChange = (event) => {
    setLandingsEntryValue(event.currentTarget.value);
  };

  const getNotificationMsg = (generatedByContent) => {
    let notificationMsgs = [];
     if(confirmCopyDocument && confirmCopyDocument.copyDocumentAcknowledged)
       notificationMsgs.push(
         confirmCopyDocument.voidDocumentConfirm ?
         t('ccProgressNotificationMsgIsVoided') :
         t('ccProgressNotificationMsgIsNotVoided', { documentNumber : confirmCopyDocument.documentNumber })
       );
    if(generatedByContent)
      notificationMsgs.push(t('ccLandingsEntryPageNewPageMessage'));

    return notificationMsgs.length ? notificationMsgs : null;
  };

  const handleSaveAndContinue = async (event) => {
    event.preventDefault();
    try {
      const hasChangedLandingType = () =>
        props.landingsEntryOption !== null &&
        (landingsEntryValue === 'directLanding' || props.landingsEntryOption === 'directLanding')
        && props.landingsEntryOption !== landingsEntryValue;

      if (hasChangedLandingType()) {
        await props.dispatchSaveChangedLandingsType(landingsEntryValue);
        props.history.push(landingsTypeConfirmationUri.replace(':documentNumber', documentNumber));
      } else {
        await props.validateLandingType(landingsEntryValue, documentNumber);
        props.history.push(nextUri.replace(':documentNumber', documentNumber));
      }
    } catch {
      scrollToErrorIsland();
    }
  };

  const renderLandingsEntryOptions = () => {
    return (
      Array.isArray(landingsEntryOptions) &&
      landingsEntryOptions.map((option) => (
        <SelectRadio
          key={option.id}
          id={option.id}
          name={option.name}
          value={option.value}
          hint={t(option.hint)}
          onChange={handleLandingsOptionChange}
          checked={landingsEntryValue === option.value}
        >
          {t(option.label)}
        </SelectRadio>
      ))
    );
  };

  return (
    <Main>
      {!isEmpty(props.errors) && (
        <ErrorIsland
          errors={props.errors.errors.map((err) => ({
            message: t(err.text),
            key: err.targetName,
          }))}
          onHandleErrorClick={onHandleErrorClick}
        />
      )}
      <PageTitle
        title={`${
          !isEmpty(props.errors) ? 'Error: ' : ''
        }${pageTitle} - ${t(title)}`}
      />
      <Form
        action='/v1/export-certificates/landings-type'
        currentUrl={path.replace(':documentNumber', documentNumber)}
        nextUrl={nextUri.replace(':documentNumber', documentNumber)}
        documentNumber={documentNumber}
      >
        <GridRow>
          <GridCol>
            <BackLink onClick={handleBackLinkClick} href={previousUri.replace(':documentNumber', documentNumber)} >{t('commonBackLinkBackButtonLabel')}</BackLink>
            {(props.generatedByContent || ( confirmCopyDocument && confirmCopyDocument.copyDocumentAcknowledged)) && (
              <NotificationBanner
                header={t('commonImportant')}
                messages={getNotificationMsg(props.generatedByContent)} />
            )}
            <H1>{pageTitle}</H1>
            <MultiChoice
              meta={{
                touched: true,
                error:
                  !isEmpty(props.errors) &&
                  t(props.errors.landingsEntryOptionError),
              }}
              id="landingsEntryOption"
            >
              <fieldset style={{ marginBottom: '30px'}}>{renderLandingsEntryOptions()}</fieldset>
            </MultiChoice>
            <Details
              summary={t('ccLandingsEntryPageWhatIsACSVFile')}
              details={
                <>
                  <span>{t('ccLandingsEntryPageWhatIsACSVFileFormatDetails')}</span>
                  <br />
                  <br />
                  <span>{t('ccLandingsEntryPageWhatIsACSVFileExportingDetails')}</span>
                </>
              }
            />
          </GridCol>
        </GridRow>
        <GridRow>
            <ContinueButton id="continue" onClick={handleSaveAndContinue}>{t('commonContinueButtonSaveAndContinueButton')}</ContinueButton>
          </GridRow>
      </Form>
      <HelpLink journey={journey} parent="functionalComp"/>
    </Main>
  );
};

function mapStateToProps(state) {
  return {
    errors: state.errors,
    landingsEntryOption: state.landingsType.landingsEntryOption,
    generatedByContent: state.landingsType.generatedByContent,
    unauthorised: state.landingsType.unauthorised,
    confirmCopyDocument: state.confirmCopyDocument
  };
}

function loadData(store) {
  store.dispatch(getLandingType(this.documentNumber));
}

export const component = withRouter(
  connect(mapStateToProps, {
    getLandingType,
    validateLandingType,
    clearLandingsType,
    dispatchSaveChangedLandingsType,
  })(withTranslation()(LandingsEntryPage))
);

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
