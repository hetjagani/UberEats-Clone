import { shallow } from 'enzyme';
import Header from './Header';
import React from 'react';
import '../../utils/testsetup';

describe('Header Test', () => {
  it('should render header component', () => {
    const header = shallow(<Header />);
    expect(header.getElements()).toMatchSnapshot();
  });
});
