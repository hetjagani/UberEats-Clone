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
    margin: '100px',
    width: '90vw',
  });

  const [orders, setOrders] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [tableData, setTableData] = useState([]);
  const [detailModal, setDetailModal] = useState(false);
  const [detailOrder, setDetailOrder] = useState({});
  const [detailOrderTable, setDetailOrderTable] = useState([]);
  const [modalMap, setModalMap] = useState({});
  const [statusOrder, setStatusOrder] = useState(0);

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

  const openStatus = (id) => {
    setStatusOrder(id);
    const mm = modalMap;
    mm[id] = true;
    setModalMap(mm);
  };

  const closeStatus = () => {
    const mm = modalMap;
    mm[statusOrder] = false;
    setModalMap(mm);
    setStatusOrder(0);
  };

  const updateStatus = (value, id) => {
    const data = {
      status: value[0] && value[0].id,
    };

    axios.put(`/orders/${id}`, data).then((res) => {
      notify({ type: 'info', description: `Updated order status to ${data.status}` });
    });

    const sm = statusMap;
    sm[id] = value;
    setStatusMap(sm);
    closeStatus();
  };

  useEffect(() => {
    axios
      .get(`/orders`)
      .then((res) => {
        setOrders(res.data);
        const sm = {};
        const mm = {};
        res.data.forEach((o) => {
          sm[o.id] = [{ id: o.status, status: o.status }];
          mm[o.id] = false;
        });
        setStatusMap(sm);
        setModalMap(mm);

        const ords = res.data.map((o) => {
          return [
            <Paragraph1>{o.restaurant && o.restaurant.name}</Paragraph1>,
            <Paragraph1>
              {o.address && o.address.firstLine} {o.address && o.address.secondLine}
            </Paragraph1>,
            <Paragraph1>{o.type && o.type.toUpperCase()}</Paragraph1>,
            <Paragraph1>${o.amount}</Paragraph1>,
            <Button onClick={() => openStatus(o.id)}>Status</Button>,
            <Button onClick={() => seeOrderDetails(o)}>Details</Button>,
          ];
        });
        setTableData(ords);
      })
      .catch((err) => {
        notify({ type: 'info', description: 'Error fetching orders.' });
      });
  }, []);

  useEffect(() => {}, [statusMap]);

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

        <Modal onClose={closeStatus} isOpen={modalMap[statusOrder]}>
          <ModalHeader>Change Order Status</ModalHeader>
          <ModalBody>
            <Select
              options={statusOpts}
              valueKey="id"
              labelKey="status"
              onChange={({ value }) => updateStatus(value, statusOrder)}
              value={statusMap[statusOrder]}
            />
          </ModalBody>
          <ModalFooter>
            <ModalButton kind="tertiary" onClick={closeStatus}>
              Cancel
            </ModalButton>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default withAuth(RestaurantOrdersPage, 'restaurant');
