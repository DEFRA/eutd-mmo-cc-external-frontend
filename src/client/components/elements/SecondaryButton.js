import styled from 'react-emotion';
import { Button } from 'govuk-react';
import { MEDIA_QUERIES } from '@govuk-react/constants';

const SecondaryButton = styled(Button)({
  backgroundColor: '#F3F2F1',
  display: 'inline-block',
  [MEDIA_QUERIES.LARGESCREEN]: {
    marginLeft: '0.8em'
  },
  boxShadow: '0 2px 0 #929191',
  color: '#0B0C0C',
  '&:hover': {
    backgroundColor: '#CCCCCC',
    color: '#0B0C0C'
  },
  '&:focus': {
    backgroundColor: '#CCCCCC',
    outline: '3px solid transparent',
    color: '#0B0C0C',
    boxShadow: 'inset 0 0 0 1px #fd0',
  },
  '&:focus:hover': {
    border: '1px solid #fd0',
    color: '#0B0C0C'
  }
});

export default SecondaryButton;
