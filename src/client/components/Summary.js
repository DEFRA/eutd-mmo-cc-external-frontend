
import { Link } from 'react-router-dom';
import styled from 'react-emotion';
import { asAnchor } from '@govuk-react/hoc';
import { MEDIA_QUERIES } from '@govuk-react/constants';

export const ChangeLinkTag = asAnchor(Link);

export const SummaryTable = styled('dl')({
  [MEDIA_QUERIES.LARGESCREEN]: {
    display: 'table',
    width: '100%',
  }
});

export const SummaryRow = styled('div')({
  position: 'relative',
  [MEDIA_QUERIES.LARGESCREEN]: {
    borderBottom: '#bfc1c3 solid 1px',
    display: 'table-row',
    margin: '5px',
    position: 'static'
  }
},
  ({ noSeperator }) => {
    if (noSeperator) {
      return ({
        borderBottom: 'none'
      });
    }
  });

export const SummaryRowValue = styled('dt')({
  display: 'block',
  fontWeight: 'bold',
  marginTop: '12px',
  maxWidth: '80%',
  [MEDIA_QUERIES.LARGESCREEN]: {
    borderBottom: '#bfc1c3 solid 1px',
    display: 'table-cell',
    margin: 0,
    padding: '7.5px 7.5px 7.5px 0',
    verticalAlign: 'middle',
    maxWidth: '100%'
  }
},
  ({ noSeperator }) => {
    if (noSeperator) {
      return ({
        [MEDIA_QUERIES.LARGESCREEN]: {
          borderBottom: 'none'
        }
      });
    }
  });

export const SummaryCellKey = styled('dt')({
  display: 'block',
  fontWeight: 'bold',
  marginTop: '12px',
  maxWidth: '80%',
  [MEDIA_QUERIES.LARGESCREEN]: {
    borderBottom: '#bfc1c3 solid 1px',
    display: 'table-cell',
    margin: 0,
    padding: '7.5px 7.5px 7.5px 0',
    width: '50%'
  }
},
  ({ noSeperator }) => {
    if (noSeperator) {
      return ({
        [MEDIA_QUERIES.LARGESCREEN]: {
          borderBottom: 'none'
        }
      });
    }
  });

export const SummaryCellValue = styled('dd')({
  display: 'block',
  paddingBottom: '7.5px',
  [MEDIA_QUERIES.LARGESCREEN]: {
    borderBottom: '#bfc1c3 solid 1px',
    display: 'table-cell',
    maxWidth: '70%',
    padding: '7.5px',
    verticalAlign: 'middle'
  }
},
  ({ noSeperator }) => {
    if (noSeperator) {
      return ({
        [MEDIA_QUERIES.LARGESCREEN]: {
          borderBottom: 'none'
        }
      });
    }
  });

export const SummaryCellLink = styled('span')({
  margin: 0,
  [MEDIA_QUERIES.LARGESCREEN]: {
    borderBottom: '#bfc1c3 solid 1px',
    display: 'table-cell',
    margin: 0,
    padding: '7.5px 0 7.5px 7.5px',
    position: 'static',
    textAlign: 'right',
    // verticalAlign: 'middle'
  }
},
  ({ noSeperator }) => {
    if (noSeperator) {
      return ({
        [MEDIA_QUERIES.LARGESCREEN]: {
          borderBottom: 'none'
        }
      });
    }
  });
