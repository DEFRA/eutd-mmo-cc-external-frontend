import React from 'react';
import PrivacyStatementEnglish from '../../../src/client/pages/common/PrivacyStatementEnglish';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';


describe('PrivacyStatementEnglish', () => {
  const mockOnSubmit = jest.fn();
  const mockHandleBackLinkClick = jest.fn();

  const wrapper = mount(
    <PrivacyStatementEnglish
      onSubmit={mockOnSubmit}
      privacyAcceptedAlready={false}
      nextUri='someUri'
      onBackLinkClick={mockHandleBackLinkClick}
    />
  );

  it('should render the PrivacyStatementEnglish component', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render PageTitle with the correct text in English', () => {
    expect(wrapper.find('PageTitle[title=\'Privacy - GOV.UK\']').exists()).toBeTruthy();
  });

  it('should render page with the correct h1 heading in English', () => {
    expect(wrapper.find('h1').first().text()).toBe('Privacy notice');
  });

  it('should render all the h2 headers in English', () => {
    expect(wrapper.find('h2').first().text()).toBe('Why We Collect Your Personal Information');
    expect(wrapper.find('h2').at(1).text()).toBe('Who Collects Your Personal Information');
    expect(wrapper.find('h2').at(2).text()).toBe('Legal Basis for Processing Your Personal Information ');
    expect(wrapper.find('h2').at(3).text()).toBe('Who Your Personal Information May be Shared with');
    expect(wrapper.find('h2').at(4).text()).toBe('How Long We Keep Your Personal Information for');
    expect(wrapper.find('h2').at(5).text()).toBe('What will happen if I don’t provide the data?');
    expect(wrapper.find('h2').at(6).text()).toBe('Will my personal information be transferred outside of the UK / EEA? If it is, how will it be protected?');
    expect(wrapper.find('h2').at(7).text()).toBe('Your Rights');
    expect(wrapper.find('h2').at(8).text()).toBe('How do I complain?');
  });

  it('should render Accept and continue button if privacy has not already been accepted and handle onSubmit when clicked', () => {
    render(
      <PrivacyStatementEnglish
        onSubmit={mockOnSubmit}
        privacyAcceptedAlready={false}
        nextUri='someUri'
        onBackLinkClick={mockHandleBackLinkClick}
      />
    );

    userEvent.click(screen.getByText('Accept and continue'));
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should NOT render Accept and continue button if privacy has already been accepted', () => {
    const wrapper = mount(
      <PrivacyStatementEnglish
        onSubmit={mockOnSubmit}
        privacyAcceptedAlready={true}
        nextUri='someUri'
        onBackLinkClick={mockHandleBackLinkClick}
      />
    );
    
    expect(wrapper.find('button#privacyNotice').exists()).toBeFalsy();
  });

  it('should render back link button if privacy has already been accepted and handle backLinkClick', () => {
    render(
      <PrivacyStatementEnglish
        onSubmit={mockOnSubmit}
        privacyAcceptedAlready={true}
        nextUri='someUri'
        onBackLinkClick={mockHandleBackLinkClick}
      />
    );
    
    userEvent.click(screen.getByText('Back'));
    expect(mockHandleBackLinkClick).toHaveBeenCalled();
  });
});
