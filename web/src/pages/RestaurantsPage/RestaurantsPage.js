import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllCartItems } from '../../actions/cart';
import withAuth from '../AuthPage/withAuth';
import NavBar from './NavBar';
import RestaurantsGrid from './RestaurantsGrid';

const RestaurantsPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCartItems());
  }, []);
  return (
    <div>
      <NavBar />
      <RestaurantsGrid />
    </div>
  );
};

export default withAuth(RestaurantsPage, 'customer');
