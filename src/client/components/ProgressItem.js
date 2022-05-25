import React from 'react';
import { ListItem, ErrorText} from 'govuk-react';
import { useTranslation } from 'react-i18next';
import { upperFirst, toLower } from 'lodash';

const ProgressItem = ({title, status, optional = false, href, testId, id, error, onClick}) => {
  const {t} = useTranslation();

  const tagCssClasses = {
  'OPTIONAL': 'govuk-tag--grey',
  'INCOMPLETE': 'govuk-tag--blue',
  'CANNOT START': 'govuk-tag--grey',
  'ERROR': 'govuk-tag--red'
  };
  const tagTitles = {
    'CANNOT START': 'cannot_start_yet',
    'ERROR': 'submission_failed'
  };

  const cssClass = tagCssClasses[status];
  const tag = tagTitles[status] || status;

  return title !== undefined && status !== undefined && (
    <>
      <ListItem className={`app-task-list__item ${error ? 'error' : ''}`} data-testid={`progress-${testId}-wrapper`} id={`${id}`}>
        {error && <ErrorText>{t(error)}</ErrorText>}
        {status === 'CANNOT START' ?
          <span data-testid={`progress-${testId}-title-blocked`} >{title}</span> :
          <a href={href} data-testid={`progress-${testId}-title`} onClick={onClick}>
            {title}
            {optional && (` (${upperFirst(toLower(t('optional')))})`)}
          </a>
        }
        {status !== '' && (
          <strong className={`govuk-tag ${cssClass} app-task-list__tag`} data-testid={`progress-${testId}-tag`}>
            {(t(toLower(tag)).toUpperCase())}
          </strong>
        )}
      </ListItem>
      <div className='grey-border-bottom'></div>
    </>
  );
};

export default ProgressItem;