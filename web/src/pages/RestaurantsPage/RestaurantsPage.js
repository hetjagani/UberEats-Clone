import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCartItems } from '../../actions/cart';
import withAuth from '../AuthPage/withAuth';
import NavBar from './NavBar';
import RestaurantsGrid from './RestaurantsGrid';

const RestaurantsPage = ({ favs }) => {
  const loginCustomer = useSelector((state) => state.customers.loginCustomer);

  const [address, setAddress] = useState('');
  const [restaurantType, setRestaurantType] = useState('delivery');
  const [foodType, setFoodType] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [city, setCity] = useState('');

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCartItems());
  }, []);

  return (
    <div>
      <NavBar
        address={address}
        setAddress={setAddress}
        restaurantType={restaurantType}
        setRestaurantType={setRestaurantType}
        foodType={foodType}
        setFoodType={setFoodType}
        searchQ={searchQ}
        setSearchQ={setSearchQ}
        city={city}
        setCity={setCity}
      />
      <RestaurantsGrid
        favs={favs}
        address={address}
        restaurant_type={restaurantType}
        food_type={foodType[0] && foodType[0].id}
        searchQ={searchQ}
        city={city[0]?.id}
      />
    </div>
  );
};

export default withAuth(RestaurantsPage, 'customer');
