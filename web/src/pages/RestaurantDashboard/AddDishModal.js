import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton } from 'baseui/modal';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Select } from 'baseui/select';
import { FileUploader } from 'baseui/file-uploader';
import S3 from 'react-aws-s3';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import axios from 'axios';
import notify from '../../utils/notify';
import { useDispatch } from 'react-redux';
import { createRestaurantDish } from '../../actions/restaurants';

const AddDishModal = ({ isOpen, setIsOpen, resID }) => {
  const [css] = useStyletron();
  const imgContainer = css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  });

  function close() {
    setIsOpen(false);
  }

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0.0);
  const [foodType, setFoodType] = useState([]);
  const [category, setCategory] = useState([]);
  const [media, setMedia] = useState([]);

  const [isUploading, setIsUploading] = useState(false);

  const mediaUpload = (acceptedFiles, rejectedFiles) => {
    const config = {
      bucketName: window.AWS_BUCKET_NAME,
      region: window.AWS_REGION,
      accessKeyId: window.AWS_ACCESS_ID,
      secretAccessKey: window.AWS_ACCESS_KEY,
      s3Url: 'https://uber-eats-media.s3.amazonaws.com',
    };

    const s3 = new S3(config);

    setIsUploading(true);

    acceptedFiles.forEach((file) => {
      s3.uploadFile(file, file.name)
        .then((res) => {
          notify({ type: 'info', description: `File ${res.key} uploaded...` });

          if (res.status == 204) {
            setMedia([...media, { alt_text: res.key, url: res.location }]);
            notify({ type: 'info', description: 'Added dish media' });
          }
          setIsUploading(false);
        })
        .catch((err) => {
          console.log(err);
          notify({ type: 'error', description: 'Uploading File Failed' });
        });
    });
  };

  const clearMedia = () => {
    setMedia([]);
  };

  const dispatch = useDispatch();

  const saveDish = () => {
    const data = {
      name,
      description,
      price,
      food_type: foodType[0] && foodType[0].id,
      category: category[0] && category[0].id,
      media,
    };

    dispatch(createRestaurantDish(data, resID)).then(() => {
      setName('');
      setDescription('');
      setPrice(0);
      setFoodType([]);
      setCategory([]);
      setMedia([]);
      setIsOpen(false);
    });
  };

  return (
    <div>
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
        <ModalHeader>Create Dish</ModalHeader>
        <ModalBody style={{ flex: '1 1 0' }}>
          <FormControl label={() => 'Name'}>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </FormControl>
          <FormControl label={() => 'Description'}>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} required />
          </FormControl>
          <FormControl label={() => 'Price'}>
            <Input
              type="number"
              placeholder="Price in Dollars"
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
                {media &&
                  media.length > 0 &&
                  media.map((m) => {
                    return (
                      <div key={m.id}>
                        <img src={m.url} alt={m.alt_text} style={{ width: '50%', height: '50%' }} />
                      </div>
                    );
                  })}
              </Carousel>
            </div>
            <div style={{ width: '80%', margin: '20px' }}>
              <FileUploader
                onCancel={() => setIsUploading(false)}
                onDrop={mediaUpload}
                progressMessage={isUploading ? `Uploading... hang tight.` : ''}
              />
            </div>
            <Button onClick={clearMedia}>Clear Images</Button>
          </div>
          <ModalButton
            kind="minimal"
            onClick={(e) => {
              setIsOpen(false);
            }}
          >
            CANCEL
          </ModalButton>
          <ModalButton onClick={saveDish}>SAVE</ModalButton>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default React.memo(AddDishModal, (prevProps, nextProps) => {
  return false;
});
