import { useStyletron } from 'baseui';
import { H2, Label1 } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from '../RestaurantsPage/NavBar';
import { Table, SIZE } from 'baseui/table-semantic';
import { Button } from 'baseui/button';
import { placedOrder, removeDishFromCart } from '../../actions/cart';
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';
import { useHistory } from 'react-router';
import notify from '../../utils/notify';
import withAuth from '../AuthPage/withAuth';

const MyCartPage = () => {
  const [css] = useStyletron();
  const mainContainer = css({
    margin: '20px',
    display: 'flex',
    justifyContent: 'space-between',
  });
  const dishTableContainer = css({
    width: '50vw',
  });
  const restaurantContainer = css({
    width: '40vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
  });

  const { dishes, restaurant } = useSelector((state) => {
    return { dishes: state.cart.dishes, restaurant: state.cart.restaurant };
  });

  const [tableData, setTableData] = useState([]);

  const dispatch = useDispatch();

  const deleteFromCart = (id) => {
    console.log('Remove cart item ', id);
    dispatch(removeDishFromCart(id));
  };

  useEffect(() => {
    const td = [];
    dishes.forEach((dish) => {
      if (dish.dish) {
        td.push([
          dish.dish.name,
          dish.dish.description,
          dish.dish.price,
          dish.quantity,
          dish.notes,
          <Button
            onClick={() => {
              deleteFromCart(dish.itemId);
            }}
          >
            Remove
          </Button>,
        ]);
      }
    });
    setTableData(td);
  }, [dishes.length]);

  const history = useHistory();

  const createOrder = () => {
    axios
      .post(`/orders/${restaurant.restaurant_type}`)
      .then((res) => {
        console.log(res.data);
        dispatch(placedOrder())
        history.push(`/orders/${res.data.id}`);
      })
      .catch((err) => {
        notify({ type: 'error', description: 'Error creating order' });
      });
  };

  return (
    <div>
      <NavBar />
      <div className={mainContainer}>
        <div className={dishTableContainer}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <H2>My Cart</H2>
            </div>
            <div>
              <Button onClick={createOrder}>Checkout</Button>
            </div>
          </div>
          <Table
            columns={['Name', 'Description', 'Price', 'Qty', 'Notes', 'Remove']}
            data={tableData}
            horizontalScrollWidth={undefined}
            size={SIZE.spacious}
          />
        </div>
        <div className={restaurantContainer}>
          <H2>Restaurant Details</H2>
          <Carousel
            className={css({ width: '100%' })}
            autoPlay={true}
            dynamicHeight={true}
            interval={5000}
            showThumbs={false}
            infiniteLoop={true}
          >
            {restaurant.media &&
              restaurant.media.length > 0 &&
              restaurant.media.map((m) => {
                return (
                  <div key={m.id}>
                    <img src={m.url} alt={m.alt_text} style={{ width: '50%', height: '50%' }} />
                  </div>
                );
              })}
          </Carousel>
          <Label1>
            <strong>Name:</strong> {restaurant.name}
          </Label1>
          <Label1>
            <strong>Description:</strong> {restaurant.description}
          </Label1>
          <Label1>
            <strong>Address:</strong> {restaurant.address}
          </Label1>
          <Label1>
            <strong>Contact No:</strong> {restaurant.contact_no}
          </Label1>
          <Label1>
            <strong>Timing:</strong> {restaurant.time_open} - {restaurant.time_close}
          </Label1>
          <Label1>
            <strong>Type:</strong> {restaurant.restaurant_type && restaurant.restaurant_type.toUpperCase()}
          </Label1>
        </div>
      </div>
    </div>
  );
};

export default withAuth(MyCartPage, 'customer');
