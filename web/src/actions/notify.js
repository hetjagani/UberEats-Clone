import { NOTIFY } from './types';

export const notifyError = (data, status) => ({
  type: NOTIFY,
  payload: {
    type: 'error',
    title: `Error : ${status}`,
    message: data,
  },
});

export const notifyInfo = (data) => ({
  type: NOTIFY,
  payload: {
    type: 'info',
    title: 'Info',
    message: data,
  },
});
