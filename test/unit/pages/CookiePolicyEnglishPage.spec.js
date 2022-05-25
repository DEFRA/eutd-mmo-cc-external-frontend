import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import CookiePolicyEnglishPage from '../../../src/client/pages/common/CookiePolicyEnglishPage';

describe('CookiePolicyEnglishPage', () => {
  const mockSaveCookieSetting = jest.fn();
  const mockOnChange = jest.fn();

  it('should render the CookiePolicyEnglishPage component', () => {
    const { container } = render(
      <CookiePolicyEnglishPage
        showSuccessBanner={false}
        saveCookieSetting={mockSaveCookieSetting}
        selected="Yes"
        onChange={mockOnChange}
      />
    );

    expect(container).toBeDefined();
  });

  it('should render save cookies settings button', () => {
    render(
      <CookiePolicyEnglishPage
        showSuccessBanner={false}
        saveCookieSetting={mockSaveCookieSetting}
        selected="Yes"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByTestId('saveCookieSettings')).toBeInTheDocument();
    expect(screen.getByTestId('saveCookieSettings')).toHaveTextContent(
      'Save cookie settings'
    );
  });

  it('should render radio button', () => {
    render(
      <CookiePolicyEnglishPage
        showSuccessBanner={false}
        saveCookieSetting={mockSaveCookieSetting}
        selected="Yes"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByTestId('cookieAnalyticsAccept')).toBeInTheDocument();
    expect(screen.getByTestId('cookieAnalyticsReject')).toBeInTheDocument();
  });

  it('should render all the headers', () => {
    render(
      <CookiePolicyEnglishPage
        showSuccessBanner={false}
        saveCookieSetting={mockSaveCookieSetting}
        selected="Yes"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByTestId('cookies_policy_header')).toBeInTheDocument();
    expect(screen.getByTestId('cookie_preference_header')).toBeInTheDocument();
    expect(screen.getByTestId('google_analytics_header')).toBeInTheDocument();
    expect(
      screen.getByTestId('introductory_cookie_message_header')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('cookies_that_remember_your_settings_header')
    ).toBeInTheDocument();
    expect(screen.getByTestId('essential_cookies_header')).toBeInTheDocument();
    expect(
      screen.getByTestId('strictly_necessary_cookies_header')
    ).toBeInTheDocument();
    expect(screen.getByTestId('functional_cookies_header')).toBeInTheDocument();
    expect(screen.getByTestId('session_cookie_header')).toBeInTheDocument();
    expect(
      screen.getByTestId('change_cookie_settings_header')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('do_You_want_accept_analytics_cookies_header')
    ).toBeInTheDocument();
  });

  it('should handle onChange event on Yes option', () => {
    render(
      <CookiePolicyEnglishPage
        showSuccessBanner={false}
        saveCookieSetting={mockSaveCookieSetting}
        selected="No"
        onChange={mockOnChange}
      />
    );

    userEvent.click(screen.getByTestId('cookieAnalyticsAccept'));
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should handle onChange event on No option', () => {
    render(
      <CookiePolicyEnglishPage
        showSuccessBanner={false}
        saveCookieSetting={mockSaveCookieSetting}
        selected="Yes"
        onChange={mockOnChange}
      />
    );

    userEvent.click(screen.getByTestId('cookieAnalyticsReject'));
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should handle onClick event on the Save cookie settings', () => {
    render(
      <CookiePolicyEnglishPage
        showSuccessBanner={false}
        saveCookieSetting={mockSaveCookieSetting}
        selected="Yes"
        onChange={mockOnChange}
      />
    );

    userEvent.click(screen.getByTestId('saveCookieSettings'));
    expect(mockSaveCookieSetting).toHaveBeenCalled();
  });

  it('should handle onClick event on the Go back to the page you were looking link on the notification', () => {
    const mockGoBack = jest.fn();
    const props = {
      window: {
        history: {
          goBack: mockGoBack(),
        },
      },
      showSuccessBanner: true,
      saveCookieSetting: mockSaveCookieSetting,
      selected: 'Yes',
      onChange: mockOnChange,
    };
    render(<CookiePolicyEnglishPage {...props} />);

    userEvent.click(screen.getByTestId('notification-banner__link'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should display notification banner with setting cookie preferences', () => {
    render(
      <CookiePolicyEnglishPage
        showSuccessBanner={true}
        saveCookieSetting={mockSaveCookieSetting}
        selected="Yes"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByTestId('notification-banner-title')).toBeInTheDocument();
    expect(
      screen.getByTestId('notification-banner__content')
    ).toBeInTheDocument();
  });
});
