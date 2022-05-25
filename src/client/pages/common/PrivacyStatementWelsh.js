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

const PrivacyStatementWelsh = ({
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
      <PageTitle title="Tudalen Preifatrwydd - GOV.UK" />
      {privacyAcceptedAlready && (
        <BackLink
          id="back"
          onClick={onBackLinkClick}
          href="#"
        >
          Yn ôl
        </BackLink>
      )}
      <GridRow>
        <GridCol>
          <Header level="1">Hysbysiad preifatrwydd</Header>
          <p>
            Mae eich preifatrwydd yn bwysig iawn i ni. Mae’r hysbysiad hwn yn
            egluro pa wybodaeth bersonol sydd gennym, sut rydyn ni’n ei
            defnyddio a sut gallwch wirio a diweddaru unrhyw ran o’ch gwybodaeth
            bersonol. At ddibenion yr Hysbysiad Preifatrwydd hwn, ystyr “ni” yw
            Adran yr Amgylchedd, Bwyd a Materion Gwledig (Defra) ac asiantaethau
            eraill y llywodraeth yn y grŵp.
          </p>
          <p>&nbsp;</p>
          <Header level="2">
            Sut a Pham Rydyn ni’n Defnyddio eich Gwybodaeth Bersonol
          </Header>
          <p>
            Rydyn ni’n casglu eich gwybodaeth bersonol er mwyn i chi gael
            Tystysgrif Dalfa Allforio yn y DU, drwy ddefnyddio’r gwasanaeth a
            weithredir gan Defra ac a brosesir gan y Sefydliad Rheoli Morol
            (MMO) ac awdurdodau Pysgodfeydd Morol eraill y DU sy’n gweithredu yn
            y DU.
          </p>
          <p>Dyma’r wybodaeth bersonol sydd ei hangen arnom:</p>
          <OrderedList listStyleType="disc">
            <ListItem>Eich enw llawn</ListItem>
            <ListItem>Enw’r cwmni (lle bo’n berthnasol)</ListItem>
            <ListItem>Cyfeiriad</ListItem>
            <ListItem>Rhif ffôn cyswllt</ListItem>
            <ListItem>Manylion cofrestru’r cwch, gan gynnwys:</ListItem>
            <OrderedList listStyleType="circle">
              <ListItem>Enw’r cwch </ListItem>
              <ListItem>Rhif cofrestru</ListItem>
              <ListItem>Porth a rhif</ListItem>
              <ListItem>Rhif y Sefydliad Morol Rhyngwladol (IMO)</ListItem>
              <ListItem>Rhif Lloyds</ListItem>
              <ListItem>Rhif trwydded pysgota</ListItem>
              <ListItem>
                Rhif Inmarsat / ffacs / ffôn lle bo hynny’n berthnasol
              </ListItem>
            </OrderedList>
            <ListItem>Enw Meistr y cwch pysgota</ListItem>
            <ListItem>
              Manylion cyswllt (enw, cyfeiriadau a manylion cludiant) y
              trawslwytho, yr (ail)allforiwr, y mewnforiwr, y cludwr, y
              proseswyr a’r cyfleusterau storio.
            </ListItem>
          </OrderedList>
          <br />
          <p>
            Rydyn ni hefyd yn defnyddio eich gwybodaeth bersonol gyda Google
            Analytics i fonitro eich cynnydd ar-lein drwy’r gwasanaeth, gan ein
            helpu i wella eich profiad ee
          </p>
          <p>Ystadegau Perfformiad:</p>
          <OrderedList listStyleType="disc">
            <ListItem>Eich rhyngweithio â’r wefan</ListItem>
            <ListItem>
              Deall beth mae defnyddiwr yn ei wneud pan fydd gwall yn codi (bwrw
              ymlaen neu roi’r gorau iddi)
            </ListItem>
            <ListItem>
              Ble fyddwch chi’n gadael y wefan, a allai fod o dudalen gwall neu
              efallai eich bod wedi methu cwblhau tystysgrif
            </ListItem>
            <ListItem>Nifer y cychod fesul dogfen</ListItem>
            <ListItem>
              Faint o ddefnyddwyr sydd wedi creu pob tystysgrif allforio
            </ListItem>
          </OrderedList>
          <br />
          <p>Gwybodaeth am berfformiad:</p>
          <OrderedList listStyleType="disc">
            <ListItem>Cipolwg ar Dystysgrif Dalfa</ListItem>

            <OrderedList listStyleType="circle">
              <ListItem>
                Faint o fanylion glanio dalfa sydd ym mhob tystysgrif
              </ListItem>
              <ListItem>Sawl amrywiad o gynnyrch</ListItem>
              <ListItem>
                Y gwahanol ddewisiadau trafnidiaeth y mae pobl yn eu defnyddio{' '}
              </ListItem>
              <ListItem>
                Faint o ddefnyddwyr sy’n newid manylion yr allforiwr
              </ListItem>
            </OrderedList>
            <p>&nbsp;</p>
            <ListItem>Cipolwg ar Gwmnïau</ListItem>
            <OrderedList listStyleType="circle">
              <ListItem>Y gwahanol fathau o gwmnïau</ListItem>
              <ListItem>Lleoliad cwmnïau</ListItem>
              <ListItem>Faint o ddogfennau y mae pob cwmni yn eu creu</ListItem>
              <ListItem>
                Canran y dogfennau sy’n cael eu creu ar draws pob cwmni
              </ListItem>
              <ListItem>Faint o gwmnïau sy’n creu dogfennau lluosog</ListItem>
            </OrderedList>
          </OrderedList>
          <br />
          <p>
            Dydyn ni ddim yn olrhain cyfeiriad IP nac ID Defnyddiwr unigol yn
            Google Analytics.
          </p>
          <Header level="2">Pwy sy’n Casglu eich Gwybodaeth Bersonol</Header>
          <p>
            Mae Adran yr Amgylchedd, Bwyd a Materion Gwledig (Defra) yn casglu
            eich gwybodaeth bersonol a hi yw'r rheolydd data ar gyfer yr
            wybodaeth bersonol y byddwch chi’n ei rhoi.
          </p>
          <span style={pStyle}>Swyddog Diogelu Data DEFRA</span> <br />
          <br />
          Gallwch gysylltu â Swyddog Diogelu Data Defra yn:
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
            E-bost:{' '}
            <a href="mailto:data.protection@defra.gov.uk">
              data.protection@defra.gov.uk
            </a>
          </p>
          <p>&nbsp;</p>
          <Header level="2">
            Sail Gyfreithiol dros Brosesu Eich Gwybodaeth Bersonol{' '}
          </Header>
          <p>
            Y sail gyfreithiol dros brosesu eich gwybodaeth bersonol yw ar gyfer
            arfer awdurdod swyddogol, a hefyd er mwyn cyflawni tasgau penodol er
            budd y cyhoedd sy’n caniatáu ar gyfer trosglwyddo data ar y ffin yn
            ddiogel. Lle bo’r gyfraith yn mynnu hynny, gellir cyhoeddi data ar
            wefannau Llywodraeth y DU neu’r UE.
          </p>
          <p>
            Bydd eich gwybodaeth bersonol yn cael ei phrosesu’n ddiogel gan
            ddefnyddio mesurau technegol a sefydliadol priodol.
          </p>
          <p>
            Mae rhagor o wybodaeth am MMO ar gael yn <br />
            <LinkTargetBlank
              href="https://www.gov.uk/government/organisations/marine-management-organisation"
              ariaLabel="yn agor mewn tab newydd"
              text="https://www.gov.uk/government/organisations/marine-management-organisation"
            />
          </p>
          <br />
          <Header level="2">
            Gyda phwy y gellir rhannu eich Gwybodaeth Bersonol
          </Header>
          <p>
            Gall gwybodaeth bersonol fod ar gael i awdurdodau cyhoeddus a lleol
            a chyrff cyhoeddus eraill yn y DU a’r UE er mwyn bodloni gofynion
            cyfreithiol yn unol â thasgau cyhoeddus
          </p>
          <p>
            Efallai y bydd yn rhaid i ni ryddhau gwybodaeth (gan gynnwys
            gwybodaeth bersonol a gwybodaeth fasnachol) o dan y ddeddfwriaeth
            ganlynol:
          </p>
          <OrderedList listStyleType="disc">
            <ListItem>Y Rheoliad Cyffredinol ar Ddiogelu Data (GDPR)</ListItem>
            <ListItem>Deddf Diogelu Data y DU 2018</ListItem>
            <ListItem>Deddf Rhyddid Gwybodaeth 2000</ListItem>
            <ListItem>Rheoliadau Gwybodaeth Amgylcheddol 2004</ListItem>
          </OrderedList>
          <br />
          <Header level="2">
            Pa Mor Hir Rydyn Ni’n Cadw Eich Gwybodaeth Bersonol
          </Header>
          <p>
            Mae’r holl wybodaeth bersonol yn Defra yn cael ei chadw yn unol â’n
            polisi cadw data ac yn unol â darpariaethau datganiadau Preifatrwydd
            Data’r UE.
          </p>
          <br />
          <Header level="2">
            Beth fydd yn digwydd os nad ydw i’n rhoi’r data?
          </Header>
          <p>
            At ddibenion statudol a budd y cyhoedd, mae angen rhoi data fel y
            nodir yn y ddeddfwriaeth berthnasol.
          </p>
          <br />
          <Header level="2">
            A fydd fy ngwybodaeth bersonol yn cael ei throsglwyddo y tu allan
            i’r DU / Ardal Economaidd Ewropeaidd (AEE)? Os bydd, sut caiff ei
            diogelu?
          </Header>
          <p>
            Ni fydd y data a roddwch yn cael ei drosglwyddo y tu allan i’r DU /
            AEE. Fodd bynnag, pan fydd angen, gellir trosglwyddo gwybodaeth
            bersonol pan fydd hynny’n gyfreithlon ac yn ategu ein gwaith a wneir
            er budd y cyhoedd, hy gorfodi, dilysu dogfennau y tu hwnt (i’r DU /
            AEE).{' '}
          </p>
          <br />
          <Header level="2">Eich Hawliau</Header>
          <span style={pStyle}>Eich Hawl i Gael Mynediad</span> <br />
          <br />
          <p>
            Mae gennych hawl i ofyn i ni am gopïau o’ch gwybodaeth bersonol.
            Mae’r hawl hon bob amser yn berthnasol. Mae rhai eithriadau, sy’n
            golygu na fyddwch chi bob amser yn cael yr holl wybodaeth rydyn ni’n
            ei phrosesu. Gallwch ddarllen mwy am hyn{' '}
            <LinkTargetBlank
              href="https://ico.org.uk/your-data-matters/your-right-to-get-copies-of-your-data/"
              ariaLabel="yn agor mewn tab newydd"
              text="yma"
            />
            .
          </p>
          <br />
          <span style={pStyle}>Eich Hawl i Gywiro</span> <br />
          <br />
          <p>
            Mae gennych hawl i ofyn i ni gywiro gwybodaeth sy’n anghywir yn eich
            barn chi. Mae gennych hefyd yr hawl i ofyn i ni lenwi gwybodaeth nad
            yw’n gyflawn yn eich barn chi. Mae’r hawl hon bob amser yn
            berthnasol. Gallwch ddarllen mwy am hyn{' '}
            <LinkTargetBlank
              href="https://ico.org.uk/your-data-matters/your-right-to-get-your-data-corrected/"
              ariaLabel="yn agor mewn tab newydd"
              text="yma"
            />
            .
          </p>
          <br />
          <span style={pStyle}>Eich Hawl i Ddileu</span> <br />
          <br />
          <p>
            Mae gennych hawl i ofyn i ni ddileu eich gwybodaeth bersonol mewn
            rhai amgylchiadau. Gallwch ddarllen mwy am hyn{' '}
            <LinkTargetBlank
              href="https://ico.org.uk/your-data-matters/your-right-to-get-your-data-deleted/"
              ariaLabel="yn agor mewn tab newydd"
              text="yma"
            />
            .
          </p>
          <br />
          <span style={pStyle}>Eich Hawl i Gyfyngu ar Brosesu</span> <br />
          <br />
          <p>
            Mae gennych hawl i ofyn i ni gyfyngu ar brosesu eich gwybodaeth
            bersonol mewn rhai amgylchiadau. Gallwch ddarllen mwy am hyn{' '}
            <LinkTargetBlank
              href="https://ico.org.uk/your-data-matters/your-right-to-limit-how-organisations-use-your-data/"
              ariaLabel="yn agor mewn tab newydd"
              text="yma"
            />
            .
          </p>
          <br />
          <span style={pStyle}>Eich Hawl i Wrthwynebu Prosesu</span> <br />
          <br />
          <p>
            Mae gennych hawl i wrthwynebu prosesu os gallwn brosesu eich
            gwybodaeth oherwydd bod y broses yn rhan o’n tasgau cyhoeddus neu er
            ein budd dilys. Gallwch ddarllen mwy am hyn{' '}
            <LinkTargetBlank
              href="https://ico.org.uk/your-data-matters/the-right-to-object-to-the-use-of-your-data/"
              ariaLabel="yn agor mewn tab newydd"
              text="yma"
            />
            .
          </p>
          <br />
          <span style={pStyle}>Eich Hawl i Gludadwyedd Data </span> <br />
          <br />
          <p>
            Dim ond i wybodaeth rydych chi wedi’i rhoi i ni y mae hyn yn
            berthnasol. Mae gennych hawl i ofyn i ni drosglwyddo’r wybodaeth a
            roesoch i ni o un sefydliad i’r llall neu ei rhoi i chi. Mae’r hawl
            yn berthnasol dim ond os ydyn ni’n prosesu gwybodaeth ar sail eich
            caniatâd neu yn sgil, neu mewn sgyrsiau ynghylch ymrwymo i gontract
            a bod y prosesu’n awtomataidd. Gallwch ddarllen mwy am hyn{' '}
            <LinkTargetBlank
              href="https://ico.org.uk/your-data-matters/your-right-to-data-portability/"
              ariaLabel="yn agor mewn tab newydd"
              text="yma"
            />
            .
          </p>
          <p>
            Os ydyn ni’n prosesu eich gwybodaeth at ddibenion gorfodi cyfraith
            droseddol, mae eich hawliau fymryn yn wahanol.{' '}
          </p>
          <p>
            Nid oes rhaid i chi dalu unrhyw dâl am arfer eich hawliau. Mae
            gennym fis i ymateb i chi.
          </p>
          <p>Cysylltwch â’n Swyddog Diogelu Data os hoffech wneud cais</p>
          <p>&nbsp;</p>
          <Header level="2">Sut mae cwyno?</Header>
          <p>
            Mae gennych hawl i gyflwyno cwyn i Swyddfa’r Comisiynydd Annibynnol
            (ICO) unrhyw bryd
          </p>
          <p>
            Yn ystod pandemig y coronafeirws, gallwch roi gwybod i’r ICO o hyd
            am ein harferion hawliau gwybodaeth drwy eu llinell gymorth ar 0303
            123 1113.
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
                Derbyn a bwrw ymlaen
              </Button>
            </form>
          )}
        </GridCol>
      </GridRow>
    </Main>
  );
};

export default PrivacyStatementWelsh;
