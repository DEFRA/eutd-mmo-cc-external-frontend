import moment from 'moment';
import React from 'react';
import { GridRow, Table } from 'govuk-react';
import SecondaryButton from '../components/elements/SecondaryButton';
import ValueFooter from '../components/value-footer.component';
import { withTranslation } from 'react-i18next';

class LandingsDetailsTable extends React.Component {
  render() {
    const { exportPayload, totalLandings, editLanding, removeLanding, t } = this.props;
    const label = totalLandings === 1 ? t('ccAddLandingValueFooterLabelLanding') : t('ccAddLandingValueFooterLabelLandings');

    return (
      <>
        <Table
          id="landings-table"
          head={
            <Table.Row>
              <Table.CellHeader>{t('ccAddLandingProductLabel')}</Table.CellHeader>
              <Table.CellHeader>{t('ccAddLandingLandingColLabel')}</Table.CellHeader>
              <Table.CellHeader>{`${t('ccAddLandingExportWeightColLabel')} (${t('ccDirectLandingProductWeightTableExportWeightInputUnit')})`}</Table.CellHeader>
              <Table.CellHeader style={{ textAlign: 'right' }}>{t('ccAddLandingActionColLabel')}</Table.CellHeader>
            </Table.Row>
          }
          body={
            exportPayload.items
              ? exportPayload.items.map((item) => {
                  if (item.landings && item.landings.length) {
                    return [
                      ...item.landings.map(({ model }, index) => {
                        return model &&
                          (
                            <Table.Row
                              id={`vessel_${item.product.id}_${model.id || 'new'}`}
                              key={index}
                            >
                              <Table.Cell
                                style={{ verticalAlign: 'top', width: '40%' }}
                              >{`${item.product.species.label}, ${item.product.state.label}, ${item.product.presentation.label}, ${item.product.commodityCode}`}</Table.Cell>
                              <Table.Cell
                                style={{ verticalAlign: 'top', width: '30%' }}
                              >{`${moment(model.dateLanded).format('DD/MM/YYYY')}, ${model.faoArea}, ${model.vessel.label}`}</Table.Cell>
                              <Table.Cell
                                style={{ verticalAlign: 'top', width: '10%' }}
                              >{`${model.exportWeight}`}</Table.Cell>
                              <Table.Cell
                                style={{ verticalAlign: 'top', width: '20%' }}
                              >
                                <GridRow style={{ margin: 0, placeContent: 'flex-end' }}>
                                  {
                                    !model.vessel.vesselOverriddenByAdmin && <SecondaryButton
                                    type="button"
                                    id={`edit_${model.id || 'new'}`}
                                    name="editLanding"
                                    style={{
                                      minWidth: '67px',
                                      wordBreak: 'normal'
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.currentTarget.blur();
                                      editLanding(item.product.id, model.id);
                                    }}
                                  >
                                    {t('commonEditLink')}
                                    <span className="govuk-visually-hidden">
                                      {`edit_${item.product.id}_${
                                        model.id || 'new'
                                      }`}
                                    </span>
                                  </SecondaryButton>
                                  }
                                  <SecondaryButton
                                    type="button"
                                    id={`remove_${model.id || 'new'}`}
                                    name="removeProduct"
                                    style={{
                                      minWidth: '100px'
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      removeLanding(item.product.id, model.id);
                                    }}
                                  >
                                    {t('commonRemoveButton')}
                                    <span className="govuk-visually-hidden">
                                      {`vessel_${item.product.id}_${
                                        model.id || 'new'
                                      }`}
                                    </span>
                                  </SecondaryButton>
                                </GridRow>
                              </Table.Cell>
                            </Table.Row>
                          );
                      })
                    ];
                  }
                })
              : []
          }
        />
        <ValueFooter
          id="valueHeading-total-landings"
          className="bold-small text-left"
          label={label}
          value={totalLandings}
        />
      </>
    );
  }
}

export default withTranslation() (LandingsDetailsTable);
