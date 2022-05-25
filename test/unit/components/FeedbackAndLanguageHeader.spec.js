import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router';
import { fireEvent, act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeedbackAndLanguageHeader from '../../../src/client/components/FeedbackAndLanguageHeader';

describe('FeedbackAndLanguageHeader', () => {
  let wrapper, globalTestId;
  const setup = (journeyPath, translationFlag = true) => {
    const state = {};
    const store = configureStore()(state);
    const props = {
      pathName: journeyPath,
      enableTranslation: translationFlag,
    };
    const { container, queryByTestId } = render(
      <Provider store={store}>
        <MemoryRouter>
          <FeedbackAndLanguageHeader {...props} />
        </MemoryRouter>
      </Provider>
    );
    wrapper = container;
    globalTestId = queryByTestId;
  };

  it('should render a FeedbackAndLanguageHeader component for PS', () => {
    setup('/create-processing-statement');
    expect(wrapper).toBeDefined();
  });

  it('should render a FeedbackAndLanguageHeader component for SD', () => {
    setup('/create-storage-document');
    expect(wrapper).toBeDefined();
  });

  it('should render a text of  This is a new service – your', () => {
    setup('/create-processing-statement');
    expect(screen.getByTestId('banner-text')).toHaveTextContent(
      'This is a new service – your feedback(opens in a new tab) will help us to improve it.'
    );
  });

  it('should render a feedback link with href property', () => {
    setup('/create-processing-statement');
    expect(screen.getByText('feedback')).toHaveAttribute(
      'href',
      'https://defragroup.eu.qualtrics.com/jfe/form/SV_3q6Yrf53I3bdoCa'
    );
  });

  

  describe('Check ENABLE TRANSLATION is switching toggles on/off', () => {
    it('should not render the language toggle when in PS journey and ENABLE_TRANSLATION env variable is false', () => {
      setup('/create-processing-statement', false);
      expect(globalTestId('Cymraeg')).toBeNull();
      expect(globalTestId('English')).toBeNull();
    });

    it('should not render the language toggle when in CC journey and ENABLE_TRANSLATION env variable is false', () => {
      setup('/create-catch-certificate', false);
      expect(globalTestId('Cymraeg')).toBeNull();
      expect(globalTestId('English')).toBeNull();
    });

    it('should not render the language toggle when in SD journey and ENABLE_TRANSLATION env variable is false', () => {
      setup('/create-storage-document', false);
      expect(globalTestId('Cymraeg')).toBeNull();
      expect(globalTestId('English')).toBeNull();
    });

    it('should  render the language toggle when in CC journey and ENABLE_TRANSLATION env variable is true', () => {
      setup('/create-catch-certificate', true);
      expect(screen.getByText('Cymraeg')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('should  render the language toggle when in SD journey and ENABLE_TRANSLATION env variable is true', () => {
      setup('/create-storage-document', true);
      expect(screen.getByText('Cymraeg')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('should render the language toggle when in PS journey and ENABLE_TRANSLATION env variable is true', () => {
      setup('/create-processing-statement', true);
      expect(screen.getByText('Cymraeg')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });
  });
});

describe('Language Toggle', () => {
  let welshToggle, englishToggle, wrapper
  const mockSaveAttributes = jest.fn();
  

  const setup = (language) => {
    const state = {};
    const store = configureStore()(state);
    const props = {
      pathName: '/create-processing-statement',
      saveAttributes: mockSaveAttributes,
      userSelectedLanguage: language,
      enableTranslation: true,
    };
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <FeedbackAndLanguageHeader {...props} />
        </MemoryRouter>
      </Provider>
    );
    welshToggle = screen.getByText('Cymraeg');
    englishToggle = screen.getByText('English');
    wrapper = container;
  };

  it('Should stop calling save attributes method when double click on english toggle',async() => {
    const mockEvent = { preventDefault: jest.fn(), target: { id: 'en_UK' } };
    setup('en_UK');
    await act(() => {
      fireEvent.click(englishToggle, mockEvent);
    });
    expect(mockSaveAttributes).not.toHaveBeenCalledWith('cy_UK');

  })

  it('Should stop calling save attributes method when double click on welsh toggle',async() => {
    const mockEvent = { preventDefault: jest.fn(), target: { id: 'cy_UK' } };
    setup('cy_UK');
    await act(() => {
      fireEvent.click(welshToggle, mockEvent);
    });
    expect(mockSaveAttributes).not.toHaveBeenCalledWith('en_UK');

  })

  it('Should enable the welsh language link active when the english link is clicked', async () => {
    const mockEvent = { preventDefault: jest.fn(), target: { id: 'en_UK' } };
    setup('cy_UK');

    await act(() => {
      fireEvent.click(englishToggle, mockEvent);
    });

    expect(wrapper.getElementsByClassName('lang-active').length).toBe(1);
    expect(wrapper.querySelector('.lang-active')).toHaveTextContent('Cymraeg');
  });

  it('Should enable the english language link active when the welsh link is clicked', async () => {
    const mockEvent = { preventDefault: jest.fn(), target: { id: 'cy_UK' } };
    setup('en_UK');

    await act(() => {
      fireEvent.click(welshToggle, mockEvent);
    });

    expect(wrapper.getElementsByClassName('lang-active').length).toBe(1);
    expect(wrapper.querySelector('.lang-active')).toHaveTextContent('English');
  });

  it('displays all text in Welsh after changing back from English', async () => {
    const mockEvent = { preventDefault: jest.fn(), target: { id: 'cy_UK' } };
    setup('en_UK');
    await act(() => {
      fireEvent.click(welshToggle, mockEvent);
    });
    expect(mockSaveAttributes).toHaveBeenCalledWith('cy_UK');
  });

  it('displays all text in English after changing back from Welsh', async () => {
    const mockEvent = { preventDefault: jest.fn(), target: { id: 'en_UK' } };
    setup('cy_UK');

    await act(() => {
      fireEvent.click(englishToggle, mockEvent);
    });
    expect(mockSaveAttributes).toHaveBeenCalledWith('en_UK');
  });


});
