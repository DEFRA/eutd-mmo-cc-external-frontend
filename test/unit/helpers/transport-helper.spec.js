import { catchCertificate, storageNotes } from '../../../src/client/pages/common/transport/helpers/findRequiredTransportData';
import { forwardUri, backUri } from '../../../src/client/helpers/vehicleRouteLookup';

describe('When finding required transport data', () => {
    it('should return true it has export location', () => {
        const mockProps = {
            exportLocation: 'London'
        };

        const res = catchCertificate(mockProps);
        expect(res).toBeTruthy();
    });

    it('should return false if export location is null', () => {
        const mockProps = {
            exportLocation: null
        };

        const res = catchCertificate(mockProps);
        expect(res).toBeFalsy();
    });

    it('should return true if facilityName is defined', () => {
        const mockProps = {
            storageNotes: {
                storageFacilities: 'London'
            }
        };
        
        const res = storageNotes(mockProps);
        expect(res).toBeTruthy();
    });

    it('should return false if facilityName is undefined', () => {
        const mockProps = {
            storageNotes: undefined
        };

        const res = storageNotes(mockProps);
        expect(res).toBeFalsy();
    });
});


describe('VehicleRouteLookUp', () => {
    const routes = {
        truckDetailsUri: '/create-catch-certificate/:documentNumber/add-transportation-details-truck',
        truckCmrUri: '/create-catch-certificate/:documentNumber/do-you-have-a-road-transport-document',
        planeDetailsUri: '/create-catch-certificate/:documentNumber/add-transportation-details-plane',
        trainDetailsUri: '/create-catch-certificate/:documentNumber/add-transportation-details-train',
        summaryUri: '/create-catch-certificate/:documentNumber/check-your-information',
        containerVesselDetailsUri: '/create-catch-certificate/:documentNumber/add-transportation-details-container-vessel',
        transportSelectionUri: '/create-catch-certificate/:documentNumber/how-does-the-export-leave-the-uk',
    };

    describe('when finding the next url for transport', () => {

        it('will define the next url for truck url', () => {
            const result = forwardUri('truck', routes);
            expect(result).toBe(routes.truckCmrUri);
        });

        it('will define the next url for plane url', () => {
            const result = forwardUri('plane', routes);
            expect(result).toBe(routes.planeDetailsUri);
        });

        it('will define the next url for train url', () => {
            const result = forwardUri('train', routes);
            expect(result).toBe(routes.trainDetailsUri);
        });

        it('will define the next url for directLanding url', () => {
            const result = forwardUri('directLanding', routes);
            expect(result).toBe(routes.summaryUri);
        });

        it('will define the next url for container vessel url', () => {
            const result = forwardUri('containerVessel', routes);
            expect(result).toBe(routes.containerVesselDetailsUri);
        });
    });

    describe('when finding the back url for transport', () => {
        it('will define the back url for truck url with Cmr', () => {
            const result = backUri('truck', 'true', routes);
            expect(result).toBe(routes.truckCmrUri);
        });

        it('will define the back url for truck url without cmr', () => {
            const result = backUri('truck', false, routes);
            expect(result).toBe(routes.truckDetailsUri);
        });
        it('will define the back url for plane url', () => {
            const result = backUri('plane', false, routes);
            expect(result).toBe(routes.planeDetailsUri);
        });

        it('will define the back url for train url', () => {
            const result = backUri('train', false, routes);
            expect(result).toBe(routes.trainDetailsUri);
        });

        it('will define the back url for directLanding url', () => {
            const result = backUri('directLanding', false, routes);
            expect(result).toBe(routes.transportSelectionUri);
        });

        it('will define the back url for container vessel url', () => {
            const result = backUri('containerVessel', false, routes);
            expect(result).toBe(routes.containerVesselDetailsUri);
        });
    });
});



