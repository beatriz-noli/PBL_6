/* Pop-up da extensão: usa os feriados e desenhos de core.js (gerado do index.html) */
const CAL_URL = 'https://claude.ai/artifact/CNe3i9ZgtzbJPgZBaQqQZ3';
const $ = s => document.querySelector(s);
const today = new Date(); today.setHours(0,0,0,0);
let view = new Date(today.getFullYear(), today.getMonth(), 1);
let sel = today;

document.body.insertAdjacentHTML('afterbegin', ART_DEFS);
$('#flock').innerHTML = sheep({who:'ele',pose:'turn',x:28,y:0,s:.72,cls:''}) + sheep({who:'ela',pose:'sit',x:-30,y:0,s:.7,cls:''});

const isShabat = d => d.getDay() === 5 || d.getDay() === 6;
const dayList = d => {
  const list = holidaysFor(d).map(h => ({...h}));
  if (isShabat(d)) list.unshift({name:'Shabat Shalom', kind:'shabat'});
  return list;
};

function renderDay(){
  const d = sel;
  $('#dayNum').textContent = d.getDate();
  const wd = DOW_FULL[d.getDay()];
  $('#dayName').textContent = `${wd[0].toUpperCase() + wd.slice(1)}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
  $('#dayHeb').textContent = hebLabel(d);
  $('#dayHol').innerHTML = dayList(d).map(h => `<span class="chip ${h.kind}">${esc(h.name)}</span>`).join('');
  $('#dayScene').innerHTML = isShabat(d) ? shabatScene().replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ') : '';
}

function renderMonth(){
  $('#monthTitle').textContent = `${MESES[view.getMonth()]} ${view.getFullYear()}`;
  const start = addDays(view, -view.getDay());
  let html = DOW.map(w => `<div class="dow">${w[0]}</div>`).join('');
  for (let i = 0; i < 42; i++){
    const d = addDays(start, i);
    if (i >= 35 && d.getMonth() !== view.getMonth()) break;
    const kinds = [...new Set(holidaysFor(d).filter(h => !h.minor).map(h => h.kind === 'sp' ? 'br' : h.kind))];
    const cls = ['d', d.getMonth() !== view.getMonth() && 'out', d.getDay() === 5 && 'fri', d.getDay() === 6 && 'sat',
      +d === +today && 'today', +d === +sel && 'sel'].filter(Boolean).join(' ');
    const names = holidaysFor(d).map(h => h.name).join(', ');
    html += `<button class="${cls}" data-d="${iso(d)}" role="gridcell" aria-label="${d.getDate()} de ${MESES[d.getMonth()]}${names ? ': ' + esc(names) : ''}"${+d === +sel ? ' aria-selected="true"' : ''}>${d.getDate()}<span class="dots">${kinds.map(k => `<i class="${k}"></i>`).join('')}</span></button>`;
  }
  $('#grid').innerHTML = html;
}

function renderSoon(){
  const out = [];
  for (let i = 0; i < 200 && out.length < 3; i++){
    const d = addDays(today, i);
    for (const h of holidaysFor(d)) if (!h.minor && !/^Erev/.test(h.name) && out.length < 3) out.push({d, h});
  }
  $('#soon').innerHTML = out.map(({d, h}) =>
    `<li><i class="${h.kind === 'sp' ? 'br' : h.kind}"></i><b>${pad(d.getDate())}/${pad(d.getMonth()+1)}</b><span>${esc(h.name)}</span></li>`).join('');
}

$('#grid').addEventListener('click', e => {
  const b = e.target.closest('[data-d]'); if (!b) return;
  sel = parse(b.dataset.d);
  if (sel.getMonth() !== view.getMonth()) view = new Date(sel.getFullYear(), sel.getMonth(), 1);
  renderDay(); renderMonth();
});
$('#prev').onclick = () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderMonth(); };
$('#next').onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderMonth(); };
$('#open').onclick = () => { chrome.tabs.create({url: CAL_URL}); window.close(); };
$('#openWin').onclick = () => { chrome.windows.create({url: CAL_URL, type: 'popup', width: 1280, height: 860}); window.close(); };

renderDay(); renderMonth(); renderSoon();
