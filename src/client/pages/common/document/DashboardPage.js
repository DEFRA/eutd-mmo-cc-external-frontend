import moment from 'moment';

import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import styled from 'react-emotion';
import { SPACING } from '@govuk-react/constants';
import Tag from '@govuk-react/tag';
import _ from 'lodash';

import {
  Main,
  GridCol,
  GridRow,
  Header,
  Table
} from 'govuk-react';

// TODO: Use spinner till component did mount completes
// import LoadingBox from '@govuk-react/loading-box';

import PageTitle from '../../../components/PageTitle';
import NotificationBanner from '../../../components/NotificationBanner';
import { camelCaseToSpacedLowerCase, camelCaseToSpacedUpperCase } from '../../../helpers/string';
import { fetchAccountDetailsFromDynamics, fetchUserDetailsFromDynamics } from '../../../actions/dynamics.actions';
import { getAllDocuments } from '../../../actions/document.actions';
import { getAllUserAttributes } from '../../../actions/userAttributes.actions';
import { getNotification, clearNotification } from '../../../actions/notification.actions';
import { monitorEvent } from '../../../actions/monitor.actions';
import { catchCertificateJourney } from '../../../helpers/journeyConfiguration';

import * as timeUtils from '../../../helpers/timeUtils.js';
import Notifications from '../../../components/Notifications';

import { withTranslation } from 'react-i18next';
import { t } from 'i18next';
import ManageYourProductFavouritesLink from '../../../components/ManageYourProductFavouritesLink';

const PRIVACY_STATEMENT_ATTRIBUTE_NAME = 'privacy_statement';
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const RelatedContent = styled('div')({
  borderTop: '2px solid #005ea5',
  paddingTop: SPACING.SCALE_4,
  paddingBottom: SPACING.SCALE_4
});

