import axios from 'axios';
import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';
import { Table, SIZE } from 'baseui/table-semantic';
import { H2, H4, Paragraph1 } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import notify from '../../utils/notify';
import NavBar from '../RestaurantsPage/NavBar';

const CustomerOrdersPage = () => {
  const [css] = useStyletron();
  const mainContainer = css({
    margin: '50px',
    width: '95vw',
  });

  const [orders, setOrders] = useState([]);
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

  useEffect(() => {
    axios
      .get(`/orders`)
      .then((res) => {
        setOrders(res.data);
        const ords = orders.map((o) => {
          return [
            <Paragraph1>{o.restaurant && o.restaurant.name}</Paragraph1>,
            <Paragraph1>
              {o.address && o.address.firstLine} {o.address && o.address.secondLine}
            </Paragraph1>,
            <Paragraph1>{o.type && o.type.toUpperCase()}</Paragraph1>,
            <Paragraph1>${o.amount}</Paragraph1>,
            <Paragraph1>{o.status}</Paragraph1>,
            <Button onClick={() => seeOrderDetails(o)}>Details</Button>,
          ];
        });
        setTableData(ords);
      })
      .catch((err) => {
        notify({ type: 'info', description: 'Error fetching orders.' });
      });
  }, []);

  return (
    <div>
      <NavBar />
      <div className={mainContainer}>
        <H2>Your Orders</H2>
        <H4>Current Orders</H4>

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

export default CustomerOrdersPage;
