import React from 'react';
import {
  ChangeLinkTag,
  SummaryCellKey,
  SummaryCellLink,
  SummaryCellValue,
  SummaryRow,
  SummaryTable
} from '../../../components/Summary';
import {scrollToField} from '../../utils';
import moment from 'moment';


function niceTransportType(transportType) {
  if (!transportType) return '';
  const type = transportType
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase();
  return type[0].toUpperCase() + type.slice(1);
}
export default class TransportSummary extends React.Component {

  renderExportDestination() {
    const { path, documentNumber, isLocked, journey, exportedTo, t } = this.props;

    let  summaryCellKeyCCOption = t('TransportSummarySummaryCellKeyCCVersion');
    let  summaryCellKeyNoCCOption = t('TransportSummarySummaryCellKeyNoCCVersion');
    let  ChangeLink = t('TransportSummaryChangeLink')


      return (
        <SummaryRow id="destination-country">
          <SummaryCellKey>{(journey === 'catchCertificate') ? summaryCellKeyCCOption : summaryCellKeyNoCCOption}</SummaryCellKey>
          <SummaryCellValue>{exportedTo?.officialCountryName || ''}</SummaryCellValue>
          <SummaryCellLink>
            {!isLocked &&
              <ChangeLinkTag
                id="change-exportedTo"
                onClick={() => scrollToField('exportedTo')}
                to={(journey === 'catchCertificate') ?
                `${path}/${documentNumber}/what-export-journey` :
                `${path}/${documentNumber}/what-export-destination`}
              >
                {ChangeLink}
                <span className="govuk-visually-hidden">
                {summaryCellKeyCCOption.toLowerCase()}
                </span>
              </ChangeLinkTag>
            }
          </SummaryCellLink>
        </SummaryRow>
      );
  }


