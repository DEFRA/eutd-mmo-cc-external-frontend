import styled from 'react-emotion';
import { Button } from 'govuk-react';
import { MEDIA_QUERIES } from '@govuk-react/constants';

const ContinueButton = styled(Button)({
  display: 'inline-block',
  [MEDIA_QUERIES.LARGESCREEN]: {
    marginLeft: '0.8em'
  },
});

export default ContinueButton;