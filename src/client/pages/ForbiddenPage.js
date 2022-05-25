import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PageTitle from '../components/PageTitle';
import i18n from '../../../src/i18n';

export class ForbiddenPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    i18n.changeLanguage();
    this.forceUpdate();
  }

  render() {
    const {t} = i18n;
    const { reference, exporter, exportPayload, transport, processingStatement, storageNotes, directLandings, conservation } = this.props;
    const supportID =
      reference.supportID ||
      exporter.supportID ||
      exportPayload.supportID ||
      transport.supportID ||
      processingStatement.supportID ||
      storageNotes.supportID ||
      directLandings.supportID ||
      conservation.supportID;

    return(
        <div className="column-two-thirds">
          <PageTitle title={`${t('commonForbiddenPageText')} – GOV.UK`} />
          {supportID 
            ? <>
              <h1 className="heading-large">{t('commonForbiddenPageURLRejected')}</h1>
              <p data-testid="try-again">{t('commonForbiddenPageTryAgain')}</p>
              <p data-testid="support-id">{t('commonForbiddenPageSupportId')} {supportID}</p>
              <p data-testid="contact-fes">{t('commonForbiddenPageContact')}</p>
              <h2 className="heading-large" data-testid="subheading-fes">{t('commonFishExportsService')}</h2>
              <p data-testid="tel-number">{t('commonTelephone')}: 0330 159 1989</p>
              <p data-testid="opening-hours">{t('commonForbiddenPageOpeningHours')}</p>
            </>
            : <>
              <h1 className="heading-large">{t('commonForbiddenPageText')}</h1>
              <p data-testid="no-permission">{t('commonForbiddenPageP1Text')}</p>
              <p data-testid="navigate-back">{t('commonForbiddenPageP2Text')}</p>
            </>
          }
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    reference: state.reference,
    exporter: state.exporter,
    exportPayload: state.exportPayload,
    transport: state.transport,
    processingStatement: state.processingStatement,
    storageNotes: state.storageNotes,
    directLandings: state.directLandings,
    conservation: state.conservation
  };
}

export default {
  component: withRouter(connect(mapStateToProps, {})(ForbiddenPage)),
};
