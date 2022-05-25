import {
  SAVE_LANDING_ROWS,
  UPLOAD_LANDING_ROWS,
  UNAUTHORISED_LANDING_ROWS,
  CLEAR_LANDING_ROWS
} from '../../../src/client/actions/upload-file.actions';
import uploadFileReducer from '../../../src/client/reducers/uploadFileReducer';

describe('Upload File Reducer', () => {
  const initialState = {
    landings: []
  };

  it('will reduce to initial state if no state is provided', () => {
    const state = null;
    const action = { type: undefined };

    expect(uploadFileReducer(state, action)).toEqual(initialState);
  });

  it('will reduce to given state when landings are provided', () => {
    const state = {
      landings: []
    };
    const data = [
      {
        rowNumber: 1,
        originalRow: 'some-string',
        productId: 'some-product-id',
        product: {
          species: 'species',
          speciesCode: 'species-code',
          scientificName: 'some-scientic-name',
          state: 'some-state',
          stateLabel: 'some-label',
          presentation: 'some-presentation',
          presentationLabel: 'some-presentation-label',
          commodity_code: 'some-commidity-code',
          commodity_code_description: 'some-commmodity-description',
        },
        landingDate: 'some-landing-date',
        faoArea: 'faoArea',
        vesselName: 'vessel-name',
        vesselPln: 'some-pln',
        exportWeight: 10,
        errors: [],
      },
    ];

    const action = { type: UPLOAD_LANDING_ROWS, payload: data };

    const expected = {
      landings: [
        {
          rowNumber: 1,
          originalRow: 'some-string',
          productId: 'some-product-id',
          product: {
            species: 'species',
            speciesCode: 'species-code',
            scientificName: 'some-scientic-name',
            state: 'some-state',
            stateLabel: 'some-label',
            presentation: 'some-presentation',
            presentationLabel: 'some-presentation-label',
            commodity_code: 'some-commidity-code',
            commodity_code_description: 'some-commmodity-description',
          },
          landingDate: 'some-landing-date',
          faoArea: 'faoArea',
          vesselName: 'vessel-name',
          vesselPln: 'some-pln',
          exportWeight: 10,
          errors: [],
        },
      ]
    };

    expect(uploadFileReducer(state, action)).toEqual(expected);
  });

  it('will reduce to given state when landings are to be saved', () => {
    const state = {
      landings: []
    };
    const data = [
      {
        rowNumber: 1,
        originalRow: 'some-string',
        productId: 'some-product-id',
        product: {
          species: 'species',
          speciesCode: 'species-code',
          scientificName: 'some-scientic-name',
          state: 'some-state',
          stateLabel: 'some-label',
          presentation: 'some-presentation',
          presentationLabel: 'some-presentation-label',
          commodity_code: 'some-commidity-code',
          commodity_code_description: 'some-commmodity-description',
        },
        landingDate: 'some-landing-date',
        faoArea: 'faoArea',
        vesselName: 'vessel-name',
        vesselPln: 'some-pln',
        exportWeight: 10,
        errors: [],
      },
    ];

    const action = { type: SAVE_LANDING_ROWS, payload: data };

    const expected = {
      landings: [
        {
          rowNumber: 1,
          originalRow: 'some-string',
          productId: 'some-product-id',
          product: {
            species: 'species',
            speciesCode: 'species-code',
            scientificName: 'some-scientic-name',
            state: 'some-state',
            stateLabel: 'some-label',
            presentation: 'some-presentation',
            presentationLabel: 'some-presentation-label',
            commodity_code: 'some-commidity-code',
            commodity_code_description: 'some-commmodity-description',
          },
          landingDate: 'some-landing-date',
          faoArea: 'faoArea',
          vesselName: 'vessel-name',
          vesselPln: 'some-pln',
          exportWeight: 10,
          errors: [],
        },
      ]
    };

    expect(uploadFileReducer(state, action)).toEqual(expected);
  });

  it('will reduce to an authorised state when landings are provided', () => {
    const state = {
      landings: [],
      unauthorised: true
    };

    const data = [
      {
        rowNumber: 1,
        originalRow: 'some-string',
        productId: 'some-product-id',
        product: {
          species: 'species',
          speciesCode: 'species-code',
          scientificName: 'some-scientic-name',
          state: 'some-state',
          stateLabel: 'some-label',
          presentation: 'some-presentation',
          presentationLabel: 'some-presentation-label',
          commodity_code: 'some-commidity-code',
          commodity_code_description: 'some-commmodity-description',
        },
        landingDate: 'some-landing-date',
        faoArea: 'faoArea',
        vesselName: 'vessel-name',
        vesselPln: 'some-pln',
        exportWeight: 10,
        errors: [],
      }
    ];

    const action = { type: UPLOAD_LANDING_ROWS, payload: data };

    const expected = {
      landings: [
        {
          rowNumber: 1,
          originalRow: 'some-string',
          productId: 'some-product-id',
          product: {
            species: 'species',
            speciesCode: 'species-code',
            scientificName: 'some-scientic-name',
            state: 'some-state',
            stateLabel: 'some-label',
            presentation: 'some-presentation',
            presentationLabel: 'some-presentation-label',
            commodity_code: 'some-commidity-code',
            commodity_code_description: 'some-commmodity-description',
          },
          landingDate: 'some-landing-date',
          faoArea: 'faoArea',
          vesselName: 'vessel-name',
          vesselPln: 'some-pln',
          exportWeight: 10,
          errors: [],
        },
      ],
      unauthorised: undefined
    };

    expect(uploadFileReducer(state, action)).toStrictEqual(expected);
  });

  it('will reduce to an unauthorised state', () => {
    const state = {
      landings: [],
    };

    const action = { type: UNAUTHORISED_LANDING_ROWS };

    const expected = {
      landings: [],
      unauthorised: true
    };

    expect(uploadFileReducer(state, action)).toStrictEqual(expected);
  });

  it('will reduce to state to a clear state', () => {
    const state = {
      landings: [
        {
          rowNumber: 1,
          originalRow: 'some-string',
          productId: 'some-product-id',
          product: {
            species: 'species',
            speciesCode: 'species-code',
            scientificName: 'some-scientic-name',
            state: 'some-state',
            stateLabel: 'some-label',
            presentation: 'some-presentation',
            presentationLabel: 'some-presentation-label',
            commodity_code: 'some-commidity-code',
            commodity_code_description: 'some-commmodity-description',
          },
          landingDate: 'some-landing-date',
          faoArea: 'faoArea',
          vesselName: 'vessel-name',
          vesselPln: 'some-pln',
          exportWeight: 10,
          errors: [],
        },
      ],
      unauthorised: true
    };

    const action = { type: CLEAR_LANDING_ROWS };

    const expected = {
      landings: []
    };

    expect(uploadFileReducer(state, action)).toStrictEqual(expected);
  });

});
