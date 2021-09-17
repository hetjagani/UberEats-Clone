import React, { useEffect, useState } from 'react';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Textarea } from 'baseui/textarea';
import { useStyletron } from 'baseui';
import { Select } from 'baseui/select';
import { Button, KIND, SIZE, SHAPE } from 'baseui/button';
import { useDispatch, useSelector } from 'react-redux';
import { createCustomer } from '../../actions/customers';
import { Notification } from 'baseui/notification';

function CustomerDetails({ loginDetails }) {
  const [css, theme] = useStyletron();
  const formContainer = css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
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
  const [nickName, setNickName] = useState('');
  const [about, setAbout] = useState('');
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [country, setCountry] = useState([]);
  const [contactNo, setContactNo] = useState('');

  const [showError, setShowError] = useState(false);

  const dispatch = useDispatch();

  const { error, customer } = useSelector((state) => {
    return {
      error: state.errors.error,
      customer: state.customers.customer,
    };
  });

  useEffect(() => {
    if (error.message && error.message != '') {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [error.message]);

  const saveCustomerDetails = () => {
    const data = {
      id: loginDetails.id,
      name,
      nickname: nickName,
      about,
      city: city[0] && city[0].city,
      state: state[0] && state[0].state,
      country: country[0] && country[0].country,
      contact_no: contactNo,
    };
    dispatch(createCustomer(data));
  };

  return (
    <div className={formContainer}>
      <FormControl label={() => 'Name'}>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </FormControl>
      <FormControl label={() => 'NickName'}>
        <Input value={nickName} onChange={(e) => setNickName(e.target.value)} />
      </FormControl>

      <FormControl label="About You" caption="Tell us something about you">
        <Textarea value={about} onChange={(event) => setAbout(event.currentTarget.value)} />
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
        <Input value={contactNo} onChange={(e) => setContactNo(e.target.value)} required />
      </FormControl>

      {showError && (
        <Notification kind="warning" $style={{ alignSelf: 'center', width: '50%' }} closeable>
          {() => JSON.stringify(error.message)}
        </Notification>
      )}

      <Button
        type="submit"
        $style={{ alignSelf: 'baseline', width: '30%' }}
        size={SIZE.large}
        onClick={saveCustomerDetails}
      >
        Save
      </Button>
    </div>
  );
}

export default CustomerDetails;
