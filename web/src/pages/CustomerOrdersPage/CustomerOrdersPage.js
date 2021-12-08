import axios from 'axios';
import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';
import { Pagination } from 'baseui/pagination';
import { Select } from 'baseui/select';
import { Table, SIZE } from 'baseui/table-semantic';
import { H2, H4, Paragraph1, ParagraphMedium } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { orderQuery, ordersQuery } from '../../queries/queries';
import query from '../../utils/graphql/query';
import notify from '../../utils/notify';
import withAuth from '../AuthPage/withAuth';
import NavBar from '../RestaurantsPage/NavBar';

const CustomerOrdersPage = () => {
  const [css] = useStyletron();
  const mainContainer = css({
    margin: '50px',
    width: '95vw',
  });

  const history = useHistory();

  const [orders, setOrders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [detailModal, setDetailModal] = useState(false);
  const [detailOrder, setDetailOrder] = useState({});
  const [detailOrderTable, setDetailOrderTable] = useState([]);
  const [status, setStatus] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState([{ id: 5, size: '5' }]);
  const [updatePage, setUpdatePage] = useState(false);

  const statusOpts = [
    { id: '', status: 'ALL' },
    { id: 'PLACED', status: 'PLACED' },
    { id: 'PREPARING', status: 'PREPARING' },
    { id: 'PICKUP_READY', status: 'PICKUP_READY' },
    { id: 'COMPLETE', status: 'COMPLETE' },
    { id: 'CANCEL', status: 'CANCEL' },
  ];

  const seeOrderDetails = (o) => {
    setDetailModal(true);
    setDetailOrder(o);
    const td =
      o.orderitems &&
      o.orderitems.map((oi) => {
        return [oi.dish && oi.dish.name, oi.notes, oi.quantity, `$${oi.price} x ${oi.quantity}`];
      });
    td.push(['', '', 'Total', `$${o.amount}`]);

    setDetailOrderTable(td);
  };

  useEffect(() => {
    const variables = {
      status: status[0] && status[0].id,
      page: page,
      limit: limit[0] && limit[0].id,
    };
    query(ordersQuery, variables)
      .then((res) => {
        setOrders(res.orders.nodes);
        const ords = res.orders.nodes?.map((o) => {
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
        setTotal(Math.floor(res.orders.total / (limit[0] && limit[0].id)) + 1);
      })
      .catch((err) => {
        console.log(err);
        notify({ type: 'info', description: 'Error fetching orders.' });
      });
  }, [status, limit, page, updatePage]);

  const cancelOrder = (id) => {
    axios
      .put(`/orders/${id}`, { status: 'CANCEL' })
      .then((res) => {
        setUpdatePage(!updatePage);
        setDetailModal(false);
        notify({ type: 'info', description: 'Order Cancelled' });
      })
      .catch((err) => {
        notify({
          type: 'error',
          description: err?.response?.data?.message || 'Error Canceling Order',
        });
      });
  };

  return (
    <div>
      <NavBar />
      <div className={mainContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <H2>Your Orders</H2>
          <div style={{ width: '40%', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ margin: '10px' }}>
              <Select
                placeholder="Select Page Size"
                options={[
                  { id: 2, size: '2' },
                  { id: 5, size: '5' },
                  { id: 10, size: '10' },
                ]}
                valueKey="id"
                labelKey="size"
                onChange={({ value }) => setLimit(value)}
                value={limit}
                clearable={false}
              />
            </div>
            <div style={{ margin: '10px' }}>
              <Select
                placeholder="Select Order Status"
                options={[{ id: '', status: 'ALL' }, ...statusOpts]}
                valueKey="id"
                labelKey="status"
                onChange={({ value }) => setStatus(value)}
                value={status}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Table
            className={css({ width: '100%' })}
            size={SIZE.spacious}
            columns={['Restaurant', 'Address', 'Type', 'Price', 'Status', 'Details']}
            data={tableData}
          />
          <div style={{ margin: '20px' }}>
            <Pagination
              numPages={total}
              currentPage={page}
              onPageChange={({ nextPage }) => {
                setPage(Math.min(Math.max(nextPage, 1), 20));
              }}
            />
          </div>
        </div>
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
            <Paragraph1>
              <strong>Order Notes: </strong>
              {detailOrder.notes && detailOrder.notes}
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
            {detailOrder.status === 'INIT' && (
              <ModalButton onClick={() => history.push(`/orders/${detailOrder._id}`)}>
                Complete Order
              </ModalButton>
            )}
            {detailOrder.status === 'PLACED' && (
              <ModalButton onClick={() => cancelOrder(detailOrder._id)}>Cancel Order</ModalButton>
            )}
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

export default withAuth(CustomerOrdersPage, 'customer');
