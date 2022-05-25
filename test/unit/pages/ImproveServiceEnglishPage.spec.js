import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ImproveServiceEnglishPage from '../../../src/client/pages/ImproveServiceEnglishPage';

describe('ImproveServiceEnglishPage', () => {
  const mockGoBack = jest.fn();
  const renderComponent = () => {
    const { container } = render(
      <ImproveServiceEnglishPage
        feedbackUrl="https://defragroup.eu.qualtrics.com/jfe/form/SV_3q6Yrf53I3bdoCa"
        backRoute="#"
        goBack={mockGoBack}
        title="Service improvement plan"
      />
    );
    return container;
  };

  it('should render the ImproveServiceEnglishPage component', () => {
    const wrapper = renderComponent();
    expect(wrapper).toBeDefined();
  });

  it('should render the back link', () => {
    renderComponent();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('should handle click event on the back link', () => {
    renderComponent();

    userEvent.click(screen.getByText('Back'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
