import { t } from 'i18next';
import React from 'react';
import styled from 'react-emotion';

export const SpeciesLink = styled('p')({
  padding: '10px 0',

});

class SpeciesDetails extends React.Component {
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
    const { exemptFrom } = this.props;

    return (
      <details>
        <summary onClick={() => this.onClick()} className="govuk-details__summary">{t('commonAddCatchDetailsSpeciesDetailsLinkTitle')}</summary>
        <div className={`govuk-details__text ${this.state.isOpen ? 'open' : ''}`}>
          {t('psAddCatchDetailsSpeciesDetailsBestResults')}
          <SpeciesLink>
            {t('psAddCatchDetailsSomeSpecies')}:&nbsp;
            <a rel="noopener noreferrer" href='https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2011:057:0010:0018:EN:PDF' target="_blank" aria-label="Link opens in a new window">
              {t('psAddCatchDetailsSomeSpeciesLinkText', {exemptFrom})} <span className="govuk-visually-hidden">{t('commonSpeciesDetailsOpenInNewTab')}</span>
            </a>
          </SpeciesLink>
          {t('psAddCatchDetailsSpeciesDetailsCannotFindSpecies')}0330 159 1989.
        </div>
      </details>
    );
  }
}

export default SpeciesDetails;