import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllCartItems } from '../../actions/cart';
import withAuth from '../AuthPage/withAuth';
import NavBar from './NavBar';
import RestaurantsGrid from './RestaurantsGrid';

const RestaurantsPage = () => {
  const [favs, setFavs] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCartItems());
  }, []);
  return (
    <div>
      <NavBar setFavs={setFavs} favs={favs} />
      <RestaurantsGrid favs={favs} />
    </div>
  );
};

export default withAuth(RestaurantsPage, 'customer');
