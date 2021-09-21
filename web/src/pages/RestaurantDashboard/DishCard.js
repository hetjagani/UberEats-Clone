import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { Card, StyledAction, StyledBody, StyledThumbnail } from 'baseui/card';
import { Paragraph1 } from 'baseui/typography';
import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton, SIZE, ROLE } from 'baseui/modal';
import { FormControl } from 'baseui/form-control';
import { Input, MaskedInput } from 'baseui/input';
import { Select } from 'baseui/select';
import { FileUploader } from 'baseui/file-uploader';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const DishCard = ({ dish, editable }) => {
  const [css] = useStyletron();
  const imgContainer = css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  });

  let featuredMediaURL = '';
  if (dish.media && dish.media.length > 0) {
    featuredMediaURL = dish.media[0].url;
  }

  const [isOpen, setIsOpen] = React.useState(false);
  function close() {
    setIsOpen(false);
  }

  const [name, setName] = useState(dish.name);
  const [description, setDescription] = useState(dish.description);
  const [price, setPrice] = useState(dish.price);
  const [foodType, setFoodType] = useState([{ id: dish.food_type }]);
  const [category, setCategory] = useState([{ id: dish.category }]);
  const [media, setMedia] = useState(dish.media);

  return (
    <>
      <Card overrides={{ Root: { style: { width: '100%', margin: '10px' } } }} title={dish.name}>
        <StyledThumbnail src={featuredMediaURL} />
        <StyledBody>
          <Paragraph1>{dish.description} </Paragraph1>
          <Paragraph1>
            <strong>Price: </strong> ${dish.price} <br />
            <strong>Food Type: </strong> {dish.food_type} <br />
            <strong>Category: </strong> {dish.category.replace('_', ' ')}
          </Paragraph1>
        </StyledBody>
        {editable && (
          <StyledAction>
            <Button
              overrides={{ BaseButton: { style: { width: '100%' } } }}
              onClick={() => setIsOpen(true)}
            >
              Edit
            </Button>
          </StyledAction>
        )}
      </Card>

      <Modal
        onClose={close}
        isOpen={isOpen}
        overrides={{
          Dialog: {
            style: {
              width: '50vw',
              height: 'auto',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <ModalHeader>Edit Dish</ModalHeader>
        <ModalBody style={{ flex: '1 1 0' }}>
          <FormControl label={() => 'Name'}>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </FormControl>
          <FormControl label={() => 'Description'}>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} required />
          </FormControl>
          <FormControl label={() => 'Price'}>
            <MaskedInput
              mask="$99999"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </FormControl>
          <FormControl label="Type of Food">
            <Select
              value={foodType}
              onChange={({ value }) => setFoodType(value)}
              options={[
                { id: 'veg', type: 'Vegitarian' },
                { id: 'non-veg', type: 'Non Vegitarian' },
                { id: 'vegan', type: 'Vegan' },
              ]}
              labelKey="type"
              valueKey="id"
              required
            />
          </FormControl>
          <FormControl label="Food Category">
            <Select
              value={category}
              onChange={({ value }) => setCategory(value)}
              options={[
                { id: 'appetizer', cat: 'Appetizer' },
                { id: 'salad', cat: 'Salad' },
                { id: 'main_course', cat: 'Main Course' },
                { id: 'dessert', cat: 'Dessert' },
                { id: 'beverage', cat: 'Beverage' },
              ]}
              labelKey="cat"
              valueKey="id"
              required
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <div className={imgContainer}>
            <div style={{ width: '80%', margin: '20px' }}>
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
                      <div key={m.id}>
                        <img src={m.url} alt={m.alt_text} style={{ width: '50%', height: '50%' }} />
                      </div>
                    );
                  })}
              </Carousel>
            </div>
            <div style={{ width: '80%', margin: '20px' }}>
              <FileUploader />
            </div>
          </div>
          <ModalButton
            kind="minimal"
            onClick={(e) => {
              setIsOpen(false);
            }}
          >
            CANCEL
          </ModalButton>
          <ModalButton>SAVE</ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DishCard;
