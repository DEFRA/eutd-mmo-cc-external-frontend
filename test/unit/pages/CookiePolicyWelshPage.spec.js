import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import CookiePolicyWelshPage from '../../../src/client/pages/common/CookiePolicyWelshPage';

describe('CookiePolicyWelshPage', () => {
  const mockSaveCookieSetting = jest.fn();
  const mockOnChange = jest.fn();

  it('should render the CookiePolicyWelshPage component', () => {
    const { container } = render(
      <CookiePolicyWelshPage
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
      <CookiePolicyWelshPage
        showSuccessBanner={false}
        saveCookieSetting={mockSaveCookieSetting}
        selected="Yes"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByTestId('saveCookieSettings')).toBeInTheDocument();
    expect(screen.getByTestId('saveCookieSettings')).toHaveTextContent(
      'Cadw’r gosodiadau cwcis'
    );
  });

  it('should render radio button', () => {
    render(
      <CookiePolicyWelshPage
        showSuccessBanner={false}
        saveCookieSetting={mockSaveCookieSetting}
        selected="Yes"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByTestId('cookieAnalyticsAccept')).toBeInTheDocument();
    expect(screen.getByTestId('cookieAnalyticsReject')).toBeInTheDocument();
  });

  it('should handle onChange event on Yes option', () => {
    render(
      <CookiePolicyWelshPage
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
      <CookiePolicyWelshPage
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
      <CookiePolicyWelshPage
        showSuccessBanner={false}
        saveCookieSetting={mockSaveCookieSetting}
        selected="Yes"
        onChange={mockOnChange}
      />
    );

    userEvent.click(screen.getByTestId('saveCookieSettings'));
    expect(mockSaveCookieSetting).toHaveBeenCalled();
  });

  it('should render all the headers', () => {
    render(
      <CookiePolicyWelshPage
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
    render(<CookiePolicyWelshPage {...props} />);

    userEvent.click(screen.getByTestId('notification-banner__link'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should display notification banner with setting cookie preferences', () => {
    render(
      <CookiePolicyWelshPage
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
