import HomePage from '../pages/HomePage';
import FavouritesPage from '../pages/FavouritesPage';
import ErrorPage from '../pages/ErrorPage';
import ForbiddenPage from '../pages/ForbiddenPage';
import NotFoundPage from '../pages/NotFoundPage';
import ImproveServicePage from '../pages/ImproveServicePage';
import TimedOutPage from '../pages/common/TimedOutPage';
import SignOutPage from '../pages/common/SignOutPage';
import InfoPage from '../pages/InfoPage';
import CookiePolicyPage from '../pages/common/CookiePolicyPage';
import AccessibilityStatementPage from '../pages/common/AccessibilityStatementPage';
import UploadGuidancePage from '../pages/uploadGuidance/UploadGuidancePage';
import PrivacyStatementPage from '../pages/common/PrivacyStatementPage';
import { catchCertificatesTitle } from '../helpers/journeyConfiguration';

export const improveServiceUri = '/service-improvement-plan';
export const cookiePolicyUri = '/cookies';
export const accessibilityStatementUri = '/accessibility';
export const privacyStatementUri = '/privacy-notice';
export const serviceImprovementUri = '/service-improvement-plan';


const base = [
  {
    ...HomePage,
    path: '/',
    exact: true,
    title: catchCertificatesTitle,
    hideHomeLink: true,
    hideFavouritesLink: true
  },
  {
    ...ForbiddenPage,
    path: '/forbidden',
    exact: true,
    title: '',
    hideHomeLink: true,
    hideFavouritesLink: true
  },
  {
    ...FavouritesPage,
    path: '/manage-favourites',
    exact: true,
    title: '',
  },
  {
    ...ErrorPage,
    path: '/there-is-a-problem-with-the-service',
    exact: true,
    title: '',
    hideHomeLink: true,
    hideFavouritesLink: true
  },
  {
    ...TimedOutPage,
    path: '/timed-out',
    exact: true,
    title: '',
    hideHomeLink: true,
    hideFavouritesLink: true
  },
  {
    ...SignOutPage,
    path: '/sign-out',
    exact: true,
    title: '',
    hideHomeLink: true,
    hideFavouritesLink: true
  },
  {
    ...ImproveServicePage,
    path: improveServiceUri,
    title: '',
    hideHomeLink: true,
    hideFavouritesLink: true
  },
  {
    ...CookiePolicyPage,
    path: cookiePolicyUri,
    title: 'Cookies - GOV.UK',
    hideHomeLink: true,
    hideFavouritesLink: true
  },
  {
    ...AccessibilityStatementPage,
    path: accessibilityStatementUri,
    title: 'Accessibility - GOV.UK',
    hideHomeLink: true,
    hideFavouritesLink: true
  },
  {
    ...PrivacyStatementPage,
    path: privacyStatementUri,
    title: 'Privacy - GOV.UK',
    hideHomeLink: true,
    alwaysShowPrivacyPage: true,
    hideFavouritesLink: true
  },
  {
    ...InfoPage,
    path: '/version-info',
    hideHomeLink: true,
    hideFavouritesLink: true
  },
  {
    ...UploadGuidancePage,
    path: '/upload-guidance',
    exact: true
  },
  {
    ...NotFoundPage,
    hideHomeLink: true,
    hideFavouritesLink: true
  }
];

export default base;