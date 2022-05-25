export function startJourney() {
  window.startJourney = new Date(Date.now());
}

export function journeyTime() {
  if( !window.startJourney) return 0;
  const timeInSeconds = (new Date(Date.now()) - window.startJourney)/1000;
  return timeInSeconds.toFixed(0);
}
