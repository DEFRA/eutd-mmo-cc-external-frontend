import React from 'react';
import { GridRow, GridCol, Table, Header } from 'govuk-react';
import { WeightInput } from '../../../components/elements/WeightInput';
import { useTranslation } from 'react-i18next';

function ProductWeights(props) {
  const { species, onWeightChange, errors } = props;
  const {t} = useTranslation();
  const totalExportWeight = species.reduce(
    (acc, curr) => acc + (Number(curr.exportWeight) || 0),
    0
  );

const splitErrorParams = (error) => {
    const isErrorWithParams = error.includes('-');
    const splitError = error.split('-');
    return isErrorWithParams ? t(splitError[0], {dynamicValue :splitError[1],param1 :splitError[2],param2 :splitError[3],param3 :splitError[4]}) : t(error);
  };

 
  return (
    <div>
      <Header level="2">{t('ccAddLandingProductWeightHeader')}</Header>
      <GridRow>
        <GridCol>
          <Table
            id="species-table"
            head={
              <Table.Row>
                <Table.CellHeader>{t('ccAddLandingProductLabel')}</Table.CellHeader>
                <Table.CellHeader>{t('ccAddLandingExportWeightColLabel')}</Table.CellHeader>
              </Table.Row>
            }
            body={
              <>
                {species.map((landing, index) => {
                  const id = `weights.${index}.exportWeight`;
                  
                  const error = errors.find((err) => err.targetName === id);
                
                  return (
                    <Table.Row id={`species_${landing.speciesId}`} key={index}>
                      <Table.Cell>{landing.speciesLabel}</Table.Cell>
                      <Table.Cell>
                        <WeightInput
                          id={id}
                          error={error ?  splitErrorParams(error.text) : ''}
                          value={landing.exportWeight}
                          onChange={(event) => {
                            event.preventDefault();

                            onWeightChange(
                              landing.speciesId,
                              event.target.value
                            );
                          }}
                        />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
                <Table.Row>
                  <Table.Cell>
                    <strong>{t('ccAddLandingTotalExportWeight')}</strong>
                  </Table.Cell>
                  <Table.Cell id="totalExportWeight">
                    <strong>
                      {Number.isInteger(totalExportWeight)
                        ? totalExportWeight
                        : totalExportWeight.toFixed(2)}
                      {t('ccDirectLandingProductWeightTableExportWeightInputUnit')}
                    </strong>
                  </Table.Cell>
                </Table.Row>
              </>
            }
          />
        </GridCol>
      </GridRow>
    </div>
  );
}

export default ProductWeights;
