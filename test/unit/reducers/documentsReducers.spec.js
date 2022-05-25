import documentsReducer from '../../../src/client/reducers/documentsReducer';

describe('Documents Reducer', () => {

    it('should reduce to initial state', () => {
        const initialState = {
            inProgress: [],
            completed: []
        };

        const action = {
            type: ''
        };

        expect(documentsReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to initial state with an undefined', () => {
      const initialState = {
          inProgress: [],
          completed: []
      };

      const action = {
          type: ''
      };

      expect(documentsReducer(undefined, action)).toEqual(initialState);
  });

    it('should update state', () => {
        const initialState = {
            inProgress: [],
            completed: []
        };

        const action = {
            type: 'GOT_ALL_DOCUMENTS',
            payload : {
                inProgress: [
                    {
                        documentNumber : 'GBR-2019-CC-205A3C348',
                        startedAt      : '27 Feb 2019'
                    }
                ],
                completed: [
                    {
                        __t : 'catchCert',
                        _id : '5c4f21c13a982e3450108a41',
                        documentNumber : 'GBR-2019-CC-D8E77AC20',
                        createdAt : '2019-01-28T15:37:37.144Z',
                        documentUri : 'http://localhost:3001/pdf/export-certificates/Export%20Certificate_1548689855353.pdf?st=2019-01-28T15%3A32%3A36Z&se=2020-01-28T15%3A37%3A36Z&sp=r&sv=2018-03-28&sr=b&sig=7O%2FthW0gQYejTT3AaFBc6iWkyx3cZnY4M4PdS7Ip8Fc%3D'
                    },
                    {
                        __t : 'catchCert',
                        _id : '5c50157bbbef3074a489f309',
                        documentNumber : 'GBR-2019-CC-D8E77AC20',
                        createdAt : '2019-01-29T08:57:31.783Z',
                        documentUri : 'http://localhost:3001/pdf/export-certificates/Export%20Certificate_1548752250050.pdf?st=2019-01-29T08%3A52%3A30Z&se=2020-01-29T08%3A57%3A30Z&sp=r&sv=2018-03-28&sr=b&sig=YgkPLf3kAuDXkgnh4TVGh3KVXvgZLe%2FeAjTfqY2w69I%3D'
                    },
                    {
                        __t : 'catchCert',
                        _id : '5c50173ae2786a692466e82e',
                        documentNumber : 'GBR-2019-CC-D8E77AC20',
                        createdAt : '2019-01-29T09:04:58.950Z',
                        documentUri:'http://localhost:3001/pdf/export-certificates/Export%20Certificate_1548752693223.pdf?st=2019-01-29T08%3A59%3A53Z&se=2020-01-29T09%3A04%3A53Z&sp=r&sv=2018-03-28&sr=b&sig=Ctal42Ui0v8%2BnM7wd5CWY6LmV4jo5M8lt0mNZ6AZzdo%3D'
                    },
                    {
                        __t            : 'catchCert',
                        _id            : '5c51ab5c126a405c74555a16',
                        documentNumber : 'GBR-2019-CC-9A5AEDEA0',
                        createdAt      : '2019-01-30T13:49:16.141Z',
                        documentUri    : 'http://localhost:3001/pdf/export-certificates/Export%20Certificate_1548856152914.pdf?st=2019-01-30T13%3A44%3A14Z&se=2020-01-30T13%3A49%3A14Z&sp=r&sv=2018-03-28&sr=b&sig=qamVeG%2F%2FJKhHd421JiExfuY4eyBD5YAu39VixavhyYA%3D'
                    },
                    {
                        __t            : 'catchCert',
                        _id            : '5c51b8b4d1d7ee6424dc06f6',
                        documentNumber : 'GBR-2019-CC-34965757A',
                        createdAt      : '2019-01-30T14:46:12.882Z',
                        documentUri    : 'http://localhost:3001/pdf/export-certificates/_e17e257c-1e36-4d9e-b9e3-23e11a42c3b7.pdf?st=2019-01-30T14%3A41%3A10Z&se=2020-01-30T14%3A46%3A10Z&sp=r&sv=2018-03-28&sr=b&sig=SbxGI7fcMokVIN%2B1DWcsjrkSdZw%2FsGoiQX7zvF2YIY8%3D'
                    },
                    {
                        __t            : 'catchCert',
                        _id            : '5c52bf3a59166a1faca20021',
                        documentNumber : 'GBR-2019-CC-5CC41458D',
                        createdAt      : '2019-01-31T09:26:18.803Z',
                        documentUri    : 'http://localhost:3001/pdf/export-certificates/_0d855fe8-78f1-4c99-9e34-5312c6368794.pdf?st=2019-01-31T09%3A21%3A14Z&se=2020-01-31T09%3A26%3A14Z&sp=r&sv=2018-03-28&sr=b&sig=CevSI76juk26w0vIh52DgNA6Hry2MsHIlgyMXbkEvUY%3D'
                    }
                ]
            }
        };

        expect(documentsReducer(initialState, action)).toEqual(action.payload);
    });
});