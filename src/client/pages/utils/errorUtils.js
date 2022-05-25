import i18n from '../../../i18n';
import enTranslations from '../../../locales/uk/en.json';

export function toGovukErrors(obj) {
  return Object.keys( obj).map( o => {
    return {targetName: o, text: obj[o], key: o, message: (obj[o] in enTranslations) ? i18n.t(obj[o]) : obj[o]};
  });
}

export function onHandleErrorClick(targetName, speciesRow, vesselIndex) {
  let elem;

  if (speciesRow !== undefined && vesselIndex !== undefined) {
    elem = document.getElementById(targetName + '-' + speciesRow + '-' + vesselIndex);
  } else {
    elem = document.getElementsByName(targetName)[0] || document.getElementById(targetName);
  }

  if (elem) {
    elem.scrollIntoView({ behavior: 'smooth' });
    elem.focus({ preventScroll: true});
  }
}

export function onHandleErrorClickWithoutFocus(targetName) {
  const elem = document.getElementsByName(targetName)[0] || document.getElementById(targetName);
  elem.scrollIntoView({ behavior: 'smooth' });
}

export function scrollToErrorIsland() {
  setTimeout( () => {
    document.getElementById('errorIsland').scrollIntoView({behavior: 'smooth'});
    document.getElementById('errorIsland').focus({ preventScroll: true});
  },100);
}

export function scrollToField(id) {
  setTimeout( () => {
    document.getElementById(id).scrollIntoView({behavior: 'smooth'});
    document.getElementById(id).focus({ preventScroll: true});
  },100);
}

export function scrollToFieldName(name) {
  setTimeout( () => {
    document.getElementsByName(name)[0].scrollIntoView({behavior: 'smooth'});
    document.getElementsByName(name)[0].focus({ preventScroll: true});
  },100);
}

