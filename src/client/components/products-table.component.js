import React from 'react';
import { GridRow, Table } from 'govuk-react';
import SecondaryButton from './elements/SecondaryButton';
import { isEmpty } from 'lodash';
import { withTranslation } from 'react-i18next';

class ProductsTable extends React.Component {
  removeHandler = (event) => {
    event.preventDefault();
    event.currentTarget.blur();
    this.props.removeProduct(event.target.value);
  };

  renderTableBody(index, weight, item, count) {
    return (
      <Table.Row
        id={`product_${item.product.id}`}
        key={index}
      >
        <Table.Cell
          style={{ verticalAlign: 'top', width: '70%' }}
       >{`${item.product.species.label}, ${item.product.state.label}, ${item.product.presentation.label}, ${item.product.commodityCode}`}
        </Table.Cell>
        <Table.Cell
          style={{ verticalAlign: 'top', width: '20%' }}
        >{`${parseFloat(weight.toFixed(2))}`}</Table.Cell>
        <Table.Cell style={{ verticalAlign: 'top', width: '10%' }}>
          <GridRow style={{ marginBottom: '0' }}>
            {count > 1 && (
              <SecondaryButton
                type="button"
                id={'remove-btn_' + item.product.id}
                name="removeProduct"
                style={{ minWidth: '100px', marginBottom: 0 }}
                value={item.product.id}
                onClick={this.removeHandler}
              >
                {this.props.t('commonRemoveButton')}
                <span className="govuk-visually-hidden">
                  {`${item.product.species.label}, ${item.product.state.label}, ${item.product.presentation.label}`}
                </span>
              </SecondaryButton>
            )}
          </GridRow>
        </Table.Cell>
      </Table.Row>
    );
  }

  render() {
    const { exportPayload, weight, t } = this.props;
    let productExportWeight;
    const bodyElements = exportPayload.items
      ? exportPayload.items.map((item, index) => {
          if (item.landings && item.landings.length) {
            productExportWeight = 0;
            productExportWeight += item.landings.reduce(function (
              accum1,
              cur1
            ) {
              if (cur1.model && !isNaN(cur1.model.exportWeight)) {
                accum1 += Number(cur1.model.exportWeight);
              }
              return accum1;
            },
            0);
            return [
              this.renderTableBody(
                index,
                productExportWeight,
                item,
                exportPayload.items.length
              ),
            ];
          } else if (!isEmpty(item.product) && isEmpty(item.landings)) {
            productExportWeight = 0;
            return [
              this.renderTableBody(
                index,
                productExportWeight,
                item,
                exportPayload.items.length
              ),
            ];
          } else {
            return [];
          }
        })
      : [];
    bodyElements.push(
      <Table.Row
        id="products-table-footer"
        key={
          exportPayload && exportPayload.items ? exportPayload.items.length : 0
        }
      >
        <Table.Cell style={{ fontWeight: 'bold' }}>
          {t('ccAddLandingTotalExportWeight')}
        </Table.Cell>
        <Table.Cell style={{ fontWeight: 'bold' }}>{`${weight}${t('ccDirectLandingProductWeightTableExportWeightInputUnit')}`}</Table.Cell>
        <Table.Cell />
      </Table.Row>
    );

    return (
      <Table
        id="products-table"
        head={
          <Table.Row>
            <Table.CellHeader>{t('ccAddLandingProductLabel')}</Table.CellHeader>
            <Table.CellHeader>{`${t('ccAddLandingExportWeightColLabel')} (${t('ccDirectLandingProductWeightTableExportWeightInputUnit')})`}</Table.CellHeader>
            <Table.CellHeader style={{ textAlign: 'right' }}>{t('ccAddLandingActionColLabel')}</Table.CellHeader>
          </Table.Row>
        }
        body={bodyElements}
      />
    );
  }
}

export default withTranslation() (ProductsTable);
