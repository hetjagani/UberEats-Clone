import { useStyletron } from 'baseui';
import { H2, Paragraph2 } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from '../RestaurantsPage/NavBar';
import { Table, SIZE } from 'baseui/table-semantic';
import { Button } from 'baseui/button';
import { placedOrder, removeDishFromCart, updateItemInCart } from '../../actions/cart';
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';
import { useHistory } from 'react-router';
import notify from '../../utils/notify';
import withAuth from '../AuthPage/withAuth';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton } from 'baseui/modal';
import { Input } from 'baseui/input';
import query from '../../utils/graphql/query';
import { initOrderMutation } from '../../mutations/mutations';

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
    dispatch(removeDishFromCart(id));
  };

  const [updateItem, setUpdateItem] = useState('');
  const [updateRestaurant, setUpdateRestaurant] = useState('');
  const [updateModal, setUpdateModal] = useState(false);
  const [updateQty, setUpdateQty] = useState(1);
  const [updateNotes, setUpdateNotes] = useState('');

  const updateDishDetails = (data) => {
    setUpdateItem(data.itemId);
    setUpdateRestaurant(data.restaurantId);
    setUpdateModal(true);
  };

  const updateCartItem = () => {
    const data = {
      restaurantId: updateRestaurant,
      quantity: updateQty,
      notes: updateNotes,
    };
    dispatch(updateItemInCart(data, updateItem)).then(() => {
      setUpdateModal(false);
    });
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
          <Button
            onClick={() => {
              updateDishDetails({ itemId: dish.itemId, restaurantId: dish.dish.restaurantId });
            }}
          >
            Update
          </Button>,
        ]);
      }
    });
    setTableData(td);
  }, [dishes]);

  const history = useHistory();

  const createOrder = () => {
    const variables = { type: restaurant.restaurant_type };
    query(initOrderMutation, variables)
      .then((res) => {
        console.log(res.initOrder);
        dispatch(placedOrder());
        history.push(`/orders/${res.initOrder._id}`);
      })
      .catch((err) => {
        notify({ type: 'error', description: 'Error creating order' });
      });
  };

  return (
    <div>
      <Modal
        onClose={() => {
          setUpdateModal(false);
        }}
        isOpen={updateModal}
      >
        <ModalHeader>Update Cart Item</ModalHeader>
        <ModalBody>
          Quantity:
          <Input
            type="number"
            value={updateQty}
            onChange={(e) => setUpdateQty(e.target.value)}
            placeholder="Quantity"
            clearOnEscape
          />
          Notes:
          <Input
            value={updateNotes}
            onChange={(e) => setUpdateNotes(e.target.value)}
            placeholder="Additional Notes for item"
            clearOnEscape
          />
        </ModalBody>
        <ModalFooter>
          <ModalButton
            kind="tertiary"
            onClick={() => {
              setUpdateModal(false);
            }}
          >
            Cancel
          </ModalButton>
          <ModalButton onClick={updateCartItem}>Save</ModalButton>
        </ModalFooter>
      </Modal>
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
            columns={['Name', 'Description', 'Price', 'Qty', 'Notes', 'Remove', 'Update']}
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
          <Paragraph2>
            <strong>Name:</strong> {restaurant.name}
          </Paragraph2>
          <Paragraph2>
            <strong>Description:</strong> {restaurant.description}
          </Paragraph2>
          <Paragraph2>
            <strong>Address:</strong> {restaurant.address}
          </Paragraph2>
          <Paragraph2>
            <strong>Contact No:</strong> {restaurant.contact_no}
          </Paragraph2>
          <Paragraph2>
            <strong>Timing:</strong> {restaurant.time_open} - {restaurant.time_close}
          </Paragraph2>
          <Paragraph2>
            <strong>Type:</strong>{' '}
            {restaurant.restaurant_type && restaurant.restaurant_type.toUpperCase()}
          </Paragraph2>
        </div>
      </div>
    </div>
  );
};

export default withAuth(MyCartPage, 'customer');