class JourneyDashboardPage extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    const pageRange = this.getInitialPageRange();

    this.state = {
      loading: false,
      error: false,
      selectedMonth: pageRange[0].getMonth() + 1,
      selectedYear: pageRange[0].getFullYear(),
      currentPageRange: pageRange,
      submitIsDisabled: false
    };

    this.onSubmitNewJourney = this.onSubmitNewJourney.bind(this);

  }

  getInitialPageRange = () => {
    const year = this.props.route.queryParams && this.props.route.queryParams.year;
    const month = this.props.route.queryParams && this.props.route.queryParams.month;
    const currentDate = (month && year) ? new Date(year, month - 1, 1) : new Date();

    let pageRange;
    const pickedAMonth = this.props.route.queryParams && this.props.route.queryParams.position !== undefined;
    const pickedNextFourMonths = this.props.route.queryParams && this.props.route.queryParams.next === 'true';
    const pickedPreviousFourMonths = this.props.route.queryParams && this.props.route.queryParams.prev === 'true';
    if (pickedAMonth && !pickedNextFourMonths && !pickedPreviousFourMonths) {
      // pagination items don't change when picking a month in current pagination set
      pageRange = timeUtils.generateMissingMonths(currentDate, parseInt(this.props.route.queryParams.position));

    } else if (pickedNextFourMonths) {
      pageRange = timeUtils.nextFourMonths(currentDate);

    } else {
      pageRange = timeUtils.previousFourMonths(currentDate);
    }
    return pageRange;
  }

  privacyAgreedAlready = () => {
    const { userAttributes } = this.props;
    let privacyAgreed = false;
    for (const attribute of userAttributes) {
      if (attribute.name === PRIVACY_STATEMENT_ATTRIBUTE_NAME) {
        privacyAgreed = true;
        break;
      }
    }

    return privacyAgreed;
  }

  getJourneyName = () => {
    const { journey } = this.props.route;
    const correctedJourney = JourneyDashboardPage.convertToCorrectJourneyName(journey);
    const word = camelCaseToSpacedLowerCase(correctedJourney);
    return word;
  };

  getStatusName = (status, isFailed) => {
    if (isFailed) {
      return t('ccStatusFailed');
    }
    if (status === 'PENDING') {
      return t('ccStatusPending');
    }
    if (status === 'LOCKED') {
      return t('ccStatusLocked');
    }
    return t('ccStatusDraft');
  }

  getStatusClassName = (status, isFailed) => {
    if (isFailed) {
      return 'failedTag';
    }
    if (status === 'PENDING') {
      return 'pendingTag';
    }
    if (status === 'LOCKED') {
      return 'lockedTag';
    }
    return 'draftInactiveTag';
  }

  buildInProgressTableBody = () => {
    const { documents } = this.props;
    const { confirmUri, nextUri, journey, summaryUri, progressUri } = this.props.route;
    return (
      <React.Fragment>
        {
          documents.inProgress.map(document => {
            let actionUri = nextUri.replace(':documentNumber', document.documentNumber);
            let deleteUri = confirmUri.replace(':documentNumber', document.documentNumber);

            if (document.status === 'LOCKED' || document.isFailed) {
              actionUri = summaryUri.replace(':documentNumber', document.documentNumber);
            } else if (progressUri) {
              actionUri = progressUri.replace(':documentNumber', document.documentNumber);
            }

            const hiddenText = `${t(journey)} ${document.documentNumber} ${document.userReference ? document.userReference : ''}`;
            return (
              <Table.Row key={document.documentNumber}>
                <Table.Cell style={{ verticalAlign: 'top', width: '28%' }}>{document.documentNumber}</Table.Cell>
                <Table.Cell style={{ textAlign: 'left', verticalAlign: 'top', width: '25%' }}>
                  {document.userReference}
                </Table.Cell>
                <Table.Cell style={{ textAlign: 'center', verticalAlign: 'top', width: '25%' }}>
                  {document.startedAt || 'Unknown'}
                </Table.Cell>
                {(journey === 'catchCertificate') ?
                  <Table.Cell style={{ textAlign: 'center', verticalAlign: 'top', width: '25%' }}>
                    <Tag className={this.getStatusClassName(document.status, document.isFailed)}>{this.getStatusName(document.status, document.isFailed)}</Tag>
                  </Table.Cell> : null
                }
                <Table.Cell alignRight style={{ verticalAlign: 'top', wordBreak: 'normal', width: '15%' }}>
                  {(document.status !== 'PENDING') ?
                    <React.Fragment>
                      <Link id='continue' to={actionUri}>{t('continue')}
                      <span className="govuk-visually-hidden">
                          {hiddenText}
                        </span>
                      </Link><br />
                      {(document.status !== 'LOCKED') ?
                        <Link id='delete' to={deleteUri}>{t('delete')}
                      <span className="govuk-visually-hidden">
                            {hiddenText}
                          </span>
                        </Link> : null
                      }
                    </React.Fragment> : null}
                </Table.Cell>
              </Table.Row>
            );
          })
        }
      </React.Fragment>
    );
  }

  buildCompletedBody = () => {
    const { documents } = this.props;
    const {maximumConcurrentDrafts} = this.props.config;
    const { confirmVoidDocumentUri, journey, copyUri } = this.props.route;
    const buildUrl = (docUrl) => {
      if (docUrl.indexOf('/') !== -1) {
        const splitUrlLength = docUrl.split('/').length;
        const splitUrl = docUrl.split('/')[splitUrlLength - 1];
        const docId = splitUrl.split('?')[0];
        return `/pdf/export-certificates/${docId}`;
      }
      return `/pdf/export-certificates/${docUrl}`;
    };

    const monitorViewEvent = (documentNumber) => {
      this.props.monitorEvent(documentNumber, journey);
    };

    return (
      <React.Fragment>
        {
          documents.completed.map(document => {
            const date = moment(document.createdAt).format('DD MMM YYYY');
            const hiddenText = ` ${t(journey)} ${document.documentNumber} ${document.userReference ? document.userReference : ''}`;
            const showCopyLink = copyUri && documents.inProgress.length < maximumConcurrentDrafts;
            return (
              <Table.Row key={document.documentNumber}>
                <Table.Cell style={{ verticalAlign: 'top', width: '35%' }}>{document.documentNumber}</Table.Cell>
                <Table.Cell style={{ textAlign: 'left', verticalAlign: 'top', width: '25%' }}>
                  {document.userReference}
                </Table.Cell>
                <Table.Cell style={{ textAlign: 'center', verticalAlign: 'top', width: '25%' }}>
                  {date}
                </Table.Cell>
                <Table.Cell alignRight style={{ verticalAlign: 'top', wordBreak: 'normal', width: '15%' }}>
                  <div>
                    <a href={buildUrl(document.documentUri)} onClick={monitorViewEvent.bind(this, document.documentNumber)} rel="noopener noreferrer">{t('commonDashboardView')}
                      <span className="govuk-visually-hidden">
                        {hiddenText}
                      </span>
                    </a>
                  </div>
                  {
                    <div>
                      <Link to={{ pathname: confirmVoidDocumentUri.replace(':documentNumber', document.documentNumber), documentNumber: document.documentNumber }}>{t('commonDashboardVoid')}
                      <span className="govuk-visually-hidden">
                          {hiddenText}
                        </span>
                      </Link>
                    </div>
                  }
                  {showCopyLink &&
                    <div>
                    <Link to={{pathname: copyUri.replace(':documentNumber', document.documentNumber), documentNumber: document.documentNumber }}>{t('commonDashboardCopy')}
                      <span className="govuk-visually-hidden">
                          {hiddenText}
                        </span>
                      </Link>
                    </div>
                  }
                </Table.Cell>
              </Table.Row>
            );
          })
        }
      </React.Fragment>
    );
  }

  getJourneyHeader = () => {
    const { journey } = this.props.route;
    if (journey === 'catchCertificate') {
      return t('ccFavouritesDetailsExemptFromCatchCertificate').toLowerCase();
    } else if (journey === 'processingStatement') {
      return t('psAddCatchDetailsExemptFromProcessingStatements').toLowerCase();
    } else {
      return t('sdAddProductToConsignmenStorageDocument').toLowerCase();
    }
  }

  static camelCaseToCapsAndSpaced = (journey) => {
    const correctedJourney = JourneyDashboardPage.convertToCorrectJourneyName(journey);
    return camelCaseToSpacedUpperCase(correctedJourney);
  }

  static convertToCorrectJourneyName = journey => {
    return journey === 'storageNotes' ? 'storageDocument' : journey;
  }

  componentDidMount = async () => {
    this._isMounted = true;
    const { journey } = this.props.route;
    const { enabledAccountDetailsFetch } = this.props.config;
    this.setState({
      loading: true
    });

    const currentDate = this.state.currentPageRange[0];
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    try {
      if (enabledAccountDetailsFetch) {
        await this.props.fetchAccountDetailsFromDynamics();
      }
      await Promise.all([
        this.props.fetchUserDetailsFromDynamics(),
        this.props.getAllDocuments(journey, month, year),
        this.props.getAllUserAttributes(),
        this.props.getNotification()
      ]);

    } catch (e) {
      // TODO: Tidy this error up
      if (this._isMounted) {
        this.setState({
          error: true
        });
      }
    }

    if (this._isMounted) {
      this.setState({
        loading: false
      });
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false;
    this.props.clearNotification();
  }

  getHeaderAndErrorSummary = (header) => {
    const { title } = this.props.route;

    return (
      <React.Fragment>
        <PageTitle title={`${header} - ${t(title)}`}></PageTitle>
        {
          this.state.error &&
          // TODO: Heading needs to come up from errorLookup?
          <React.Fragment>
            <div id="errorIsland" className="error-summary" role="alert" aria-labelledby="error-summary-heading-example-1" tabIndex="-1">
              <h2 className="heading-medium error-summary-heading" id="error-summary-heading-example-1">{t('commonErrorHeading')}</h2>
            </div>
          </React.Fragment>
        }

        <GridRow>
          <GridCol>
            <Header>{header}</Header>
          </GridCol>
        </GridRow>
      </React.Fragment>
    );
  }

  renderLandingLinks() {
    return (
      <React.Fragment>
        <Header style={{ marginBottom: '0' }} level="3">{t('commonDashboardlandingLinksHeader')}</Header>
        <p>
          <a rel="noopener noreferrer" href="https://www.gov.uk/government/publications/give-prior-notification-to-land-fish-in-the-eu" target="_blank">
            {t('commonDashboardPriorNotificationForm')} <span className="govuk-visually-hidden">{t('commonHelpLinkOpenInNewTab')}</span>
          </a> (PDF)
          <br />
          <a rel="noopener noreferrer" href="https://www.gov.uk/government/publications/make-a-pre-landing-declaration-to-land-fish-in-an-eu-port" target="_blank">
            {t('commonDashboardPreLandingDeclaration')} <span className="govuk-visually-hidden">{t('commonHelpLinkOpenInNewTab')}</span>
          </a> (PDF)
        </p>
        <hr style={{ marginTop: 0, marginBottom: 0 }} />
        <p />
      </React.Fragment>
    );
  }

  renderCatchCertSubSection() {
    return (
      <React.Fragment>
        <Header style={{ marginBottom: '0' }} level="3">{t('commonDashboardCatchCertSubSectionHeader')}</Header>
        <p>
          {t('commonDashboardForFishNotCaught')}<br />
          <a rel="noopener noreferrer" href="https://www.gov.uk/guidance/create-a-uk-processing-statement" target="_blank">
            {t('processingStatementRendererHeaderSectionTitle')} (gov.uk) <span className="govuk-visually-hidden">{t('commonHelpLinkOpenInNewTab')}</span>
          </a>
          <br />
          <a rel="noopener noreferrer" href="https://www.gov.uk/guidance/create-a-uk-storage-document" target="_blank">
            {t('commonDashboardCreateaUkStorageDocument')} (gov.uk) <span className="govuk-visually-hidden">{t('commonHelpLinkOpenInNewTab')}</span>
          </a>
        </p>
      </React.Fragment>
    );
  }

  renderProcessingStatementSubSection() {
    return (
      <React.Fragment>
        <Header style={{ marginBottom: '0' }} level="3">{t('psDashboardOtherFishExportServices')}</Header>
        <p>
          <a rel="noopener noreferrer" href="https://www.gov.uk/guidance/create-a-uk-catch-certificate" target="_blank">
          {t('commonDashboardCreateAUkCatchCertificate')} (gov.uk)<span className="govuk-visually-hidden">({t('psOpenNewTab')})</span>
          </a>
          <br />
          <a rel="noopener noreferrer" href="https://www.gov.uk/guidance/create-a-uk-storage-document" target="_blank">
          {t('commonDashboardCreateaUkStorageDocument')} (gov.uk)<span className="govuk-visually-hidden">({t('psOpenNewTab')})</span>
          </a>
        </p>
      </React.Fragment>
    );
  }

  renderStorageNoteSubSection() {
    return (
      <React.Fragment>
        <Header style={{ marginBottom: '0' }} level="3">{t('psDashboardOtherFishExportServices')}</Header>
        <p>
          <a rel="noopener noreferrer" href="https://www.gov.uk/guidance/create-a-uk-catch-certificate" target="_blank">
          {t('commonDashboardCreateAUkCatchCertificate')} (gov.uk) <span className="govuk-visually-hidden">{t('commonHelpLinkOpenInNewTab')}</span>
          </a>
          <br />
          <a rel="noopener noreferrer" href="https://www.gov.uk/guidance/create-a-uk-processing-statement" target="_blank">
            {t('processingStatementRendererHeaderSectionTitle')} (gov.uk) <span className="govuk-visually-hidden">{t('commonHelpLinkOpenInNewTab')}</span>
          </a>
        </p>
      </React.Fragment>
    );
  }

  getIndividualNameOrCompanyNameToUseInHeader = () => {
    const { accountDetails, userDetails } = this.props;
    const hasAccountDetails = accountDetails && accountDetails.model && accountDetails.model.length > 0;
    const hasUserDetails = userDetails && userDetails.model && userDetails.model.length > 0;
    if (hasAccountDetails) {
      // company name
      return accountDetails.model[0].name;

    } else if (hasUserDetails) {
      // individual's name
      return userDetails.model[0].firstName + ' ' + userDetails.model[0].lastName;
    }
    return null;
  }



  changePaginationSetToPreviousFour = e => {
    // we have already been showing prev four months, pick the last month and generate previous four months from that point on
    e.preventDefault();
    const previousFourMonths = timeUtils.previousFourMonths(this.state.currentPageRange[this.state.currentPageRange.length - 1]);
    this.setState({
      currentPageRange: previousFourMonths
    });
  }

  changePaginationSetToNextFour = e => {
    e.preventDefault();
    const nextFourMonths = timeUtils.nextFourMonths(this.state.currentPageRange[0]);
    this.setState({
      currentPageRange: nextFourMonths
    });
  }

  // At any given point there will be only 4 months of data visible, so 4 onclick curried functions should not inhibit perf
  loadDataForMonthYear = (month, year) => async e => {
    e.preventDefault();
    const { journey } = this.props.route;
    this.setState({
      selectedMonth: month,
      selectedYear: year
    });
    await this.props.getAllDocuments(journey, month, year);
  }


  findCurrentlySelectedMonthIndex = () => {
    if (this.props.route.queryParams && this.props.route.queryParams.position) {
      return this.props.route.queryParams.position;
    } else {
      return this.state.currentPageRange.findIndex(x => {
        return x.getMonth() + 1 === this.state.selectedMonth && x.getFullYear() === this.state.selectedYear;
      });
    }
  }

  getAllPaginationLinks = () => {
    const { journeyText } = this.props.route;
    const firstDate = this.state.currentPageRange[0];
    const firstYear = firstDate.getFullYear();
    const firstMonth = firstDate.getMonth() + 1;

    const lastDate = this.state.currentPageRange[this.state.currentPageRange.length - 1];
    const lastYear = lastDate.getFullYear();
    const lastMonth = lastDate.getMonth() + 1;

    const today = new Date();
    const inCurrentMonth = today.getMonth() === firstDate.getMonth() && today.getFullYear() === firstDate.getFullYear();

    const nextParams = `position=0&next=true&month=${firstMonth}&year=${firstYear}`;
    const prevParams = `position=0&prev=true&month=${lastMonth}&year=${lastYear}`;
    const currentlySelectedMonth = this.findCurrentlySelectedMonthIndex();
    return (
      <div date-testid={`${t(journeyText)}-history-of-certificates`}  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', paddingBottom: SPACING.SCALE_4 }}>
        {
          (() => {
            if (inCurrentMonth) {
              return (<div>
                &#60;&#60;
              </div>);

            } else {
              return (<div>
                <Link aria-label={`Display the next month’s ${t(journeyText)}`} onClick={this.changePaginationSetToNextFour} to={{ pathname: this.props.location.pathname, search: nextParams }}>&#60;&#60;</Link>
              </div>);
            }
          })()
        }
        {
          this.state.currentPageRange.map((x, index) => {
            const actualMonth = x.getMonth() + 1; // getMonth is 0-index
            const year = x.getFullYear();
            const monthAndYear = `${MONTH_NAMES[x.getMonth()]} ${year}`;
            const currentParams = `month=${actualMonth}&year=${year}&position=${index}`;
            if (parseInt(currentlySelectedMonth) === index) {
              return (
                <div key={monthAndYear}>
                  {monthAndYear}
                </div>
              );
            } else {
              return (
                <div key={monthAndYear}>
                  <Link aria-label= {`Display ${t(journeyText)} created in ${monthAndYear}`}
                    onClick={this.loadDataForMonthYear(actualMonth, year)}
                    to={{ pathname: this.props.location.pathname, search: currentParams }}
                  >
                    {monthAndYear}
                  </Link>
                </div>
              );
            }

          })
        }
        <div>
          <Link aria-label={`Display the previous month’s ${t(journeyText)}`} onClick={this.changePaginationSetToPreviousFour} to={{ pathname: this.props.location.pathname, search: prevParams }}>&#62;&#62;</Link>
        </div>
      </div>
    );
  }

  showPaginationSet = () => {
    return this.getAllPaginationLinks();
  }

  getCompletedListWithData = () => {
    const { documents } = this.props;
    const { journey } = this.props.route;

    const subtitleText = journey === 'storageNotes' ? t('snDashboardStorageNotesJourney') : t(journey);

    if (documents && documents.completed && documents.completed.length === 0) {
      return (
        <React.Fragment>
          <GridRow>
            <GridCol name={`${journey}-completed-certificates`}>
              <Header level='2'>{t('completed')}</Header>
              {t(`${journey}DashboardCompleteSubtitleText`, {journey: camelCaseToSpacedLowerCase(subtitleText)})}
            </GridCol>
          </GridRow>
          {this.showPaginationSet()}
        </React.Fragment>
      );
    }

    const completedHeader = (
      <Table.Row>
        <Table.CellHeader>{t('commonDocumentNumber')}</Table.CellHeader>
        <Table.CellHeader style={{ textAlign: 'left' }}>{t(`${journey}DashboardYourReference`)}</Table.CellHeader>
        <Table.CellHeader style={{ textAlign: 'center' }}>{t(`${journey}DashboardDateCreated`)}</Table.CellHeader>
        <Table.CellHeader alignRight>{t('commonDashboardAction')}</Table.CellHeader>
      </Table.Row>
    );

    const completedBody = this.buildCompletedBody();
    return (
      <React.Fragment>
        <GridRow>
          <GridCol>
            <Table
              name={`${journey}-completed-certificates`}
              caption={<Header level='2'>{t('completed')}</Header>}
              head={completedHeader}
              body={completedBody}
            />
          </GridCol>
        </GridRow>
        {this.showPaginationSet()}
      </React.Fragment>
    );
  }

  getInProgressListWithData = (journeyHeader) => {
    const { maximumConcurrentDrafts } = this.props.config;
    const { journey } = this.props.route;

    const head = (
      <Table.Row>
        <Table.CellHeader>{t('commonDocumentNumber')}</Table.CellHeader>
        <Table.CellHeader style={{ textAlign: 'left' }}>{t(`${journey}DashboardYourReference`)}</Table.CellHeader>
        <Table.CellHeader style={{ textAlign: 'center' }}>{t(`${journey}DashboardDateStarted`)}</Table.CellHeader>
        {(journey === 'catchCertificate') ? <Table.CellHeader style={{ textAlign: 'center' }}>{t('commonDashboardStatus')}</Table.CellHeader> : null}
        <Table.CellHeader alignRight>{t('commonDashboardAction')}</Table.CellHeader>
      </Table.Row>
    );

    const inProgressBody = this.buildInProgressTableBody();

    return (
      <React.Fragment>
        <GridRow>
          <GridCol>
            <Table
              name={`${journey}-progress-certificates`}
              caption={
                <React.Fragment>
                  <Header level='2'>{t('commonDashboardInProgress')}</Header>
                  <p className='multiple-draft-info cc-guidance'>
                    {t(`${journey}DashboardGuidance`, {maximumConcurrentDrafts})}<br />
                    {journey === catchCertificateJourney && t(`${journey}DashboardGuidanceForPendingSubmission`)}<br />
                    {journey === catchCertificateJourney && t(`${journey}DashboardGuidanceForFailedSubmission`)}
                  </p>
                </React.Fragment>
              }
              head={head}
              body={inProgressBody}
            />
          </GridCol>
        </GridRow>
      </React.Fragment>
    );
  }

  onSubmitNewJourney() {
    this.setState({ submitIsDisabled: true });
  }

  getStartJourneyButton(label) {
    const { documents } = this.props;
    const { maximumConcurrentDrafts } = this.props.config;
    const { createUri, createDraftNextUri, journey } = this.props.route;

    const inProgress = documents.inProgress.length;
    const showStartButton = inProgress < maximumConcurrentDrafts || inProgress === 0;

    const button = <form action={createUri} method="POST" onSubmit={this.onSubmitNewJourney} >
      <input type="hidden" name="nextUri" value={createDraftNextUri} />
      <button
        className="button button-start"
        type="submit"
        disabled={this.state.submitIsDisabled}
      >{label}</button>
    </form>;

    return showStartButton && (
      <GridRow>
        <GridCol>
          {button}
          {journey === 'catchCertificate' && <ManageYourProductFavouritesLink styles={{lineHeight: 3}}/>}
        </GridCol>
      </GridRow>
    );
  }

  showPage = (header, label, journeyHeader, hasDrafts) => {
    const {journey} = this.props.route;
    const inProgress = (hasDrafts)
      ? this.getInProgressListWithData(journeyHeader)
      : <GridRow>
        <GridCol name={`${journey}-progress-certificates`}>
          <Header level='2'>{t('commonDashboardInProgress')}</Header>
          {t(`${journey}DashboardNoAnyDocInProgress`)}
        </GridCol>
      </GridRow>;

    return (
      <Main>
        {this.getHeaderAndErrorSummary(header)}
        {this.getStartJourneyButton(label)}
        {inProgress}
        {this.getCompletedListWithData()}
      </Main>
    );
  }

  getJourneyHeaderWithoutCompanyName = (journeyHeader) => {
    return `${journeyHeader.charAt(0).toUpperCase()}${journeyHeader.substring(1)}`;
  }

  getJourneyHeaderWithCompanyOrIndividualName = (journeyHeader) => {
    return `${journeyHeader.toLowerCase()}`;
  }

  render() {
    const agreedAlready = this.privacyAgreedAlready();
    if (!agreedAlready) {
      const { privacyNoticeUri } = this.props.route;
      return (
        <Redirect to={privacyNoticeUri} />
      );
    }

    const { journey } = this.props.route;
    const { documents, notification } = this.props;

    const hasDrafts = documents.inProgress && documents.inProgress.length > 0;
    const journeyHeader = this.getJourneyHeader();
    const label = t(`${journey}DashboardCreateANewJourney`, {key: t(journey)});

    let nameForHeader = this.getIndividualNameOrCompanyNameToUseInHeader();
    if (nameForHeader) {
      const localHeader = this.getJourneyHeaderWithCompanyOrIndividualName(journeyHeader);
      nameForHeader += `: ${localHeader}`;
    } else {
      const localHeader = this.getJourneyHeaderWithoutCompanyName(journeyHeader);
      nameForHeader = `${localHeader}`;
    }

    const dashboardTable = this.showPage(nameForHeader, label, journeyHeader.toLowerCase(), hasDrafts);
    const { maximumConcurrentDrafts } = this.props.config;
    const inProgress = documents.inProgress.length;
    const showNotificationOfMaximumDrafts = inProgress >= maximumConcurrentDrafts;
    return (
      <div>
        {!_.isEmpty(notification) && (
          <Notifications
            title={notification.title}
            message={notification.message}
          />
        )}
        {showNotificationOfMaximumDrafts && (
          <NotificationBanner
            header={t('commonImportant')}
            messages={[t(`${journey}DashboardNotificationOfMaximumDrafts`)]}
          />
        )}
        <GridRow>
          <GridCol columnTwoThirds>
            {dashboardTable}
          </GridCol>
          <GridCol columnOneThird>
            {
              <RelatedContent>
                <Header level={2}>{t('helpLinkNeedHelp')}</Header>
                <a rel="noopener noreferrer" href="https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal" target="_blank">
                  {t('commonDashboardGuidanceOnExportingFish')} (gov.uk) <span className="govuk-visually-hidden">({t('psOpenNewTab')})</span>
                </a>
                <hr style={{ marginTop: 0, marginBottom: '18px' }} />
                {journey === 'catchCertificate' && this.renderLandingLinks()}
                {journey === 'catchCertificate' && this.renderCatchCertSubSection()}
                {journey === 'processingStatement' && this.renderProcessingStatementSubSection()}
                {journey === 'storageNotes' && this.renderStorageNoteSubSection()}
              </RelatedContent>
            }
          </GridCol>
        </GridRow>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    documents: state.documents,
    accountDetails: state.accountdetails,
    userDetails: state.userdetails,
    userAttributes: state.userAttributes,
    monitorEvent: state.monitorEvent,
    config: state.config,
    notification: state.notification
  };
};

function loadData(store, journey, queryParams) {
  const { config = {} } = store.getState();
  const { enabledAccountDetailsFetch = false } = config;
  let currentMonth;
  let currentYear;

  if (queryParams && queryParams.month && queryParams.year) {
    if (queryParams.next && queryParams.next === 'true') {
      const allNextFourMonths = timeUtils.nextFourMonths(new Date(queryParams.year, queryParams.month - 1));
      const firstMonthDate = allNextFourMonths[0];
      currentMonth = firstMonthDate.getMonth() + 1;
      currentYear = firstMonthDate.getFullYear();

    } else if (queryParams.prev && queryParams.prev === 'true') {
      const allPreviousFourMonths = timeUtils.previousFourMonths(new Date(queryParams.year, queryParams.month - 1));
      const firstMonthDate = allPreviousFourMonths[0];
      currentMonth = firstMonthDate.getMonth() + 1;
      currentYear = firstMonthDate.getFullYear();

    } else {
      currentMonth = queryParams.month;
      currentYear = queryParams.year;
    }

  } else {
    const currentDate = new Date();
    currentMonth = currentDate.getMonth() + 1;
    currentYear = currentDate.getFullYear();
  }

  if (enabledAccountDetailsFetch) {
    store.dispatch(fetchAccountDetailsFromDynamics());
  }
  let allPromises = [
    store.dispatch(fetchUserDetailsFromDynamics()),
    store.dispatch(getAllUserAttributes()),
    store.dispatch(getAllDocuments(journey, currentMonth, currentYear)),
    store.dispatch(getNotification)
  ];

  return Promise.all(allPromises);
}

export default {
  loadData,
  component: withRouter(connect(mapStateToProps,
    {
      fetchAccountDetailsFromDynamics,
      fetchUserDetailsFromDynamics,
      getAllDocuments,
      getAllUserAttributes,
      getNotification,
      clearNotification,
      monitorEvent
    }
  )(withTranslation() (JourneyDashboardPage)))
};
