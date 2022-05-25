import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ImproveServiceWelshPage from '../../../src/client/pages/ImproveServiceWelshPage';

describe('ImproveServiceWelshPage', () => {
  const mockGoBack = jest.fn();
  const renderComponent = () => {
    const { container } = render(
      <ImproveServiceWelshPage
        feedbackUrl="https://defragroup.eu.qualtrics.com/jfe/form/SV_3q6Yrf53I3bdoCa"
        backRoute="#"
        goBack={mockGoBack}
        title="Service improvement plan"
      />
    );
    return container;
  };

  it('should render the ImproveServiceWelshPage component', () => {
    const wrapper = renderComponent();
    expect(wrapper).toBeDefined();
  });

  it('should render the back link', () => {
    renderComponent();
    expect(screen.getByText('Yn ôl')).toBeInTheDocument();
  });

  it('should handle click event on the back link', () => {
    renderComponent();

    userEvent.click(screen.getByText('Yn ôl'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
