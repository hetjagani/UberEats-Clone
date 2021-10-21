import { useStyletron } from 'baseui';
import React, { useEffect, useState } from 'react';
import withAuth from '../AuthPage/withAuth';
import NavBar from '../RestaurantsPage/NavBar';
import { Table, SIZE } from 'baseui/table-semantic';
import { useDispatch, useSelector } from 'react-redux';
import { H2, Paragraph1, Paragraph2 } from 'baseui/typography';
import { Button } from 'baseui/button';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE as modalSize,
  ROLE,
} from 'baseui/modal';
import { KIND as ButtonKind } from 'baseui/button';
import { Select } from 'baseui/select';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import {
  createCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
} from '../../actions/customers';

const AddressesPage = () => {
  const [css] = useStyletron();
  const mainContainer = css({
    display: 'flex',
    width: '100vw',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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

  const { loginCustomer, addresses } = useSelector((state) => {
    return { loginCustomer: state.customers.loginCustomer, addresses: state.customers.addresses };
  });

  const [tableData, setTableData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [updateId, setUpdateId] = useState('');

  const [firstLine, setFirstLine] = useState('');
  const [secondLine, setSecondLine] = useState('');
  const [zipcode, setZipcode] = useState(0);
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [country, setCountry] = useState([]);

  useEffect(() => {
    const data = [];
    if (addresses) {
      addresses.forEach((add) => {
        data.push([
          <Paragraph2>{add.firstLine}</Paragraph2>,
          <Paragraph2>{add.secondLine}</Paragraph2>,
          <Paragraph2>{add.zipcode}</Paragraph2>,
          <Paragraph2>{add.city}</Paragraph2>,
          <Paragraph2>{add.state}</Paragraph2>,
          <Paragraph2>{add.country}</Paragraph2>,
          <Button
            onClick={() => {
              deleteAddress(add._id);
            }}
          >
            Delete
          </Button>,
          <Button
            onClick={() => {
              openUpdateModal(add._id);
            }}
          >
            Update
          </Button>,
        ]);
      });
      setTableData(data);
    }
  }, [addresses]);

  useEffect(() => {
    const filtered = addresses.filter((item) => item._id == updateId);
    if (filtered.length > 0) {
      setFirstLine(filtered[0].firstLine);
      setSecondLine(filtered[0].secondLine);
      setZipcode(filtered[0].zipcode);
      setCity([{ id: filtered[0].city }]);
      setState([{ id: filtered[0].state }]);
      setCountry([{ id: filtered[0].country }]);
    }
  }, [updateId]);

  const openUpdateModal = (id) => {
    setUpdate(true);
    setUpdateId(id);
    setOpenModal(true);
  };

  const openAddModal = () => {
    setUpdate(false);
    setUpdateId('');

    setFirstLine('');
    setSecondLine('');
    setZipcode(0);
    setCity([]);
    setState([]);
    setCountry([]);

    setOpenModal(true);
  };

  const dispatch = useDispatch();

  const saveAddress = () => {
    const data = {
      firstLine,
      secondLine,
      zipcode,
      city: city[0] && city[0].id,
      state: state[0] && state[0].id,
      country: country[0] && country[0].id,
      customerId: loginCustomer._id,
    };
    if (update) {
      dispatch(updateCustomerAddress(data, updateId)).then(() => {
        setOpenModal(false);
      });
    } else {
      dispatch(createCustomerAddress(data)).then(() => {
        setOpenModal(false);
      });
    }
  };

  const deleteAddress = (id) => {
    dispatch(deleteCustomerAddress(id));
  };

  return (
    <div>
      <NavBar />
      <div className={mainContainer}>
        <H2>{loginCustomer.name}'s Addresses</H2>
        <Table
          className={css({ width: '100vw' })}
          size={SIZE.spacious}
          columns={[
            'First Line',
            'Second Line',
            'Zipcode',
            'City',
            'State',
            'Country',
            'Delete',
            'Update',
          ]}
          data={tableData}
        />
        <Button
          className={css({ margin: '40px', width: '30%' })}
          size="compact"
          onClick={openAddModal}
        >
          Add Address
        </Button>
      </div>

      <Modal
        onClose={() => {
          setOpenModal(false);
        }}
        isOpen={openModal}
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
        <ModalHeader>{update ? 'Update Address' : 'Add Address'}</ModalHeader>
        <ModalBody style={{ flex: '1 1 0' }}>
          <FormControl label={() => 'First Line'}>
            <Input value={firstLine} onChange={(e) => setFirstLine(e.target.value)} required />
          </FormControl>
          <FormControl label={() => 'Second Line'}>
            <Input value={secondLine} onChange={(e) => setSecondLine(e.target.value)} required />
          </FormControl>
          <FormControl label={() => 'Zipcode'}>
            <Input
              type="number"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              required
            />
          </FormControl>
          <FormControl label="City">
            <Select
              value={city}
              onChange={({ value }) => setCity(value)}
              options={cityOpts}
              labelKey="city"
              valueKey="id"
              required
            />
          </FormControl>
          <FormControl label="State">
            <Select
              value={state}
              onChange={({ value }) => setState(value)}
              options={stateOpts}
              labelKey="state"
              valueKey="id"
              required
            />
          </FormControl>
          <FormControl label="Country">
            <Select
              value={country}
              onChange={({ value }) => setCountry(value)}
              options={countryOpts}
              labelKey="country"
              valueKey="id"
              required
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <ModalButton
            kind="minimal"
            onClick={(e) => {
              setOpenModal(false);
            }}
          >
            CANCEL
          </ModalButton>
          <ModalButton onClick={saveAddress}>SAVE</ModalButton>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default withAuth(AddressesPage, 'customer');
