import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router';
import getLoginDetails from '../../utils/getLoginDetails';

const withAuth = (WrappedComponent, ar) => {
  return (props) => {
    const { role, id } = getLoginDetails();

    if (!role) {
      return <Redirect to={'/auth/login'} />;
    } else if (role === 'customer' && role === ar) {
      return <WrappedComponent {...props} />;
    } else if (role === 'restaurant' && role === ar) {
      return <WrappedComponent {...props} />;
    } else {
      return <div>Unauthorized</div>;
    }
  };
};

export default withAuth;
