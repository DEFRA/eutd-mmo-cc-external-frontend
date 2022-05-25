import React from 'react';
import { connect } from 'react-redux';
import { catchCertificateJourney, processingStatementJourney, storageNoteJourney } from '../helpers/journeyConfiguration';
import { H2, GridRow, GridCol} from 'govuk-react';
import { withTranslation } from 'react-i18next';
import i18n from '../../i18n';
class HelpLink extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    i18n.changeLanguage();
    if(this.props.parent !== 'functionalComp'){
      this.forceUpdate();
    }
  }

  render() {
    const { tag = '', config = {}, journey, t } = this.props;
    const { catchCertHelpUrl, storageDocHelpUrl, processingStatementHelpUrl } = config;

    const journeyLookup = {
      [`${catchCertificateJourney}`]: catchCertHelpUrl,
      [`${storageNoteJourney}`]: storageDocHelpUrl,
      [`${processingStatementJourney}`]: processingStatementHelpUrl,
    };

    const url = journeyLookup[journey] || catchCertHelpUrl;

    return (
      <GridRow>
        <GridCol>
          <hr className="help-link" />
          <H2>{t('helpLinkNeedHelp')}</H2>
          <a rel="noopener noreferrer" href={`${url}${tag}`} target="_blank">
            {t('commonHelpLinkGetHelpExportingFish')} <span className="govuk-visually-hidden">{t('commonHelpLinkOpenInNewTab')}</span>
          </a>
        </GridCol>
      </GridRow>

    );
  }
}

export default connect((state) => ({ config: state.config }))(withTranslation() (HelpLink));
