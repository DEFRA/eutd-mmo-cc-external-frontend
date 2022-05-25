import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AccessibilityStatementWelsh } from '../../../src/client/pages/common/AccessibilityStatementWelsh';

describe('Accessibility Statement English', () => {

  const mockStore = configureStore([thunk]);
  const store = mockStore({ });

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <AccessibilityStatementWelsh />
      </MemoryRouter>
    </Provider>
  );

  it('should render the component', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render PageTitle with the correct text in Welsh', () => {
    expect(wrapper.find('PageTitle[title=\'Hygyrchedd - GOV.UK\']').exists()).toBeTruthy();
  });

  it('should render page with the correct heading in Welsh', () => {
    expect(wrapper.find('h1').first().text()).toBe('Datganiad hygyrchedd ar gyfer y gwasanaeth Allforio Pysgod');
  });


  it('should render page with the correct links and text', () => {
    expect(wrapper.find('a[href="/"]').text()).toEqual('https://manage-fish-exports.service.gov.uk/(opens in new tab)');
    expect(wrapper.find('a[href="https://www.gov.uk/help/accessibility-statement"]').text()).toEqual('datganiad hygyrchedd ar wahân ar gyfer prif wefan GOV.UK.(opens in new tab)');
    expect(wrapper.find('a[href="https://mcmw.abilitynet.org.uk/"]').text()).toEqual('AbilityNet(opens in new tab)');
    expect(wrapper.find('a[href="https://www.equalityadvisoryservice.com/"]').text()).toEqual('cysylltwch â’r Gwasanaeth Cynghori a Chefnogi Cydraddoldeb (EASS).(opens in new tab)');
    expect(wrapper.find('a[href="https://www.gov.uk/contact-local-marine-management-organisation"]').text()).toEqual('Cysylltu â’ch swyddfa Sefydliad Rheoli Morol leol(opens in new tab)');
    expect(wrapper.find('a[href="https://www.w3.org/TR/WCAG21/"]').text()).toEqual('Chanllawiau Hygyrchedd Cynnwys Gwe fersiwn 2.1 safon AA(opens in new tab)');
    expect(wrapper.find('a[href="https://www.gov.uk/cymraeg"]').text()).toEqual('GOV.UK(opens in new tab)');
  });

  it('should render update information about how accessible this service is in Welsh', () => {
    expect(wrapper.find('li').at(5).text()).toBe('Mae problemau cydnawsedd gyda rhywfaint o dechnoleg gynorthwyol');
    expect(wrapper.find('li').at(6).text()).toBe('Mae rhywfaint o’r llywio’n anghyson neu nid yw wedi’i gysylltu’n glir â’i gynnwys');
    expect(wrapper.find('li').at(7).text()).toBe('Mae problemau wrth newid maint testun ar dudalennau penodol');
    expect(wrapper.find('li').at(8).text()).toBe('Mae enwau hygyrch ar goll o rai botymau');
    expect(wrapper.find('li').at(9).text()).toBe('Mae angen egluro rhai negeseuon gwall');
    expect(wrapper.find('li').at(10).text()).toBe('Mae strwythur pennawd anghywir ar rai tudalennau');
    expect(wrapper.find('li').at(11).text()).toBe('Mae teitl tudalen anghywir wedi\'i roi ar waith ar y dudalen Ychwanegu Tystysgrifau Dalfa');
    expect(wrapper.find('li').at(12).text()).toBe('Mae modd tynnu labeli o\'u cynnwys ar y dudalen Ychwanegu Tystysgrifau Dalfa');
    expect(wrapper.find('li').at(15).text()).toBe('canfod a datrys problemau hygyrchedd sydd ddim yn cydymffurfio â WCAG 2.1 AA (blaenoriaeth 1)');
    expect(wrapper.find('li').at(16).text()).toBe('gwneud gwaith ymchwil parhaus i wneud yn siŵr eich bod yn gallu cwblhau’r gwasanaeth y tro cyntaf, a gwneud gwelliannau lle bo angen (blaenoriaeth 2)');
    expect(wrapper.find('li').at(17).text()).toBe('parhau i ymchwilio a phrofi’r gwasanaeth fel ei fod yn cyflawni eich anghenion (blaenoriaeth 3)');

    expect(wrapper.find('p').at(14).text()).toBe('Mae’r wefan hon yn cydymffurfio\'n rhannol â Chanllawiau Hygyrchedd Cynnwys Gwe fersiwn 2.1 safon AA(opens in new tab), oherwydd y diffyg cydymffurfio a restrir isod.');
    expect(wrapper.find('p').at(16).text()).toBe('Mae’r gwasanaeth wedi nodi’r problemau canlynol:');
    expect(wrapper.find('p').at(17).text()).toBe('CC - Tystysgrifau Dalfa, PS - Prosesu Datganiadau, SD - Dogfennau Storio');
    expect(wrapper.find('p').at(21).text()).toBe('Er mwyn gwella’n barhaus, nod y gwasanaeth yw:');
    expect(wrapper.find('p').at(22).text()).toBe('Paratowyd y datganiad hwn ar 3 Mehefin 2021. Cafodd ei adolygu ddiwethaf ar 3 Mehefin 2021.');
    expect(wrapper.find('p').last().text()).toBe('Cafodd y gwasanaeth hwn ei brofi ddiwethaf ar 21 Medi 2020. Cynhaliwyd y prawf gan dîm hygyrchedd Gwasanaethau Digidol, Data a Thechnoleg Defra.');
  });

  it('should render a table of accessibility issues identified in the service in Welsh', () => {
    const table = wrapper.find('table');
    expect(table.exists()).toBeTruthy();

    const header = table.find('thead');
    expect(header.exists()).toBeTruthy();
    expect(header.find('th').first().text()).toBe('Cyfeirnod');
    expect(header.find('th').at(1).text()).toBe('Problem');
    expect(header.find('th').at(2).text()).toBe('Lleoliad');
    expect(header.find('th').at(3).text()).toBe('Cyf WCAG.');

    const body = table.find('tbody');
    expect(body.exists()).toBeTruthy();

    const row = body.find('tr').first();
    expect(row.exists()).toBeTruthy();

    expect(row.find('td').first().text()).toBe('AA1/A-05a');
    expect(row.find('td').at(1).text()).toBe('Dydy llywio o fis i fis ddim yn gysylltiedig yn weledol nac yn semantig â\'r data \'Cwblhawyd\' uwchben.');
    expect(row.find('td').at(2).text()).toBe('CC,PS,SD - Dangosfwrdd allforiwr');
    expect(row.find('td').at(3).text()).toBe('1.3.2');

    const row_1 = body.find('tr').at(1);
    expect(row_1.exists()).toBeTruthy();

    expect(row_1.find('td').first().text()).toBe('AA1/A-05b');
    expect(row_1.find('td').at(1).text()).toBe('Nid yw’r dolenni \'<<\' a \'>>\' i fisoedd blaenorol/yn y dyfodol wedi’u hegluro neu eu cyflwyno’n semantig mewn ffordd hygyrch.');
    expect(row_1.find('td').at(2).text()).toBe('CC,PS,SD - Dangosfwrdd allforiwr');
    expect(row_1.find('td').at(3).text()).toBe('1.3.2');

    const row_2 = body.find('tr').at(2);
    expect(row_2.exists()).toBeTruthy();

    expect(row_2.find('td').first().text()).toBe('AA1/A-23');
    expect(row_2.find('td').at(1).text()).toBe('Strwythur pennawd anghywir');
    expect(row_2.find('td').at(2).text()).toBe('CC,PS,SD - Dangosfwrdd allforiwr');
    expect(row_2.find('td').at(3).text()).toBe('1.3.1');

    const row_3 = body.find('tr').at(3);
    expect(row_3.exists()).toBeTruthy();

    expect(row_3.find('td').first().text()).toBe('AA1/A-07');
    expect(row_3.find('td').at(1).text()).toBe('Mae modd newid maint y testun ond mae\'r ffordd y mae\'r ffurflen yn cael ei thrin yn golygu nad yw lled y maes yn gallu delio\'n ddigonol â\'r testun mewn maint gwahanol. Felly, mae rhywfaint o’r cynnwys yn cael ei guddio.');
    expect(row_3.find('td').at(2).text()).toBe('CC - Ychwanegu glaniadau');
    expect(row_3.find('td').at(3).text()).toBe('1.4.4');

    const row_4 = body.find('tr').at(4);
    expect(row_4.exists()).toBeTruthy();

    expect(row_4.find('td').first().text()).toBe('AA1/A-08');
    expect(row_4.find('td').at(1).text()).toBe('Nid yw cynllun y ffurflen yn ail-lifo wrth newid maint y testun, felly mae rhywfaint o gynnwys yn cael ei guddio. Yn yr un modd, ar sgrin lai ni fydd rhannau o’r ffurflen i’w gweld ar y sgrin.');
    expect(row_4.find('td').at(2).text()).toBe('CC - Ychwanegu glaniadau');
    expect(row_4.find('td').at(3).text()).toBe('1.4.10');

    const row_5 = body.find('tr').at(5);
    expect(row_5.exists()).toBeTruthy();

    expect(row_5.find('td').first().text()).toBe('AA1/A-09');
    expect(row_5.find('td').at(1).text()).toBe('Problemau gyda’r dewiswr dyddiadau.');
    expect(row_5.find('td').at(2).text()).toBe('CC,PS,SD');
    expect(row_5.find('td').at(3).text()).toBe('2.1.1');

    const row_6 = body.find('tr').at(6);
    expect(row_6.exists()).toBeTruthy();

    expect(row_6.find('td').first().text()).toBe('AA1/A-10');
    expect(row_6.find('td').at(1).text()).toBe('Problemau awto-deipio Typeahead – ‘Ychwanegu glaniadau ar gyfer pob cynnyrch’.');
    expect(row_6.find('td').at(2).text()).toBe('CC,PS,SD');
    expect(row_6.find('td').at(3).text()).toBe('2.1.1');

    const row_7 = body.find('tr').at(7);
    expect(row_7.exists()).toBeTruthy();

    expect(row_7.find('td').first().text()).toBe('AA1/A-29');
    expect(row_7.find('td').at(1).text()).toBe('Problemau teitl tudalen gydag ychwanegu glaniadau - elfen teitl anghywir');
    expect(row_7.find('td').at(2).text()).toBe('CC - Ychwanegu glaniadau');
    expect(row_7.find('td').at(3).text()).toBe('2.4.2');

    const row_8 = body.find('tr').at(8);
    expect(row_8.exists()).toBeTruthy();

    expect(row_8.find('td').first().text()).toBe('AA1/A-17');
    expect(row_8.find('td').at(1).text()).toBe('Mae enwau hygyrch ar goll o\'r botymau \'Golygu\' a \'Tynnu\'.');
    expect(row_8.find('td').at(2).text()).toBe('CC - Ychwanegu glaniadau');
    expect(row_8.find('td').at(3).text()).toBe('2.5.3');

    const row_9 = body.find('tr').at(9);
    expect(row_9.exists()).toBeTruthy();

    expect(row_9.find('td').first().text()).toBe('AA1/A-30');
    expect(row_9.find('td').at(1).text()).toBe('Materion llywio - dewislen prif lywio anghyson');
    expect(row_9.find('td').at(2).text()).toBe('CC,PS,SD - Dangosfwrdd allforiwr');
    expect(row_9.find('td').at(3).text()).toBe('3.2.3');

    const row_10 = body.find('tr').at(10);
    expect(row_10.exists()).toBeTruthy();

    expect(row_10.find('td').first().text()).toBe('AA1/A-18');
    expect(row_10.find('td').at(1).text()).toBe('Enghreifftiau o negeseuon gwall generig.');
    expect(row_10.find('td').at(2).text()).toBe('CC - Ychwanegu glaniadau');
    expect(row_10.find('td').at(3).text()).toBe('3.3.1');

    const row_11 = body.find('tr').at(11);
    expect(row_11.exists()).toBeTruthy();

    expect(row_11.find('td').first().text()).toBe('AA1/A-33');
    expect(row_11.find('td').at(1).text()).toBe('Mae labeli’r ffurflen glaniadau’n diflannu o\'r golwg wrth ychwanegu mwy nag un glaniad.');
    expect(row_11.find('td').at(2).text()).toBe('CC - Ychwanegu glaniadau');
    expect(row_11.find('td').at(3).text()).toBe('3.3.2');

    const row_12 = body.find('tr').at(12);
    expect(row_12.exists()).toBeTruthy();

    expect(row_12.find('td').first().text()).toBe('AA1/A-34');
    expect(row_12.find('td').at(1).text()).toBe('Mae’r broses ddilysu’n benodol o ran “manylion cludo”, ond nid yw’n rhoi gwybod i’r defnyddiwr beth mae angen iddo ei wneud i gywiro ei gamgymeriadau.');
    expect(row_12.find('td').at(2).text()).toBe('CC,SD - Ychwanegu manylion cludo');
    expect(row_12.find('td').at(3).text()).toBe('3.3.1');

    const row_13 = body.find('tr').at(13);
    expect(row_13.exists()).toBeTruthy();

    expect(row_13.find('td').first().text()).toBe('AA1/A-01');
    expect(row_13.find('td').at(1).text()).toBe('Nid yw’r rhestrau dewis ar y gwymplen ar gael wrth ddefnyddio Dragon Naturallyspeaking.');
    expect(row_13.find('td').at(2).text()).toBe('CC - Ychwanegu cynnyrch');
    expect(row_13.find('td').at(3).text()).toBe('4.1.1');

    const row_14 = body.find('tr').at(14);
    expect(row_14.exists()).toBeTruthy();

    expect(row_14.find('td').first().text()).toBe('AA1/A-02');
    expect(row_14.find('td').at(1).text()).toBe('Does dim modd dewis dyddiad wrth ddefnyddio Dragon Naturallying.');
    expect(row_14.find('td').at(2).text()).toBe('CC - Ychwanegu glaniadau');
    expect(row_14.find('td').at(3).text()).toBe('4.1.1');

    const row_15 = body.find('tr').at(15);
    expect(row_15.exists()).toBeTruthy();

    expect(row_15.find('td').first().text()).toBe('AA1/A-03');
    expect(row_15.find('td').at(1).text()).toBe('Nid yw’r rhestrau dewis ar y gwymplen ar gael wrth ddefnyddio Dragon Naturallyspeaking.');
    expect(row_15.find('td').at(2).text()).toBe('CC - Ychwanegu glaniadau');
    expect(row_15.find('td').at(3).text()).toBe('4.1.1');

    const row_16 = body.find('tr').at(16);
    expect(row_16.exists()).toBeTruthy();

    expect(row_16.find('td').first().text()).toBe('AA1/A-20');
    expect(row_16.find('td').at(1).text()).toBe('Problemau cydnawsedd gyda Dragon Naturally Speaking.');
    expect(row_16.find('td').at(2).text()).toBe('CC,PS,SD');
    expect(row_16.find('td').at(3).text()).toBe('4.1.1');

    const row_17 = body.find('tr').at(17);
    expect(row_17.exists()).toBeTruthy();

    expect(row_17.find('td').first().text()).toBe('AA1/A-21');
    expect(row_17.find('td').at(1).text()).toBe('Problemau llywio - rolau ARIA coll');
    expect(row_17.find('td').at(2).text()).toBe('CC,PS,SD');
    expect(row_17.find('td').at(3).text()).toBe('4.1.2');

    const row_18 = body.find('tr').at(18);
    expect(row_18.exists()).toBeTruthy();

    expect(row_18.find('td').first().text()).toBe('AA1/A-35');
    expect(row_18.find('td').at(1).text()).toBe('Mae mwy nag un math o fformat yn cael ei ddefnyddio gan y dewiswyr dyddiadau. Does dim modd defnyddio’r bysellfwrdd gyda’r fersiwn hwn.');
    expect(row_18.find('td').at(2).text()).toBe('SD - Ychwanegu cynnyrch');
    expect(row_18.find('td').at(3).text()).toBe('4.1.1');
  });
});