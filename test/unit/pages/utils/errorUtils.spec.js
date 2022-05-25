import * as errorUtils from '../../../../src/client/pages/utils/errorUtils';

describe('ErrorUtils', () => {
    const mockDocument = global.document;
    let mockGetElementById = jest.fn();
    let mockGetElementsByName = jest.fn();

    describe('onHandleErrorClick', () => {

        const mockLabel = {
            scrollIntoView: (f) => f,
            focus: (f) => f
        };
        beforeAll(() => {
            global.document.getElementById = mockGetElementById;
            global.document.getElementsByName = mockGetElementsByName;
        });

        afterEach(() => {
            mockGetElementById.mockRestore();
            mockGetElementsByName.mockRestore();
        });

        it('get element by ID should be called', () => {
            mockGetElementById.mockImplementation(() => mockLabel);
            mockGetElementsByName.mockImplementation(() => []);
            Object.defineProperty(mockDocument, 'getElementById', { value: mockGetElementById });
            Object.defineProperty(mockDocument, 'getElementsByName', { value: mockGetElementsByName });

            errorUtils.onHandleErrorClick('my_target', 0, 1);
            expect(mockGetElementById).toHaveBeenCalled();
            expect(mockGetElementById).toHaveBeenCalledWith('my_target-0-1');
        });

        it('get element by ID should be called with undefined', () => {
          mockGetElementById.mockImplementation(() => mockLabel);
          mockGetElementsByName.mockImplementation(() => []);
          Object.defineProperty(mockDocument, 'getElementById', { value: mockGetElementById });
          Object.defineProperty(mockDocument, 'getElementsByName', { value: mockGetElementsByName });

          errorUtils.onHandleErrorClick('my_target');
          expect(mockGetElementsByName).toHaveBeenCalled();
        });

        it('get element by ID should be called and return no element', () => {
          mockGetElementById.mockImplementation(() => null);
          mockGetElementsByName.mockImplementation(() => null);
          Object.defineProperty(mockDocument, 'getElementById', { value: mockGetElementById });
          Object.defineProperty(mockDocument, 'getElementsByName', { value: mockGetElementsByName });

          errorUtils.onHandleErrorClick('my_target', 0, 1);
          expect(mockGetElementById).toHaveBeenCalled();
        });

        it('get element by ID should not be called', () => {
            const nodelist = [mockLabel];
            mockGetElementById.mockImplementation(() => mockLabel);
            mockGetElementsByName.mockImplementation(() => nodelist);

            Object.defineProperty(mockDocument, 'getElementById', { value: mockGetElementById });
            Object.defineProperty(mockDocument, 'getElementsByName', { value: mockGetElementsByName });

            errorUtils.onHandleErrorClick('my_target', 0, 1);
            expect(mockGetElementById).toHaveBeenCalled();
            expect(mockGetElementById).toHaveBeenCalledWith('my_target-0-1');
        });
    });

    describe('onHandleErrorClickWithoutFocus', () => {
        const mockLabel = {
            scrollIntoView: (f) => f
        };

        beforeAll(() => {
            global.document.getElementById = mockGetElementById;
            global.document.getElementsByName = mockGetElementsByName;
        });

        afterEach(() => {
            mockGetElementById.mockRestore();
            mockGetElementsByName.mockRestore();
        });

        it('get element by ID should be called', () => {
            mockGetElementById.mockImplementation(() => mockLabel);
            mockGetElementsByName.mockImplementation(() => []);
            Object.defineProperty(mockDocument, 'getElementById', { value: mockGetElementById });
            Object.defineProperty(mockDocument, 'getElementsByName', { value: mockGetElementsByName });

            errorUtils.onHandleErrorClickWithoutFocus('my_target');
            expect(mockGetElementById).toHaveBeenCalled();
            expect(mockGetElementById).toHaveBeenCalledWith('my_target');
        });

        it('get element by ID should not be called', () => {
            const nodelist = [mockLabel];
            mockGetElementById.mockImplementation(() => mockLabel);
            mockGetElementsByName.mockImplementation(() => nodelist);

            Object.defineProperty(mockDocument, 'getElementById', { value: mockGetElementById });
            Object.defineProperty(mockDocument, 'getElementsByName', { value: mockGetElementsByName });

            errorUtils.onHandleErrorClickWithoutFocus('my_target');
            expect(mockGetElementById).not.toHaveBeenCalled();
            expect(mockGetElementsByName).toHaveBeenCalled();
            expect(mockGetElementsByName).toHaveBeenCalledWith('my_target');
        });
    });

    describe('scrollToField()', () => {
        const mockLabel = {
            scrollIntoView: (f) => f,
            focus: (f) => f
        };
        jest.useFakeTimers();

        beforeAll(() => {
            global.document.getElementById = mockGetElementById;
        });

        afterEach(() => {
            mockGetElementById.mockRestore();
        });

        it('get element by ID should be called', () => {
            mockGetElementById.mockImplementation(() => mockLabel);
            Object.defineProperty(mockDocument, 'getElementById', { value: mockGetElementById });
            errorUtils.scrollToField('my_id');
            jest.runAllTimers();

            expect(mockGetElementById).toHaveBeenCalled();
        });
    });

    describe('scrollToFieldName()', () => {
        const mockLabel = {
            scrollIntoView: (f) => f,
            focus: (f) => f
        };
        jest.useFakeTimers();

        beforeAll(() => {
            global.document.getElementsByName = mockGetElementsByName;
        });

        afterEach(() => {
            mockGetElementsByName.mockRestore();
        });

        it('get element by ID should be called', () => {
            const nodeList = [mockLabel];
            mockGetElementsByName.mockImplementation(() => nodeList);
            Object.defineProperty(mockDocument, 'getElementsByName', { value: mockGetElementsByName });
            errorUtils.scrollToFieldName('my_name');
            jest.runAllTimers();

            expect(mockGetElementsByName).toHaveBeenCalled();
        });
    });

    describe('scrollToErrorIsland()', () => {

        const mockLabel = {
            scrollIntoView: (f) => f,
            focus: (f) => f
        };
        jest.useFakeTimers();

        beforeAll(() => {
            global.document.getElementById = mockGetElementById;
        });

        afterEach(() => {
            mockGetElementById.mockRestore();
        });

        it('get element by ID should be called', () => {
            mockGetElementById.mockImplementation(() => mockLabel);
            Object.defineProperty(mockDocument, 'getElementById', { value: mockGetElementById });
            errorUtils.scrollToErrorIsland();
            jest.runAllTimers();

            expect(mockGetElementById).toHaveBeenCalled();
        });
    });

    describe('toGovukErrors', () => {
        it('should return error array in correct format', () => {
            const errors = [
                {
                    key: 'ERROR',
                    message: 'There is an error'
                },
                {
                    key: 'ERROR1',
                    message: 'There is another error'
                }
            ];
            const expected = [
                { 'key': '0', 'message': { 'key': 'ERROR', 'message': 'There is an error' }, 'targetName': '0', 'text': { 'key': 'ERROR', 'message': 'There is an error' } },
                { 'key': '1', 'message': { 'key': 'ERROR1', 'message': 'There is another error' }, 'targetName': '1', 'text': { 'key': 'ERROR1', 'message': 'There is another error' } }
            ];
            const result = errorUtils.toGovukErrors(errors);
            expect(result).toEqual(expected);
        });
    });

});
