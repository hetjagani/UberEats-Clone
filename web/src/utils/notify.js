import { toast } from 'react-toastify';

const notify = ({ type, description }) => {
  toast[type](`${type}: ${description}`, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export default notify;