  render() {
    const {transport, path, showExportDate, location, documentNumber, isLocked, journey, isDirectLanding, t } = this.props;
    if (transport) {
      const { vehicle } = transport;
      if (vehicle === 'directLanding') {
        return (
          <SummaryTable id="transport-details">
            {journey === 'catchCertificate' &&
              <SummaryRow>
              <SummaryCellKey id="departure-country">{t('commonTransportSummaryDepartureCountry')}</SummaryCellKey>
                <SummaryCellValue>{location.exportedFrom}</SummaryCellValue>
              <SummaryCellLink>
                {!isLocked &&
                  <ChangeLinkTag
                  id="change-exportedFrom"
                  onClick={() => scrollToField('exportedFrom')}
                  to={`${path}/${documentNumber}/what-export-journey`}>
                  {t('commonSummaryPageChangeLink')}
                    <span className="govuk-visually-hidden">
                    {t('transportSummaryVHiddenTransportCountryExportationText')}
                    </span>
                  </ChangeLinkTag>
                }
                </SummaryCellLink>
              </SummaryRow>
            }
            {this.renderExportDestination()}
            <SummaryRow>
              <SummaryCellKey>{t('commonTransportSummaryLeaveUKText')}</SummaryCellKey>
              <SummaryCellValue>Fishing vessel</SummaryCellValue>
              <SummaryCellLink>
                {!isLocked && !isDirectLanding &&
                  <ChangeLinkTag
                    id="change-transportType"
                    onClick={() => scrollToField('transportType')}
                    to={`${path}/${documentNumber}/how-does-the-export-leave-the-uk`}>
                    {t('commonSummaryPageChangeLink')}
                  <span className="govuk-visually-hidden">
                     {t('commonTransportType').toLowerCase()}
                  </span>
                  </ChangeLinkTag>
                }
              </SummaryCellLink>
            </SummaryRow>
          </SummaryTable>
        );
      }

      if (vehicle === 'truck' && transport.cmr === 'true') {
        return (
          <SummaryTable id="transport-details">
            {journey === 'catchCertificate' &&
                <SummaryRow>
              <SummaryCellKey id="departure-country">{t('commonTransportSummaryDepartureCountry')}</SummaryCellKey>
                <SummaryCellValue>{location.exportedFrom}</SummaryCellValue>
                <SummaryCellLink>
                {!isLocked &&
                  <ChangeLinkTag
                    id="change-exportedFrom"
                    onClick={() => scrollToField('exportedFrom')}
                    to={`${path}/${documentNumber}/what-export-journey`}>
                    {t('commonSummaryPageChangeLink')}
                    <span className="govuk-visually-hidden">
                      {t('transportSummaryVHiddenTransportCountryExportationText')}
                    </span>
                  </ChangeLinkTag>
                }
                </SummaryCellLink>
              </SummaryRow>
            }
            {this.renderExportDestination()}
            <SummaryRow>
              <SummaryCellKey>{t('commonTransportSummaryLeaveUKText')}</SummaryCellKey>
              <SummaryCellValue>Truck</SummaryCellValue>
              <SummaryCellLink>
                {!isLocked &&
                  <ChangeLinkTag
                    id="change-transportType"
                    onClick={() => scrollToField('transportType')}
                    to={`${path}/${documentNumber}/how-does-the-export-leave-the-uk`}>
                    {t('commonSummaryPageChangeLink')}
                  <span className="govuk-visually-hidden">
                      {t('commonTransportType').toLowerCase()}
                  </span>
                  </ChangeLinkTag>
                }
              </SummaryCellLink>
            </SummaryRow>
            <SummaryRow>
              <SummaryCellKey>{t('sdDoYouHaveaRoadTransportDocumentHeader')}</SummaryCellKey>
              <SummaryCellValue>Yes</SummaryCellValue>
              <SummaryCellLink>
                {!isLocked &&
                  <ChangeLinkTag
                    id="change-cmrType"
                    onClick={() => scrollToField('separateCmrTrue')}
                    to={`${path}/${documentNumber}/do-you-have-a-road-transport-document`}>
                    {t('commonSummaryPageChangeLink')}
                  <span className="govuk-visually-hidden">
                      {t('transportSummaryVHiddenTransportText')}
                  </span>
                  </ChangeLinkTag>
                }
              </SummaryCellLink>
            </SummaryRow>
          </SummaryTable>
        );
      }

      if (vehicle === 'truck') {
        return (
          <SummaryTable id="transport-details">
            {journey === 'catchCertificate' &&
                <SummaryRow>
                <SummaryCellKey id="departure-country">
                {t('commonTransportSummaryDepartureCountry')}
                </SummaryCellKey>
              <SummaryCellValue>{location.exportedFrom}</SummaryCellValue>
                <SummaryCellLink>
                  {!isLocked &&
                  <ChangeLinkTag
                    id="change-exportedFrom"
                    onClick={() => scrollToField('exportedFrom')}
                      to={`${path}/${documentNumber}/what-export-journey`}
                    >
                    {t('commonSummaryPageChangeLink')}
                    <span className="govuk-visually-hidden">
                    {t('transportSummaryVHiddenTransportCountryExportationText')}
                    </span>
                  </ChangeLinkTag>
                  }
                </SummaryCellLink>
              </SummaryRow>
            }
            {this.renderExportDestination()}
            <SummaryRow>
              <SummaryCellKey>{t('commonTransportSummaryLeaveUKText')}</SummaryCellKey>
              <SummaryCellValue>
                {niceTransportType(transport.vehicle)}
              </SummaryCellValue>
              <SummaryCellLink>
                {!isLocked &&
                  <ChangeLinkTag
                    id="change-transportType"
                    onClick={() => scrollToField('transportType')}
                    to={`${path}/${documentNumber}/how-does-the-export-leave-the-uk`}
                  >
                    {t('commonSummaryPageChangeLink')}
                  <span className="govuk-visually-hidden">
                    {t('commonTransportType').toLowerCase()}
                  </span>
                  </ChangeLinkTag>
                }
              </SummaryCellLink>
            </SummaryRow>

            <br />
            <SummaryRow>
              <SummaryCellKey
                noSeperator="true"
                className="transport-details-summary-row"
              >
                {t('sdAddTransportationDetailsTruckNationality')}
              </SummaryCellKey>
              <SummaryCellValue noSeperator="true">
                {transport.nationalityOfVehicle}
              </SummaryCellValue>
              <SummaryCellLink noSeperator="true">
                {!isLocked &&
                  <ChangeLinkTag
                    onClick={() => scrollToField('nationalityOfVehicle')}
                    to={`${path}/${documentNumber}/add-transportation-details-truck`}>
                    {t('commonSummaryPageChangeLink')}
                  <span className="govuk-visually-hidden">
                      {t('commonSummaryPageTransportHeader').toLowerCase()}
                  </span>
                  </ChangeLinkTag>
                }
              </SummaryCellLink>
            </SummaryRow>

            <SummaryRow>
              <SummaryCellKey
                noSeperator="true"
                className="transport-details-summary-row"
              >
                {t('sdAddTransportationDetailsRegistrationNumber')}
              </SummaryCellKey>
              <SummaryCellValue noSeperator="true">
                {transport.registrationNumber}
              </SummaryCellValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryCellKey
                noSeperator="true"
                className="transport-details-summary-row"
              >
                 {t('commonAddTransportationDetailsPlaceExportLeavesUK')}
              </SummaryCellKey>
              <SummaryCellValue noSeperator="true">
                {transport.departurePlace}
              </SummaryCellValue>
            </SummaryRow>

            <SummaryRow>
              <SummaryCellKey
                noSeperator="true"
                className="transport-details-summary-row"
              >
                {showExportDate && `${t('commonAddTransportationDetailsExportDate')}`}
              </SummaryCellKey>
              <SummaryCellValue noSeperator="true">
                {showExportDate &&
                  moment(transport.exportDate, 'DD/MM/YYYY').format(
                    'D MMMM YYYY'
                  )}
              </SummaryCellValue>
            </SummaryRow>
          </SummaryTable>
        );
      }

      if (vehicle === 'plane') {
        return (
          <SummaryTable id="transport-details">
            {journey === 'catchCertificate' &&
                <SummaryRow>
                <SummaryCellKey id="departure-country">
                {t('commonTransportSummaryDepartureCountry')}
                </SummaryCellKey>
                <SummaryCellValue>{location.exportedFrom}</SummaryCellValue>
                <SummaryCellLink>
                  {!isLocked &&
                  <ChangeLinkTag
                    id="change-exportedFrom"
                    onClick={() => scrollToField('exportedFrom')}
                      to={`${path}/${documentNumber}/what-export-journey`}
                    >
                    {t('commonSummaryPageChangeLink')}
                    <span className="govuk-visually-hidden">
                    {t('transportSummaryVHiddenTransportCountryExportationText')}
                    </span>
                  </ChangeLinkTag>
                  }
                </SummaryCellLink>
              </SummaryRow>
            }
            {this.renderExportDestination()}
            <SummaryRow>
              <SummaryCellKey>{t('commonTransportSummaryLeaveUKText')}</SummaryCellKey>
              <SummaryCellValue>Plane</SummaryCellValue>
              <SummaryCellLink>
                {!isLocked &&
                  <ChangeLinkTag
                    id="change-transportType"
                    onClick={() => scrollToField('transportType')}
                    to={`${path}/${documentNumber}/how-does-the-export-leave-the-uk`}
                  >
                    {t('commonSummaryPageChangeLink')}
                  <span className="govuk-visually-hidden">
                   {t('commonTransportType').toLowerCase()}
                  </span>
                  </ChangeLinkTag>
                }
              </SummaryCellLink>
            </SummaryRow>

            <br />
            <SummaryRow>
              <SummaryCellKey
                noSeperator="true"
                className="transport-details-summary-row"
              >
                {t('commonAddTransportationDetailsFlightnumber')}
              </SummaryCellKey>
              <SummaryCellValue noSeperator="true">
                {transport.flightNumber}
              </SummaryCellValue>
              <SummaryCellLink noSeperator="true">
                {!isLocked &&
                  <ChangeLinkTag
                    onClick={() => scrollToField('flightNumber')}
                    to={`${path}/${documentNumber}/add-transportation-details-plane`}
                  >
                    {t('commonSummaryPageChangeLink')}
                  <span className="govuk-visually-hidden">
                      {t('commonSummaryPageTransportHeader').toLowerCase()}
                  </span>
                  </ChangeLinkTag>
                }
              </SummaryCellLink>
            </SummaryRow>

            <SummaryRow>
              <SummaryCellKey
                noSeperator="true"
                className="transport-details-summary-row"
              >
                {t('commonAddTransportationDetailsContainerIdentificationText')}
              </SummaryCellKey>
              <SummaryCellValue noSeperator="true">
                {transport.containerNumber}
              </SummaryCellValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryCellKey
                noSeperator="true"
                className="transport-details-summary-row"
              >
                {t('commonAddTransportationDetailsPlaceExportLeavesUK')}
              </SummaryCellKey>
              <SummaryCellValue noSeperator="true">
                {transport.departurePlace}
              </SummaryCellValue>
            </SummaryRow>

            <SummaryRow>
              <SummaryCellKey
                noSeperator="true"
                className="transport-details-summary-row"
              >
                {showExportDate && `${t('commonAddTransportationDetailsExportDate')}`}
              </SummaryCellKey>
              <SummaryCellValue noSeperator="true">
                {showExportDate &&
                  moment(transport.exportDate, 'DD/MM/YYYY').format(
                    'D MMMM YYYY'
                  )}
              </SummaryCellValue>
            </SummaryRow>
          </SummaryTable>
        );
      }

      if (vehicle === 'train') {
        return (
          <SummaryTable id="transport-details">
            {journey === 'catchCertificate' &&
                <SummaryRow>
                <SummaryCellKey id="departure-country">
                {t('commonTransportSummaryDepartureCountry')}
                </SummaryCellKey>
                <SummaryCellValue>{location.exportedFrom}</SummaryCellValue>
                <SummaryCellLink>
                  {!isLocked &&
                  <ChangeLinkTag
                    id="change-exportedFrom"
                    onClick={() => scrollToField('exportedFrom')}
                      to={`${path}/${documentNumber}/what-export-journey`}
                    >
                    {t('commonSummaryPageChangeLink')}
                    <span className="govuk-visually-hidden">
                    {t('transportSummaryVHiddenTransportCountryExportationText')}
                    </span>
                  </ChangeLinkTag>
                  }
                </SummaryCellLink>
              </SummaryRow>
            }
            {this.renderExportDestination()}
            <SummaryRow>
              <SummaryCellKey>{t('commonTransportSummaryLeaveUKText')}</SummaryCellKey>
              <SummaryCellValue>Train</SummaryCellValue>
              <SummaryCellLink>
                {!isLocked &&
                  <ChangeLinkTag
                    id="change-transportType"
                    onClick={() => scrollToField('transportType')}
                    to={`${path}/${documentNumber}/how-does-the-export-leave-the-uk`}
                  >
                    {t('commonSummaryPageChangeLink')}
                  <span className="govuk-visually-hidden">
                     {t('commonTransportType').toLowerCase()}
                  </span>
                  </ChangeLinkTag>
                }
              </SummaryCellLink>
            </SummaryRow>

            <br />
            <SummaryRow>
              <SummaryCellKey
                noSeperator="true"
                className="transport-details-summary-row"
              >
                {t('sdAddTransportationDetailsRailwayBillNumber')}
              </SummaryCellKey>
              <SummaryCellValue noSeperator="true">
                {transport.railwayBillNumber}
              </SummaryCellValue>
              <SummaryCellLink noSeperator="true">
                {!isLocked &&
                  <ChangeLinkTag
                    onClick={() => scrollToField('railwayBillNumber')}
                    to={`${path}/${documentNumber}/add-transportation-details-train`}
                  >
                    {t('commonSummaryPageChangeLink')}
                  <span className="govuk-visually-hidden">
                    {t('sdProgressTransportDetails').toLowerCase()}
                  </span>
                  </ChangeLinkTag>
                }
              </SummaryCellLink>
            </SummaryRow>

            <SummaryRow>
              <SummaryCellKey
                noSeperator="true"
                className="transport-details-summary-row"
              >
                {t('commonAddTransportationDetailsPlaceExportLeavesUK')}
              </SummaryCellKey>
              <SummaryCellValue noSeperator="true">
                {transport.departurePlace}
              </SummaryCellValue>
            </SummaryRow>

            <SummaryRow>
              <SummaryCellKey
                noSeperator="true"
                className="transport-details-summary-row"
              >
                {showExportDate && `${t('commonAddTransportationDetailsExportDate')}`}
              </SummaryCellKey>
              <SummaryCellValue noSeperator="true">
                {showExportDate &&
                  moment(transport.exportDate, 'DD/MM/YYYY').format(
                    'D MMMM YYYY'
                  )}
              </SummaryCellValue>
            </SummaryRow>

          </SummaryTable>
        );
      }

      if (vehicle === 'containerVessel') {
        return (
          <SummaryTable id="transport-details">
            {journey === 'catchCertificate' &&
                <SummaryRow>
              <SummaryCellKey id="departure-country">{t('commonTransportSummaryDepartureCountry')}</SummaryCellKey>
                <SummaryCellValue>{location.exportedFrom}</SummaryCellValue>
                <SummaryCellLink>
                {!isLocked &&
                  <ChangeLinkTag
                    id="change-exportedFrom"
                    onClick={() => scrollToField('exportedFrom')}
                    to={`${path}/${documentNumber}/what-export-journey`}>
                    {t('commonSummaryPageChangeLink')}
                    <span className="govuk-visually-hidden">
                    {t('transportSummaryVHiddenTransportCountryExportationText')}
                    </span>
                  </ChangeLinkTag>
                }
                </SummaryCellLink>
              </SummaryRow>
            }
            {this.renderExportDestination()}
            <SummaryRow>
              <SummaryCellKey>{t('commonTransportSummaryLeaveUKText')}</SummaryCellKey>
              <SummaryCellValue>Container Vessel</SummaryCellValue>
              <SummaryCellLink>
                {!isLocked &&
                  <ChangeLinkTag
                    id="change-transportType"
                    onClick={() => scrollToField('vehicle')}
                    to={`${path}/${documentNumber}/how-does-the-export-leave-the-uk`}>
                    {t('commonSummaryPageChangeLink')}
                  <span className="govuk-visually-hidden">
                    {t('commonTransportType').toLowerCase()}
                  </span>
                  </ChangeLinkTag>
                }
              </SummaryCellLink>
            </SummaryRow>

 <br/>
            <SummaryRow>
              <SummaryCellKey noSeperator="true" className="transport-details-summary-row">
                {t('commonAddTransportationDetailsVesselNameText')}
               </SummaryCellKey>
              <SummaryCellValue noSeperator="true">{transport.vesselName}</SummaryCellValue>
              <SummaryCellLink noSeperator="true">
                {!isLocked &&
                  <ChangeLinkTag
                    onClick={() => scrollToField('vesselName')}
                    to={`${path}/${documentNumber}/add-transportation-details-container-vessel`}>
                    {t('commonSummaryPageChangeLink')}
                  <span className="govuk-visually-hidden">
                    {t('sdProgressTransportDetails').toLowerCase()}
                  </span>
                  </ChangeLinkTag>
                }
              </SummaryCellLink>
            </SummaryRow>

            <SummaryRow>
              <SummaryCellKey noSeperator="true" className="transport-details-summary-row">{t('commonAddTransportationDetailsFlagStateText')}</SummaryCellKey>
              <SummaryCellValue noSeperator="true" >
                {transport.flagState}</SummaryCellValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryCellKey noSeperator="true" className="transport-details-summary-row">{t('commonAddTransportationDetailsContainerIdentificationText')}</SummaryCellKey>
              <SummaryCellValue noSeperator="true" >{transport.containerNumber}</SummaryCellValue>
            </SummaryRow>
            <SummaryRow >
              <SummaryCellKey noSeperator="true" className="transport-details-summary-row"> {t('commonAddTransportationDetailsPlaceExportLeavesUK')}</SummaryCellKey>
              <SummaryCellValue noSeperator="true">{transport.departurePlace}</SummaryCellValue>
            </SummaryRow>

            <SummaryRow >
              <SummaryCellKey noSeperator="true" className="transport-details-summary-row"> {showExportDate && `${t('commonAddTransportationDetailsExportDate')}`}</SummaryCellKey>
              <SummaryCellValue noSeperator="true"> {showExportDate && moment(transport.exportDate, 'DD/MM/YYYY').format('D MMMM YYYY')}</SummaryCellValue>
            </SummaryRow>

          </SummaryTable>
        );
      }
        return null;
      } else {
        return this.renderExportDestination();
      }
    }
}