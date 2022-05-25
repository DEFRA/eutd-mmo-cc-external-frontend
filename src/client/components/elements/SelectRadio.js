import styled from 'react-emotion';
import Radio from '../elements/radio';
import { YELLOW } from 'govuk-colours';

const SelectRadio = styled(Radio)({
  '& input:checked ~ span::after': {
    opacity: 1
  },
  '& input:focus ~ span::before': {
    boxShadow: `0 0 0 4px ${YELLOW}`
  },
  '& input:disabled ~ span': {
    opacity: '.4',
    pointerEvents: 'none'
  }
});

export default SelectRadio;