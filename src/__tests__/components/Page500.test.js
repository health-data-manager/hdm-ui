import React from 'react';
import Page500 from '../../components/pages/Page500';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const wrapper = shallow(<Page500 />);
  wrapper.unmount();
});
