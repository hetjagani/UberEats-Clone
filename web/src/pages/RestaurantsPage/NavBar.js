import React, { useState } from 'react';
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationItem as NavigationItem,
  StyledNavigationList as NavigationList,
} from 'baseui/header-navigation';
import { StyledLink as Link } from 'baseui/link';
import { Select, StatefulSelect as Search, TYPE } from 'baseui/select';
import { ANCHOR, Drawer } from 'baseui/drawer';
import Menu from 'baseui/icon/menu';
import { Radio, RadioGroup } from 'baseui/radio';
import { FaShoppingCart } from 'react-icons/fa';
import { Button, SIZE, SHAPE, KIND } from 'baseui/button';
import { useStyletron } from 'baseui';
import { useSelector } from 'react-redux';
import { Avatar } from 'baseui/avatar';
import { ListItem, ListItemLabel, ARTWORK_SIZES } from 'baseui/list';
import { RiFileList3Fill, RiMap2Line } from 'react-icons/ri';
import { MdFavorite } from 'react-icons/md';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import { clearData } from '../../utils/clearData';
import { ButtonGroup, SIZE as btnGrpSize, SHAPE as btnGrpShp, MODE } from 'baseui/button-group';
import { Input } from 'baseui/input';
import { BiCurrentLocation, BiFoodTag } from 'react-icons/bi';

