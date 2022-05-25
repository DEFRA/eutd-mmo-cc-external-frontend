import React from 'react';
import LinkTargetBlank from '../../components/elements/LinkTargetBlank';
import { withTranslation } from 'react-i18next';


export class ProductFavouriteDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  onClick() {
    const toggle = !this.state.isOpen;
    this.setState({ isOpen: toggle });
  }

  render() {
    const { t } = this.props;
    return (
      <details>
        <summary onClick={() => this.onClick()} className="govuk-details__summary">{t('ccProductFavouriteDetailSummaryText')}</summary>
        <div className={`govuk-details__text ${this.state.isOpen ? 'open' : ''}`}>
          <p> 
            {t('ccProductFavouriteDetailSummaryParagraphText')}
          </p>
          <p>
            {t('ccProductFavouriteDetailSummary2ParagraphText')} <LinkTargetBlank href="/manage-favourites" ariaLabel="Opens link for information on fish export service" text={t('ccProductFavouriteDetailSummary3ParagraphText')} /> {t('ccProductFavouriteDetailSummary4ParagraphText')}
          </p>
        </div>
      </details>
    );
  }
}

export default withTranslation() (ProductFavouriteDetail);