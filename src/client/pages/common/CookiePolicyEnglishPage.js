import React from 'react';
import GridCol from '@govuk-react/grid-col';
import GridRow from '@govuk-react/grid-row';
import Header from '@govuk-react/header';
import ListItem from '@govuk-react/list-item';
import Main from '@govuk-react/main';
import UnorderedList from '@govuk-react/unordered-list';
import SelectRadio from '../../components/elements/SelectRadio';
import PageTitle from '../../components/PageTitle';

const CookiePolicyEnglishPage = ({
  showSuccessBanner,
  selected,
  saveCookieSetting,
  onChange,
}) => (
  <Main>
    <PageTitle title="Cookies - GOV.UK" />
    <GridRow>
      {showSuccessBanner && (
        <div
          className="notification-banner notification-banner--success"
          role="alert"
          aria-labelledby="notification-banner-title"
          data-module="notification-banner"
        >
          <div className="notification-banner__header">
            <h2
              className="notification-banner__title"
              id="notification-banner-title"
              data-testid="notification-banner-title"
            >
              Success
            </h2>
          </div>
          <div
            className="notification-banner__content"
            data-testid="notification-banner__content"
          >
            <p className="notification-banner__heading">
              You’ve set your cookie preferences.
              <a
                className="notification-banner__link"
                onClick={() => window.history.back()}
                href="#"
                data-testid="notification-banner__link"
              >
                Go back to the page you were looking at
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </GridRow>
    <GridRow>
      <GridCol>
        <Header level="1" data-testid="cookies_policy_header">
          Cookies Policy
        </Header>
        <p>
          Cookies are small text files that are placed on your phone, tablet or
          computer by websites that you visit. They are widely used in order to
          make websites work, or work more efficiently, as well as to provide
          information to the owners of the site.
        </p>
        <p>
          The Fish Exports service uses cookies to store information about how
          you use our website, such as the pages you visit. The information
          below explains the cookies we use and why; e.g. Cookie Preferences and
          Google Analytics etc.
        </p>
        <br />
        <Header level="2" size="MEDIUM" data-testid="cookie_preference_header">
          Cookie Preferences
        </Header>
        <p>
          This cookie is used to remember your choice about cookies. Where you
          have previously indicated a preference, your preference will be stored
          in this cookie.
        </p>
        <br />
        <Header level="2" size="MEDIUM" data-testid="google_analytics_header">
          Google Analytics
        </Header>
        <p>
          These cookies are used to collect information about how you use our
          website. We use the information to compile reports and to help us
          improve the website. The cookies collect information such as the
          number of visitors to the website, where visitors have come to the
          website from and the pages they visited. This information does not
          identify anyone.
        </p>
        <p>
          We do not allow Google to use or share the data about how you use this
          site.
        </p>
        <p>
          Google Analytics sets cookies that store anonymised information about:
        </p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>how you got to the site</ListItem>
          <ListItem>
            the pages you visit on The Fish Exports services, and how long you
            spend on each page
          </ListItem>
          <ListItem>
            how many documents and/or certificates are created
          </ListItem>
          <ListItem>how you use the service so we can improve it</ListItem>
          <ListItem>
            how we measure the performance of the digital service and track user
            journeys
          </ListItem>
        </UnorderedList>
        <br />
        <p>
          Google is not allowed to use or share our analytics data, and you can
          opt out of Google Analytics &nbsp;
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            rel="noopener noreferrer"
            data-testid="here__link"
          >
            Here
          </a>
        </p>
        <br />
        <Header
          level="2"
          size="MEDIUM"
          data-testid="introductory_cookie_message_header"
        >
          Introductory Cookie Message
        </Header>
        <p>
          When you first use the service we show a ‘cookie message’. We then
          store a cookie on your phone, tablet or computer so it knows not to
          show this message again. This cookie will expire after one month,
          which means you’ll be asked the same question after this time.
        </p>
        <br />
        <Header
          level="2"
          size="MEDIUM"
          data-testid="cookies_that_remember_your_settings_header"
        >
          Cookies that remember your settings
        </Header>
        <p>
          These cookies remember your preferences and the choices you make, to
          personalise your experience when using the site.
        </p>
        <br />
        <Header level="2" size="MEDIUM" data-testid="essential_cookies_header">
          Essential Cookies and Cookies you can choose
        </Header>
        <p>
          Different types of cookies do different jobs on our website. Some are
          needed to make the website work. We need your consent to use other
          cookies that are not essential. You can change your choices at any
          time. Just click the 'Cookies' link at the end of any page.
        </p>
        <br />
        <Header
          level="2"
          size="MEDIUM"
          data-testid="strictly_necessary_cookies_header"
        >
          Strictly Necessary Cookies
        </Header>
        <p>
          These essential cookies remember your progress through a form, for
          example a licence application, and always need to be on.
        </p>
        <p>
          If you are a customer, they help us know who you are so that you can
          sign in and manage your account. They also help us keep your details
          safe and private.
        </p>
        <p>Other important jobs they do are:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>Help you move around the site</ListItem>
          <ListItem>
            Tell us if you’ve been to it before and which pages you went to
          </ListItem>
          <ListItem>
            Tell us how the site is working, so that we can find and fix any
            problems.
          </ListItem>
        </UnorderedList>
        <br />
        <Header level="2" size="MEDIUM" data-testid="functional_cookies_header">
          Functional Cookies
        </Header>
        <p>
          These cookies always need to be on and are used for remembering things
          like:
        </p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>
            Your username and password on the page where you sign in
          </ListItem>
        </UnorderedList>
        <br />
        <Header level="2" size="MEDIUM" data-testid="session_cookie_header">
          Session cookie
        </Header>
        <p>
          We store session cookies on your phone, tablet or computer to help
          keep your information secure while you use the service. These cookies
          are automatically removed after 15 minutes following no activity or
          when you close your web browser.
        </p>
        <br />
        <Header
          level="2"
          size="MEDIUM"
          data-testid="change_cookie_settings_header"
        >
          Change your cookie settings
        </Header>
        <br />
        <Header
          level="4"
          size="MEDIUM"
          data-testid="do_You_want_accept_analytics_cookies_header"
        >
          Do you want to accept the analytics cookies?
        </Header>
        <div id="radioButtons">
          <fieldset className="govuk-fieldset">
            <SelectRadio
              onChange={() => onChange('Yes')}
              id="cookieAnalyticsAccept"
              name="cookieAnalyticsAccept"
              data-testid="cookieAnalyticsAccept"
              value="Yes"
              checked={selected === 'Yes'}
            >
              Yes
            </SelectRadio>
            <SelectRadio
              onChange={() => onChange('No')}
              id="cookieAnalyticsReject"
              name="cookieAnalyticsReject"
              data-testid="cookieAnalyticsReject"
              value="No"
              checked={selected === 'No'}
            >
              No
            </SelectRadio>
          </fieldset>
        </div>
      </GridCol>
    </GridRow>
    <GridRow>
      <GridCol>
        <button
          className="button"
          type="button"
          id="saveCookieSettings"
          data-testid="saveCookieSettings"
          onClick={saveCookieSetting}
        >
          Save cookie settings
        </button>
      </GridCol>
    </GridRow>
  </Main>
);

export default CookiePolicyEnglishPage;