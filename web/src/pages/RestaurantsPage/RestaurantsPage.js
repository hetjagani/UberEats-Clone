import React from 'react';
import withAuth from '../AuthPage/withAuth';
import NavBar from './NavBar';

const RestaurantsPage = () => {
  return (
    <div>
      <NavBar />
    </div>
  );
};

export default withAuth(RestaurantsPage, 'customer');
