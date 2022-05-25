import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AccessibilityStatementEnglish } from '../../../src/client/pages/common/AccessibilityStatementEnglish';

describe('Accessibility Statement English', () => {

  const mockStore = configureStore([thunk]);
  const store = mockStore({ });

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <AccessibilityStatementEnglish />
      </MemoryRouter>
    </Provider>
  );

  it('should render the component', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render PageTitle with the correct text in English', () => {
    expect(wrapper.find('PageTitle[title=\'Accessibility - GOV.UK\']').exists()).toBeTruthy();
  });

  it('should render page with the correct heading in English', () => {
    expect(wrapper.find('h1').first().text()).toBe('Accessibility statement for the Fish Exports service');
  });


  it('should render page with the correct links and text', () => {
    expect(wrapper.find('a[href="/"]').text()).toEqual('https://manage-fish-exports.service.gov.uk/(opens in new tab)');
    expect(wrapper.find('a[href="https://www.gov.uk/help/accessibility-statement"]').text()).toEqual('accessibility statement for the main GOV.UK website.(opens in new tab)');
    expect(wrapper.find('a[href="https://mcmw.abilitynet.org.uk/"]').text()).toEqual('AbilityNet(opens in new tab)');
    expect(wrapper.find('a[href="https://www.equalityadvisoryservice.com/"]').text()).toEqual('contact the Equality Advisory and Support Service (EASS).(opens in new tab)');
    expect(wrapper.find('a[href="https://www.gov.uk/contact-local-marine-management-organisation"]').text()).toEqual('Contact your local Marine Management Organisation office(opens in new tab)');
    expect(wrapper.find('a[href="https://www.w3.org/TR/WCAG21/"]').text()).toEqual('Web Content Accessibility Guidelines version 2.1 AA standard(opens in new tab)');
    expect(wrapper.find('a[href="https://www.gov.uk"]').text()).toEqual('GOV.UK(opens in new tab)');
  });

  it('should render update information about how accessible this service is', () => {
    expect(wrapper.find('li').at(5).text()).toBe('There are compatibility issues with some assistive technology');
    expect(wrapper.find('li').at(6).text()).toBe('Some navigation is inconsistent or not clearly connected to its content');
    expect(wrapper.find('li').at(7).text()).toBe('There are text resizing issues on certain pages');
    expect(wrapper.find('li').at(8).text()).toBe('Accessible names are missing from some buttons');
    expect(wrapper.find('li').at(9).text()).toBe('Some error messages require clarification');
    expect(wrapper.find('li').at(10).text()).toBe('There is incorrect heading structure on certain pages');
    expect(wrapper.find('li').at(11).text()).toBe('There is an incorrect page title implementation on the Catch Certificates Add landings page');
    expect(wrapper.find('li').at(12).text()).toBe('Labels can become removed from their content on the Catch Certificates Add landings page');
    expect(wrapper.find('li').at(15).text()).toBe('address and fix identified, WCAG 2.1 AA non-compliant accessibility issues (priority 1)');
    expect(wrapper.find('li').at(16).text()).toBe('carry out continuous research to make sure you can complete the service first time, and make improvements where necessary (priority 2)');
    expect(wrapper.find('li').at(17).text()).toBe('continue to research and test the service to ensure your needs are addressed (priority 3)');

    expect(wrapper.find('p').at(14).text()).toBe('This website is partially compliant with the Web Content Accessibility Guidelines version 2.1 AA standard(opens in new tab), due to the non-compliances listed below.');
    expect(wrapper.find('p').at(16).text()).toBe('The service has identified the following issues:');
    expect(wrapper.find('p').at(17).text()).toBe('CC = Catch Certificates, PS = Processing Statements, SD = Storage Documents');
    expect(wrapper.find('p').at(21).text()).toBe('As part of continuous improvement, the service aims to:');
    expect(wrapper.find('p').at(22).text()).toBe('This statement was prepared on 3 June 2021. It was last reviewed on 3 June 2021.');
    expect(wrapper.find('p').last().text()).toBe('This service was last tested on 21 September 2020. The test was carried out by Defra’s Digital, Data and Technology Services accessibility team.');
  });

  it('should render a table of accessibility issues identified in the service', () => {
    const table = wrapper.find('table');
    expect(table.exists()).toBeTruthy();

    const header = table.find('thead');
    expect(header.exists()).toBeTruthy();
    expect(header.find('th').first().text()).toBe('Reference');
    expect(header.find('th').at(1).text()).toBe('Issue');
    expect(header.find('th').at(2).text()).toBe('Location');
    expect(header.find('th').at(3).text()).toBe('WCAG ref.');

    const body = table.find('tbody');
    expect(body.exists()).toBeTruthy();

    const row = body.find('tr').first();
    expect(row.exists()).toBeTruthy();

    expect(row.find('td').first().text()).toBe('AA1/A-05a');
    expect(row.find('td').at(1).text()).toBe('Month-by-month navigation isn\'t visually or semantically connected to the \'Completed\' data above it.');
    expect(row.find('td').at(2).text()).toBe('CC,PS,SD - Exporter dashboard');
    expect(row.find('td').at(3).text()).toBe('1.3.2');

    const row_1 = body.find('tr').at(1);
    expect(row_1.exists()).toBeTruthy();

    expect(row_1.find('td').first().text()).toBe('AA1/A-05b');
    expect(row_1.find('td').at(1).text()).toBe('The \'<<\' and \'>>\' links to future/previous months are not explained or semantically presented in way that is accessible.');
    expect(row_1.find('td').at(2).text()).toBe('CC,PS,SD - Exporter dashboard');
    expect(row_1.find('td').at(3).text()).toBe('1.3.2');

    const row_2 = body.find('tr').at(2);
    expect(row_2.exists()).toBeTruthy();

    expect(row_2.find('td').first().text()).toBe('AA1/A-23');
    expect(row_2.find('td').at(1).text()).toBe('Incorrect heading structure');
    expect(row_2.find('td').at(2).text()).toBe('CC,PS,SD - Exporter dashboard');
    expect(row_2.find('td').at(3).text()).toBe('1.3.1');

    const row_3 = body.find('tr').at(3);
    expect(row_3.exists()).toBeTruthy();

    expect(row_3.find('td').first().text()).toBe('AA1/A-07');
    expect(row_3.find('td').at(1).text()).toBe('The text can be resized, but the way the form is handled means that the field widths don\'t adequately accommodate the resized text, partially obscuring the content.');
    expect(row_3.find('td').at(2).text()).toBe('CC - Add landings');
    expect(row_3.find('td').at(3).text()).toBe('1.4.4');

    const row_4 = body.find('tr').at(4);
    expect(row_4.exists()).toBeTruthy();

    expect(row_4.find('td').first().text()).toBe('AA1/A-08');
    expect(row_4.find('td').at(1).text()).toBe('On text resizing, the form does not reflow on resizing, causing some content to be part hidden. Similarly, on smaller screen sizes, parts of the form appear off screen.');
    expect(row_4.find('td').at(2).text()).toBe('CC - Add landings');
    expect(row_4.find('td').at(3).text()).toBe('1.4.10');

    const row_5 = body.find('tr').at(5);
    expect(row_5.exists()).toBeTruthy();

    expect(row_5.find('td').first().text()).toBe('AA1/A-09');
    expect(row_5.find('td').at(1).text()).toBe('Date picker issues.');
    expect(row_5.find('td').at(2).text()).toBe('CC,PS,SD');
    expect(row_5.find('td').at(3).text()).toBe('2.1.1');

    const row_6 = body.find('tr').at(6);
    expect(row_6.exists()).toBeTruthy();

    expect(row_6.find('td').first().text()).toBe('AA1/A-10');
    expect(row_6.find('td').at(1).text()).toBe('Typeahead issues - ‘Add landings for each product’.');
    expect(row_6.find('td').at(2).text()).toBe('CC,PS,SD');
    expect(row_6.find('td').at(3).text()).toBe('2.1.1');

    const row_7 = body.find('tr').at(7);
    expect(row_7.exists()).toBeTruthy();

    expect(row_7.find('td').first().text()).toBe('AA1/A-29');
    expect(row_7.find('td').at(1).text()).toBe('Page title issue with add landings - incorrect title element');
    expect(row_7.find('td').at(2).text()).toBe('CC - Add landings');
    expect(row_7.find('td').at(3).text()).toBe('2.4.2');

    const row_8 = body.find('tr').at(8);
    expect(row_8.exists()).toBeTruthy();

    expect(row_8.find('td').first().text()).toBe('AA1/A-17');
    expect(row_8.find('td').at(1).text()).toBe('Accessible names are missing from the \'Edit\' and \'Remove\' buttons.');
    expect(row_8.find('td').at(2).text()).toBe('CC - Add landings');
    expect(row_8.find('td').at(3).text()).toBe('2.5.3');

    const row_9 = body.find('tr').at(9);
    expect(row_9.exists()).toBeTruthy();

    expect(row_9.find('td').first().text()).toBe('AA1/A-30');
    expect(row_9.find('td').at(1).text()).toBe('Navigation issues - inconsistent main navigation');
    expect(row_9.find('td').at(2).text()).toBe('CC,PS,SD - Exporter dashboard');
    expect(row_9.find('td').at(3).text()).toBe('3.2.3');

    const row_10 = body.find('tr').at(10);
    expect(row_10.exists()).toBeTruthy();

    expect(row_10.find('td').first().text()).toBe('AA1/A-18');
    expect(row_10.find('td').at(1).text()).toBe('Instances of generic error messaging.');
    expect(row_10.find('td').at(2).text()).toBe('CC - Add landings');
    expect(row_10.find('td').at(3).text()).toBe('3.3.1');

    const row_11 = body.find('tr').at(11);
    expect(row_11.exists()).toBeTruthy();

    expect(row_11.find('td').first().text()).toBe('AA1/A-33');
    expect(row_11.find('td').at(1).text()).toBe('Landings form labels disappear from view when multiple landings are added.');
    expect(row_11.find('td').at(2).text()).toBe('CC - Add landings');
    expect(row_11.find('td').at(3).text()).toBe('3.3.2');

    const row_12 = body.find('tr').at(12);
    expect(row_12.exists()).toBeTruthy();

    expect(row_12.find('td').first().text()).toBe('AA1/A-34');
    expect(row_12.find('td').at(1).text()).toBe('Validation is specific regarding “transportation details” but does not inform the user what they need to do to correct their mistakes.');
    expect(row_12.find('td').at(2).text()).toBe('CC,SD - Add transportation details');
    expect(row_12.find('td').at(3).text()).toBe('3.3.1');

    const row_13 = body.find('tr').at(13);
    expect(row_13.exists()).toBeTruthy();

    expect(row_13.find('td').first().text()).toBe('AA1/A-01');
    expect(row_13.find('td').at(1).text()).toBe('Drop-down pick lists not accessible with Dragon Naturallyspeaking.');
    expect(row_13.find('td').at(2).text()).toBe('CC - Add products');
    expect(row_13.find('td').at(3).text()).toBe('4.1.1');

    const row_14 = body.find('tr').at(14);
    expect(row_14.exists()).toBeTruthy();

    expect(row_14.find('td').first().text()).toBe('AA1/A-02');
    expect(row_14.find('td').at(1).text()).toBe('Date cannot be chosen using Dragon Naturallyspeaking.');
    expect(row_14.find('td').at(2).text()).toBe('CC - Add landings');
    expect(row_14.find('td').at(3).text()).toBe('4.1.1');

    const row_15 = body.find('tr').at(15);
    expect(row_15.exists()).toBeTruthy();

    expect(row_15.find('td').first().text()).toBe('AA1/A-03');
    expect(row_15.find('td').at(1).text()).toBe('Drop-down pick lists not accessible with Dragon Naturallyspeaking.');
    expect(row_15.find('td').at(2).text()).toBe('CC - Add landings');
    expect(row_15.find('td').at(3).text()).toBe('4.1.1');

    const row_16 = body.find('tr').at(16);
    expect(row_16.exists()).toBeTruthy();

    expect(row_16.find('td').first().text()).toBe('AA1/A-20');
    expect(row_16.find('td').at(1).text()).toBe('Compatibility issues with Dragon Naturally Speaking.');
    expect(row_16.find('td').at(2).text()).toBe('CC,PS,SD');
    expect(row_16.find('td').at(3).text()).toBe('4.1.1');

    const row_17 = body.find('tr').at(17);
    expect(row_17.exists()).toBeTruthy();

    expect(row_17.find('td').first().text()).toBe('AA1/A-21');
    expect(row_17.find('td').at(1).text()).toBe('Navigation issues - missing ARIA roles');
    expect(row_17.find('td').at(2).text()).toBe('CC,PS,SD');
    expect(row_17.find('td').at(3).text()).toBe('4.1.2');

    const row_18 = body.find('tr').at(18);
    expect(row_18.exists()).toBeTruthy();

    expect(row_18.find('td').first().text()).toBe('AA1/A-35');
    expect(row_18.find('td').at(1).text()).toBe('There is more than one type of format used for date pickers. This version is not keyboard-accessible.');
    expect(row_18.find('td').at(2).text()).toBe('SD - Add product');
    expect(row_18.find('td').at(3).text()).toBe('4.1.1');
  });
});