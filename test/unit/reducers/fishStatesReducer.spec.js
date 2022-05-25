import fishStatesReducer from '../../../src/client/reducers/fishStatesReducer';

describe('Fish States Reducer', () => {

    it('should reduce to initial state', () => {
      const initialState = [];
      const action = {type: ''};

      expect(fishStatesReducer(initialState, action)).toEqual([]);
    });

    it('should reduce to initial state with an undefined', () => {
      const action = {type: ''};

      expect(fishStatesReducer(undefined, action)).toEqual([]);
    });

    it('should add a species state and presentations to initial state', () => {
        const initialState = [];

        const payload = {
            data : [
            {
                state : {
                    value: 'FRO',
                    label: 'Frozen'
                },
                presentations : [
                    {
                        value: 'BMS',
                        label: 'Below minimum conservation reference size'
                    },
                    {
                        value: 'FIL',
                        label: 'Filleted'
                    },
                    {
                        value: 'FIS',
                        label: 'Filleted and skinned fillets'
                    },
                    {
                        value: 'GUH',
                        label: 'Gutted and headed'
                    },
                    {
                        value: 'GUT',
                        label: 'Gutted'
                    },
                    {
                        value: 'JAP',
                        label: 'Japanese cut'
                    },
                    {
                        value: 'OTH',
                        label: 'Other'
                    },
                    {
                        value: 'ROE',
                        label: 'Roe(s)'
                    },
                    {
                        value: 'SGH',
                        label: 'Salted'
                    },
                    {
                        value: 'SGT',
                        label: 'Salted gutted'
                    },
                    {
                        value: 'WHL',
                        label: 'Whole'
                    },
                    {
                        value: 'FSB',
                        label: 'Filleted with skin and bones'
                    },
                    {
                        value: 'FSP',
                        label: 'Filleted skinned with pinbone on'
                    }
                ]
              }
            ]
        };

        const action = {type: 'search_fish_states', payload: payload};

        expect(fishStatesReducer(initialState, action)).toEqual(payload.data);
    });
});