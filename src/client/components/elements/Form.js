import React from 'react';

export default function Form({action, currentUrl, nextUrl, setOnValidationSuccess, saveToRedisIfErrors, documentNumber, ...props}) {


  const queryParams = [];

  if( currentUrl ) queryParams.push( `c=${currentUrl}` );
  if( nextUrl ) queryParams.push( `n=${nextUrl}` );
  if( saveToRedisIfErrors ) queryParams.push( `saveToRedisIfErrors=${saveToRedisIfErrors}` );
  if( setOnValidationSuccess ) queryParams.push( `setOnValidationSuccess=${setOnValidationSuccess}` );
  if( documentNumber ) queryParams.push( `documentNumber=${documentNumber}` );

  let url = action;
  if( queryParams.length > 0 ) url += `?${queryParams.join('&')}`;

  return (
    <form action={url} method="POST" {...props}>
      {props.children}
    </form>
  );
}

