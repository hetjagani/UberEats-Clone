import axios from 'axios';
import { useStyletron } from 'baseui';
import { Card, StyledBody, StyledThumbnail } from 'baseui/card';
import { Input } from 'baseui/input';
import { H1, H2, Label1, Paragraph1 } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import notify from '../../utils/notify';
import withAuth from '../AuthPage/withAuth';
import Header from '../RestaurantDashboard/Header';

const CustomersPage = () => {
  const [css] = useStyletron();
  const mainContainer = css({
    margin: '100px',
    width: '90vw',
  });
  const customersList = css({
    marginTop: '50px',
    width: '100%',
  });

  const [customers, setCustomers] = useState([]);
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    axios
      .get(`/customers`, { params: { q: searchQ } })
      .then((res) => {
        setCustomers(res.data.nodes);
      })
      .catch((err) => {
        notify({ type: 'error', description: 'Error fetching customers' });
      });
  }, [searchQ]);

  return (
    <div>
      <Header />
      <div className={mainContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <H2>Your Past Customers</H2>
          <div style={{ width: '20%' }}>
            <Input
              placeholder="Search"
              onChange={(e) => setSearchQ(e.target.value)}
              value={searchQ}
            />
          </div>
        </div>
        <div className={customersList}>
          {customers &&
            customers.length > 0 &&
            customers.map((customer) => {
              return (
                <Card
                  overrides={{ Root: { style: { width: '100%', margin: '20px' } } }}
                  title={customer.name}
                >
                  <StyledThumbnail
                    src={
                      customer.medium
                        ? customer.medium.url
                        : `https://avatars.dicebear.com/api/initials/${customer.name}.svg`
                    }
                  />
                  <StyledBody>
                    <strong>NickName: </strong>
                    {customer.nickname}
                    <br />
                    <strong>About: </strong>
                    {customer.about}
                    <br />
                    <strong>City: </strong>
                    {customer.city}
                    <br />
                    <strong>State: </strong>
                    {customer.state}
                    <br />
                    <strong>Country: </strong>
                    {customer.country}
                    <br />
                    <strong>Contact No: </strong>
                    {customer.contact_no}
                    <br />
                  </StyledBody>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default withAuth(CustomersPage, 'restaurant');