const NavBar = ({
  address,
  setAddress,
  restaurantType,
  setRestaurantType,
  foodType,
  setFoodType,
  searchQ,
  setSearchQ,
  city,
  setCity,
}) => {
  const [css] = useStyletron();

  const drawerContainer = css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  });

  const foodTypeOpts = [
    { id: '', foodType: 'All' },
    { id: 'veg', foodType: 'Vegitarian' },
    { id: 'non-veg', foodType: 'Non Vegitarian' },
    { id: 'vegan', foodType: 'Vegan' },
  ];

  const cityOpts = [
    { id: '', city: 'All' },
    { id: 'San Jose', city: 'San Jose' },
    { id: 'Berkely', city: 'Berkely' },
    { id: 'Los Angeles', city: 'Los Angeles' },
    { id: 'San Diego', city: 'San Diego' },
    { id: 'San Francisco', city: 'San Francisco' },
    { id: 'Fresno', city: 'Fresno' },
    { id: 'Sacremento', city: 'Sacremento' },
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deliveryTypeselected, setDeliveryTypeselected] = useState(0);

  const { loginCustomer, medium, cartDishes } = useSelector((state) => {
    return {
      loginCustomer: state.customers.loginCustomer,
      medium: state.customers.medium,
      cartDishes: state.cart.dishes,
    };
  });

  const history = useHistory();

  const signOutUser = () => {
    clearData();
    window.location.href = '/auth/login';
  };

  return (
    <div style={{ width: '100%' }}>
      <Drawer
        isOpen={drawerOpen}
        anchor={ANCHOR.left}
        autoFocus
        onClose={() => setDrawerOpen(false)}
      >
        <div className={drawerContainer}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginBottom: '50px',
            }}
          >
            <div>
              <Avatar name={loginCustomer.name} size="scale1600" src={medium && medium.url} />
            </div>
            <div>
              <div>
                <strong style={{ fontSize: 18, margin: 40 }}>{loginCustomer.name}</strong>
              </div>
              <div>
                <strong style={{ fontSize: 18, margin: 40 }}>
                  <Link href="/details/update">View account</Link>
                </strong>
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '70vh',
              }}
            >
              <ListItem artwork={(props) => <RiFileList3Fill size={25} />}>
                <ListItemLabel>
                  <Link href="/orders/customers">Orders</Link>
                </ListItemLabel>
              </ListItem>
              <ListItem artwork={(props) => <MdFavorite size={25} />}>
                <ListItemLabel>
                  <Link href="/restaurants/favourites">Show Favourites</Link>
                </ListItemLabel>
              </ListItem>
              <ListItem artwork={(props) => <RiMap2Line size={25} />}>
                <ListItemLabel>
                  <Link href="/addresses">Addresses</Link>
                </ListItemLabel>
              </ListItem>
              <ListItem artwork={(props) => <BiFoodTag size={25} />}>
                <Search
                  options={foodTypeOpts}
                  labelKey="foodType"
                  valueKey="id"
                  placeholder="Filter By Food Type"
                  onChange={({ value }) => {
                    setFoodType && setFoodType(value);
                  }}
                  value={foodType}
                />
              </ListItem>
              <ListItem artwork={(props) => <BiCurrentLocation size={25} />}>
                <Search
                  options={cityOpts}
                  labelKey="city"
                  valueKey="id"
                  placeholder="Filter By City"
                  onChange={({ value }) => {
                    setCity && setCity(value);
                  }}
                  value={city}
                />
              </ListItem>
            </div>
            <div style={{ width: '100%' }}>
              <Button
                className={css({ width: '100%' })}
                onClick={() => signOutUser()}
                kind={KIND.primary}
                size={SIZE.large}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
      <HeaderNavigation>
        <NavigationList $align={ALIGN.left}>
          <NavigationItem>
            <Link onClick={() => setDrawerOpen(true)}>
              <Menu size={25} />
            </Link>
          </NavigationItem>
          <NavigationItem>
            <NavLink to="/restaurants">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1052 170"
                  height="48"
                  width="150"
                >
                  <path
                    d="M787.3 105.2c0-21-16.8-37.5-38-37.5-20.9 0-38 16.5-38 37.5s17.1 37.5 38 37.5c21.2 0 38-16.5 38-37.5m31-61.4v122.9h-31.6v-11.1c-11 9.1-24.9 14.2-40 14.2-37.4 0-66.6-28.7-66.6-64.6 0-35.8 29.3-64.6 66.6-64.6 15.1 0 29 5.1 40 14.2v-11h31.6zm105 95h-23.8c-7.2 0-11.9-3.1-11.9-9.7V71.6h35.6V43.8h-35.6v-35h-31.9v35h-24v27.9h24V137c0 16.5 11.9 29.6 33.3 29.6h34.2v-27.8zm72 31c36.5 0 57.1-17.1 57.1-40.7 0-16.8-12.2-29.3-37.7-34.7l-27-5.4c-15.6-2.8-20.6-5.7-20.6-11.4 0-7.4 7.5-11.9 21.4-11.9 15.1 0 26.1 4 29.3 17.6h31.6c-1.7-25.6-20.6-42.7-58.8-42.7-33 0-56.2 13.4-56.2 39.3 0 17.9 12.8 29.6 40.3 35.3l30.1 6.8c11.9 2.3 15.1 5.4 15.1 10.2 0 7.7-9 12.5-23.5 12.5-18.2 0-28.7-4-32.7-17.6h-31.9c4.7 25.6 24.1 42.7 63.5 42.7M552.6.2h119.1v28.4h-86.9v40.7h84.6v27.6h-84.6v41.2h86.9v28.4H552.6V.2z"
                    fill="#06c167"
                  />
                  <path
                    d="M496 66.7V44.4h-8.5c-13.5 0-23.5 6.2-29.5 15.9v-15h-24.2v121.1h24.4V97.6c0-18.8 11.6-30.9 27.6-30.9H496zm-175.6 28c4.4-18.5 19.6-30.9 37.7-30.9s33.4 12.3 37.5 30.9h-75.2zM358.6 43c-36 0-63.4 28.7-63.4 62.9 0 36.1 28.5 63.2 65.6 63.2 22.5 0 40.9-9.7 53.2-25.9l-17.7-12.8c-9.2 12.1-21.3 17.8-35.6 17.8-20.8 0-37.5-14.7-40.9-34.4h100.4V106c.1-36.2-26-63-61.6-63M219 148.2c-23.7 0-42.6-18.8-42.6-42 0-23.5 19.1-42 42.6-42 23.2 0 42.3 18.5 42.3 42 .1 23.2-19 42-42.3 42m-66.5 18.3h24.2v-15.2c11.1 11.2 26.9 18 44 18 36.3 0 64.8-28.3 64.8-63.2 0-35.1-28.5-63.4-64.8-63.4-17.2 0-32.7 6.9-43.8 18V.2h-24.4v166.3zM66.6 147c23.5 0 41.6-17.8 41.6-44.2V.2h25.4v166.2h-25.2V151c-11.4 11.6-27.1 18.3-44.8 18.3-36.3 0-64.1-25.9-64.1-65.1V.2H25v102.6c0 26.9 17.9 44.2 41.6 44.2"
                    fill="#142328"
                  />
                </svg>
              </div>
            </NavLink>
          </NavigationItem>
          <NavigationItem>
            <div
              style={{
                backgroundColor: '#EEEEEE',
                borderRadius: '100px',
                padding: '5px',
                height: '60px',
                boxSizing: 'border-box',
              }}
            >
              <ButtonGroup
                mode={MODE.radio}
                shape={btnGrpShp.pill}
                selected={deliveryTypeselected}
                onClick={(event, index) => {
                  setDeliveryTypeselected(index);
                  index == 0
                    ? setRestaurantType && setRestaurantType('delivery')
                    : setRestaurantType && setRestaurantType('pickup');
                }}
              >
                <Button
                  style={
                    deliveryTypeselected === 0 ? { backgroundColor: 'white', color: 'black' } : {}
                  }
                >
                  Delivery
                </Button>
                <Button
                  style={
                    deliveryTypeselected === 1 ? { backgroundColor: 'white', color: 'black' } : {}
                  }
                >
                  Pickup
                </Button>
              </ButtonGroup>
            </div>
          </NavigationItem>
          <NavigationItem style={{ width: '20vw', margin: '10px' }}>
            <Input
              placeholder="Search Address"
              onChange={(e) => {
                setAddress && setAddress(e.target.value);
              }}
              value={address}
            />
          </NavigationItem>
        </NavigationList>
        <NavigationList $align={ALIGN.center} />
        <NavigationList $align={ALIGN.right} style={{ margin: '20px' }}>
          <NavigationItem style={{ width: '40vw' }}>
            <Input
              placeholder="Search Restaurants"
              onChange={(e) => {
                setSearchQ && setSearchQ(e.target.value);
              }}
              value={searchQ}
            />
          </NavigationItem>
          <NavigationItem>
            <Button
              onClick={() => {
                history.push('/cart');
              }}
              size={SIZE.compact}
              shape={SHAPE.pill}
            >
              <FaShoppingCart style={{ marginRight: '10px' }} /> {cartDishes.length}
            </Button>
          </NavigationItem>
        </NavigationList>
      </HeaderNavigation>
    </div>
  );
};

export default NavBar;
