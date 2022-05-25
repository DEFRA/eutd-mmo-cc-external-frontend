import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import * as NotFoundPage from '../../../src/client/pages/NotFoundPage';

Enzyme.configure({ adapter: new Adapter() });

function setup() {
    const wrapper = shallow(<NotFoundPage.default.component />);

    return {
        wrapper
    };
}

describe('Not Found Page', () => {
    it('should load successfully', () => {
        const { wrapper } = setup();
        expect(wrapper).toBeDefined();
    });
});