import displayProgressPage from '../../../../src/client/pages/common/transport/helpers/displayProgressPage';

describe('displayProgressPage', () => {
  it('should redirect to progress page', () => {
    const mockPush = jest.fn();

    const props = {
      route: {
        progressUri: ':documentNumber/progress'
      },
      match: {
        params: { documentNumber: 'some-document-number'}
      },
      history: {
        push: mockPush,
      },
    };

    displayProgressPage(props);

    expect(mockPush).toHaveBeenCalledWith('some-document-number/progress');
  });
});
