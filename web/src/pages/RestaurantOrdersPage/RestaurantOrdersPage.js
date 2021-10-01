import axios from 'axios';
import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';
import { Select } from 'baseui/select';
import { Table, SIZE } from 'baseui/table-semantic';
import { H2, H4, Paragraph1 } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import notify from '../../utils/notify';
import withAuth from '../AuthPage/withAuth';
import Header from '../RestaurantDashboard/Header';

const RestaurantOrdersPage = () => {
  const [css] = useStyletron();
  const mainContainer = css({
    marginTop: '100px',
    margin: '50px',
    width: '95vw',
  });

  const [orders, setOrders] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [tableData, setTableData] = useState([]);
  const [detailModal, setDetailModal] = useState(false);
  const [detailOrder, setDetailOrder] = useState({});
  const [detailOrderTable, setDetailOrderTable] = useState([]);

  const seeOrderDetails = (o) => {
    setDetailModal(true);
    setDetailOrder(o);
    const td =
      o.orderitems &&
      o.orderitems.map((oi) => {
        return [
          oi.dish && oi.dish.name,
          oi.notes,
          oi.quantity,
          `$${oi.dish.price} x ${oi.quantity}`,
        ];
      });
    td.push(['', '', 'Total', `$${o.amount}`]);

    setDetailOrderTable(td);
  };

  const statusOpts = [
    { id: 'PLACED', status: 'PLACED' },
    { id: 'PREPARING', status: 'PREPARING' },
    { id: 'PICKUP_READY', status: 'PICKUP_READY' },
    { id: 'COMPLETE', status: 'COMPLETE' },
    { id: 'CANCEL', status: 'CANCEL' },
  ];

  const updateStatus = (value, id) => {
    console.log(value);
    console.log(id);
    const sm = statusMap;
    sm[id] = value;
    setStatusMap(sm);
    console.log(statusMap);
  };

  useEffect(() => {
    axios
      .get(`/orders`)
      .then((res) => {
        setOrders(res.data);
        const sm = {};
        res.data.forEach((o) => {
          sm[o.id] = [{ id: o.status, status: o.status }];
        });
        setStatusMap(sm);
      })
      .catch((err) => {
        notify({ type: 'info', description: 'Error fetching orders.' });
      });
  }, []);

  useEffect(() => {
    const ords = orders.map((o) => {
      return [
        <Paragraph1>{o.restaurant && o.restaurant.name}</Paragraph1>,
        <Paragraph1>
          {o.address && o.address.firstLine} {o.address && o.address.secondLine}
        </Paragraph1>,
        <Paragraph1>{o.type && o.type.toUpperCase()}</Paragraph1>,
        <Paragraph1>${o.amount}</Paragraph1>,
        <Paragraph1>{o.status}</Paragraph1>,
        <Select
          options={statusOpts}
          valueKey="id"
          labelKey="status"
          onChange={({ value }) => updateStatus(value, o.id)}
          value={statusMap[o.id]}
        />,
        <Button onClick={() => seeOrderDetails(o)}>Details</Button>,
      ];
    });
    setTableData(ords);
  }, [orders]);

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className={mainContainer}>
        <H2>Your Orders</H2>

        <Table
          className={css({ width: '100%' })}
          size={SIZE.spacious}
          columns={['Restaurant', 'Address', 'Type', 'Price', 'Status', 'Details']}
          data={tableData}
        />
        <Modal
          onClose={() => {
            setDetailModal(false);
            setDetailOrder({});
          }}
          isOpen={detailModal}
          overrides={{
            Dialog: {
              style: {
                width: '40vw',
                height: 'fit-content',
                display: 'flex',
                flexDirection: 'column',
              },
            },
          }}
        >
          <ModalHeader>
            Order from {detailOrder.restaurant && detailOrder.restaurant.name}
          </ModalHeader>
          <ModalBody style={{ flex: '1 1 0' }}>
            <Paragraph1>
              <strong>Order Type: </strong>
              {detailOrder.type && detailOrder.type.toUpperCase()}
            </Paragraph1>
            <Paragraph1>
              <strong>Order Address: </strong>
              {detailOrder.address &&
                `${detailOrder.address.firstLine} ${detailOrder.address.secondLine}`}
            </Paragraph1>
            <Paragraph1>Order Items</Paragraph1>
            <Table
              className={css({ width: '100%' })}
              size={SIZE.compact}
              columns={['Item', 'Notes', 'Quantity', 'Price']}
              data={detailOrderTable}
            />
          </ModalBody>
          <ModalFooter>
            <ModalButton
              kind="tertiary"
              onClick={() => {
                setDetailModal(false);
                setDetailOrder({});
              }}
            >
              Cancel
            </ModalButton>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default withAuth(RestaurantOrdersPage, 'restaurant');
