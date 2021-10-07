import { shallow } from 'enzyme';
import React from 'react';
import '../../utils/testsetup';

import * as redux from 'react-redux';
import AuthPage from './AuthPage';
import { H2 } from 'baseui/typography';
import { Input } from 'baseui/input';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '?email=testuser@mail.com',
    location: '/auth/login',
  }),
}));

describe('Auth Page Test', () => {
  it('should render Auth Page', () => {
    const dispatchMock = jest.spyOn(redux, 'useDispatch');
    dispatchMock.mockReturnValue(null);

    const authPage = shallow(<AuthPage flow={'login'} role={'customer'} />);
    expect(authPage.getElements()).toMatchSnapshot();
  });

  it('should contain Welcome Back on login flow', () => {
    const dispatchMock = jest.spyOn(redux, 'useDispatch');
    dispatchMock.mockReturnValue(null);

    const authPage = shallow(<AuthPage flow={'login'} role={'customer'} />);
    expect(
      authPage
        .find(H2)
        .getElements()
        .filter((e) => {
          return e.props.children == 'Welcome Back,';
        }).length,
    ).toBeGreaterThan(0);
  });

  it('should contain Welcome Customer on signup flow for customer', () => {
    const dispatchMock = jest.spyOn(redux, 'useDispatch');
    dispatchMock.mockReturnValue(null);

    const authPage = shallow(<AuthPage flow={'register'} role={'customer'} />);
    expect(
      authPage
        .find(H2)
        .getElements()
        .filter((e) => {
          return e.props.children.includes('customer');
        }).length,
    ).toBeGreaterThan(0);
  });

  it('should contain Welcome Restaurant on signup flow for restaurant', () => {
    const dispatchMock = jest.spyOn(redux, 'useDispatch');
    dispatchMock.mockReturnValue(null);

    const authPage = shallow(<AuthPage flow={'register'} role={'restaurant'} />);
    expect(
      authPage
        .find(H2)
        .getElements()
        .filter((e) => {
          return e.props.children.includes('restaurant');
        }).length,
    ).toBeGreaterThan(0);
  });

  it('should contain two password elements in signup page', () => {
    const dispatchMock = jest.spyOn(redux, 'useDispatch');
    dispatchMock.mockReturnValue(null);

    const authPage = shallow(<AuthPage flow={'register'} role={'restaurant'} />);
    expect(
      authPage
        .find(Input)
        .getElements()
        .filter((e) => {
          return e.props.type == 'password';
        }).length,
    ).toBe(2);
  });
});
