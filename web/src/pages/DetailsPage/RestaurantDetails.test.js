
import { shallow } from 'enzyme';
import React from 'react';
import '../../utils/testsetup';
import { Display4 } from 'baseui/typography';
import RestaurantDetails from './RestaurantDetails';

import * as redux from 'react-redux';

describe('Restaurant Details Page Test', () => {
  const initialState = {
    medium: [],
    loginRestaurant: {
      name: 'Test User',
      description: 'Test About',
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

  it('should render Restaurant Details page', () => {
    const detailsPage = shallow(<RestaurantDetails />);
    expect(detailsPage.getElements()).toMatchSnapshot();
  });

  it('should have Restaurant Profile heading', () => {
    const detailsPage = shallow(<RestaurantDetails />);
    expect(detailsPage.find(Display4).text()).toBe('Restaurant Profile');
  });
});
