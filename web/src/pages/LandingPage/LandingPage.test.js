import { Drawer } from 'baseui/drawer';
import { H1 } from 'baseui/typography';
import { shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router-dom';
import '../../utils/testsetup';
import Header from './Header';
import LandingPage from './LandingPage';

describe('Landing Page Test', () => {
  it('should render Landing page', () => {
    const landingPage = shallow(<LandingPage />);
    expect(landingPage.getElements()).toMatchSnapshot();
  });

  it('should contain a Header and Drawer', () => {
    const landingPage = shallow(<LandingPage />);
    expect(landingPage.find(Header).length).toBe(1);
    expect(landingPage.find(Drawer).length).toBe(1);
  });

  it('should have proper heading', () => {
    const landingPage = shallow(<LandingPage />);
    expect(landingPage.find(H1).text()).toBe('Order food to your door');
  });

  it('should have links to signin and signup', () => {
    const landingPage = shallow(<LandingPage />);
    expect(
      landingPage
        .find(Link)
        .getElements()
        .filter((e) => {
          return e.props.to.includes('/auth/registeruser');
        }).length,
    ).toBeGreaterThan(0);

    expect(
      landingPage
        .find(Link)
        .getElements()
        .filter((e) => {
          return e.props.to.includes('/auth/registerres');
        }).length,
    ).toBeGreaterThan(0);

    expect(
      landingPage
        .find(Link)
        .getElements()
        .filter((e) => {
          return e.props.to.includes('/auth/login');
        }).length,
    ).toBeGreaterThan(0);
  });
});
