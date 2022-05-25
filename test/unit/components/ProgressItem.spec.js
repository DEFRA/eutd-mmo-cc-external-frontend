import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressItem from '../../../src/client/components/ProgressItem';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';


describe('Progress Item', () => {

  const scenarios = {
    incompleteItem: 'INCOMPLETE',
    completeItem: 'COMPLETED',
    optionalItem: 'OPTIONAL',
    blankItem: '',
    blockedItem: 'CANNOT START',
    errorItem: 'ERROR'
  };

  it('should render a incomplete field', () => {
    render(
      <ProgressItem
        title="Incomplete item"
        testId="incomplete"
        status={scenarios.incompleteItem}
      />
    );

    expect(screen.getByTestId('progress-incomplete-title'))
      .toHaveTextContent('Incomplete item');

    expect(screen.getByTestId('progress-incomplete-tag'))
      .toHaveTextContent('INCOMPLETE');
  });

  it('should render an incomplete field with error', () => {
    render(
      <ProgressItem
        title="Incomplete item"
        error="something's missing"
        testId="incomplete"
        status={scenarios.incompleteItem}
      />
    );

    expect(screen.getByTestId('progress-incomplete-title'))
      .toHaveTextContent('Incomplete item');

    expect(screen.getByTestId('progress-incomplete-tag'))
      .toHaveTextContent('INCOMPLETE');
  });

  it('should render a complete field', () => {
    render(
      <ProgressItem
        title="Complete item"
        testId="complete"
        status={scenarios.completeItem}
      />
    );

    expect(screen.getByTestId('progress-complete-title'))
      .toHaveTextContent('Complete item');

    expect(screen.getByTestId('progress-complete-tag'))
      .toHaveTextContent('COMPLETED');
  });

  it('should render an optional field', () => {
    render(
      <ProgressItem
        title="Optional item"
        testId="optional"
        optional={true}
        status={scenarios.optionalItem}
      />
    );

    expect(screen.getByTestId('progress-optional-title'))
      .toHaveTextContent('Optional item (Optional)');

    expect(screen.getByTestId('progress-optional-tag'))
      .toHaveTextContent('OPTIONAL');
  });

  it('should render a blocked field', () => {
    render(
      <ProgressItem
        title="Blocked item"
        testId="blocked"
        status={scenarios.blockedItem}
      />
    );

    expect(screen.getByTestId('progress-blocked-title-blocked'))
      .toHaveTextContent('Blocked item');

    expect(screen.getByTestId('progress-blocked-tag'))
      .toHaveTextContent('CANNOT START YET');
  });

  it('should render a blank field', () => {
    render(
      <ProgressItem
        title="Blank item"
        testId="blank"
        status={scenarios.blankItem}
      />
    );

    expect(screen.getByTestId('progress-blank-title'))
      .toHaveTextContent('Blank item');

    expect(screen.queryByTestId('progress-blank-tag'))
      .toBeNull();
  });

  it('should render a error field', () => {
    render(
      <ProgressItem
        title="Error item"
        testId="error"
        status={scenarios.errorItem}
      />
    );

    expect(screen.getByTestId('progress-error-title'))
      .toHaveTextContent('Error item');

    expect(screen.getByTestId('progress-error-tag'))
      .toHaveTextContent('SUBMISSION FAILED');
  });

  it('should not render a undefined field', () => {
    render(
      <ProgressItem
        title="Item that doesn't exist"
        status={scenarios.undefinedItem}
      />
    );

    expect(screen.queryByTestId('progress-item-wrapper'))
      .toBeNull();
  });

  it('should not render if no props are specified', () => {
    render(
      <ProgressItem />
    );

    expect(screen.queryByTestId('progress-item-wrapper'))
      .toBeNull();
  });

  it('should render a link with href property', () => {
    render(
      <ProgressItem 
        title='Reference'
        testId="reference"
        status='OPTIONAL'
        href='/create-catch-certificate/GBR-234567/any-page'
      />
    );

    expect(screen.queryByTestId('progress-reference-title')).toHaveAttribute('href', '/create-catch-certificate/GBR-234567/any-page');
  });

  it('should handle an onClick event', () => {
    const mockCallBack = jest.fn();

    render(
      <ProgressItem 
        title='Reference'
        testId="reference"
        status='OPTIONAL'
        href='/create-catch-certificate/GBR-234567/any-page'
        onClick={mockCallBack}
      />
    );

    userEvent.click(screen.getByTestId('progress-reference-title'));
  
    expect(mockCallBack.mock.calls.length).toEqual(1);  
  });
  it('should check the optional text', () => {
    render(
      <ProgressItem 
        testId="yourReference"
        optional="true"
        title='Your Reference'
        status='OPTIONAL'
        href='/create-catch-certificate/GBR-234567/any-page'
      />
    );
    expect(screen.getByTestId('progress-yourReference-tag')).toHaveTextContent('OPTIONAL');
  });
});
