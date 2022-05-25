import vesselsReducer from '../../../src/client/reducers/vesselsReducer';

describe('Vessels Reducer', () => {

    it('should reduce to initial state', () => {
        const initialState = [];
        const action = {
            type : ''
        };

        expect(vesselsReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to initial state with an undefined', () => {
      const initialState = [];
      const action = {
          type : ''
      };

      expect(vesselsReducer(undefined, action)).toEqual(initialState);
  });

    it('should reduce to search vessel state', () => {
        const initialState = [];
        const action = {
            type : 'search_vessels',
            payload : {
                data : [
                    {pln:'B192',vesselName:'GOLDEN BELLS 11',homePort:'ARDGLASS',registrationNumber:'',licenceNumber:'10106',imoNumber:''},
                    {pln:'BCK126',vesselName:'ZARA ANNABEL',homePort:'UNKNOWN',registrationNumber:'',licenceNumber:'42095',imoNumber:'8966640'},
                    {pln:'BD277',vesselName:'OUR OLIVIA BELLE',homePort:'ILFRACOMBE',registrationNumber:'',licenceNumber:'11956',imoNumber:''}
                ]
            }
        };

        const expectedResult = [
            {pln:'B192',vesselName:'GOLDEN BELLS 11',homePort:'ARDGLASS',registrationNumber:'',licenceNumber:'10106',imoNumber:''},
            {pln:'BCK126',vesselName:'ZARA ANNABEL',homePort:'UNKNOWN',registrationNumber:'',licenceNumber:'42095',imoNumber:'8966640'},
            {pln:'BD277',vesselName:'OUR OLIVIA BELLE',homePort:'ILFRACOMBE',registrationNumber:'',licenceNumber:'11956',imoNumber:''}
        ];

        expect(vesselsReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce to clear search vessel result state', () => {
        const initialState = [
            {pln:'B192',vesselName:'GOLDEN BELLS 11',homePort:'ARDGLASS',registrationNumber:'',licenceNumber:'10106',imoNumber:''},
            {pln:'BCK126',vesselName:'ZARA ANNABEL',homePort:'UNKNOWN',registrationNumber:'',licenceNumber:'42095',imoNumber:'8966640'},
            {pln:'BD277',vesselName:'OUR OLIVIA BELLE',homePort:'ILFRACOMBE',registrationNumber:'',licenceNumber:'11956',imoNumber:''}
        ];

        const action = {
            type : 'clear_vessels_search_results'
        };

        const expectedResult = [];

        expect(vesselsReducer(initialState, action)).toEqual(expectedResult);
    });
});