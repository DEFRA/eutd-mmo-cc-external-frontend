import {
  SAVE_PROCESSING_STATEMENT,
  CLEAR_PROCESSING_STATEMENT,
  SHOW_INLINE_SUMMARY_ERRORS_PS_SD,
  SAVE_PROCESSING_STATEMENT_UNAUTHORISED,
  SAVE_PROCESSING_STATEMENT_WAF_ERROR,
  CHANGE_PLANT_ADDRESS,
  CLEAR_CHANGE_PLANT_ADDRESS,
  CLEAR_ERRORS_PLANT_ADDRESS
} from '../actions';

const initialState = {
  catches: [{}],
  validationErrors: [{}]
};

export default (state, action) => {
  state = state || initialState;
  const data = action.payload;

  switch (action.type) {

    case SAVE_PROCESSING_STATEMENT:
      return {...state, ...data};

    case CLEAR_PROCESSING_STATEMENT:
      return {...initialState, supportID: state.supportID};

    case SHOW_INLINE_SUMMARY_ERRORS_PS_SD:
      return {...state, ...data};

    case SAVE_PROCESSING_STATEMENT_UNAUTHORISED:
      return {...state, unauthorised: true, supportID: undefined};

    case SAVE_PROCESSING_STATEMENT_WAF_ERROR:
      return {...state, unauthorised: true, supportID: action.supportID};

    case CHANGE_PLANT_ADDRESS: {
      return {
        ...state,
        changeAddress: true
      };
    }

    case CLEAR_CHANGE_PLANT_ADDRESS: {
      return {
        ...state,
        changeAddress: undefined
      };
    }
    case CLEAR_ERRORS_PLANT_ADDRESS: {
      return {
        ...state,
        errors: {}
      };
    }

    default:
      return state;
  }
};
