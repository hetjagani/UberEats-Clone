import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'baseui/modal';
import DishCard from '../RestaurantDashboard/DishCard';
import { Carousel } from 'react-responsive-carousel';
import { useStyletron } from 'baseui';
import { Paragraph1 } from 'baseui/typography';
import { Input, SIZE, ADJOINED } from 'baseui/input';
import { Button } from 'baseui/button';
import { useDispatch, useSelector } from 'react-redux';
import { addDishToCart } from '../../actions/cart';

const DishDetails = ({ dish, resId }) => {
  const [css] = useStyletron();
  const footerStyle = css({
    display: 'flex',
    justifyContent: 'space-between',
  });

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const addDish = () => {
    const data = {
      dishId: dish._id,
      restaurantId: resId,
      quantity: parseInt(quantity, 10),
      notes,
    };

    dispatch(addDishToCart(data)).then(() => {
      setIsOpen(false);
    });
  };

  function close() {
    setIsOpen(false);
  }

  return (
    <React.Fragment>
      <div style={{ width: '450px', height: 'fit-content' }} onClick={() => setIsOpen(true)}>
        <DishCard dish={dish} editable={false} resID={resId} />
      </div>
      <Modal
        onClose={close}
        isOpen={isOpen}
        overrides={{
          Dialog: {
            style: {
              width: '60vw',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <ModalHeader>
          <Carousel
            className={css({ width: '100%' })}
            autoPlay={true}
            dynamicHeight={true}
            interval={5000}
            showThumbs={false}
            infiniteLoop={true}
          >
            {dish.media &&
              dish.media.length > 0 &&
              dish.media.map((m) => {
                return (
                  <div key={m._id}>
                    <img src={m.url} alt={m.alt_text} style={{ width: '50%', height: '50%' }} />
                  </div>
                );
              })}
          </Carousel>

          {dish.name}
        </ModalHeader>
        <ModalBody>
          <Paragraph1>
            <strong>Description: </strong> {dish.description}
          </Paragraph1>
          <strong>Price: </strong>$ {dish.price} <br />
          <strong>Food Type: </strong>
          {dish.food_type} <br />
          <strong>Category: </strong>
          {dish.category.replace('_', ' ')} <br />
        </ModalBody>
        <ModalFooter className={footerStyle}>
          <div style={{ display: 'flex' }}>
            <Input
              value={quantity}
              type="number"
              onChange={(e) => setQuantity(e.target.value)}
              size={SIZE.default}
              placeholder="Quantity"
              clearable
              clearOnEscape
            />
            <Input
              value={notes}
              type="text"
              onChange={(e) => setNotes(e.target.value)}
              size={SIZE.default}
              placeholder="Notes for preparation"
              clearable
              clearOnEscape
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <Button onClick={addDish}>Add to cart</Button>
          </div>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default DishDetails;
