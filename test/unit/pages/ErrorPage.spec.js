import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import * as ErrorPage from '../../../src/client/pages/ErrorPage';
import { render } from '@testing-library/react';

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  jest.spyOn(window, 'scrollTo')
    .mockResolvedValue();

  const wrapper = mount(<ErrorPage.default.component />);

  return {
      wrapper
  };
}

describe('Error Page', () => {
  const { wrapper } = setup();
  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should display the correct title for catch certificates', () => {
    wrapper.find('ErrorPage').setState({
      href: '/create-catch-certificate'
    });

    expect(wrapper.find('PageTitle').prop('title')).toBe('Sorry, there is a problem with the service - Create a UK catch certificate - GOV.UK');
  });

  it('should display the correct title for processing statements', () => {
    wrapper.find('ErrorPage').setState({
      href: '/create-processing-statement'
    });
    expect(wrapper.find('PageTitle').prop('title')).toBe('Sorry, there is a problem with the service - Create a UK processing statement - GOV.UK');
  });

  it('should display the correct title for storage documents', () => {
    wrapper.find('ErrorPage').setState({
      href: '/create-storage-document'
    });
    expect(wrapper.find('PageTitle').prop('title')).toBe('Sorry, there is a problem with the service - Create a UK storage document - GOV.UK');
  });

  it('should generate snapshot for the Plane Details page', () => {
    
    const { container } = render(wrapper)
    
    expect(container).toMatchSnapshot();
  })
});
