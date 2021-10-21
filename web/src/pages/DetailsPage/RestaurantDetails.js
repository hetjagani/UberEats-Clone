import { useStyletron } from 'baseui';
import React, { useEffect, useState } from 'react';
import { FormControl } from 'baseui/form-control';
import { Input, MaskedInput } from 'baseui/input';
import { Select } from 'baseui/select';
import { Button, SIZE } from 'baseui/button';
import { Textarea } from 'baseui/textarea';
import { Display4 } from 'baseui/typography';
import { Card } from 'baseui/card';
import {
  clearRestaurantMedia,
  createRestaurant,
  createRestaurantMedia,
  updateRestaurant,
} from '../../actions/restaurants';
import { useDispatch, useSelector } from 'react-redux';
import { FileUploader } from 'baseui/file-uploader';
import S3 from 'react-aws-s3';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import notify from '../../utils/notify';
import { Redirect } from 'react-router';

const RestaurantDetails = ({ loginDetails, update }) => {
  const [css, theme] = useStyletron();
  const formContainer = css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginRight: '50px',
  });
  const mainContainer = css({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  });
  const imgContainer = css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '50px',
    width: '30vw',
  });

  const cityOpts = [
    { id: 'San Jose', city: 'San Jose' },
    { id: 'Berkely', city: 'Berkely' },
    { id: 'Los Angeles', city: 'Los Angeles' },
    { id: 'San Diego', city: 'San Diego' },
    { id: 'San Francisco', city: 'San Francisco' },
    { id: 'Fresno', city: 'Fresno' },
    { id: 'Sacremento', city: 'Sacremento' },
  ];

  const stateOpts = [
    { id: 'California', state: 'California' },
    { id: 'Arizona', state: 'Arizona' },
    { id: 'Colorado', state: 'Colorado' },
  ];

  const countryOpts = [{ id: 'United States', country: 'United States' }];

  const { media, loginRestaurant } = useSelector((state) => {
    return { media: state.restaurants.media, loginRestaurant: state.restaurants.loginRestaurant };
  });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [country, setCountry] = useState([]);
  const [contactNo, setContactNo] = useState('');
  const [timeOpen, setTimeOpen] = useState('');
  const [timeClose, setTimeClose] = useState('');
  const [foodType, setFoodType] = useState([]);
  const [resType, setResType] = useState([]);

  useEffect(() => {
    if (update) {
      setName(loginRestaurant.name);
      setDescription(loginRestaurant.description);
      setAddress(loginRestaurant.address);
      setCity([{ city: loginRestaurant.city }]);
      setState([{ state: loginRestaurant.state }]);
      setCountry([{ country: loginRestaurant.country }]);
      setContactNo(loginRestaurant.contact_no);
      setTimeOpen(loginRestaurant.time_open);
      setTimeClose(loginRestaurant.time_close);
      setFoodType([{ id: loginRestaurant.food_type }]);
      setResType([{ id: loginRestaurant.restaurant_type }]);
    }
  }, []);

  const [isUploading, setIsUploading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const dispatch = useDispatch();

  const saveRestaurantDetails = () => {
    if (
      name == '' ||
      description == '' ||
      address == '' ||
      city == [] ||
      state == [] ||
      country == [] ||
      contactNo == '' ||
      timeOpen == '' ||
      timeClose == '' ||
      foodType == [] ||
      resType == []
    ) {
      notify({ type: 'error', description: 'Invalid Values' });
      return;
    }
    const data = {
      id: loginDetails.id,
      name,
      description,
      address,
      city: city[0] && city[0].city,
      state: state[0] && state[0].state,
      country: country[0] && country[0].country,
      contact_no: contactNo,
      time_open: timeOpen,
      time_close: timeClose,
      food_type: foodType[0] && foodType[0].id,
      restaurant_type: resType[0] && resType[0].id,
      media: media,
    };

    if (update) {
      dispatch(updateRestaurant(data, data.id)).then(() => {
        setIsChanged(true);
      });
    } else {
      dispatch(createRestaurant(data)).then(() => {
        setIsChanged(true);
      });
    }
  };

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
            dispatch(createRestaurantMedia({ alt_text: res.key, url: res.location }));
          }
          setIsUploading(false);
        })
        .catch((err) => {
          console.log(err);
          notify({ type: 'error', description: `Uploading File Failed` });
        });
    });
  };

  const clearMedia = () => {
    dispatch(clearRestaurantMedia());
  };

  if (isChanged) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className={mainContainer}>
      <div className={formContainer}>
        <Display4>Restaurant Profile</Display4>
        <FormControl label={() => 'Name'}>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </FormControl>

        <FormControl label="Description" caption="Tell us something about your restaurant">
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
        </FormControl>

        <FormControl label={() => 'Address'}>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
        </FormControl>

        <FormControl label="Type to search city">
          <Select
            value={city}
            onChange={({ value }) => setCity(value)}
            options={cityOpts}
            labelKey="id"
            valueKey="city"
            required
          />
        </FormControl>

        <FormControl label="Type to search state">
          <Select
            value={state}
            onChange={({ value }) => setState(value)}
            options={stateOpts}
            labelKey="id"
            valueKey="state"
            required
          />
        </FormControl>

        <FormControl label="Type to search country">
          <Select
            value={country}
            onChange={({ value }) => setCountry(value)}
            options={countryOpts}
            labelKey="id"
            valueKey="country"
            required
          />
        </FormControl>

        <FormControl label={() => 'Contact No'}>
          <MaskedInput
            placeholder="Phone number"
            mask="(999) 999-9999"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
          />
        </FormControl>

        <FormControl label={() => 'Opening Time'}>
          <MaskedInput
            placeholder="Opening Time"
            mask="99:99"
            value={timeOpen}
            onChange={(e) => setTimeOpen(e.target.value)}
          />
        </FormControl>

        <FormControl label={() => 'Closing Time'}>
          <MaskedInput
            placeholder="Closing Time"
            mask="99:99"
            value={timeClose}
            onChange={(e) => setTimeClose(e.target.value)}
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

        <FormControl label="Type of Restaurant">
          <Select
            value={resType}
            onChange={({ value }) => setResType(value)}
            options={[
              { id: 'delivery', type: 'Delivery' },
              { id: 'pickup', type: 'Pickup' },
            ]}
            labelKey="type"
            valueKey="id"
            searchable={false}
            required
          />
        </FormControl>

        <Button
          type="submit"
          $style={{ alignSelf: 'baseline', width: '30%' }}
          size={SIZE.large}
          onClick={saveRestaurantDetails}
        >
          Save
        </Button>
      </div>

      <div className={imgContainer}>
        <Carousel $style={{ width: '80%' }}>
          {media &&
            media.length > 0 &&
            media.map((m) => {
              return (
                <div key={m.id}>
                  <img src={m.url} alt={m.alt_text} width="500" />
                </div>
              );
            })}
        </Carousel>
        <Button className={css({ margin: '20px' })} onClick={clearMedia}>
          Clear Images
        </Button>
        <FileUploader
          onCancel={() => setIsUploading(false)}
          onDrop={mediaUpload}
          progressMessage={isUploading ? `Uploading... hang tight.` : ''}
        />
      </div>
    </div>
  );
};

export default RestaurantDetails;
