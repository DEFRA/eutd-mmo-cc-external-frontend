import React from 'react';
import { Link } from 'react-router-dom';
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
import PageTitle from '../../components/PageTitle';
import HelpLink from '../../components/HelpLink';

export const UploadGuidanceEnglish = ({ history }) => (
  <Main>
    <PageTitle title="Upload Guidance - GOV.UK" />
    <GridRow>
      <GridCol>
        <BackLink
          onClick={(e) => {
            e.preventDefault();
            history.goBack();
          }}
          href={'#'}
        />
        <H1>Upload guidance</H1>
        <H2 data-testid="data-general-label">General</H2>
        <Table
          data-testid="data-general-table"
          head={
            <Table.Row>
              <Table.CellHeader>Subject</Table.CellHeader>
              <Table.CellHeader>Guidance</Table.CellHeader>
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
                  <strong>Upload process</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      The steps of the upload process are as follows:
                      <OrderedList className="ol" listStyleType="continue">
                        <ListItem>
                          {' '}
                          <strong>Upload products and landings</strong> - Upload
                          the CSV file containing the product IDs and landings.
                        </ListItem>
                        <ListItem>
                          {' '}
                          <strong>Fix errors (if required)</strong> - If there
                          are multiple errors, you can clear the upload, amend
                          the file, and reupload.
                        </ListItem>
                        <ListItem>
                          {' '}
                          <strong>Review/correct</strong>  - The steps will take
                          you back to the Add landings page where you can add
                          any missing landings manually or correct any mistakes
                          you find.
                        </ListItem>
                      </OrderedList>
                    </ListItem>
                    <ListItem>
                      Multiple CSV files can be uploaded by cycling through the
                      process again.
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
                  <strong>Limitations</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      The maximum number of rows that can be uploaded per catch
                      certificate is 100.
                    </ListItem>
                    <ListItem>
                      You can only upload products that have been saved in your
                      product favourites, accessible from the main navigation.
                    </ListItem>
                    <ListItem>
                      If your export contains multiple products from the same
                      landing, the landing will need to be repeated for each
                      product.
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
                  <strong>Product IDs</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      Product IDs are created when a &nbsp;
                      <Link to='/manage-favourites' aria-label='Opens link for information on product favourites'>
                        <span className="govuk-visually-hidden">
                          (opens in same tab)
                        </span>
                        product favourites
                      </Link>&nbsp;
                       is saved.
                    </ListItem>
                    <ListItem>
                      They are unique to each user and are used to speed up the
                      process of uploading products.
                    </ListItem>
                    <ListItem>
                      Product IDs are only used internally by the FES service
                      and have no relevance to the final catch certificate.
                    </ListItem>
                  </UnorderedList>
                </Table.Cell>
              </Table.Row>
            </>
          }
        />
        <br />
        <H2 data-testid="data-csvfile-label">CSV file</H2>
        <Table
          data-testid="data-csvfile-table"
          head={
            <Table.Row>
              <Table.CellHeader>Subject</Table.CellHeader>
              <Table.CellHeader>Guidance</Table.CellHeader>
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
                  <strong>File type</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      The upload file must be a CSV file (CSV stands for Comma
                      Separated Values).
                    </ListItem>
                    <ListItem>
                      CSV files can be generated by exporting from spreadsheets
                      or other software with an export feature.
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
                  <strong>Data structure</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>Do not include a header row.</ListItem>
                    <ListItem>
                      Each row should have the following structure:
                      <InsetText style={{ marginTop: '30px' }}>
                        <strong>
                          Product ID,Date landed,Catch area,Vessel PLN,Export
                          weight
                        </strong>{' '}
                        <br />
                        For example: PRD123,01/01/2021,FAO27,PH1100,50.95
                      </InsetText>
                    </ListItem>
                    <ListItem>
                      Only use commas to separate fields (known as
                      'delimiters').
                    </ListItem>
                    <ListItem>
                      You are advised to group the rows together in a way that
                      makes it easy for you to check the upload. For example,
                      you could group landings by product or by vessel.
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
                  <strong>Validation</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      Uploaded products and landings will be subjected to the
                      same validation as those entered manually.
                    </ListItem>
                    <ListItem>
                      If some rows fail to upload and you want to add them later
                      manually, you should make a note of them before
                      continuing.
                    </ListItem>
                  </UnorderedList>
                </Table.Cell>
              </Table.Row>
            </>
          }
        />
        <br />
        <H2 data-testid="data-requirements-label">Data requirements</H2>
        <Table
          data-testid="data-requirements-table"
          head={
            <Table.Row>
              <Table.CellHeader>Field</Table.CellHeader>
              <Table.CellHeader>Guidance</Table.CellHeader>
              <Table.CellHeader>Example</Table.CellHeader>
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
                  <strong>Product ID</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      The product ID must refer to a product saved in your
                      product favourites.
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
                  <strong>Date landed</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      Landing dates must be real dates in the format
                      'dd/mm/yyyy'.
                    </ListItem>
                    <ListItem>
                      Dates cannot be more than 7 days in the future.
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
                  <strong>Catch area</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      The catch area must be a FAO major fishing area.
                    </ListItem>
                    <ListItem>
                      A list of the major fishing areas is available from:
                      www.fao.org
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
                  <strong>Vessel PLN</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>The PLN must be a valid Vessel PLN.</ListItem>
                    <ListItem>
                      Vessels must be licensed on the date the catch was landed.
                    </ListItem>
                    <ListItem>
                      Vessel PLNs are available from:
                      www.fishhub.cefas.co.uk/vessel-register/
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
                  <strong>Export weight</strong>
                </Table.Cell>
                <Table.Cell>
                  <UnorderedList className="ul" listStyleType="disc">
                    <ListItem>
                      The export weight must be in kilograms (kg).
                    </ListItem>
                    <ListItem>
                      Weights must be greater than zero with up to two decimal
                      places.
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
