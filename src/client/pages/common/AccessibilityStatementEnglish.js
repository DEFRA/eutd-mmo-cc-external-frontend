import React from 'react';
import {
  GridCol,
  GridRow,
  Header,
  ListItem,
  Main,
  UnorderedList,
  Table
} from 'govuk-react';
import PageTitle from '../../components/PageTitle';
import LinkTargetBlank from '../../components/elements/LinkTargetBlank';

export const AccessibilityStatementEnglish = () => (
  <Main>
    <PageTitle title='Accessibility - GOV.UK' />
    <GridRow>
      <GridCol>
        <Header level="1">Accessibility statement for the Fish Exports service</Header>
        <p>This service is part of the wider <LinkTargetBlank href="https://www.gov.uk" ariaLabel="Opens link for GOV.UK" text="GOV.UK"/> website. There’s a separate &nbsp;
          <LinkTargetBlank href="https://www.gov.uk/help/accessibility-statement" ariaLabel="Opens link for accessibility statement for main gov.uk site" text="accessibility statement for the main GOV.UK website."/>
        </p>
        <p>This page only contains information about the Fish Exports service, available at: <br />
          <LinkTargetBlank href="/" ariaLabel="Opens link for information on fish export service" text="https://manage-fish-exports.service.gov.uk/" />
        </p>
        <br />
        <Header level="2" size="MEDIUM">Using this service</Header>
        <p>This service is run by the Marine Management Organisation. We want as many people as possible to be able to use this service. For example, that means you should be able to:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>change colours, contrast levels and fonts</ListItem>
          <ListItem>zoom in up to 300% without the text spilling off the screen</ListItem>
          <ListItem>get from the start of the service to the end using just a keyboard</ListItem>
          <ListItem>get from the start of the service to the end using speech recognition software</ListItem>
          <ListItem>listen to the service using a screen reader (including the most recent versions of JAWS, NVDA and VoiceOver)</ListItem>
        </UnorderedList>
        <br/>
        <p>We’ve also made the text in the service as simple as possible to understand.</p>
        <p><LinkTargetBlank href="https://mcmw.abilitynet.org.uk/" ariaLabel="Opens link about using your device if you have disability" text="AbilityNet" /> has advice on making your device easier to use if you have a disability.</p>
        <Header level="2" size="MEDIUM">How accessible this service is</Header>
        <p>We know some parts of this website are not fully accessible.</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>There are compatibility issues with some assistive technology</ListItem>
          <ListItem>Some navigation is inconsistent or not clearly connected to its content</ListItem>
          <ListItem>There are text resizing issues on certain pages</ListItem>
          <ListItem>Accessible names are missing from some buttons</ListItem>
          <ListItem>Some error messages require clarification</ListItem>
          <ListItem>There is incorrect heading structure on certain pages</ListItem>
          <ListItem>There is an incorrect page title implementation on the Catch Certificates Add landings page</ListItem>
          <ListItem>Labels can become removed from their content on the Catch Certificates Add landings page</ListItem>
        </UnorderedList>
        <br/>
        <Header level="2" size="MEDIUM">Feedback and contact information</Header>
        <p>If you have difficulty using this service, contact us by:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>call <a href="tel:0330 159 1989 ">0330 159 1989</a></ListItem>
        </UnorderedList>
        <br />
        <p>As part of providing this service, we may need to send you messages or documents. We’ll ask you how you want us to send messages or documents to you but contact us if you need them in a different format. For example, large print, audio recording or braille.</p>
        <Header level="2" size="MEDIUM"> Reporting accessibility problems with this service</Header>
        <p>We’re always looking to improve the accessibility of this service. If you find any problems that are not listed on this page or think we’re not meeting accessibility requirements, contact: Dom Horsfall (<a href="mailto:dominic.Horsfall@marinemanagement.org.uk">dominic.Horsfall@marinemanagement.org.uk</a>)</p>
        <br />
        <Header level="2" size="MEDIUM">Enforcement procedure</Header>
        <p>The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the ‘accessibility regulations’). If you’re not happy with how we respond to your complaint, &nbsp;
          <LinkTargetBlank href="https://www.equalityadvisoryservice.com/" ariaLabel="Opens link to information about equality advisory service" text="contact the Equality Advisory and Support Service (EASS)." />
        </p>
        <br />

        <Header level="2" size="MEDIUM">Contacting us by phone or visiting us in person</Header>
        <p>We provide a text relay service for people who are deaf, hearing impaired or have a speech impediment.</p>
        <p>Our offices have audio induction loops, or if you contact us before your visit, we can arrange a British Sign Language (BSL) interpreter to help you complete the service in person.</p>
        <p>Find out how to contact us: &nbsp;
         <LinkTargetBlank href="https://www.gov.uk/contact-local-marine-management-organisation" ariaLabel="Opens link to Contact your local Marine Management Organisation office" text="Contact your local Marine Management Organisation office" />
        </p>


        <br />
        <Header level="2" size="MEDIUM">Technical information about this service’s accessibility</Header>
        <p>The Marine Management Organisation is committed to making this service accessible, in accordance with the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018.</p>

        <br />
        <Header level="3" size="MEDIUM">Compliance status</Header>
        <p>{'This website is partially compliant with the '}
        <LinkTargetBlank href="https://www.w3.org/TR/WCAG21/" ariaLabel="Opens link to Web Content Accessibility Guidelines" text="Web Content Accessibility Guidelines version 2.1 AA standard" />, due to the non-compliances listed below.</p>
        <br />

        <Header level="2" size="MEDIUM">Non accessible content</Header>
        <p>The content listed below is non-accessible for the following reasons.</p>

        <br />
        <Header level="3" size="MEDIUM">Non-compliance with the accessibility regulations</Header>
        <p>The service has identified the following issues:</p>
        <Table
         head={(
          <Table.Row>
            <Table.CellHeader>Reference</Table.CellHeader>
            <Table.CellHeader>Issue</Table.CellHeader>
            <Table.CellHeader>Location</Table.CellHeader>
            <Table.CellHeader>WCAG ref.</Table.CellHeader>
          </Table.Row>
         )}
         body={
          <>
            <Table.Row>
             <Table.Cell><strong>AA1/A-05a</strong></Table.Cell>
             <Table.Cell><strong>{'Month-by-month navigation isn\'t visually or semantically connected to the \'Completed\' data above it.'}</strong></Table.Cell>
             <Table.Cell>CC,PS,SD - Exporter dashboard</Table.Cell>
             <Table.Cell>1.3.2</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-05b</strong></Table.Cell>
             <Table.Cell><strong>{'The \'<<\' and \'>>\' links to future/previous months are not explained or semantically presented in way that is accessible.'}</strong></Table.Cell>
             <Table.Cell>CC,PS,SD - Exporter dashboard</Table.Cell>
             <Table.Cell>1.3.2</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-23</strong></Table.Cell>
             <Table.Cell><strong>Incorrect heading structure</strong></Table.Cell>
             <Table.Cell>CC,PS,SD - Exporter dashboard</Table.Cell>
             <Table.Cell>1.3.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-07</strong></Table.Cell>
             <Table.Cell><strong>{'The text can be resized, but the way the form is handled means that the field widths don\'t adequately accommodate the resized text, partially obscuring the content.'}</strong></Table.Cell>
             <Table.Cell>CC - Add landings</Table.Cell>
             <Table.Cell>1.4.4</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-08</strong></Table.Cell>
             <Table.Cell><strong>On text resizing, the form does not reflow on resizing, causing some content to be part hidden. Similarly, on smaller screen sizes, parts of the form appear off screen.</strong></Table.Cell>
             <Table.Cell>CC - Add landings</Table.Cell>
             <Table.Cell>1.4.10</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-09</strong></Table.Cell>
             <Table.Cell><strong>Date picker issues.</strong></Table.Cell>
             <Table.Cell>CC,PS,SD</Table.Cell>
             <Table.Cell>2.1.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-10</strong></Table.Cell>
             <Table.Cell><strong>Typeahead issues - ‘Add landings for each product’.</strong></Table.Cell>
             <Table.Cell>CC,PS,SD</Table.Cell>
             <Table.Cell>2.1.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-29</strong></Table.Cell>
             <Table.Cell><strong>Page title issue with add landings - incorrect title element</strong></Table.Cell>
             <Table.Cell>CC - Add landings</Table.Cell>
             <Table.Cell>2.4.2</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-17</strong></Table.Cell>
             <Table.Cell><strong>Accessible names are missing from the 'Edit' and 'Remove' buttons.</strong></Table.Cell>
             <Table.Cell>CC - Add landings</Table.Cell>
             <Table.Cell>2.5.3</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-30</strong></Table.Cell>
             <Table.Cell><strong>Navigation issues - inconsistent main navigation</strong></Table.Cell>
             <Table.Cell>CC,PS,SD - Exporter dashboard</Table.Cell>
             <Table.Cell>3.2.3</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-18</strong></Table.Cell>
             <Table.Cell><strong>Instances of generic error messaging.</strong></Table.Cell>
             <Table.Cell>CC - Add landings</Table.Cell>
             <Table.Cell>3.3.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-33</strong></Table.Cell>
             <Table.Cell><strong>Landings form labels disappear from view when multiple landings are added.</strong></Table.Cell>
             <Table.Cell>CC - Add landings</Table.Cell>
             <Table.Cell>3.3.2</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-34</strong></Table.Cell>
             <Table.Cell><strong>Validation is specific regarding “transportation details” but does not inform the user what they need to do to correct their mistakes.</strong></Table.Cell>
             <Table.Cell>CC,SD - Add transportation details</Table.Cell>
             <Table.Cell>3.3.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-01</strong></Table.Cell>
             <Table.Cell><strong>Drop-down pick lists not accessible with Dragon Naturallyspeaking.</strong></Table.Cell>
             <Table.Cell>CC - Add products</Table.Cell>
             <Table.Cell>4.1.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-02</strong></Table.Cell>
             <Table.Cell><strong>Date cannot be chosen using Dragon Naturallyspeaking.</strong></Table.Cell>
             <Table.Cell>CC - Add landings</Table.Cell>
             <Table.Cell>4.1.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-03</strong></Table.Cell>
             <Table.Cell><strong>Drop-down pick lists not accessible with Dragon Naturallyspeaking.</strong></Table.Cell>
             <Table.Cell>CC - Add landings</Table.Cell>
             <Table.Cell>4.1.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-20</strong></Table.Cell>
             <Table.Cell><strong>Compatibility issues with Dragon Naturally Speaking.</strong></Table.Cell>
             <Table.Cell>CC,PS,SD</Table.Cell>
             <Table.Cell>4.1.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-21</strong></Table.Cell>
             <Table.Cell><strong>Navigation issues - missing ARIA roles</strong></Table.Cell>
             <Table.Cell>CC,PS,SD</Table.Cell>
             <Table.Cell>4.1.2</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-35</strong></Table.Cell>
             <Table.Cell><strong>There is more than one type of format used for date pickers. This version is not keyboard-accessible.</strong></Table.Cell>
             <Table.Cell>SD - Add product</Table.Cell>
             <Table.Cell>4.1.1</Table.Cell>
           </Table.Row>
          </>
         }
        />
        <br />
        <p>CC = Catch Certificates, PS = Processing Statements, SD = Storage Documents</p>
        <p>We intend to fix these problems by as soon as possible.</p>

        <br />
        <Header level="3" size="MEDIUM">Disproportionate burden</Header>
        <p>For catch certificates:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>the forms for direct landings are only available in PDF format</ListItem>
        </UnorderedList>
        <br/>
        <p>These PDF forms have passed WCAG AA standards, however, we do intend to replace them with HTML forms in the long term.</p>

        <Header level="2" size="MEDIUM">What we’re doing to improve accessibility</Header>
        <p>As part of continuous improvement, the service aims to:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>address and fix identified, WCAG 2.1 AA non-compliant accessibility issues (priority 1)</ListItem>
          <ListItem>carry out continuous research to make sure you can complete the service first time, and make improvements where necessary (priority 2)</ListItem>
          <ListItem>continue to research and test the service to ensure your needs are addressed (priority 3)</ListItem>
        </UnorderedList>
        <br />
        <Header level="2" size="MEDIUM">Preparation of this accessibility statement</Header>
        <p>This statement was prepared on 3 June 2021. It was last reviewed on 3 June 2021.</p>
        <p>This service was last tested on 21 September 2020. The test was carried out by Defra’s Digital, Data and Technology Services accessibility team.</p>
        <br />
      </GridCol>
    </GridRow>
  </Main>
);