import axios from 'axios';
import { useStyletron } from 'baseui';
import { Button, SIZE as btnSize } from 'baseui/button';
import { Select } from 'baseui/select';
import { Table, SIZE } from 'baseui/table-semantic';
import { H2, Paragraph2 } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import { useHistory, useParams } from 'react-router';
import { placedOrder } from '../../actions/cart';
import notify from '../../utils/notify';
import withAuth from '../AuthPage/withAuth';
import NavBar from '../RestaurantsPage/NavBar';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton, ROLE } from 'baseui/modal';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { createCustomerAddress } from '../../actions/customers';
import query from '../../utils/graphql/query';
import { orderQuery } from '../../queries/queries';
import { placeOrderQuery } from '../../mutations/mutations';

const CheckoutPage = () => {
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

  const { id } = useParams();
  const history = useHistory();

  const [order, setOrder] = useState({});
  const [tableData, setTableData] = useState([]);
  const [address, setAddress] = useState([]);
  const [addressOpts, setAddressOpts] = useState([]);

  const [firstLine, setFirstLine] = useState('');
  const [secondLine, setSecondLine] = useState('');
  const [zipcode, setZipcode] = useState(0);
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [country, setCountry] = useState([]);
  const [notes, setNotes] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const { loginCustomer, addresses } = useSelector((state) => {
    return { loginCustomer: state.customers.loginCustomer, addresses: state.customers.addresses };
  });

  useEffect(() => {
    const opts = [];
    addresses &
      addresses.forEach((add) => {
        opts.push({
          id: add._id,
          address: `${add.firstLine}, ${add.secondLine}, ${add.zipcode}, ${add.city}, ${add.country}`,
        });
      });
    setAddressOpts(opts);
  }, [addresses]);

  useEffect(() => {
    const variables = { id };
    query(orderQuery, variables)
      .then((res) => {
        setOrder(res.order);
      })
      .catch((err) => {
        notify({ type: 'error', description: 'Error fetching order' });
      });
  }, []);

  useEffect(() => {
    const td = [];
    order.orderitems &&
      order.orderitems.forEach((item) => {
        if (item.dish) {
          td.push([
            item.dish.name,
            item.dish.description,
            item.quantity,
            item.notes,
            item.dish.price,
          ]);
        }
      });
    td.push(['', '', '', <strong>Total</strong>, order.amount]);
    setTableData(td);
  }, [order.orderitems]);

  const dispatch = useDispatch();

  const placeOrder = () => {
    const data = { orderId: order._id, addressId: address[0] && address[0].id, notes };

    query(placeOrderQuery, { order: data })
      .then((res) => {
        dispatch(placedOrder());
        notify({ type: 'info', description: `Order placed successfully` });
        history.push('/restaurants');
      })
      .catch((err) => {
        notify({
          type: 'error',
          description: `${
            err.response ? JSON.stringify(err.response.data) : 'Error placing order'
          }`,
        });
      });
  };

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

    dispatch(createCustomerAddress(data)).then(() => {
      setOpenModal(false);
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
              <H2>Checkout</H2>
            </div>
          </div>
          <Table
            columns={['Name', 'Description', 'Qty', 'Notes', 'Price']}
            data={tableData}
            horizontalScrollWidth={undefined}
            size={SIZE.spacious}
          />

          <div>
            <H2>Add Notes</H2>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 'fit-content',
            }}
          >
            <div style={{ width: '80%' }}>
              <Input
                placeholder={'Additional Notes'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div>
            <H2>Select Address</H2>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              height: 'fit-content',
              flexDirection: 'column',
            }}
          >
            <div style={{ width: '80%' }}>
              <Select
                options={addressOpts}
                labelKey="address"
                valueKey="id"
                onChange={({ value }) => setAddress(value)}
                value={address}
              />
              <Button
                size="compact"
                className={css({ width: '100%' })}
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                Add Address
              </Button>
            </div>
            <div style={{ marginTop: '20px' }}>
              <Button onClick={placeOrder}>Place Order</Button>
            </div>
          </div>
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
            {order.restaurant &&
              order.restaurant.media &&
              order.restaurant.media.length > 0 &&
              order.restaurant.media.map((m) => {
                return (
                  <div key={m.id}>
                    <img src={m.url} alt={m.alt_text} style={{ width: '50%', height: '50%' }} />
                  </div>
                );
              })}
          </Carousel>
          <Paragraph2>
            <strong>Name:</strong> {order.restaurant && order.restaurant.name}
          </Paragraph2>
          <Paragraph2>
            <strong>Description:</strong> {order.restaurant && order.restaurant.description}
          </Paragraph2>
          <Paragraph2>
            <strong>Address:</strong> {order.restaurant && order.restaurant.address}
          </Paragraph2>
          <Paragraph2>
            <strong>Contact No:</strong> {order.restaurant && order.restaurant.contact_no}
          </Paragraph2>
          <Paragraph2>
            <strong>Timing:</strong> {order.restaurant && order.restaurant.time_open} -
            {order.restaurant && order.restaurant.time_close}
          </Paragraph2>
          <Paragraph2>
            <strong>Type:</strong>
            {order.restaurant && order.restaurant.restaurant_type.toUpperCase()}
          </Paragraph2>
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
          <ModalHeader>Add Address</ModalHeader>
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
    </div>
  );
};

export default withAuth(CheckoutPage, 'customer');
