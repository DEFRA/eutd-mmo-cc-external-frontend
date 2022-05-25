import {
  SAVE_STORAGE_NOTES,
  SAVE_STORAGE_NOTES_UNAUTHORISED,
  SAVE_STORAGE_NOTES_WAF_ERROR,
  CLEAR_STORAGE_NOTES,
  SHOW_INLINE_SUMMARY_ERRORS_PS_SD,
  CHANGE_STORAGE_FACILITY_ADDRESS
} from '../actions';

const initialState = {
  catches: [{}],
  storageFacilities: [{}],
  validationErrors: [{}],
  errors: {},
  errorsUrl: ''
};

export default (state, action) => {
  
  state = state || initialState;
  const data = {...action.payload};

  switch (action.type) {
    case SAVE_STORAGE_NOTES:
      return {...state, ...data};

    case SAVE_STORAGE_NOTES_UNAUTHORISED:
      return {...state, unauthorised: true, supportID: undefined};
      
    case SAVE_STORAGE_NOTES_WAF_ERROR:
      return {...state, unauthorised: true, supportID: action.supportID};

    case CLEAR_STORAGE_NOTES:
      return {...initialState, pdf: data.pdf, supportID: state.supportID};

    case SHOW_INLINE_SUMMARY_ERRORS_PS_SD:
      return {...state, ...data};
     
     case CHANGE_STORAGE_FACILITY_ADDRESS:
       return {
        ...state,
        ...data,
        changeAddress: true
        }; 
    
    default:
      return state;
  }
};
