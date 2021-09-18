import { useStyletron } from 'baseui';
import React, { useState } from 'react';
import { FormControl } from 'baseui/form-control';
import { Input, MaskedInput } from 'baseui/input';
import { Select } from 'baseui/select';
import { Button, SIZE } from 'baseui/button';
import { Textarea } from 'baseui/textarea';
import { Display4 } from 'baseui/typography';
import { Card } from 'baseui/card';
import { createRestaurant } from '../../actions/restaurants';
import { useDispatch } from 'react-redux';

const RestaurantDetails = ({ loginDetails }) => {
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
    marginLeft: '50px',
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

  const dispatch = useDispatch();

  const saveRestaurantDetails = () => {
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
      media: [],
    };
    dispatch(createRestaurant(data));
  };

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
        <Card
          overrides={{ Root: { style: { width: '512px' } } }}
          headerImage={'https://source.unsplash.com/user/erondu/700x400'}
          title="Profile Picture"
        ></Card>
      </div>
    </div>
  );
};

export default RestaurantDetails;
