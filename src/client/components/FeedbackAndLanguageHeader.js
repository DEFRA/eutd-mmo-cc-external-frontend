import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const FeedbackAndLanguageHeader = (props) => {
    const [languageToggle, setLanguageToggle] = useState('');
    const showLanguageToggle = props.enableTranslation === true ? true : false;
    const { t, i18n } = useTranslation();

    useEffect(() => {
      setLanguageToggle(props.userSelectedLanguage || 'en_UK');
    }, []);


    const toggleActiveLanguage = async (e) => {
        e.preventDefault();
     if(e.target.id !== (props.userSelectedLanguage || 'en_UK')) {   
        setLanguageToggle(e.target.id);
        i18n.changeLanguage(e.target.id);
        await props.saveAttributes(e.target.id);
      }  
    };

    return (
        <div className='govuk-phase-banner'>
            <p className='govuk-phase-banner__content'>
                <strong className='govuk-tag govuk-phase-banner__content__tag '>
                    BETA
                </strong>
                <span className='govuk-phase-banner__text' data-testid='banner-text' data-href='https://defragroup.eu.qualtrics.com/jfe/form/SV_3q6Yrf53I3bdoCa'>
                    <span>{t('feedbackAndLanguageHeaderThisIsANewService')} </span>
                    <a className='govuk-link' href='https://defragroup.eu.qualtrics.com/jfe/form/SV_3q6Yrf53I3bdoCa' target='_blank' rel='noopener noreferrer'>{t('feedbackAndLanguageHeaderFeedback')}
                        <span className='govuk-visually-hidden'>{t('feedbackAndLanguageHeaderOpensInANewTab')}</span></a> <span>{t('feedbackAndLanguageHeaderWillHelpUs')}</span>
                    <br />
                </span>
            </p>
            {showLanguageToggle &&
                <ul className='language-toggle govuk-list govuk-!-margin-top-0'>
                    <li id='en_UK' className={languageToggle === 'cy_UK' ? 'lang-link lang-active' : 'lang-link'} onClick={toggleActiveLanguage} data-testid='English'> English </li>
                    <li>|</li>
                    <li id='cy_UK' className={languageToggle === 'en_UK' ? 'lang-link lang-active' : 'lang-link'} onClick={toggleActiveLanguage} data-testid='Cymraeg'> Cymraeg </li>
                </ul>}
        </div>
    );
};

export default FeedbackAndLanguageHeader;