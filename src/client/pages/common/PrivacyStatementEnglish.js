import * as React from 'react';
import Main from '@govuk-react/main';
import PageTitle from '../../components/PageTitle';
import BackLink from '@govuk-react/back-link';
import GridCol from '@govuk-react/grid-col';
import GridRow from '@govuk-react/grid-row';
import Header from '@govuk-react/header';
import OrderedList from '@govuk-react/ordered-list';
import ListItem from '@govuk-react/list-item';
import Button from '@govuk-react/button';
import LinkTargetBlank from '../../components/elements/LinkTargetBlank';

const PrivacyStatementEnglish = ({
  onSubmit,
  nextUri,
  onBackLinkClick,
  privacyAcceptedAlready,
}) => {
  const pStyle = {
    fontWeight: 'bold',
  };

  return (
    <Main>
      <PageTitle title="Privacy - GOV.UK" />
      {privacyAcceptedAlready && (
        <BackLink
          id="back"
          onClick={onBackLinkClick}
          href="#"
        />
      )}
      <GridRow>
        <GridCol>
          <Header level="1">Privacy notice</Header>
          <p>
            Your privacy is extremely important to us. This notice explains what
            personal information we have, how we use it and how you can check
            and update any of your personal information. For the purposes of
            this Privacy Notice, “we” means Department for Environment, Food and
            Rural Affairs (Defra) and other government agencies in the group.
          </p>
          <p>&nbsp;</p>
          <Header level="2">Why We Collect Your Personal Information</Header>
          <p>
            We collect your personal information so you can be issued a UK
            Export Catch Certificate, by accessing the service operated by Defra
            and processed by the Marine Management Organisation (MMO) and other
            UK Marine Fisheries authorities operating in the UK.
          </p>
          <p>The following personal information we require is as follows:</p>
          <OrderedList listStyleType="disc">
            <ListItem>Your full name</ListItem>
            <ListItem>Company name (where applicable)</ListItem>
            <ListItem>Address</ListItem>
            <ListItem>Contact telephone number</ListItem>
            <ListItem>Vessel registration details, including:</ListItem>
            <OrderedList listStyleType="circle">
              <ListItem>Vessel name</ListItem>
              <ListItem>Registration number</ListItem>
              <ListItem>Port and number</ListItem>
              <ListItem>
                International Maritime Organisation (IMO) number
              </ListItem>
              <ListItem>Lloyds number</ListItem>
              <ListItem>Fishing license number</ListItem>
              <ListItem>
                Inmarsat number / fax / telephone number where applicable
              </ListItem>
            </OrderedList>
            <ListItem>Name of Master of fishing vessel</ListItem>
            <ListItem>
              Contact details (name, addresses & transportation details) of
              transshipment, (re)exporter, importer, transporter, processors,
              and storage facilities.
            </ListItem>
          </OrderedList>
          <br />
          <p>
            We also use your personal information with Google Analytics to
            monitor your online progress through the service, helping us to
            improve your experience e.g.
          </p>
          <p>Performance Statistics:</p>
          <OrderedList listStyleType="disc">
            <ListItem>Your interaction with the website</ListItem>
            <ListItem>
              Understanding what a user does when they receive an error
              (continue or abandon)
            </ListItem>
            <ListItem>
              Where you leave the website, which could be from an error page or
              you may have failed to complete a certificate
            </ListItem>
            <ListItem>Number of vessels per document</ListItem>
            <ListItem>How many users created each export certificate</ListItem>
          </OrderedList>
          <br />
          <p>Performance information:</p>
          <OrderedList listStyleType="disc">
            <ListItem>Catch Certificate Insights</ListItem>

            <OrderedList listStyleType="circle">
              <ListItem>
                How many catch landing details in each certificate
              </ListItem>
              <ListItem>How many variations of products</ListItem>
              <ListItem>The different transport options people use </ListItem>
              <ListItem>
                The amount of users who change the exporter details
              </ListItem>
            </OrderedList>
            <p>&nbsp;</p>
            <ListItem>Company Insights</ListItem>
            <OrderedList listStyleType="circle">
              <ListItem>The different types of companies</ListItem>
              <ListItem>The location of companies</ListItem>
              <ListItem>The amount of documents each company creates</ListItem>
              <ListItem>
                The percentage of documents created across all companies
              </ListItem>
              <ListItem>
                The amount of companies who create multiple documents
              </ListItem>
            </OrderedList>
          </OrderedList>
          <br />
          <p>
            We do not track IP address or individual User Id’s in Google
            Analytics.
          </p>
          <Header level="2">Who Collects Your Personal Information</Header>
          <p>
            The Department for Environment, Food and Rural Affairs (Defra)
            collects your personal information and is the data controller for
            the personal information you provide.
          </p>
          <span style={pStyle}>DEFRA Data Protection Officer</span> <br />
          <br />
          You can contact the Defra Data Protection Officer at:
          <p>
            Department for Environment, <br />
            Food and Rural Affairs
            <br />
            SW Quarter
            <br />
            2nd floor
            <br />
            Seacole Block
            <br />2 Marsham Street
            <br />
            London SW1P 4DF <br />
            Email:{' '}
            <a href="mailto:data.protection@defra.gov.uk">
              data.protection@defra.gov.uk
            </a>
          </p>
          <p>&nbsp;</p>
          <Header level="2">
            Legal Basis for Processing Your Personal Information{' '}
          </Header>
          <p>
            The legal basis for processing your personal information is in the
            exercise of official authority, and also to perform specific tasks
            in the public interest which allow for safe border data transfer.
            Where required by law, data may be published on UK Government or EU
            websites.
          </p>
          <p>
            Your personal information will be processed securely using
            appropriate technical and organisational measures.
          </p>
          <p>
            More information about the MMO can be found at <br />
            <LinkTargetBlank
              href="https://www.gov.uk/government/organisations/marine-management-organisation"
              ariaLabel="Opens link for information about MMO"
              text="https://www.gov.uk/government/organisations/marine-management-organisation"
            />
          </p>
          <br />
          <Header level="2">
            Who Your Personal Information May be Shared with
          </Header>
          <p>
            Personal information may be made available to public and local
            authorities and other public bodies in the UK and EU to meet legal
            requirements in pursuance of public tasks
          </p>
          <p>
            We may have to release information (including personal information
            and commercial information) under the following legislation:
          </p>
          <OrderedList listStyleType="disc">
            <ListItem>General Data Protection Regulation (GDPR)</ListItem>
            <ListItem>UK Data Protection Act 2018</ListItem>
            <ListItem>Freedom of Information Act 2000</ListItem>
            <ListItem>Environmental Information Regulations 2004</ListItem>
          </OrderedList>
          <br />
          <Header level="2">
            How Long We Keep Your Personal Information for
          </Header>
          <p>
            All personal information within Defra is held in accordance with our
            data retention policy and in alignment with EU Data Privacy
            statement provisions.
          </p>
          <br />
          <Header level="2">
            What will happen if I don’t provide the data?
          </Header>
          <p>
            For statutory and public interest purposes it is necessary to
            provide data as stated in the relevant legislation.
          </p>
          <br />
          <Header level="2">
            Will my personal information be transferred outside of the UK / EEA?
            If it is, how will it be protected?
          </Header>
          <p>
            The data you provide will not be transferred outside of the UK /
            EEA. However, when necessary personal information may be transferred
            when it is lawful and complementary to our work carried out in the
            public interest, i.e. enforcement, verification of documentation
            outside (UK / EEA),{' '}
          </p>
          <br />
          <Header level="2">Your Rights</Header>
          <span style={pStyle}>Your Right of Access</span> <br />
          <br />
          <p>
            You have the right to ask us for copies of your personal
            information. This right always applies. There are some exemptions,
            which means you may not always receive all the information we
            process. You can read more about this right{' '}
            <LinkTargetBlank
              href="https://ico.org.uk/your-data-matters/your-right-to-get-copies-of-your-data/"
              ariaLabel="Opens link about your right of access"
              text="here"
            />{' '}
            .
          </p>
          <br />
          <span style={pStyle}>Your Right to Rectification</span> <br />
          <br />
          <p>
            You have the right to ask us to rectify information you think is
            inaccurate. You also have the right to ask us to complete
            information you think is incomplete. This right always applies.You
            can read more about this right{' '}
            <LinkTargetBlank
              href="https://ico.org.uk/your-data-matters/your-right-to-get-your-data-corrected/"
              ariaLabel="Opens link about Your right to get your data corrected"
              text="here"
            />
            .
          </p>
          <br />
          <span style={pStyle}>Your Right to Erasure</span> <br />
          <br />
          <p>
            You have the right to ask us to erase your personal information in
            certain circumstances. You can read more about this right{' '}
            <LinkTargetBlank
              href="https://ico.org.uk/your-data-matters/your-right-to-get-your-data-deleted/"
              ariaLabel="Opens link about your right to get your data deleted"
              text="here"
            />
            .
          </p>
          <br />
          <span style={pStyle}>
            Your Right to Restriction of Processing
          </span>{' '}
          <br />
          <br />
          <p>
            You have the right to ask us to restrict the processing of your
            information in certain circumstances. You can read more about this
            right{' '}
            <LinkTargetBlank
              href="https://ico.org.uk/your-data-matters/your-right-to-limit-how-organisations-use-your-data/"
              ariaLabel="Opens link about Your right to limit how organisations use your data"
              text="here"
            />
            .
          </p>
          <br />
          <span style={pStyle}>Your Right to Object to Processing</span> <br />
          <br />
          <p>
            You have the right to object to processing if we are able to process
            your information because the process forms part of our public tasks
            or is in our legitimate interests. You can read more about this
            right{' '}
            <LinkTargetBlank
              href="https://ico.org.uk/your-data-matters/the-right-to-object-to-the-use-of-your-data/"
              ariaLabel="Opens link about your right to object to the use of your data"
              text="here"
            />
            .
          </p>
          <br />
          <span style={pStyle}>Your Right to Data Portability </span> <br />
          <br />
          <p>
            This only applies to information you have given us. You have the
            right to ask that we transfer the information you gave us from one
            organisation to another or give it to you. The right only applies if
            we are processing information based on your consent or under, or in
            talks about entering into a contract and the processing is
            automated. You can read more about this right{' '}
            <LinkTargetBlank
              href="https://ico.org.uk/your-data-matters/your-right-to-data-portability/"
              ariaLabel="Opens link about your right to data portability"
              text="here"
            />
            .
          </p>
          <p>
            If we are processing your information for criminal law enforcement
            purposes, your rights are slightly different.{' '}
          </p>
          <p>
            You are not required to pay any charge for exercising your rights.
            We have one month to respond to you.
          </p>
          <p>
            Please contact our Data Protection Officer if you wish to make a
            request
          </p>
          <p>&nbsp;</p>
          <Header level="2">How do I complain?</Header>
          <p>
            You have the right to lodge a complaint with the Independent
            Commissioners Office (ICO) at any time
          </p>
          <p>
            During the coronavirus pandemic you can still report concerns to the
            ICO about our information rights practices via their helpline on
            0303 123 1113.
          </p>
          <p>&nbsp;</p>
          <br />
          {!privacyAcceptedAlready && (
            <form
              action="/orchestration/api/v1/userAttributes"
              method="POST"
              onSubmit={onSubmit}
            >
              <input type="hidden" name="key" value="privacy_statement"></input>
              <input type="hidden" name="value" value="true"></input>
              <input type="hidden" name="nextUri" value={nextUri}></input>
              <Button id="privacyNotice" name="privacyNotice">
                Accept and continue
              </Button>
            </form>
          )}
        </GridCol>
      </GridRow>
    </Main>
  );
};

export default PrivacyStatementEnglish;
