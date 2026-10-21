// Mostra o dia de hoje no ícone da extensão e deseja Shabat Shalom na sexta e no sábado
function tick(){
  const d = new Date(), shabat = d.getDay() === 5 || d.getDay() === 6;
  chrome.action.setBadgeText({ text: String(d.getDate()) });
  chrome.action.setBadgeBackgroundColor({ color: shabat ? '#8E6CD8' : '#EE5F95' });
  chrome.action.setBadgeTextColor?.({ color: '#FFFFFF' });
  chrome.action.setTitle({ title: shabat ? 'Shabat Shalom! · Lã-boratório das Ovelhas' : 'Lã-boratório das Ovelhas' });
}
chrome.runtime.onInstalled.addListener(() => { tick(); chrome.alarms.create('tick', { periodInMinutes: 15 }); });
chrome.runtime.onStartup.addListener(tick);
chrome.alarms.onAlarm.addListener(tick);
