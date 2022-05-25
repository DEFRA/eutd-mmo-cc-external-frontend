import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import {
  GridCol,
  GridRow,
  ListItem,
  Main,
  UnorderedList,
  Table,
  OrderedList,
  H1,
  H2,
  InsetText,
  BackLink
} from 'govuk-react';
import HelpLink from '../../components/HelpLink';

export const UploadGuidanceWelsh = () => (
  <Main>
    <PageTitle title="Canllawiau Llwytho i Fyny - GOV.UK" />
    <GridRow>
      <GridCol>
        <BackLink
          onClick={(e) => {
            e.preventDefault();
            history.goBack();
          }}
          href={'#'}
        >
          Yn ôl
        </BackLink>
        <H1>Canllawiau llwytho i fyny</H1>
        <H2 data-testid="data-general-label">Cyffredinol</H2>
        <Table
          data-testid="data-general-table"
          head={
            <Table.Row>
              <Table.CellHeader>Pwnc</Table.CellHeader>
              <Table.CellHeader>Canllawiau</Table.CellHeader>
            </Table.Row>
          }
          body={
            <>
              <Table.Row>
                <Table.Cell
                  style={{
                    verticalAlign: 'top',
                    textAlign: 'left',
                    borderBottom: '1px solid #b1b4b6',
                    padding: '10px 20px 10px 0',
                  }}
                >
                  <strong>Proses llwytho i fyny</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      Dyma gamau’r broses llwytho i fyny:
                      <OrderedList className="ol" listStyleType="continue">
                        <ListItem>
                          {' '}
                          <strong>Llwytho cynnyrch a glaniadau i fyny</strong> - Llwytho’r ffeil CSV i fyny sy’n cynnwys IDs y cynnyrch a’r glaniadau.
                        </ListItem>
                        <ListItem>
                          {' '}
                          <strong>Trwsio gwallau (os oes angen)</strong> - Os oes mwy nag un gwall, gallwch glirio’r broses llwytho i fyny, newid y ffeil, a llwytho i fyny eto.
                        </ListItem>
                        <ListItem>
                          {' '}
                          <strong>Adolygu/cywiro</strong> - Bydd y camau’n mynd â chi’n ôl i’r dudalen Ychwanegu glaniadau, lle gallwch ychwanegu unrhyw laniadau coll eich hun neu gywiro unrhyw gamgymeriadau a welwch.
                        </ListItem>
                      </OrderedList>
                    </ListItem>
                    <ListItem>
                      Mae modd llwytho mwy nag un ffeil CSV i fyny drwy fynd drwy’r broses eto.
                    </ListItem>
                  </UnorderedList>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell
                  style={{
                    verticalAlign: 'top',
                    textAlign: 'left',
                    borderBottom: '1px solid #b1b4b6',
                    padding: '10px 20px 10px 0',
                  }}
                >
                  <strong>Cyfyngiadau</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      100 yw’r nifer mwyaf o resi mae modd eu llwytho i fyny fesul tystysgrif dalfa.
                    </ListItem>
                    <ListItem>
                      Dim ond cynnyrch sydd wedi’i gadw yn eich hoff gynnyrch gallwch chi eu llwytho i fyny, sydd ar gael o’r brif ddewislen llywio.
                    </ListItem>
                    <ListItem>
                      Os ydych chi’n allforio mwy nag un cynnyrch o’r un glaniad, bydd angen ailadrodd y glaniad ar gyfer pob cynnyrch.
                    </ListItem>
                  </UnorderedList>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell
                  style={{
                    verticalAlign: 'top',
                    textAlign: 'left',
                    borderBottom: '1px solid #b1b4b6',
                    padding: '10px 20px 10px 0',
                  }}
                >
                  <strong>IDs y cynnyrch</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      Mae IDs cynnyrch yn cael eu creu wrth gadw
                      &nbsp;
                      <Link to='/manage-favourites' aria-label='Opens link for information on product favourites'>
                        <span className="govuk-visually-hidden">
                          (opens in same tab)
                        </span>
                        hoff gynnyrch
                      </Link>.
                    </ListItem>
                    <ListItem>
                      Maen nhw’n unigryw i bob defnyddiwr ac yn cael eu defnyddio i gyflymu’r broses o lwytho cynnyrch i fyny.
                    </ListItem>
                    <ListItem>
                      Dim ond yn fewnol y defnyddir IDs cynnyrch gan y gwasanaeth FES ac nid ydynt yn berthnasol i’r dystysgrif dalfa derfynol.
                    </ListItem>
                  </UnorderedList>
                </Table.Cell>
              </Table.Row>
            </>
          }
        />
        <br />
        <H2 data-testid="data-csvfile-label">Ffeil CSV</H2>
        <Table
          data-testid="data-csvfile-table"
          head={
            <Table.Row>
              <Table.CellHeader>Pwnc</Table.CellHeader>
              <Table.CellHeader>Canllawiau</Table.CellHeader>
            </Table.Row>
          }
          body={
            <>
              <Table.Row>
                <Table.Cell
                  style={{
                    verticalAlign: 'top',
                    textAlign: 'left',
                    borderBottom: '1px solid #b1b4b6',
                    padding: '10px 20px 10px 0',
                  }}
                >
                  <strong>Math o ffeil</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      Rhaid i’r ffeil sy’n cael ei llwytho i fyny fod yn ffeil CSV (Mae CSV yn golygu Comma Separated Values).
                    </ListItem>
                    <ListItem>
                      Mae modd cynhyrchu ffeiliau CSV drwy allgludo o daenlenni neu feddalwedd arall gyda nodwedd allgludo.
                    </ListItem>
                  </UnorderedList>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell
                  style={{
                    verticalAlign: 'top',
                    textAlign: 'left',
                    borderBottom: '1px solid #b1b4b6',
                    padding: '10px 20px 10px 0',
                  }}
                >
                  <strong>Strwythur data</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>Peidiwch â chynnwys rhes pennyn.</ListItem>
                    <ListItem>
                      Dylai fod gan bob rhes y strwythur canlynol:
                      <InsetText style={{ marginTop: '30px' }}>
                        <strong>
                          ID y Cynnyrch,Dyddiad glanio, Ardal y ddalfa,PLN Cwch,Pwysau allforio
                        </strong>{' '}
                        <br />
                          Er enghraifft: PRD123,01/01/2021,FAO27,PH1100,50.95
                      </InsetText>
                    </ListItem>
                    <ListItem>
                      Defnyddiwch atalnodau dim ond i wahanu’r meysydd (‘amffinyddion’ yw’r enw ar y rhain).
                    </ListItem>
                    <ListItem>
                      Mae’n syniad da grwpio’r rhesi gyda’i gilydd mewn ffordd sy’n ei gwneud hi’n hawdd i chi wirio’r llwytho i fyny. Er enghraifft, gallech grwpio glaniadau fesul cynnyrch neu gwch.
                    </ListItem>
                  </UnorderedList>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell
                  style={{
                    verticalAlign: 'top',
                    textAlign: 'left',
                    borderBottom: '1px solid #b1b4b6',
                    padding: '10px 20px 10px 0',
                  }}
                >
                  <strong>Dilysu</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      Bydd cynnyrch a glaniadau sydd wedi cael eu llwytho i fyny yn mynd drwy’r un broses ddilysu â’r rheini sydd wedi cael eu cofnodi â llaw.
                    </ListItem>
                    <ListItem>
                      Os bydd rhai rhesi’n methu llwytho i fyny a’ch bod am eu hychwanegu eich hun yn nes ymlaen, dylech chi wneud nodyn ohonyn nhw cyn bwrw ymlaen.
                    </ListItem>
                  </UnorderedList>
                </Table.Cell>
              </Table.Row>
            </>
          }
        />
        <br />
        <H2 data-testid="data-requirements-label">Gofynion data</H2>
        <Table
          data-testid="data-requirements-table"
          head={
            <Table.Row>
              <Table.CellHeader>Maes</Table.CellHeader>
              <Table.CellHeader>Canllawiau</Table.CellHeader>
              <Table.CellHeader>Enghraifft</Table.CellHeader>
            </Table.Row>
          }
          body={
            <>
              <Table.Row>
                <Table.Cell
                  style={{
                    verticalAlign: 'top',
                    textAlign: 'left',
                    borderBottom: '1px solid #b1b4b6',
                    padding: '10px 20px 10px 0',
                  }}
                >
                  <strong>ID y cynnyrch</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      Rhaid i ID y cynnyrch gyfeirio at gynnyrch sydd wedi'i gadw yn eich hoff gynnyrch.
                    </ListItem>
                  </UnorderedList>
                </Table.Cell>
                <Table.Cell>PRD123</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell
                  style={{
                    verticalAlign: 'top',
                    textAlign: 'left',
                    borderBottom: '1px solid #b1b4b6',
                    padding: '10px 20px 10px 0',
                  }}
                >
                  <strong>Dyddiad glanio</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      Rhaid i’r dyddiadau glanio fod yn ddyddiadau go iawn yn y fformat 'dd/mm/yyyy'.
                    </ListItem>
                    <ListItem>
                      Does dim modd i’r dyddiadau fod yn fwy na 7 diwrnod yn y dyfodol.
                    </ListItem>
                  </UnorderedList>
                </Table.Cell>
                <Table.Cell>01/01/2021</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell
                  style={{
                    verticalAlign: 'top',
                    textAlign: 'left',
                    borderBottom: '1px solid #b1b4b6',
                    padding: '10px 20px 10px 0',
                  }}
                >
                  <strong>Ardal y ddalfa</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      Rhaid i ardal y ddalfa fod yn un o brif ardaloedd pysgota’r Sefydliad Bwyd ac Amaeth.
                    </ListItem>
                    <ListItem>
                      Mae rhestr o’r prif ardaloedd pysgota ar gael yn: www.fao.org
                    </ListItem>
                  </UnorderedList>
                </Table.Cell>
                <Table.Cell>FAO27</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell
                  style={{
                    verticalAlign: 'top',
                    textAlign: 'left',
                    borderBottom: '1px solid #b1b4b6',
                    padding: '10px 20px 10px 0',
                  }}
                >
                  <strong>PLN y Cwch</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>Rhaid i'r PLN fod yn PLN Cwch dilys.</ListItem>
                    <ListItem>
                      Rhaid i gychod fod wedi'u trwyddedu ar ddyddiad glanio’r ddalfa.
                    </ListItem>
                    <ListItem>
                      Mae PLNs Cychod ar gael o: www.fishhub.cefas.co.uk/vessel-register/
                    </ListItem>
                  </UnorderedList>
                </Table.Cell>
                <Table.Cell>PH1100</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell
                  style={{
                    verticalAlign: 'top',
                    textAlign: 'left',
                    borderBottom: '1px solid #b1b4b6',
                    padding: '10px 20px 10px 0',
                  }}
                >
                  <strong>Pwysau allforio</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      Rhaid i'r pwysau allforio fod mewn cilogramau (kg).
                    </ListItem>
                    <ListItem>
                      Rhaid i'r pwysau fod yn fwy na sero gyda hyd at ddau le degol.
                    </ListItem>
                  </UnorderedList>
                </Table.Cell>
                <Table.Cell>50.95</Table.Cell>
              </Table.Row>
            </>
          }
        />
      </GridCol>
    </GridRow>
    <HelpLink journey="catchCertificate" />
  </Main>
);
