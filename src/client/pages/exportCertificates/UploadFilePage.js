import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  BackLink,
  Main,
  H1,
  H2,
  GridRow,
  GridCol,
  WarningText,
  OrderedList,
  ListItem,
  Table,
  FileUpload
} from 'govuk-react';
import { isEmpty } from 'lodash';
import { onHandleErrorClick, scrollToErrorIsland, scrollToField } from '../utils';
import { clearLandings, saveLandings, uploadLandingsFile } from '../../actions/upload-file.actions';
import ContinueButton from '../../components/elements/ContinueButton';
import ErrorIsland from '../../components/elements/ErrorIsland';
import Form from '../../components/elements/Form';
import HelpLink from '../../components/HelpLink';
import NotificationBanner from '../../components/NotificationBanner';
import PageTitle from '../../components/PageTitle';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import errorTransformer from '../../helpers/errorTransformer';
import SecondaryButton from '../../components/elements/SecondaryButton';
import BackToProgressLink from '../../components/BackToProgressLink';
import { withTranslation } from 'react-i18next';
import { getLandingType } from '../../actions/landingsType.actions';

const UploadFilePage = (props) => {

  const { previousUri, path, nextUri, journey, dashboardUri, landingsEntryUri, progressUri } = props.route;
  const { params } = props.match;
  const { documentNumber } = params;
  const { landings, t } = props;
  const title = t('ccUploadFilePageTitle');
  const [uploadNotification, setUploadNotification] = useState(false);
  let completedRows;
  let totalRows;

  const showNotification = landings && Array.isArray(landings) && landings.length > 0;
  if (showNotification) {
     completedRows = landings.filter(row => Array.isArray(row.errors) && row.errors.length === 0).length;
     totalRows = landings.length;
  }

  const handleBackLinkClick = (event) => {
    event.preventDefault();
    props.history.push(previousUri.replace(':documentNumber', documentNumber));
  };

  useEffect(async () => {
    await props.getLandingType(documentNumber);
    if (props.landingsEntryOption === null)
      props.history.push(landingsEntryUri.replace(':documentNumber', documentNumber));
    else if (props.landingsEntryOption !== 'uploadEntry')
      props.history.push(dashboardUri);

  }, []);

  useEffect(() => {
    return () => {
      clearUpload();
    };
  }, [props.landingsEntryOption]);

  const handlerClearUpload = (event) => {
    event.preventDefault();
    clearUpload();
  };

  const clearUpload = () => {
    props.clearLandings();

    const inputEl = document.querySelector('#file input');
    if (inputEl) {
      inputEl.value = '';
    }
  };

  const handlerCancel = (event) => {
    event.preventDefault();
    props.history.push(previousUri.replace(':documentNumber', documentNumber));
  };

  const handlerSave = async (event) => {
    event.preventDefault();

    try {
      const data = {
        file: props.landings,
        currentUri: path.replace(':documentNumber', documentNumber)
      };

      await props.saveLandings(data, documentNumber);

      props.history.push(nextUri.replace(':documentNumber', documentNumber));
    } catch (err) {
      scrollToErrorIsland();
    }
  };

  const extractErrorsMessage = (errors) => {
    const errorObjects = errorTransformer(errors).errors;
    const errorsMessage = [];

    errorObjects &&
      errorObjects.map((errorObject) => {
        const isErrorWithParams =
          errorObject && errorObject.text && errorObject.text.split('-');
        errorsMessage.push(
          t(`${isErrorWithParams[0]}`, { dynamicValue: isErrorWithParams[1] })
        );
      });

    return errorsMessage;
  };

  const onUploadFile = async (e) => {
    e.preventDefault();
    props.clearLandings();
    const fileToUpload = e.target.files[0];
    if (fileToUpload) {
      setUploadNotification(true);
      scrollToField('root');
      try {
        await props.uploadLandingsFile(e.target.files[0], documentNumber);
      } catch (err) {
        scrollToErrorIsland();
      }
      setUploadNotification(false);
    }
  };

  const splitErrorParams = (error) => {
    const isErrorWithParams = error.text.includes('-');
    const splitError = error.text.split('-');

    return isErrorWithParams ? t(splitError[0], { dynamicValue: splitError[1] }) : t(error.text);
  };

  const formatErrors = (errors) => {
    return errors.map((error) => (
      { message: splitErrorParams(error), key: error.targetName }
    )
    );
  };

  const formatFileUploadError = () => {
    const { fileError } = props.errors;
    const isFileErrorWithParams = fileError.includes('-');
    const splitFileError = fileError.split('-');

    return isFileErrorWithParams ? t(splitFileError[0], { dynamicValue: splitFileError[1] }) : t(fileError);
  };

  return (
    <Main>
      {!isEmpty(props.errors) && (
        <ErrorIsland
          errors={formatErrors(props.errors.errors)}
          onHandleErrorClick={onHandleErrorClick}
        />
      )}
      <PageTitle
        title={`${
          !isEmpty(props.errors) ? 'Error: ' : ''
        }${title} - ${t('ccCommonTitle')}`}
      />
      <Form
        action="/orchestration/api/v1/save/landings"
        currentUrl={path.replace(':documentNumber', documentNumber)}
        nextUrl={nextUri.replace(':documentNumber', documentNumber)}
        documentNumber={documentNumber}
      >
        <GridRow>
          <GridCol>
            <BackLink onClick={handleBackLinkClick} href={previousUri}>{t('commonBackLinkBackButtonLabel')}</BackLink>
            {(showNotification || uploadNotification) && <NotificationBanner
              header={uploadNotification ? t('ccUploadFilePageNotificationProgressHeader') : t('ccUploadFilePageNotificationCompletionHeader')}
              className= {uploadNotification ? '' :'upload-csv-notification'}
              messages={[
                uploadNotification ? t('ccUploadFilePageNotificationProgressMessage') : t('ccUploadFilePageNotificationCompletionMessage', { completedRows: completedRows, totalRows: totalRows}),
              ]}
            />}
            <H1>{title}</H1>
            <H2 data-testid="guidance-heading">{t('ccUploadFilePageGuidanceHeader')}</H2>
            <WarningText data-testid="warning-message" className="warning-message">
              {t('ccUploadFilePageGuidanceMessage')}&nbsp;
              <Link to='/upload-guidance' aria-label='Opens link for information on upload guidance'>
                <span className="govuk-visually-hidden">
                  (opens in same tab)
                </span>
                {t('ccUploadFilePageGuidanceMessageLink')}
              </Link>
              , {t('ccUploadFilePageGuidanceMessageCreate')}&nbsp;
              <Link to='/manage-favourites' aria-label='Opens link for information on product favourites'>
                <span className="govuk-visually-hidden">
                  (opens in same tab)
                </span>
                {t('ccUploadFilePageManageFavouritesLink')}
              </Link>
            </WarningText>
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol>
            <H2 data-testid="file-upload-heading">{t('ccUploadFilePageFileUploadHeading')}</H2>
            <FileUpload
              data-testid="productCsvFileUpload"
              name="productCsvFile"
              id="file"
              onChange={onUploadFile}
              acceptedFormats=".csv"
              meta={{
                error: !isEmpty(props.errors) && formatFileUploadError(),
                touched: true
              }}
            >
              {t('ccUploadFilePageFileUploadText')}
            </FileUpload>
            <GridRow>
              <SecondaryButton
                id="clearUpload"
                name="clearUpload"
                onClick={handlerClearUpload}
              >
                {t('ccUploadFilePageClearFileUpload')}
              </SecondaryButton>
            </GridRow>
            <H2 data-testid="upload-results-label">{t('ccUploadFilePageFileUploadResultsHeader')}</H2>
            <p data-testid="validation-failed-paragraph">{t('ccUploadFilePageValidationFailedParagraph')}</p>
            <OrderedList listStyleType="decimal">
              <ListItem data-testid="validation-failed-advice-one" style={{ fontSize: '19px', marginBottom: '5px' }}>
                {t('ccUploadFilePageValidationFailedAdviceOne')}
              </ListItem>
              <ListItem data-testid="validation-failed-advice-two" style={{ fontSize: '19px', marginBottom: '5px' }}>
                {t('ccUploadFilePageValidationFailedAdviceTwo')}
              </ListItem>
            </OrderedList>
            <Table
              id="uploadedProductsAndLandings"
              head={
                <Table.Row>
                  <Table.CellHeader>{t('ccUploadFilePageTableHeaderOne')}</Table.CellHeader>
                  <Table.CellHeader>{t('ccUploadFilePageTableHeaderTwo')}</Table.CellHeader>
                  <Table.CellHeader>{t('ccUploadFilePageTableHeaderThree')}</Table.CellHeader>
                </Table.Row>
              }
              body={!isEmpty(landings) ? landings.map((landing, index) => {
                const errorsEmpty = isEmpty(landing.errors);
                return (
                  <Table.Row id={`landing_${landing.productId}`} data-testid={`${landing.productId}`} style={{ color: errorsEmpty ? '' : '#b10e1e' }} key={index}>
                    <Table.Cell style={{ verticalAlign: 'top', width: '5%' }}>
                      {landing.rowNumber}
                    </Table.Cell>
                    <Table.Cell style={{ verticalAlign: 'top', width: '47.5%' }}>
                      {landing.originalRow}
                    </Table.Cell>
                    {errorsEmpty ?
                      <Table.Cell style={{ verticalAlign: 'top', width: '47.5%' }}>
                        <strong>{t('ccUploadFilePageTableProductInfo')}</strong>: {`${landing.product ? landing.product.species : 'UNKNOWN'}, ${landing.product ? landing.product.stateLabel : 'UNKNOWN'}, ${landing.product ? landing.product.presentationLabel : 'UNKNOWN'}, ${landing.product ? landing.product.commodity_code : 'UNKNOWN'}`} <br />
                        <strong>{t('ccUploadFilePageTableLandingInfo')}</strong>: {`${landing.landingDate}, ${landing.faoArea}, ${landing.vessel ? landing.vessel.vesselName : 'UNKNOWN'} (${landing.vessel ? landing.vessel.pln : 'UNKNOWN'})`} <br />
                        <strong>{t('ccUploadFilePageTableExportWeightInfo')}</strong>: {landing.exportWeight} <br />
                      </Table.Cell>
                      :
                      <Table.Cell style={{ verticalAlign: 'top', width: '47.5%' }}>
                        <div style={{ display: 'flex' , flexWrap: 'wrap' }}>
                          <div style={{ flex: ' 1 1 auto', minWidth: '10%'}}><strong>{t('ccUploadFilePageTableFailedInfo')}</strong>:</div>
                          <ol style={{ flex: '1 1 83%' }}>
                            {extractErrorsMessage(landing.errors).map(
                              (error, keyIndex) => <li key={keyIndex}> {error}</li>
                            )}
                          </ol>
                        </div>
                      </Table.Cell>}
                  </Table.Row>
                );
              }) : null }
            />
          </GridCol>
        </GridRow>
        <GridRow>
          <SecondaryButton id="cancel" name="cancel" onClick={handlerCancel}>
          {t('commonSecondaryButtonCancelButton')}
          </SecondaryButton>
          <ContinueButton id="continue" onClick={handlerSave}>
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
};


function loadData(store) {
  return Promise.all([
    store.dispatch(getLandingType(this.documentNumber))
  ]);
}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    landings: state.uploadedLandings.landings,
    landingsEntryOption: state.landingsType.landingsEntryOption
  };
}

export const component = withRouter(
  connect(mapStateToProps, {
    clearLandings,
    saveLandings,
    getLandingType,
    uploadLandingsFile
  })(withTranslation() (UploadFilePage))
);

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
