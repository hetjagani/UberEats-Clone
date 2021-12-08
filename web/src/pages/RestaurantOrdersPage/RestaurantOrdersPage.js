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
import { StyledLink } from 'baseui/link';
import { Pagination } from 'baseui/pagination';
import query from '../../utils/graphql/query';
import { ordersQuery } from '../../queries/queries';

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
  const [status, setStatus] = useState([]);
  const [detailCustomer, setDetailCustomer] = useState({});
  const [customerDetailModal, setCustomerDetailModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState([{ id: 5, size: '5' }]);

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

  const openCustomerDetailModal = (customer) => {
    setDetailCustomer(customer);
    setCustomerDetailModal(true);
    console.log(customer);
  };

  useEffect(() => {
    axios
      .get('/customers')
      .then((res) => {
        const cusMap = {};
        res.data.nodes &&
          res.data.nodes.forEach((cus) => {
            cusMap[cus._id] = cus;
          });

        const variables = {
          status: status[0] && status[0].id,
          page: page,
          limit: limit[0] && limit[0].id,
        };

        query(ordersQuery, variables).then((res) => {
          const sm = {};
          const mm = {};
          res.orders.total > 0 &&
            res.orders.nodes.forEach((o) => {
              sm[o._id] = [{ id: o.status, status: o.status }];
              mm[o._id] = false;
            });
          setStatusMap(sm);
          setModalMap(mm);

          // Keep link that shows customer profile
          const ords = res.orders.nodes?.map((o) => {
            return [
              <Paragraph1>
                <StyledLink href="#" onClick={() => openCustomerDetailModal(cusMap[o.customerId])}>
                  {cusMap[o.customerId]?.name || 'Unknown Customer'}
                </StyledLink>
              </Paragraph1>,
              <Paragraph1>
                {o.address && o.address.firstLine} {o.address && o.address.secondLine}
              </Paragraph1>,
              <Paragraph1>{o.type && o.type.toUpperCase()}</Paragraph1>,
              <Paragraph1>${o.amount}</Paragraph1>,
              <Button onClick={() => openStatus(o._id)}>Status</Button>,
              <Button onClick={() => seeOrderDetails(o)}>Details</Button>,
            ];
          });
          setTableData(ords);
          setOrders(res.orders);
          setTotal(Math.floor(res.orders.total / (limit[0] && limit[0].id)) + 1);
        });
      })
      .catch((err) => {
        console.log(err);
        notify({ type: 'error', description: 'Error fetching orders.' });
      });
  }, [status, page, limit]);

  return (
    <div>
      <div>
        <Header />
      </div>
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
            columns={['Customer', 'Address', 'Type', 'Price', 'Status', 'Details']}
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

      <Modal onClose={() => setCustomerDetailModal(false)} isOpen={customerDetailModal}>
        <ModalHeader>{detailCustomer?.nickname}</ModalHeader>
        <ModalBody>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              style={{ maxWidth: '200px', maxHeight: '200px' }}
              src={detailCustomer.medium ? detailCustomer.medium?.url : '/images/user.png'}
            ></img>
          </div>
          <Paragraph1>
            <strong>Name: </strong> {detailCustomer.name}
          </Paragraph1>
          <Paragraph1>
            <strong>About: </strong> {detailCustomer.about}
          </Paragraph1>
          <Paragraph1>
            <strong>City: </strong> {detailCustomer.city}
          </Paragraph1>
          <Paragraph1>
            <strong>State: </strong> {detailCustomer.state}
          </Paragraph1>
          <Paragraph1>
            <strong>Country: </strong> {detailCustomer.country}
          </Paragraph1>
          <Paragraph1>
            <strong>Contact No: </strong> {detailCustomer.contact_no}
          </Paragraph1>
        </ModalBody>
        <ModalFooter>
          <ModalButton kind="tertiary" onClick={() => setCustomerDetailModal(false)}>
            Cancel
          </ModalButton>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default withAuth(RestaurantOrdersPage, 'restaurant');
