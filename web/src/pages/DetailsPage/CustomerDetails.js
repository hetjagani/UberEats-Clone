import React, { useEffect, useState } from 'react';
import { FormControl } from 'baseui/form-control';
import { Input, MaskedInput } from 'baseui/input';
import { Textarea } from 'baseui/textarea';
import { useStyletron } from 'baseui';
import { Select, StatefulSelect } from 'baseui/select';
import { Button, SIZE } from 'baseui/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCustomerMedium,
  createCustomer,
  createCustomerMedium,
  updateCustomer,
} from '../../actions/customers';
import { Display4 } from 'baseui/typography';
import { Card } from 'baseui/card';
import { FileUploader } from 'baseui/file-uploader';
import S3 from 'react-aws-s3';
import notify from '../../utils/notify';
import { useHistory } from 'react-router';

function CustomerDetails({ loginDetails, update }) {
  const [css, theme] = useStyletron();
  const formContainer = css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
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

  const { medium, loginCustomer } = useSelector((state) => {
    return { medium: state.customers.medium, loginCustomer: state.customers.loginCustomer };
  });

  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [about, setAbout] = useState('');
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [country, setCountry] = useState([]);
  const [contactNo, setContactNo] = useState('');

  const [isUploading, setIsUploading] = React.useState(false);

  useEffect(() => {
    if (update) {
      setName(loginCustomer.name);
      setNickName(loginCustomer.nickname);
      setAbout(loginCustomer.about);
      setCity([{ city: loginCustomer.city }]);
      setState([{ state: loginCustomer.state }]);
      setCountry([{ country: loginCustomer.country }]);
      setContactNo(loginCustomer.contact_no);
    }
  }, []);

  const dispatch = useDispatch();
  const history = useHistory();

  const saveCustomerDetails = () => {
    if (
      name == '' ||
      nickName == '' ||
      city == [] ||
      state == [] ||
      country == [] ||
      contactNo == ''
    ) {
      notify({ type: 'error', description: 'Invalid Values' });
      return;
    }
    const data = {
      id: loginDetails.id,
      name,
      nickname: nickName,
      about,
      city: city[0] && city[0].city,
      state: state[0] && state[0].state,
      country: country[0] && country[0].country,
      contact_no: contactNo,
      medium: medium,
    };
    if (update) {
      dispatch(updateCustomer(data, data.id)).then(() => {
        history.push('/restaurants');
      });
    } else {
      dispatch(createCustomer(data)).then(() => {
        history.push('/restaurants');
      });
    }
  };

  const clearMedia = () => {
    dispatch(clearCustomerMedium());
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

    if (acceptedFiles.length > 0) {
      s3.uploadFile(acceptedFiles[0], acceptedFiles[0].name)
        .then((res) => {
          notify({ type: 'info', description: `File ${res.key} uploded...` });

          if (res.status == 204) {
            dispatch(createCustomerMedium({ alt_text: res.key, url: res.location }));
          }
          setIsUploading(false);
        })
        .catch((err) => {
          console.log(err);
          notify({ type: 'error', description: `Uploading File Failed` });
        });
    }
  };

  return (
    <div className={mainContainer}>
      <div className={formContainer}>
        <Display4>Customer Profile</Display4>
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
          <MaskedInput
            placeholder="Phone number"
            mask="(999) 999-9999"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
          />
        </FormControl>

        <Button
          type="submit"
          $style={{ alignSelf: 'baseline', width: '30%' }}
          size={SIZE.large}
          onClick={saveCustomerDetails}
        >
          Save
        </Button>
      </div>
      <div className={imgContainer}>
        {medium?.url ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Card
              overrides={{ Root: { style: { width: '512px' } } }}
              headerImage={medium.url}
              title="Profile Picture"
            ></Card>
            <Button className={css({ margin: '40px' })} onClick={clearMedia}>
              Clear Profile Picture
            </Button>
          </div>
        ) : (
          <FileUploader
            onCancel={() => setIsUploading(false)}
            onDrop={mediaUpload}
            progressMessage={isUploading ? `Uploading... hang tight.` : ''}
          />
        )}
      </div>
    </div>
  );
}

export default CustomerDetails;
