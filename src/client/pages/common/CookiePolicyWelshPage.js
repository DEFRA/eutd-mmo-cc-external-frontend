import React from 'react';
import GridCol from '@govuk-react/grid-col';
import GridRow from '@govuk-react/grid-row';
import Header from '@govuk-react/header';
import ListItem from '@govuk-react/list-item';
import Main from '@govuk-react/main';
import UnorderedList from '@govuk-react/unordered-list';
import SelectRadio from '../../components/elements/SelectRadio';
import PageTitle from '../../components/PageTitle';

const CookiePolicyWelshPage = ({
  showSuccessBanner,
  selected,
  saveCookieSetting,
  onChange,
}) => (
  <Main>
    <PageTitle title="Briwsion - GOV.UK" />
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
              Llwyddiant
            </h2>
          </div>
          <div
            className="notification-banner__content"
            data-testid="notification-banner__content"
          >
            <p className="notification-banner__heading">
              Rydych chi wedi gosod eich dewisiadau cwcis.
              <a
                className="notification-banner__link"
                onClick={() => window.history.back()}
                href="#"
                data-testid="notification-banner__link"
              >
                Mynd yn ôl i’r dudalen roeddech chi’n edrych arni
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
          Polisi Cwcis
        </Header>
        <p>
          Ffeiliau testun bach yw cwcis, sy’n cael eu rhoi ar eich ffôn, eich dyfais tabled neu’ch cyfrifiadur gan y gwefannau rydych chi’n ymweld â nhw. Maent yn cael eu defnyddio ar raddfa eang er mwyn i wefannau weithio, neu weithio'n fwy effeithlon, yn ogystal ag i ddarparu gwybodaeth i berchnogion y safle.
        </p>
        <p>
          Mae’r gwasanaeth Allforio Pysgod yn defnyddio cwcis i storio gwybodaeth am sut rydych chi’n defnyddio ein gwefan, fel y tudalennau rydych chi’n ymweld â nhw. Mae’r wybodaeth isod yn egluro’r cwcis rydyn ni'n eu defnyddio a pham; ee Dewisiadau Cwcis, Google Analytics ac ati.
        </p>
        <br />
        <Header level="2" size="MEDIUM" data-testid="cookie_preference_header">
          Dewisiadau Cwcis
        </Header>
        <p>
          Defnyddir y cwci hwn i gofio eich dewis am gwcis. Os ydych chi wedi nodi eich dewis o’r blaen, bydd eich dewis yn cael ei storio yn y cwci hwn.
        </p>
        <br />
        <Header level="2" size="MEDIUM" data-testid="google_analytics_header">
          Google Analytics
        </Header>
        <p>
          Defnyddir y cwcis hyn i gasglu gwybodaeth am sut rydych chi’n defnyddio ein gwefan. Defnyddiwn y wybodaeth i lunio adroddiadau ac i'n helpu ni wella'r wefan. Mae’r cwcis yn casglu gwybodaeth fel nifer yr ymwelwyr â’r wefan, o ble mae ymwelwyr wedi dod i’r wefan, a pha dudalennau maen nhw wedi ymweld â nhw. Nid yw’r wybodaeth hon yn datgelu pwy yw unrhyw un.
        </p>
        <p>
          Dydyn ni ddim yn caniatáu i Google ddefnyddio na rhannu’r data am sut rydych chi’n defnyddio’r safle hwn.
        </p>
        <p>
          Mae Google Analytics yn gosod cwcis sy’n storio gwybodaeth ddienw am:
        </p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>sut y daethoch chi i'r safle</ListItem>
          <ListItem>
            y tudalennau rydych chi’n ymweld â nhw ar y gwasanaeth Allforio Pysgod, a faint o amser rydych chi’n ei dreulio ar bob tudalen
          </ListItem>
          <ListItem>
            faint o ddogfennau a/neu dystysgrifau sy’n cael eu creu
          </ListItem>
          <ListItem>sut rydych chi’n defnyddio’r gwasanaeth er mwyn i ni allu ei wella</ListItem>
          <ListItem>
            sut rydyn ni’n mesur perfformiad y gwasanaeth digidol ac yn olrhain teithiau defnyddwyr
          </ListItem>
        </UnorderedList>
        <br />
        <p>
          Dydy Google ddim yn cael defnyddio na rhannu ein data dadansoddi, a gallwch chi optio allan o Google Analytics &nbsp;
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            rel="noopener noreferrer"
            data-testid="here__link"
          >
            Yma
          </a>
        </p>
        <br />
        <Header
          level="2"
          size="MEDIUM"
          data-testid="introductory_cookie_message_header"
        >
          Neges Cwcis Ragarweiniol
        </Header>
        <p>
          Pan fyddwch yn defnyddio’r gwasanaeth am y tro cyntaf, byddwn yn dangos ‘neges cwcis’. Rydyn ni wedyn yn storio cwci ar eich ffôn, eich dyfais tabled neu’ch cyfrifiadur fel ei fod yn gwybod i beidio â dangos y neges hon eto. Bydd y cwci hwn yn dod i ben ar ôl mis, sy’n golygu y bydd rhywun yn gofyn yr un cwestiwn i chi ar ôl y cyfnod hwn.
        </p>
        <br />
        <Header
          level="2"
          size="MEDIUM"
          data-testid="cookies_that_remember_your_settings_header"
        >
          Cwcis sy’n cofio eich gosodiadau
        </Header>
        <p>
          Mae’r cwcis hyn yn cofio eich dewisiadau er mwyn personoli eich profiad wrth ddefnyddio’r safle.
        </p>
        <br />
        <Header level="2" size="MEDIUM" data-testid="essential_cookies_header">
          Cwcis a Chwcis hanfodol y gallwch eu dewis
        </Header>
        <p>
          Mae gwahanol fathau o gwcis yn gwneud gwahanol bethau ar ein gwefan. Mae angen rhai er mwyn gwneud i’r wefan weithio. Mae angen eich caniatâd chi arnom i ddefnyddio cwcis eraill sydd ddim yn hanfodol. Gallwch newid eich dewisiadau ar unrhyw adeg. Cliciwch ar y ddolen “Cwcis” ar waelod unrhyw dudalen.
        </p>
        <br />
        <Header
          level="2"
          size="MEDIUM"
          data-testid="strictly_necessary_cookies_header"
        >
          Cwcis sydd wir eu hangen
        </Header>
        <p>
          Mae’r cwcis hanfodol hyn yn cofio ble ydych chi wedi cyrraedd ar ffurflen, er enghraifft wrth wneud cais am drwydded. Rhaid i’r rhain fod ar waith drwy’r amser.
        </p>
        <p>
          Os ydych chi’n gwsmer, maen nhw’n ein helpu ni i wybod pwy ydych chi er mwyn i chi allu mewngofnodi a rheoli eich cyfrif. Maen nhw hefyd yn ein helpu i gadw eich manylion yn ddiogel ac yn breifat.
        </p>
        <p>Dyma rai o’r swyddi pwysig eraill maen nhw’n eu gwneud:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>Helpu chi i symud o gwmpas y safle</ListItem>
          <ListItem>
            Dweud wrthym ni a ydych chi wedi bod yma o’r blaen a pha dudalennau wnaethoch chi ymweld â nhw
          </ListItem>
          <ListItem>
            Dweud wrthym ni sut mae’r safle’n gweithio, er mwyn i ni allu canfod a thrwsio unrhyw broblemau.
          </ListItem>
        </UnorderedList>
        <br />
        <Header level="2" size="MEDIUM" data-testid="functional_cookies_header">
          Cwcis swyddogaethol
        </Header>
        <p>
          Mae angen i’r cwcis hyn fod ar waith drwy’r amser ac fe’u defnyddir i gofio pethau fel:
        </p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>
            Eich enw defnyddiwr a’ch cyfrinair ar y dudalen mewngofnodi
          </ListItem>
        </UnorderedList>
        <br />
        <Header level="2" size="MEDIUM" data-testid="session_cookie_header">
          Cwci sesiwn
        </Header>
        <p>
          Rydyn ni’n storio cwcis sesiwn ar eich ffôn, eich tabled neu’ch cyfrifiadur i helpu i gadw eich gwybodaeth yn ddiogel wrth i chi ddefnyddio’r gwasanaeth. Caiff y cwcis hyn eu dileu’n awtomatig ar ôl 15 munud os nad oes gweithgarwch neu pan fyddwch yn cau eich porwr gwe.
        </p>
        <br />
        <Header
          level="2"
          size="MEDIUM"
          data-testid="change_cookie_settings_header"
        >
          Newid eich gosodiadau cwcis
        </Header>
        <br />
        <Header
          level="4"
          size="MEDIUM"
          data-testid="do_You_want_accept_analytics_cookies_header"
        >
          Ydych chi am dderbyn y cwcis dadansoddi?
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
              Ydw
            </SelectRadio>
            <SelectRadio
              onChange={() => onChange('No')}
              id="cookieAnalyticsReject"
              name="cookieAnalyticsReject"
              data-testid="cookieAnalyticsReject"
              value="No"
              checked={selected === 'No'}
            >
              Nac ydw
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
          Cadw’r gosodiadau cwcis
        </button>
      </GridCol>
    </GridRow>
  </Main>
);

export default CookiePolicyWelshPage;