import React from 'react';
import {
  Main,
  BackLink,
  GridRow,
  GridCol,
  Header,
  UnorderedList,
  ListItem,
} from 'govuk-react';
import PageTitle from '../components/PageTitle';

const ImproveServiceEnglishPage = ({
  feedbackUrl,
  listFont,
  backRoute,
  goBack,
  title,
}) => (
  <Main>
    <PageTitle title={`Service improvement plan - ${title}`} />
    <BackLink
      onClick={(e) => {
        e.preventDefault();
        goBack();
      }}
      href={backRoute}
    />
    <GridRow>
      <GridCol>
        <Header level="1">How we're improving the service</Header>
      </GridCol>
    </GridRow>
    <GridRow>
      <GridCol>
        <p>
          The <strong>Fish Exports Service</strong> helps businesses operating
          in the UK produce documents that enable fish exports to the EU and
          certain other countries.
        </p>
        <p>The service:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem style={listFont}>
            uses your information in a secure way
          </ListItem>
          <ListItem style={listFont}>
            is working towards the WCAG 2.1 AA accessibility standard
          </ListItem>
          <ListItem style={listFont}>
            uses technology that allows it to be improved over time
          </ListItem>
          <ListItem style={listFont}>
            aims to meet the Government’s{' '}
            <a
              href="https://www.gov.uk/service-manual/service-standard"
              rel="noopener noreferrer"
              target="_blank"
              alt="Opens service manual"
            >
              Digital Service Standard (opens in new tab)
            </a>
            .
          </ListItem>
        </UnorderedList>
        <br />
        <p>As part of continuous improvement, the service aims to:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem style={listFont}>
            address and fix identified, WCAG 2.1 AA non-compliant accessibility
            issues (priority 1)
          </ListItem>
          <ListItem style={listFont}>
            carry out continuous research to make sure you can complete the
            service first time, and make improvements where necessary (priority
            2)
          </ListItem>
          <ListItem style={listFont}>
            continue to research and test the service to ensure your needs are
            addressed (priority 3)
          </ListItem>
        </UnorderedList>
        <br />
        <p>
          Your{' '}
          <a
            href={feedbackUrl}
            rel="noopener noreferrer"
            target="_blank"
            alt="Opens feedback form"
          >
            feedback (opens in new tab)
          </a>{' '}
          will help us to improve this service.
        </p>
      </GridCol>
    </GridRow>
  </Main>
);

export default ImproveServiceEnglishPage;
