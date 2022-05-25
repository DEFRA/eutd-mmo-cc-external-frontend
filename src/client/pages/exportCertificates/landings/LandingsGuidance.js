import React from 'react';
import { InsetText, ListItem, UnorderedList } from 'govuk-react';

function LandingsGuidance(props) {
  const {
    maxLandingsLimit,
    offlineValidationTime,
    landingLimitDaysInTheFuture,
    t,
  } = props;

  return (
    t !== undefined && (
      <InsetText id="speciesAndLandingsGuidanceMessage">
        <p>{t('ccSpeciesAndLandingsGuidanceTitle')}</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>{t('ccSpeciesAndLandingsGuidanceListItem1')}</ListItem>
          <ListItem>
            {t('ccSpeciesAndLandingsGuidanceListItem2', {
              landingLimitDaysInTheFuture,
            })}
          </ListItem>
          <ListItem>{t('ccSpeciesAndLandingsGuidanceListItem3')}</ListItem>
          {offlineValidationTime && (
            <ListItem>
              {t('ccSpeciesAndLandingsGuidanceListItem4', {
                offlineValidationTime,
              })}
            </ListItem>
          )}
          {maxLandingsLimit && (
            <ListItem>
              {t('ccSpeciesAndLandingsGuidanceListItem5', { maxLandingsLimit })}
            </ListItem>
          )}
        </UnorderedList>
      </InsetText>
    )
  );
}

export default LandingsGuidance;
