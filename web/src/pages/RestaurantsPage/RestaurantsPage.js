import React, { useEffect, useState } from 'react';
import withAuth from '../AuthPage/withAuth';
import NavBar from './NavBar';
import RestaurantsGrid from './RestaurantsGrid';

const RestaurantsPage = () => {
  return (
    <div>
      <NavBar />
      <RestaurantsGrid />
    </div>
  );
};

export default withAuth(RestaurantsPage, 'customer');
