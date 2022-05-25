import React from 'react';
import PrivacyStatementWelsh from '../../../src/client/pages/common/PrivacyStatementWelsh';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';


describe('PrivacyStatementWelsh', () => {
  const mockOnSubmit = jest.fn();
  const mockHandleBackLinkClick = jest.fn();

  const wrapper = mount(
    <PrivacyStatementWelsh
      onSubmit={mockOnSubmit}
      privacyAcceptedAlready={false}
      nextUri='someUri'
      onBackLinkClick={mockHandleBackLinkClick}
    />
  );

  it('should render the PrivacyStatementWelsh component', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render PageTitle with the correct text in Welsh', () => {
    expect(wrapper.find('PageTitle[title=\'Tudalen Preifatrwydd - GOV.UK\']').exists()).toBeTruthy();
  });

  it('should render page with the correct h1 heading in Welsh', () => {
    expect(wrapper.find('h1').first().text()).toBe('Hysbysiad preifatrwydd');
  });

  it('should render all the h2 headers in Welsh', () => {
    expect(wrapper.find('h2').first().text()).toBe('Sut a Pham Rydyn ni’n Defnyddio eich Gwybodaeth Bersonol');
    expect(wrapper.find('h2').at(1).text()).toBe('Pwy sy’n Casglu eich Gwybodaeth Bersonol');
    expect(wrapper.find('h2').at(2).text()).toBe('Sail Gyfreithiol dros Brosesu Eich Gwybodaeth Bersonol ');
    expect(wrapper.find('h2').at(3).text()).toBe('Gyda phwy y gellir rhannu eich Gwybodaeth Bersonol');
    expect(wrapper.find('h2').at(4).text()).toBe('Pa Mor Hir Rydyn Ni’n Cadw Eich Gwybodaeth Bersonol');
    expect(wrapper.find('h2').at(5).text()).toBe('Beth fydd yn digwydd os nad ydw i’n rhoi’r data?');
    expect(wrapper.find('h2').at(6).text()).toBe('A fydd fy ngwybodaeth bersonol yn cael ei throsglwyddo y tu allan i’r DU / Ardal Economaidd Ewropeaidd (AEE)? Os bydd, sut caiff ei diogelu?');
    expect(wrapper.find('h2').at(7).text()).toBe('Eich Hawliau');
    expect(wrapper.find('h2').at(8).text()).toBe('Sut mae cwyno?');
  });

  it('should render Accept and continue button in Welsh if privacy has not already been accepted and handle onSubmit when clicked', () => {
    render(
      <PrivacyStatementWelsh
        onSubmit={mockOnSubmit}
        privacyAcceptedAlready={false}
        nextUri='someUri'
        onBackLinkClick={mockHandleBackLinkClick}
      />
    );

    userEvent.click(screen.getByText('Derbyn a bwrw ymlaen'));
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should NOT render Accept and continue button if privacy has already been accepted', () => {
    const wrapper = mount(
      <PrivacyStatementWelsh
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
      <PrivacyStatementWelsh
        onSubmit={mockOnSubmit}
        privacyAcceptedAlready={true}
        nextUri='someUri'
        onBackLinkClick={mockHandleBackLinkClick}
      />
    );
    
    userEvent.click(screen.getByText('Yn ôl'));
    expect(mockHandleBackLinkClick).toHaveBeenCalled();
  });
});
