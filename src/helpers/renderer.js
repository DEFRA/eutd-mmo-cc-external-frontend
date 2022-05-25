import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import serialize from 'serialize-javascript';
import { Helmet } from 'react-helmet';
import Routes from '../client/Routes';
import { renderStylesToString } from 'emotion-server';
import CONFIG from '../config';
import i18n from './../i18n';

function lookupTitle(path, documentNumber) {
  const route = Routes[0].routes.find(r => r.path && r.path.replace(':documentNumber', documentNumber) === path);
  if (!route || !route.title) return '';
  return route.title.substring(0, route.title.length - 9);
}

function lookupHomeLink(path, documentNumber) {
  const route = Routes[0].routes.find(r => r.path && r.path.replace(':documentNumber', documentNumber) === path);
  let homeLink = '/';
  if (route && route.title) {
    if (route.journey == 'catchCertificate') {
      homeLink = '/create-catch-certificate/catch-certificates';
    } else if (route.journey == "processingStatement") {
      homeLink = '/create-processing-statement/processing-statements';
    } else if (route.journey == "storageNotes") {
      homeLink = '/create-storage-document/storage-documents';
    }
  }
  return homeLink;
}

function lookupShowHomeLink(path, documentNumber) {
  const route = Routes[0].routes.find(r => r.path && r.path.replace(':documentNumber', documentNumber) === path);
  return route ? !route.hideHomeLink : false;
}

const lookupShowFavouritesLink = (path, documentNumber) => {
  const route = Routes[0].routes.find(r => r.path && r.path.replace(':documentNumber', documentNumber) === path);
  if (route && route.journey && (route.journey == 'catchCertificate') && !route.hideFavouritesLink) {
    return true;
  }
};

export default (req, store, context, gaSearch, nonce, documentNumber) => {
  let alttitle;
  let journey;

  if(req.path.indexOf('create-storage-document') !== -1){
    alttitle = 'Create a UK storage document';
    journey = 'storageNotes';
  } else if(req.path.indexOf('create-processing-statement') !== -1) {
    alttitle = 'Create a UK processing statement';
    journey = 'processingStatement';
  } else {
    alttitle = 'Create a UK catch certificate';
    journey = 'catchCertificate';
  }

  const homeLink = lookupHomeLink(req.path, documentNumber);
  const showHomeLink = lookupShowHomeLink(req.path, documentNumber);
  const showFavouritesLink = lookupShowFavouritesLink(req.path, documentNumber);
  const manageAccount = CONFIG.IDENTITY_APP_MGT_URL;
  const state = store.getState();
  const enableCookies = req.headers.cookie && req.headers.cookie.search('analytics_cookies_accepted=true') > -1 ;
  const googleAnalyticsProperty = 'UA-124887477-10';

  const content = renderStylesToString(renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} context={context}>
        <div>
          {renderRoutes(Routes)}
        </div>
      </StaticRouter>
    </Provider>
  ));

  const helmet = Helmet.renderStatic();

  const renderHead = () => {
    return `
    <link rel="stylesheet" media="screen" href="/static/assets/govuk-template.css"/>
    <link rel="stylesheet" media="print" href="/static/assets/govuk-template-print.css"/>

    <link rel="stylesheet" media="all" href="/static/assets/fonts.css"/>
    <link rel="stylesheet" type="text/css" href="/static/assets/fancythat.css">
    <link rel="stylesheet" type="text/css" href="/static/assets/css/react-datepicker.css">`;
  };

  const renderHomeLink = show => show ? `<li class="govuk-header__navigation-item">
    <a id="home-link" class="govuk-header__link" href="${homeLink}" data-translate='commonRenderHome'>${i18n.t('commonRenderHome')}</a>
    </li>`: '';

  const renderFavouritesLink = show => show ? `<li class="govuk-header__navigation-item">
  <a id="favourites-link" class="govuk-header__link" href="/manage-favourites" data-translate='ccRenderFavourites'>${i18n.t('ccRenderFavourites')}</a>
  </li>`: '';

  const acceptAnalytics = () => {
    return `
       var acceptButtonHandler = function(e) {
         e.preventDefault();
         document.cookie = 'analytics_cookies_accepted=true;expires=Thu, 31 Dec 2099 23:59:59 UTC;samesite;secure; path=/';
         document.querySelector('#cookie-banner-clearance-accept').removeAttribute("hidden");
         document.querySelector('#cookie-banner').setAttribute("hidden", true);
       }
       var acceptButton = document.querySelector('#accept-button');
       acceptButton.addEventListener('click', acceptButtonHandler);
       document.querySelector('body').classList.add('js-enabled');
     `;
  };

  const rejectAnalytics = () => {
    return `
       function gaOptout(e) {
         e.preventDefault();
         document.querySelector('#cookie-banner-clearance-reject').removeAttribute("hidden");
         document.querySelector('#cookie-banner').setAttribute("hidden", true);
         var disableStr = 'ga-disable-${googleAnalyticsProperty}';

         document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
         window[disableStr] = true;
       }
       var rejectButton = document.querySelector('#reject-button');
         rejectButton.addEventListener('click', gaOptout);`;
  };

  const hideCookiesMessage = () => {
    return `
       function hideMessage(e) {
         e.preventDefault();
         var bannerElement = document.querySelector('.govuk-cookie-banner ');
         bannerElement.parentNode.removeChild(bannerElement);
       }
       var hideButton = document.querySelector('#hide-message-button');
       var hideButtonReject = document.querySelector('#hide-message-button-reject');

       hideButton.addEventListener('click', hideMessage);
       hideButtonReject.addEventListener('click', hideMessage);
     `;
  };

