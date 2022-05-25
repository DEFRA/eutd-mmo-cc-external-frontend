import React from 'react';
import { withTranslation } from 'react-i18next';
class FavouritesDetails extends React.Component {
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
        <summary onClick={() => this.onClick()} className="govuk-details__summary">{t('ccFavouritesPageDetailsQuestion')}</summary>
        <div className={`govuk-details__text ${this.state.isOpen ? 'open' : ''}`}>
        {t('ccFavouritesPageDetailsAnswerOne')}<br/><br/>
        {t('ccFavouritesPageDetailsAnswerTwo')}
          </div>
      </details>
    );
  }
}

export default withTranslation() (FavouritesDetails);