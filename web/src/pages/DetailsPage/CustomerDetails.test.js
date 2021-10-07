import { shallow } from 'enzyme';
import React from 'react';
import '../../utils/testsetup';
import CustomerDetails from './CustomerDetails';
import { Display4 } from 'baseui/typography';

import * as redux from 'react-redux';

describe('Customer Details Page Test', () => {
  const initialState = {
    medium: [],
    loginCustomer: {
      name: 'Test User',
      nickname: 'TU',
      about: 'Test About',
      city: 'Fremont',
      state: 'California',
      country: 'USA',
      contact_no: '9898989898',
    },
  };

  const spy = jest.spyOn(redux, 'useSelector');
  spy.mockReturnValue(initialState);
  const spy2 = jest.spyOn(redux, 'useDispatch');
  spy2.mockReturnValue(null);

  it('should render Customer Details page', () => {
    const detailsPage = shallow(<CustomerDetails />);
    expect(detailsPage.getElements()).toMatchSnapshot();
  });

  it('should have Customer Profile heading', () => {
    const detailsPage = shallow(<CustomerDetails />);
    expect(detailsPage.find(Display4).text()).toBe('Customer Profile');
  });
});