const cookieBanner = () =>  `
  <div class="govuk-cookie-banner " data-nosnippet role="region" aria-label="Cookies on Fish Exports Service" hidden>
    <div id="cookie-banner" class="govuk-cookie-banner__message govuk-width-container">

      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <h2 class="govuk-cookie-banner__heading govuk-heading-m">Cookies on the Fish Exports Service</h2>

          <div class="govuk-cookie-banner__content">
            <p>We use some essential cookies to make this service work.</p>
            <p>We’d also like to use analytics cookies so we can understand how you use the service and make improvements.</p>
          </div>
        </div>
      </div>

      <div class="govuk-button-group">
        <button value="accept" id="accept-button" type="submit" name="cookies" class="govuk-button" data-module="govuk-button">
          Accept analytics cookies
        </button>
        <button value="reject" id="reject-button" type="submit" name="cookies" class="govuk-button" data-module="govuk-button">
          Reject analytics cookies
        </button>
        <a class="govuk-link" href="/cookies">View cookies</a>
      </div>
    </div>

    <div id="cookie-banner-clearance-accept" class="govuk-cookie-banner__message govuk-width-container" hidden>

      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">

          <div class="govuk-cookie-banner__content">
            <p>You’ve accepted additional cookies. You can <a class="govuk-link" href="/cookies">change your cookie settings</a> at any time.</p>
          </div>
        </div>
      </div>

      <div class="govuk-button-group">
        <a id="hide-message-button" role="button" draggable="false" class="govuk-button" data-module="govuk-button">
          Hide this message
        </a>
      </div>
    </div>

    <div id="cookie-banner-clearance-reject" class="govuk-cookie-banner__message govuk-width-container" hidden>

      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">

          <div class="govuk-cookie-banner__content">
            <p>You’ve rejected additional cookies. You can <a class="govuk-link" href="/cookies">change your cookie settings</a> at any time.</p>
          </div>
        </div>
      </div>

      <div class="govuk-button-group">
        <a id="hide-message-button-reject" role="button" draggable="false" class="govuk-button" data-module="govuk-button">
          Hide this message
        </a>
      </div>
    </div>
  </div>`;

  const showGTM = (key) => {
    if (key) {
      return `<!-- Google Tag Manager -->
      <script nonce="${nonce.gaAnalytics}">
        window.dataLayer = window.dataLayer || [];
      </script>

      <script nonce=${nonce.gaAnalyticsTag}>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${ CONFIG.GOOGLE_TAG_MANAGER_ID }');</script>
      <!-- End Google Tag Manager -->

       <script nonce=${nonce.gaAnalyticsCookie}>
        (function(){
          document.cookie = 'ga-disable-${googleAnalyticsProperty}' + ' =; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
        })();
      </script>`;

    }

    return '';
  };

  const showGTMNoJS = (key) => {
    if(key) {
      return `<!-- Google Tag Manager (noscript) -->
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${ CONFIG.GOOGLE_TAG_MANAGER_ID }"
      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
      <!-- End Google Tag Manager (noscript) -->

       <script nonce=${nonce.gaAnalyticsCookie}>
        (function(){
          document.cookie = 'ga-disable-${googleAnalyticsProperty}' + ' =; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
        })();
      </script>`;
    }

    return '';
  };

  const removeCookies = (key) => {
    if(!key) {
      return `<script nonce=${nonce.gaAnalyticsCookie}>
        (function(){
          document.cookie = '_gid =; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
          document.cookie = '_ga =; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
          document.cookie = '_gat_${googleAnalyticsProperty}' + ' =; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
          if (document.cookie.search('analytics_cookies_accepted=false') > -1 )
            document.cookie = 'ga-disable-${googleAnalyticsProperty}' + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
        })();
      </script>`;
    }

    return '';
  };

  return `<!DOCTYPE html>
        <html lang="en" version="4.4">
        ${helmet.meta.toString()}
        <head>
          ${showGTM(enableCookies)}

          ${helmet.title.toString()}
          <meta charSet="utf-8" />
          ${renderHead()}
          <link rel="shortcut icon" href="/static/assets/images/favicon.ico" type="image/x-icon" />
          <link rel="mask-icon" href="/static/assets/images/gov.uk_logotype_crown.svg" color="#0b0c0c" />
          <link rel="apple-touch-icon" sizes="180x180" href="/static/assets/images/apple-touch-icon-180x180.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/static/assets/images/apple-touch-icon-167x167.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/static/assets/images/apple-touch-icon-152x152.png" />
          <link rel="apple-touch-icon" href="/static/assets/images/apple-touch-icon.png" />
          <meta name="theme-color" content="#0b0c0c" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          ${showGTMNoJS(enableCookies)}
          <meta property="og:image" content="/static/assets/images/opengraph-image.png" />
          <div id="skiplink-container">
            <div>
              <a href="#content" class="skiplink">Skip to main content</a>
            </div>
          </div>
          <div id="global-cookie-message">
            <p>GOV.UK uses cookies to make the site simpler. <a href="https://www.gov.uk/help/cookies">Find out more about cookies</a></p>
          </div>
          ${cookieBanner()}
          <header class="govuk-header " data-module="header">
          <div id="tanslationTracker" data-lng="" ></div>
            <div class="govuk-header__container govuk-width-container">
              <div class="govuk-header__logo">
                <a href="${homeLink}" class="govuk-header__link govuk-header__link--homepage">
                  <span class="govuk-header__logotype">
                    <svg role="presentation" focusable="false" class="govuk-header__logotype-crown" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 132 97" height="32" width="36">
                      <path fill="currentColor" fill-rule="evenodd" d="M25 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.6-.2-7.8-3.9-9.2-3.6-1.4-7.6.3-9.1 3.9-1.4 3.5.3 7.5 3.9 9zM9 39.5c3.6 1.5 7.8-.2 9.2-3.7 1.5-3.6-.2-7.8-3.9-9.1-3.6-1.5-7.6.2-9.1 3.8-1.4 3.5.3 7.5 3.8 9zM4.4 57.2c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.5-1.5-7.6.3-9.1 3.8-1.4 3.5.3 7.6 3.9 9.1zm38.3-21.4c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.6-1.5-7.6.3-9.1 3.8-1.3 3.6.4 7.7 3.9 9.1zm64.4-5.6c-3.6 1.5-7.8-.2-9.1-3.7-1.5-3.6.2-7.8 3.8-9.2 3.6-1.4 7.7.3 9.2 3.9 1.3 3.5-.4 7.5-3.9 9zm15.9 9.3c-3.6 1.5-7.7-.2-9.1-3.7-1.5-3.6.2-7.8 3.7-9.1 3.6-1.5 7.7.2 9.2 3.8 1.5 3.5-.3 7.5-3.8 9zm4.7 17.7c-3.6 1.5-7.8-.2-9.2-3.8-1.5-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.3 3.5-.4 7.6-3.9 9.1zM89.3 35.8c-3.6 1.5-7.8-.2-9.2-3.8-1.4-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.4 3.6-.3 7.7-3.9 9.1zM69.7 17.7l8.9 4.7V9.3l-8.9 2.8c-.2-.3-.5-.6-.9-.9L72.4 0H59.6l3.5 11.2c-.3.3-.6.5-.9.9l-8.8-2.8v13.1l8.8-4.7c.3.3.6.7.9.9l-5 15.4v.1c-.2.8-.4 1.6-.4 2.4 0 4.1 3.1 7.5 7 8.1h.2c.3 0 .7.1 1 .1.4 0 .7 0 1-.1h.2c4-.6 7.1-4.1 7.1-8.1 0-.8-.1-1.7-.4-2.4V34l-5.1-15.4c.4-.2.7-.6 1-.9zM66 92.8c16.9 0 32.8 1.1 47.1 3.2 4-16.9 8.9-26.7 14-33.5l-9.6-3.4c1 4.9 1.1 7.2 0 10.2-1.5-1.4-3-4.3-4.2-8.7L108.6 76c2.8-2 5-3.2 7.5-3.3-4.4 9.4-10 11.9-13.6 11.2-4.3-.8-6.3-4.6-5.6-7.9 1-4.7 5.7-5.9 8-.5 4.3-8.7-3-11.4-7.6-8.8 7.1-7.2 7.9-13.5 2.1-21.1-8 6.1-8.1 12.3-4.5 20.8-4.7-5.4-12.1-2.5-9.5 6.2 3.4-5.2 7.9-2 7.2 3.1-.6 4.3-6.4 7.8-13.5 7.2-10.3-.9-10.9-8-11.2-13.8 2.5-.5 7.1 1.8 11 7.3L80.2 60c-4.1 4.4-8 5.3-12.3 5.4 1.4-4.4 8-11.6 8-11.6H55.5s6.4 7.2 7.9 11.6c-4.2-.1-8-1-12.3-5.4l1.4 16.4c3.9-5.5 8.5-7.7 10.9-7.3-.3 5.8-.9 12.8-11.1 13.8-7.2.6-12.9-2.9-13.5-7.2-.7-5 3.8-8.3 7.1-3.1 2.7-8.7-4.6-11.6-9.4-6.2 3.7-8.5 3.6-14.7-4.6-20.8-5.8 7.6-5 13.9 2.2 21.1-4.7-2.6-11.9.1-7.7 8.8 2.3-5.5 7.1-4.2 8.1.5.7 3.3-1.3 7.1-5.7 7.9-3.5.7-9-1.8-13.5-11.2 2.5.1 4.7 1.3 7.5 3.3l-4.7-15.4c-1.2 4.4-2.7 7.2-4.3 8.7-1.1-3-.9-5.3 0-10.2l-9.5 3.4c5 6.9 9.9 16.7 14 33.5 14.8-2.1 30.8-3.2 47.7-3.2z"></path>
                    </svg>
                      <img width="36px" height="26px" role="presentation" alt="GOV.UK logo" src="/static/assets/images/gov.uk_logotype_crown_invert_trans.png" class="govuk-header__logotype-crown-fallback-image" />
                    <span class="govuk-header__logotype-text">
                      GOV.UK
                    </span>
                  </span>
                </a>
              </div>
              <div class="govuk-header__content">
              <a href="${homeLink}" alt="${alttitle}" class="govuk-header__link govuk-header__link--service-name" data-translate=${`${journey}RendererHeaderSectionTitle`}>${i18n.t(`${journey}RendererHeaderSectionTitle`)}</a>
                <button type="button" class="govuk-header__menu-button js-header-toggle" aria-controls="navigation" aria-label="Show or hide Top Level Navigation">Menu</button>
                <nav id="navigation">
                  <ul id="service-navigation" class="govuk-header__navigation " aria-label="Service Top Level Navigation">
                    ${renderHomeLink(showHomeLink)}
                    ${renderFavouritesLink(showFavouritesLink)}
                    <li class="govuk-header__navigation-item">
                    <a id="manage-account-link" class="govuk-header__link" href="${manageAccount}" data-translate="commonRenderManageAccount">Manage account</a>
                    </li>
                    <li class="govuk-header__navigation-item">
                    <a id="sign-out-link" class="govuk-header__link" href="/logout?backToPath=/server-logout" data-translate="signOut">Sign out</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>
          <div class="govuk-width-container">
            <main class="govuk-main-wrapper " id="content">
              <div id="root">${content}</div>
            </main>
        </div>
        <script nonce=${nonce.initialState}>window.INITIAL_STATE = ${serialize(state)}</script>
        <script src="/static/assets/bundle.js"></script>

        <footer class="group js-footer" id="footer">
          <div class="footer-wrapper">
            <div class="footer-meta">
              <div class="footer-meta-inner">
                <ul id="footer-link-list">
                  <li><a id="accessibility" href="/accessibility" data-translate="commonRenderAccessibility">Accessibility</a></li>
                  <li><a id="cookies" href="/cookies" data-translate="commonRenderCookies">Cookies</a></li>
                  <li><a id="privacy" href="/privacy-notice" data-translate="commonRenderPrivacy">Privacy</a></li>
                  <li><a id="serviceImprovement" href="/service-improvement-plan" data-translate="commonRenderServiceImprovement">Service Improvement</a></li>
                </ul>
                <div class="open-government-licence">
                  <p class="logo"><a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" rel="license" target="_blank">Open Government Licence</a></p>
                  <p data-translate="commonUseageLicenceNotice">All content is available under the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" rel="license" target="_blank">Open Government Licence v3.0</a>, except where otherwise stated</p>
                </div>
              </div>
              <div class="copyright">
                <a data-translate="commonCopyrightNotice" href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/copyright-and-re-use/crown-copyright/" target="_blank" rel="noopener noreferrer">© Crown copyright</a>
              </div>
            </div>
          </div>
        </footer>
        ${removeCookies(enableCookies)}
        <script nonce=${nonce.jsEnabled}>
          (function(){
            var toggleMenuVisibility = function(e) {
              e.preventDefault();
              document.querySelector('#navigation').classList.toggle('open');
            }
            var navButton = document.querySelector('.govuk-header__menu-button');
            navButton.addEventListener('click', toggleMenuVisibility);
            document.querySelector('body').classList.add('js-enabled');
          })();
          (function () {
            // forcing page reload to reflect the user previous selected language when browser back or forward button clicked
            if (window.performance) {
              if (window.performance.navigation
                && window.performance.navigation.type == window.performance.navigation.TYPE_BACK_FORWARD) {
                  window.location.reload();
                }
              }
          })();
          </script>
          <script nonce=${nonce.gaAnalyticsSearch}>
            const searchParams  = '${gaSearch}';
              if (window.location.pathname === '/') {
                if (!window.location.search.includes("_ga") && searchParams !== 'undefined') {
                  window.location = "/?"+searchParams;
                }
              }
        </script>
        <script nonce=${nonce.gaAnalyticsCookie}>
          (function(){
            const analyticsCookieExists = document.cookie.split(';').some((item) => item.includes('analytics_cookies_accepted'));
            const analyticsDisabledCookieExists = document.cookie.split(';').some((item) => item.includes('ga-disable-${googleAnalyticsProperty}=true'));
            const bannerElement = document.querySelector('.govuk-cookie-banner ');
            if (!analyticsCookieExists && !analyticsDisabledCookieExists) {
              bannerElement.removeAttribute('hidden');
              ${acceptAnalytics()}
              ${rejectAnalytics()}
              ${hideCookiesMessage()}
            } else {
              bannerElement.parentNode.removeChild(bannerElement);
            }
          })();
        </script>
        </body>
      </html>`;
};