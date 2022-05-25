import React from 'react';
import PropTypes from 'prop-types';
import { t } from 'i18next';

const ErrorIsland = (props) => {

  function dedupeErrors(errs) {
    return errs.reduce((accumulator, value) => {
      const keyNotThere = !accumulator.filter((v) => {
        return v.key === value.key;
      }).length;
      if (keyNotThere) {
        accumulator.push(value);
      }
      return accumulator;
    }, []);
  }

  function listTheErrors(errs, onHandleErrorClick) {

    function onClick(e, key, speciesRow, vesselIndex) {
      if (!onHandleErrorClick) {
        return;
      }

      e.preventDefault();
      onHandleErrorClick(key, speciesRow, vesselIndex);
    }

    return dedupeErrors(errs).map((err) => {
      return (
        <li key={err.key}>
          <a
            onClick={(e) =>
              onClick(e, err.key, props.speciesRow, props.vesselIndex)
            }
            href={'#' + err.key}
          >
            {err.message}
          </a>
        </li>
      );
    });
  }

  if (props.errors && props.errors.length) {
    return(
      <div id="errorIsland" className="error-summary" role="alert" aria-labelledby="error-summary-heading-example-1" tabIndex="-1">
        <h2 className="heading-medium error-summary-heading" id="error-summary-heading-example-1">
          {t('commonErrorHeading')}
        </h2>

        <ul className="error-summary-list">
          {listTheErrors(props.errors, props.onHandleErrorClick)}
        </ul>
      </div>
    );
  }
  return null;
};

ErrorIsland.propTypes = {
  errors: PropTypes.array
};

export default ErrorIsland;
