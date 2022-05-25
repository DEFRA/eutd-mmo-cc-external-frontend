import {getAllUserAttributes, saveUserAttribute, GOT_ALL_USER_ATTRIBUTES, UPDATED_USER_ATTRIBUTES} from '../../../src/client/actions/userAttributes.actions';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk.withExtraArgument({
                        orchestrationApi: {
                            get: () => {
                                return new Promise((res) => {
                                    res({
                                        data: [
                                            {
                                                modifiedAt: '2019-02-26T21:15:10.493Z',
                                                name: 'privacy_statement',
                                                value: true
                                            }
                                        ]
                                    });
                                });
                            },
                            post: () => {
                                return new Promise((res) => {
                                    res({
                                        data: [
                                            {
                                                modifiedAt: '2019-02-26T21:15:10.493Z',
                                                name: 'privacy_statement',
                                                value: true
                                            }
                                        ]
                                    });
                                });
                            }
                        }
                  })]);


describe('User Attributes Actions', () => {

    it('should get user attributes', () => {
        const expectedActions = [
            {
                type : 'begin_api_call',
            },
            {
                type : GOT_ALL_USER_ATTRIBUTES,
                payload: [
                    {
                        modifiedAt: '2019-02-26T21:15:10.493Z',
                        name: 'privacy_statement',
                        value: true
                    }
                ]
            }
        ];

        const store = mockStore({
            getAllUserAttributes: [
                {
                    modifiedAt: '2019-02-26T21:15:10.493Z',
                    name: 'privacy_statement',
                    value: true
                }
            ]
        });

        return store.dispatch(getAllUserAttributes()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should post user attributes', () => {

        const expectedActions = [
            {
                type    : UPDATED_USER_ATTRIBUTES,
                payload : [
                    {
                        modifiedAt: '2019-02-26T21:15:10.493Z',
                        name: 'privacy_statement',
                        value: true
                    }
                ]
            }
        ];

        const payload = {
            modifiedAt: '2019-02-26T21:15:10.493Z',
            name: 'privacy_statement',
            value: true
        };

        const store = mockStore({
            saveUserAttribute: [
                {
                    modifiedAt: '2019-02-26T21:15:10.493Z',
                    name: 'privacy_statement',
                    value: true
                }
            ]
        });

        return store.dispatch(saveUserAttribute(payload)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('handle when get user attributes API fails', () => {

        const response = {
            status: 404,
            statusText: 'No data found'
        };

        const mockFailureStore = configureStore([thunk.withExtraArgument({
            orchestrationApi: {
                get: () => {
                    return new Promise((res, rej) => {
                        rej({response});
                    });
                }
            }
        })]);

        const store = mockFailureStore({
            getAllUserAttributes: {}
        });

        store.dispatch(getAllUserAttributes()).catch((err) => {
            expect(err).toBeDefined();
        });
    });

    it('should handle post user attributes API failures', () => {

        const response = {
            status: 400,
            statusText: 'Bad request'
        };

        const payload = {
            modifiedAt: '2019-02-26T21:15:10.493Z',
            name: 'privacy_statement',
            value: true
        };

        const mockFailureStore = configureStore([thunk.withExtraArgument({
            orchestrationApi: {
                post: () => {
                    return new Promise((res, rej) => {
                        rej({response});
                    });
                }
            }
        })]);

        const store = mockFailureStore({
            saveUserAttribute: {}
        });

        store.dispatch(saveUserAttribute(payload)).catch((err) => {
            expect(err).toBeDefined();
        });
    });
});