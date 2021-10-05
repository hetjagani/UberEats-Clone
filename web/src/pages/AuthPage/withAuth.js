import React from 'react';
import { Redirect, Route } from 'react-router';
import getLoginDetails from '../../utils/getLoginDetails';

const withAuth = (WrappedComponent, ar) => {
  return (props) => {
    const { role } = getLoginDetails();

    if (!role) {
      return <Redirect to={'/auth/login'} />;
    } else if (role === 'customer' && role === ar) {
      return <WrappedComponent {...props} />;
    } else if (role === 'restaurant' && role === ar) {
      return <WrappedComponent {...props} />;
    } else if (ar === 'any') {
      return <WrappedComponent {...props} />;
    } else {
      return role === 'customer' ? (
        <Redirect to={'/restaurants'} />
      ) : (
        <Redirect to={'/dashboard'} />
      );
    }
  };
};

export default withAuth;
