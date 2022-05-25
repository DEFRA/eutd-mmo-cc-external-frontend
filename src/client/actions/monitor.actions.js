import {isError, showFullPageError} from './index';

export const monitorEvent = (documentNumber, journey) => async (dispatch, getState, { orchestrationApi }) => {

  try {
    const res = await orchestrationApi.get('/client-ip');
    const clientip = res.data;

    orchestrationApi.post('/monitoring-event/post', {documentNumber, clientip, journey});
  } catch(e) {
    if(isError(e)) dispatch(showFullPageError());
  }
};