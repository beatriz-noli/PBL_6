/* Gerado por build.py a partir de ../index.html — não edite à mão. */
const pad = n => String(n).padStart(2,'0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parse = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
const addDays = (d,n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x; };
const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const DOW = ['dom','seg','ter','qua','qui','sex','sáb'];
const DOW_FULL = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function easter(y){ const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),
  h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1; return new Date(y,mo-1,da); }
const brCache = {};
function brHolidays(y){
  if (brCache[y]) return brCache[y];
  const out = {}; const put = (d,name,kind='br') => { const k = typeof d==='string'? `${y}-${d}` : iso(d); (out[k] ||= []).push({name,kind}); };
  put('01-01','Confraternização Universal'); put('04-21','Tiradentes'); put('05-01','Dia do Trabalho');
  put('09-07','Independência do Brasil'); put('10-12','Nossa Senhora Aparecida'); put('11-02','Finados');
  put('11-15','Proclamação da República'); put('11-20','Dia da Consciência Negra'); put('12-25','Natal');
  const e = easter(y);
  put(addDays(e,-48),'Carnaval','sp'); put(addDays(e,-47),'Carnaval','sp');
  put(addDays(e,-2),'Sexta-feira Santa'); put(e,'Páscoa','sp'); put(addDays(e,60),'Corpus Christi','sp');
  put('01-25','Aniversário de São Paulo','sp'); put('07-09','Revolução Constitucionalista (SP)','sp');
  put('06-12','Dia dos Namorados','love');
  return brCache[y] = out;
}
const hebFmt = new Intl.DateTimeFormat('en-u-ca-hebrew',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const hebPt = new Intl.DateTimeFormat('pt-BR-u-ca-hebrew',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const hebCache = new Map();
function heb(d){
  const k = iso(d); if (hebCache.has(k)) return hebCache.get(k);
  const p = hebFmt.formatToParts(new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate(),12)));
  const r = { day:+p.find(x=>x.type==='day').value, month:p.find(x=>x.type==='month').value, year:+(p.find(x=>x.type==='year')||{}).value };
  hebCache.set(k,r); return r;
}
function hebLabel(d){ return hebPt.format(new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate(),12))).replace(/\s*AM$/,''); }
function jewishBase(d){
  const {day,month} = heb(d), w = d.getDay(), out = [];
  const add = (name,minor=false) => out.push({name,kind:'jew',minor});
  const isAdar = month==='Adar' || month==='Adar II';
  if (month==='Tishri'){
    if (day===1||day===2) add(`Rosh Hashaná · ${day}º dia`);
    if (day===10) add('Yom Kipur');
    if (day===15||day===16) add(`Sucot · ${day-14}º dia`);
    if (day>=17&&day<=20) add('Chol HaMoed Sucot',true);
    if (day===21) add('Hoshaná Rabá',true);
    if (day===22) add('Shemini Atzeret');
    if (day===23) add('Simchat Torá');
  }
  // Chanucá: 25 de Kislev + 7 dias
  for (let k=0;k<8;k++){ const b = heb(addDays(d,-k)); if (b.month==='Kislev' && b.day===25){ add(`Chanucá · ${k+1}ª vela`, k>0); break; } }
  if (month==='Shevat' && day===15) add('Tu BiShvat',true);
  if (isAdar && day===14) add('Purim');
  if (month==='Nisan'){
    if (day===15||day===16) add(`Pessach · ${day-14}º dia`);
    if (day>=17&&day<=20) add('Chol HaMoed Pessach',true);
    if (day===21||day===22) add(`Pessach · ${day-14}º dia`);
    const ys = (day===27 && w!==5 && w!==0) || (day===26 && w===4) || (day===28 && w===1);
    if (ys) add('Yom HaShoá',true);
  }
  if (month==='Iyar'){
    const ya = (day===5 && w!==1 && w!==5 && w!==6) || ((day===4 || day===3) && w===4) || (day===6 && w===2);
    if (ya) add("Yom Ha'Atzmaut",true);
    if (day===18) add('Lag BaOmer',true);
  }
  if (month==='Sivan' && (day===6||day===7)) add(`Shavuot · ${day-5}º dia`);
  if (month==='Av'){
    if ((day===9 && w!==6) || (day===10 && w===0)) add("Tishá BeAv",true);
    if (day===15) out.push({name:'Tu BeAv · dia do amor',kind:'love'});
  }
  return out;
}
const MAJOR_EREV = [/^Rosh/,/^Yom Kipur/,/^Sucot · 1/,/^Pessach · 1/,/^Shavuot · 1/,/^Shemini/,/^Pessach · 7/];
function holidaysFor(d){
  const k = iso(d); const list = [...(brHolidays(d.getFullYear())[k]||[]), ...jewishBase(d)];
  const base = h => h.name.split(' ·')[0];
  const tom = jewishBase(addDays(d,1)).find(h => MAJOR_EREV.some(r=>r.test(h.name)));
  if (tom && !jewishBase(d).some(h => base(h)===base(tom)))
    list.push({name:`Erev ${/^Pessach · 7/.test(tom.name)?'últimos dias de Pessach':base(tom)} · ao pôr do sol`,kind:'jew',minor:true});
  return list;
}

const ART_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <filter id="ov-rough" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>
  <linearGradient id="ov-sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A99BE8"/><stop offset=".45" stop-color="#F3A6C2"/><stop offset=".8" stop-color="#FFC9A0"/><stop offset="1" stop-color="#FFE3B0"/></linearGradient>
  <linearGradient id="ov-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FA7D6"/><stop offset="1" stop-color="#7FD0EA"/></linearGradient>
  <linearGradient id="ov-beachsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD0F5"/><stop offset="1" stop-color="#E4F6FF"/></linearGradient>
  <radialGradient id="ov-lamp"><stop offset="0" stop-color="#FFD98A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient>
  <linearGradient id="ov-dreamsky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD9E8"/><stop offset=".55" stop-color="#EBDDFB"/><stop offset="1" stop-color="#D6E9FF"/></linearGradient>
  <radialGradient id="ov-glow"><stop offset="0" stop-color="#FFE7A3" stop-opacity=".85"/><stop offset="1" stop-color="#FFE7A3" stop-opacity="0"/></radialGradient>
  <radialGradient id="ov-glow-v"><stop offset="0" stop-color="#D9C8FF" stop-opacity=".9"/><stop offset="1" stop-color="#B9A2FF" stop-opacity="0"/></radialGradient>
  <radialGradient id="ov-glow-g"><stop offset="0" stop-color="#B8FFD8" stop-opacity=".9"/><stop offset="1" stop-color="#7DF0B4" stop-opacity="0"/></radialGradient>
</defs></svg>`;

const OL = '#7A5E4C', LW = 1.5;
const PAL = {wool:'#FFFBF3', woolSh:'#EFE2CF', curl:'#DCCAB2', face:'#F3DCC4', faceSh:'#E5C4A5', ear:'#E7C09F', earIn:'#F2B0AE', leg:'#E8CBAE', legFar:'#D6B190', hoof:'#7A5A48', blush:'#F59AA6',
  wetWool:'#F2F8FF', wetSh:'#D9E8F5', coat:'#FAFCFF', coatSh:'#DCE4EF', coatOL:'#7D7F95'};
let SEED = 1; const rnd = () => (SEED = (SEED*16807) % 2147483647) / 2147483647;
/** contorno de lã irregular (cada bolinha com tamanho um pouco diferente) */
function woolPath(cx,cy,rx,ry,n,seed=1,k=.6){
  SEED = seed*977+13; const P=[];
  for(let i=0;i<n;i++){ const t=-Math.PI/2+(i+(rnd()-.5)*.25)/n*2*Math.PI, j=1+(rnd()-.5)*.08; P.push([cx+rx*j*Math.cos(t), cy+ry*j*Math.sin(t)]); }
  let d=`M${P[0][0].toFixed(1)} ${P[0][1].toFixed(1)}`;
  for(let i=0;i<n;i++){ const [a,b]=P[i],[c,e]=P[(i+1)%n], r=(Math.hypot(c-a,e-b)*(k+(rnd()-.5)*.12)).toFixed(1); d+=` A${r} ${r} 0 0 1 ${c.toFixed(1)} ${e.toFixed(1)}`; }
  return d+'Z';
}
const cloudPath = (cx,cy,rx,ry,n,k=.6) => woolPath(cx,cy,rx,ry,n,3,k);
/** lã com sombra chapada embaixo à direita e contorno */
function wool(cx,cy,rx,ry,n,seed,wet=false,curls=[]){
  const f = wet?PAL.wetWool:PAL.wool, sh = wet?PAL.wetSh:PAL.woolSh, d = woolPath(cx,cy,rx,ry,n,seed);
  return `<path d="${d}" fill="${sh}"/><path d="${woolPath(cx-2,cy-2.6,rx-3,ry-3.2,n,seed)}" fill="${f}"/>`+
    curls.map(([x,y,r])=>`<path d="M${x-r} ${y+r*.2} a${r} ${r} 0 1 1 ${r*1.5} ${r*.7}" fill="none" stroke="${PAL.curl}" stroke-width="1.5" stroke-linecap="round"/>`).join('')+
    `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${LW}" stroke-linejoin="round"/>`;
}
const ol = (w=LW) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

/* ---------- olhos e cabeças ---------- */
function eyes(pts, baby, mood){
  return pts.map(([x,y],i)=>{
    if (mood==='sleep') return `<path d="M${x-3.8} ${y} q3.8 2.8 7.6 0" fill="none" ${ol(1.7)}/>`;
    if (mood==='closed' || (mood==='wink' && i===pts.length-1)) return `<path d="M${x-3.8} ${y+1} q3.8 -4 7.6 0" fill="none" ${ol(1.7)}/>`;
    return baby
      ? `<ellipse cx="${x}" cy="${y}" rx="2.9" ry="3.5" fill="#3B2A20"/><circle cx="${x-.9}" cy="${y-1.3}" r="1.1" fill="#fff"/>`
      : `<ellipse cx="${x}" cy="${y}" rx="2.7" ry="3.3" fill="#3B2A20"/><circle cx="${x-.9}" cy="${y-1.3}" r="1" fill="#fff"/>`;
  }).join('') + (baby && mood!=='sleep' && mood!=='closed' ? pts.map(([x,y],i)=>`<path d="M${x+(i?2.6:-2.6)} ${y-3.6} l${i?2:-2} -1.8" ${ol(1.2)}/>`).join('') : '');
}
const bow = (x,y,r=-14,sc=1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${sc})"><path d="M-1.5 2 L-5 9 L-1.5 8Z M1.5 2 L5 9 L1.5 8Z" fill="#E4619A" ${ol(1.2)}/><path d="M0 0 C-3 -7 -13 -9 -13 -2 C-13 5 -5 4.5 0 0Z M0 0 C3 -7 13 -9 13 -2 C13 5 5 4.5 0 0Z" fill="#F78DB8" ${ol(1.4)}/><ellipse rx="3.3" ry="3.7" fill="#EC6EA5" ${ol(1.3)}/></g>`;
const bandaid = (x,y,r) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(.72)"><rect x="-7" y="-2.8" width="14" height="5.6" rx="2.8" fill="#F4C394" ${ol(1.1)}/><rect x="-2.2" y="-2.8" width="4.4" height="5.6" fill="#E7AC77"/><circle cx="-4.6" cy="0" r=".5" fill="#C98E5E"/><circle cx="4.6" cy="0" r=".5" fill="#C98E5E"/></g>`;
const flameAt = (x,y,s=1) => `<circle cx="${x}" cy="${y-5*s}" r="${9*s}" fill="url(#ov-glow)"/><path d="M${x} ${y-12*s} C${x+4.6*s} ${y-6.5*s} ${x+4.6*s} ${y-2.5*s} ${x} ${y} C${x-4.6*s} ${y-2.5*s} ${x-4.6*s} ${y-6.5*s} ${x} ${y-12*s}Z" fill="#FFB429"/><path d="M${x} ${y-6.5*s} C${x+1.8*s} ${y-4*s} ${x+1.8*s} ${y-2.2*s} ${x} ${y-1.2*s} C${x-1.8*s} ${y-2.2*s} ${x-1.8*s} ${y-4*s} ${x} ${y-6.5*s}Z" fill="#FFF3C2"/>`;

/** cabeça de perfil, olhando para a esquerda; origem no centro da cabeça */
function headSide(baby, mood, acc, wet){
  let h = `<g transform="rotate(22 14 -6)"><ellipse cx="22" cy="-6" rx="11" ry="5" fill="${PAL.ear}" ${ol(1.5)}/><ellipse cx="23" cy="-5.5" rx="6.2" ry="2.2" fill="${PAL.earIn}"/></g>`;
  const F = 'M14 -14 C6 -22 -12 -23 -20 -13 C-26 -5 -28 5 -22 10 C-16 15 -2 16 8 10 C16 4 18 -8 14 -14Z';
  h += `<path d="${F}" fill="${PAL.face}"/><path d="M-22 10 C-16 15 -2 16 8 10 C12 7 15 2 16 -4 C10 6 -6 12 -22 10Z" fill="${PAL.faceSh}"/><path d="${F}" fill="none" ${ol()}/>`;
  h += wool(3,-14,16.5,10,10,baby?11:21,wet,[[6,-16,2.6]]);
  h += eyes([[-12,-3]], baby, mood);
  h += `<ellipse cx="-4" cy="5" rx="5" ry="3" fill="${PAL.blush}" opacity=".55"/>`;
  h += `<path d="M-25.4 -1 q1.2 1.3 2.4 .7" fill="none" ${ol(1.4)}/>`;
  h += mood==='o' ? `<ellipse cx="-19" cy="7" rx="2" ry="2.5" fill="#7A4E3A" ${ol(1)}/>` : `<path d="M-22 6 q3.4 2.8 7 0" fill="none" ${ol(1.5)}/>`;
  if (acc.includes('bandaid')) h += bandaid(-2,8.5,12);
  if (acc.includes('goggles')) h += `<path d="M-6 -4 L13 -7" stroke="#5B6B8A" stroke-width="2.2"/><path d="M-19 -3.5 H-23" stroke="#5B6B8A" stroke-width="2.2"/><rect x="-19" y="-8" width="13" height="10" rx="4.5" fill="#CDEBFF" fill-opacity=".5" stroke="#5B6B8A" stroke-width="1.6"/>`;
  if (baby) h += bow(-5,-23,-14);
  if (acc.includes('kippah')) h += `<g transform="translate(13 -20) rotate(38)"><path d="M-12 2 Q0 -11 12 2 Z" fill="#3E67C9" ${ol(1.4)}/><path d="M-7 -1.5 q7 -4.4 14 0" stroke="#9DB8F2" stroke-width="1.3" fill="none" stroke-linecap="round"/></g>`;
  if (acc.includes('icepack')) h += `<g transform="translate(5 -24) rotate(-12)"><path d="M-12 0 C-12 -9 12 -9 12 0 C12 5 -12 5 -12 0Z" fill="#9DC3F2" ${ol(1.4)}/><path d="M-4 -6 q4 -3 8 0" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M-3 -8 l3 -4 l3 4" fill="#7EA8E6" ${ol(1)}/></g>`;
  if (acc.includes('thermo')) h += `<g transform="translate(-18 7) rotate(168)"><rect x="0" y="-1.8" width="18" height="3.6" rx="1.8" fill="#EEF1F7" ${ol(.9)}/><circle cx="18" cy="0" r="2.6" fill="#FF5C7A" ${ol(.9)}/></g>`;
  if (acc.includes('match')) h += `<path d="M-17 7 L-44 -8" stroke="#E2B776" stroke-width="2.4" stroke-linecap="round"/><path d="M-17 7 L-44 -8" stroke="${OL}" stroke-width=".6" opacity=".4"/><circle cx="-44.5" cy="-8.3" r="2.3" fill="#C4421A"/>${flameAt(-45,-10.4,.9)}`;
  if (acc.includes('foam')) h += [[-6,-25,5.5],[4,-28,6.5],[13,-24,5]].map(([a,b,r],i)=>wool(a,b,r,r,6,30+i,true)).join('');
  return h;
}
/** cabeça de frente; origem no centro do rosto */
function headFront(baby, mood, acc, wet){
  let h = '';
  h += `<ellipse cx="-22" cy="2" rx="11" ry="5.2" transform="rotate(-24 -22 2)" fill="${PAL.ear}" ${ol(1.5)}/><ellipse cx="-23" cy="2.6" rx="6" ry="2.2" transform="rotate(-24 -22 2)" fill="${PAL.earIn}"/>`;
  h += `<ellipse cx="22" cy="2" rx="11" ry="5.2" transform="rotate(24 22 2)" fill="${PAL.ear}" ${ol(1.5)}/><ellipse cx="23" cy="2.6" rx="6" ry="2.2" transform="rotate(24 22 2)" fill="${PAL.earIn}"/>`;
  h += `<ellipse cx="0" cy="3" rx="18.5" ry="17" fill="${PAL.face}"/><path d="M-17 8 C-12 19 12 19 17 8 C12 15 -12 15 -17 8Z" fill="${PAL.faceSh}"/><ellipse cx="0" cy="3" rx="18.5" ry="17" fill="none" ${ol()}/>`;
  h += wool(0,-10,18.5,9.5,10,baby?12:22,wet,[[-6,-11,2.4],[7,-12,2.2]]);
  h += eyes([[-7.5,4],[7.5,4]], baby, mood);
  h += `<ellipse cx="-12" cy="10.5" rx="4.4" ry="2.6" fill="${PAL.blush}" opacity=".55"/><ellipse cx="12" cy="10.5" rx="4.4" ry="2.6" fill="${PAL.blush}" opacity=".55"/>`;
  h += `<path d="M-1.6 9.6 q1.6 1.4 3.2 0" fill="none" ${ol(1.3)}/>`;
  h += mood==='o' ? `<ellipse cx="0" cy="14" rx="2" ry="2.4" fill="#7A4E3A" ${ol(1)}/>` : `<path d="M-3.6 12.6 q1.8 2.2 3.6 0 q1.8 2.2 3.6 0" fill="none" ${ol(1.4)}/>`;
  if (acc.includes('bandaid')) h += bandaid(11,13.5,-18);
  if (acc.includes('goggles')) h += `<path d="M-18.5 3 H-14 M-1.5 3 H1.5 M14 3 H18.5" stroke="#5B6B8A" stroke-width="2.2"/><rect x="-14" y="-1.5" width="12.5" height="10" rx="4.5" fill="#CDEBFF" fill-opacity=".5" stroke="#5B6B8A" stroke-width="1.6"/><rect x="1.5" y="-1.5" width="12.5" height="10" rx="4.5" fill="#CDEBFF" fill-opacity=".5" stroke="#5B6B8A" stroke-width="1.6"/><path d="M-11 1 l3 -1.6 M4.5 1 l3 -1.6" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>`;
  if (baby) h += bow(-11,-17,-18);
  if (acc.includes('kippah')) h += `<g transform="translate(9 -18) rotate(16)"><path d="M-12 2 Q0 -10 12 2 Z" fill="#3E67C9" ${ol(1.4)}/><path d="M-7 -1.2 q7 -4 14 0" stroke="#9DB8F2" stroke-width="1.3" fill="none" stroke-linecap="round"/></g>`;
  if (acc.includes('foam')) h += [[-9,-19,5.5],[2,-22,6.5],[12,-18,5]].map(([a,b,r],i)=>wool(a,b,r,r,6,40+i,true)).join('');
  if (acc.includes('thermo')) h += `<g transform="translate(2 13) rotate(20)"><rect x="0" y="-1.6" width="16" height="3.2" rx="1.6" fill="#EEF1F7" ${ol(.9)}/><circle cx="16" cy="0" r="2.4" fill="#FF5C7A" ${ol(.9)}/></g>`;
  return h;
}

/* ---------- corpos ---------- */
const leg = (x,top,len,far) => `<path d="M${x} ${top} h8.6 v${len-4.3} a4.3 4.3 0 0 1 -8.6 0z" fill="${far?PAL.legFar:PAL.leg}" ${ol(1.5)}/><path d="M${x+.8} ${top+len-5.6} h7 v1.3 a3.5 3.5 0 0 1 -7 0z" fill="${PAL.hoof}"/>`;
function coatSide(cx,cy,rx,ry){
  const L=cx-rx, R=cx+rx, T=cy-ry, H=cy+ry+2;
  const d = `M${L+6} ${T+10} C${L+10} ${T-7} ${R-10} ${T-7} ${R-2} ${T+8} C${R+4} ${cy} ${R+5} ${H-6} ${R+3} ${H+1} Q${cx} ${H+8} ${L-3} ${H+1} C${L-5} ${H-8} ${L-3} ${T+22} ${L+6} ${T+10}Z`;
  return `<path d="${d}" fill="${PAL.coat}"/><path d="M${R-6} ${T+10} C${R+2} ${cy} ${R+3} ${H-6} ${R+2} ${H+1} Q${cx+10} ${H+6} ${cx-8} ${H+5} C${cx+12} ${H-2} ${R-4} ${cy+6} ${R-6} ${T+10}Z" fill="${PAL.coatSh}"/><path d="${d}" fill="none" ${ol(1.5)}/>
    <path d="M${L+10} ${T+12} C${L+16} ${cy} ${L+15} ${H-10} ${L+13} ${H+3}" fill="none" ${ol(1.3)}/>
    <path d="M${L+6} ${T+10} L${L+19} ${T+11} L${L+11} ${T+23}Z" fill="#FFFFFF" ${ol(1.2)}/>
    <circle cx="${L+16}" cy="${cy+4}" r="1.6" fill="#9AA3B8"/><circle cx="${L+16}" cy="${cy+13}" r="1.6" fill="#9AA3B8"/>
    <path d="M${cx+8} ${cy+2} h13 v7 a3 3 0 0 1 -3 3 h-7 a3 3 0 0 1 -3 -3z" fill="#EEF2F8" ${ol(1.1)}/><rect x="${cx+11}" y="${cy-3.5}" width="2.4" height="6.5" rx="1.2" fill="#F06A9F" ${ol(.8)}/><rect x="${cx+15.5}" y="${cy-2.5}" width="2.4" height="5.5" rx="1.2" fill="#5B8FE0" ${ol(.8)}/>
    <rect x="${cx+20}" y="${T+7}" width="11" height="7" rx="1.8" fill="#FFC2D6" ${ol(1)}/>`;
}
function coatFront(cx,cy,rx,ry){
  const T=cy-ry, H=cy+ry;
  const d = `M${cx-rx*.62} ${T+4} C${cx-rx*1.05} ${T+10} ${cx-rx*1.12} ${H-8} ${cx-rx*1.08} ${H+2} Q${cx} ${H+7} ${cx+rx*1.08} ${H+2} C${cx+rx*1.12} ${H-8} ${cx+rx*1.05} ${T+10} ${cx+rx*.62} ${T+4} Q${cx} ${T-4} ${cx-rx*.62} ${T+4}Z`;
  return `<path d="${d}" fill="${PAL.coat}"/><path d="M${cx+rx*.5} ${T+8} C${cx+rx*1.0} ${T+16} ${cx+rx*1.05} ${H-8} ${cx+rx*1.02} ${H+2} Q${cx+rx*.6} ${H+5} ${cx+rx*.3} ${H+5} C${cx+rx*.8} ${H-6} ${cx+rx*.7} ${T+16} ${cx+rx*.5} ${T+8}Z" fill="${PAL.coatSh}"/><path d="${d}" fill="none" ${ol(1.5)}/>
    <path d="M${cx-rx*.55} ${T+5} L${cx-3} ${T+20} L${cx-rx*.62} ${T+16}Z M${cx+rx*.55} ${T+5} L${cx+3} ${T+20} L${cx+rx*.62} ${T+16}Z" fill="#FFFFFF" ${ol(1.2)}/>
    <path d="M${cx} ${T+20} V${H+5}" ${ol(1.2)}/><circle cx="${cx-3}" cy="${T+27}" r="1.5" fill="#9AA3B8"/><circle cx="${cx-3}" cy="${T+35}" r="1.5" fill="#9AA3B8"/>
    <path d="M${cx+5} ${T+24} h10 v6 a2.5 2.5 0 0 1 -2.5 2.5 h-5 a2.5 2.5 0 0 1 -2.5 -2.5z" fill="#EEF2F8" ${ol(1)}/><rect x="${cx+7}" y="${T+19}" width="2.2" height="6" rx="1.1" fill="#F06A9F" ${ol(.7)}/><rect x="${cx+11}" y="${T+20}" width="2.2" height="5" rx="1.1" fill="#5B8FE0" ${ol(.7)}/>
    <rect x="${cx-rx*.85}" y="${T+18}" width="10" height="6.5" rx="1.6" fill="#FFC2D6" ${ol(.9)}/>`;
}

/** Ovelha. pose: 'side' (perfil) | 'turn' (corpo de lado, rosto de frente) | 'front' | 'sit' | 'lie'.
 *  x,y = ponto no chão sob a ovelha. Olha para a esquerda; flip olha para a direita.
 *  who 'ela' = ovelha bebê (lacinho rosa, olhos verdes); 'ele' = maior, olhos castanhos. */
function sheep({x=0,y=0,s=1,who='ela',pose='side',mood='happy',wet=false,acc=[],flip=false,cls='bob',body=true}={}){
  if (mood==='happy-closed') mood='closed';
  const baby = who==='ela', coat = acc.includes('coat') && baby;
  let g = '';
  const Hs = baby ? 1.2 : 1;
  if (!body){ g = `<g transform="scale(${Hs})">${headFront(baby,mood,acc,wet)}</g>`; }
  else if (pose==='side' || pose==='turn'){
    const B = baby ? {cx:6,cy:-30,rx:33,ry:23,lt:-17,fl:[-20,-7],bl:[16,27],tail:[40,-38]} : {cx:8,cy:-36,rx:42,ry:27,lt:-19,fl:[-26,-12],bl:[22,36],tail:[52,-44]};
    const len = -B.lt;
    g += `<ellipse cx="${B.cx}" cy="1" rx="${B.rx+4}" ry="4" fill="#3A3226" opacity=".12"/>`;
    g += leg(B.bl[0]+4,B.lt-2,len+1,true) + leg(B.fl[0]+4,B.lt-2,len+1,true) + leg(B.bl[1],B.lt,len,false) + leg(B.fl[1],B.lt,len,false);
    g += wool(B.tail[0],B.tail[1],7,7,6,5,wet);
    if (coat) g += coatSide(B.cx,B.cy,B.rx,B.ry) + wool(B.cx-B.rx+8,B.cy-B.ry+8,8,7,7,9,wet);
    else g += wool(B.cx,B.cy,B.rx,B.ry,15,baby?3:4,wet,[[B.cx-6,B.cy-6,3.2],[B.cx+16,B.cy+1,3],[B.cx+2,B.cy+10,2.8],[B.cx+24,B.cy-10,2.6]]);
    if (pose==='side') g += `<g transform="translate(${baby?-27:-35} ${baby?-42:-50}) scale(${Hs})">${headSide(baby,mood,acc,wet)}</g>`;
    else g += `<g transform="translate(${baby?-26:-33} ${baby?-46:-56}) scale(${Hs})">${headFront(baby,mood,acc,wet)}</g>`;
  } else if (pose==='front' || pose==='sit'){
    const sit = pose==='sit';
    const B = baby ? {cy:sit?-22:-28,rx:sit?27:26,ry:sit?22:22} : {cy:sit?-26:-34,rx:sit?32:31,ry:sit?26:26};
    g += `<ellipse cx="0" cy="1" rx="${B.rx+6}" ry="4" fill="#3A3226" opacity=".12"/>`;
    if (sit){
      g += `<ellipse cx="${-B.rx+2}" cy="-5" rx="9" ry="6" fill="${PAL.leg}" ${ol(1.5)}/><path d="M${-B.rx-6} -6 a5 5 0 0 0 4 6 l3 -1 l-2 -8z" fill="${PAL.hoof}"/>`;
      g += `<ellipse cx="${B.rx-2}" cy="-5" rx="9" ry="6" fill="${PAL.leg}" ${ol(1.5)}/><path d="M${B.rx+6} -6 a5 5 0 0 1 -4 6 l-3 -1 l2 -8z" fill="${PAL.hoof}"/>`;
    } else g += leg(-B.rx+6,-16,16,true) + leg(B.rx-14,-16,16,true);
    if (coat) g += coatFront(0,B.cy,B.rx,B.ry);
    else g += wool(0,B.cy,B.rx,B.ry,14,baby?6:7,wet,[[-10,B.cy+2,3],[9,B.cy+8,2.8],[14,B.cy-6,2.4]]);
    const lt = sit ? -12 : -18;
    g += leg(-12,lt,-lt,false) + leg(3.4,lt,-lt,false);
    if (coat) g += `<path d="M-13.5 ${lt-2} h11.6 v7 h-11.6z M1.9 ${lt-2} h11.6 v7 h-11.6z" fill="${PAL.coat}" ${ol(1.3)}/>`;
    g += `<g transform="translate(0 ${B.cy-B.ry-8}) scale(${Hs})">${headFront(baby,mood,acc,wet)}</g>`;
  } else if (pose==='lie'){
    const B = baby ? {cx:6,cy:-17,rx:36,ry:17} : {cx:8,cy:-20,rx:44,ry:20};
    g += `<ellipse cx="${B.cx}" cy="1" rx="${B.rx+4}" ry="4" fill="#3A3226" opacity=".12"/>`;
    // pernas dobradas: as da frente esticadas para a frente, a de trás encolhida
    const fore = (x0,len,yy,far) => `<rect x="${x0-len}" y="${yy}" width="${len}" height="7.6" rx="3.8" fill="${far?PAL.legFar:PAL.leg}" ${ol(1.4)}/><path d="M${x0-len+3.8} ${yy} a3.8 3.8 0 0 0 0 7.6 h2.6 v-7.6z" fill="${PAL.hoof}"/>`;
    const hind = (cx,rx,far) => `<ellipse cx="${cx}" cy="-5" rx="${rx}" ry="5.6" fill="${far?PAL.legFar:PAL.leg}" ${ol(1.4)}/><path d="M${cx+rx-3.4} -10.2 a5.2 5.2 0 0 1 0 10.4 h-1.6 v-10.4z" fill="${PAL.hoof}"/>`;
    g += fore(B.cx-B.rx*.3,B.rx*.6,-11,true) + hind(B.cx+B.rx*.58,B.rx*.26,true);
    g += wool(B.cx+B.rx-2,B.cy-6,6.5,6.5,6,5,wet);
    g += wool(B.cx,B.cy,B.rx,B.ry,15,baby?8:9,wet,[[B.cx-4,B.cy-4,3],[B.cx+16,B.cy+2,2.8]]);
    g += fore(B.cx-B.rx*.15,B.rx*.72,-8,false) + hind(B.cx+B.rx*.44,B.rx*.26,false);
    g += `<g transform="translate(${B.cx-B.rx-2} ${B.cy-10}) rotate(-6) scale(${Hs})">${headSide(baby,mood,acc,wet)}</g>`;
  }
  return `<g transform="translate(${x} ${y}) scale(${flip?-s:s} ${s})"><g class="${cls}" style="transform-box:fill-box;transform-origin:50% 100%">${g}</g></g>`;
}

/* ---------- elementos de cenário ---------- */
const O = (w=1.5) => ol(w);
const heart = (x,y,s=1,c='#FF7FA3') => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 6 C-10 -2 -8 -10 -3 -10 C-1 -10 0 -8 0 -7 C0 -8 1 -10 3 -10 C8 -10 10 -2 0 6Z" fill="${c}" ${O(1.2/s)}/>`;
const sparkle = (x,y,s=1,c='#FFD98A') => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -8 Q1 -1 8 0 Q1 1 0 8 Q-1 1 -8 0 Q-1 -1 0 -8Z" fill="${c}"/>`;
const bubble = (x,y,r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,.5)" stroke="#8FBFE0" stroke-width="1"/><path d="M${x-r*.5} ${y-r*.1} a${r*.55} ${r*.55} 0 0 1 ${r*.4} ${-r*.4}" stroke="#fff" stroke-width="${Math.max(.9,r*.2)}" fill="none" stroke-linecap="round"/>`;
const cloud = (x,y,s=1,c='#FFFFFF') => `<path transform="translate(${x} ${y}) scale(${s})" d="${cloudPath(0,0,30,11,8,.62)}" fill="${c}" ${O(1.3/s)}/>`;
const R = (x,y,w,h,f,r=2,w2=1.5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" ${O(w2)}/>`;
const T = (x,y,t,sz,c,o={}) => `<text x="${x}" y="${y}" font-family="${o.f||'Grandstander, sans-serif'}" font-size="${sz}" font-weight="${o.w||800}" fill="${c}" text-anchor="${o.a||'middle'}"${o.r?` transform="rotate(${o.r} ${x} ${y})"`:''}>${t}</text>`;
const COL = ['#F59AB9','#8FD3B6','#FFD27A','#9DC3F2','#C7B2F0','#FFB38A','#F7E39A','#B8E0A0'];
/** fileira de produtos de mercado/farmácia em cima de uma prateleira (y = topo da prateleira) */
function goods(x0,x1,y,seed,kind='market'){
  SEED = seed*131+7; let x = x0, out = '';
  while (x < x1-8){
    const t = Math.floor(rnd()*(kind==='market'?6:4)), c = COL[Math.floor(rnd()*COL.length)], c2 = COL[Math.floor(rnd()*COL.length)];
    let w = 0;
    if (t===0){ w=13; const h=18+Math.round(rnd()*6); out += R(x,y-h,w,h,c,1.5,1.2)+`<rect x="${x+2.5}" y="${y-h+5}" width="8" height="6" rx="1" fill="#fff" opacity=".85"/><circle cx="${x+6.5}" cy="${y-h+8}" r="1.8" fill="${c2}"/>`; }
    else if (t===1){ w=9; out += R(x,y-12,w,12,c,2,1.2)+`<rect x="${x}" y="${y-8.5}" width="${w}" height="4.5" fill="#fff" opacity=".8"/>`; }
    else if (t===2){ w=8; out += `<path d="M${x+2.5} ${y-21} h3 v4 l2.5 3 v14 h-8 v-14 l2.5 -3z" fill="${c}" ${O(1.2)}/><rect x="${x+2.5}" y="${y-23}" width="3" height="2.4" fill="#fff" ${O(.8)}/>`; }
    else if (t===3){ w=11; out += R(x,y-13,w,13,c,3,1.2)+`<rect x="${x-.5}" y="${y-16}" width="12" height="4" rx="1.5" fill="${c2}" ${O(1)}/>`; }
    else if (t===4){ w=12; out += `<path d="M${x} ${y} v-14 l3 -5 h6 l3 5 v14z" fill="#FFFFFF" ${O(1.2)}/><path d="M${x} ${y-14} h12" stroke="${OL}" stroke-width=".8"/><rect x="${x+2}" y="${y-11}" width="8" height="6" rx="1" fill="${c}"/>`; }
    else { w=16; out += `<path d="M${x+1} ${y} q-2 -9 1 -16 q7 -3 13 0 q3 7 1 16z" fill="${c}" ${O(1.2)}/><path d="M${x+4} ${y-9} h8" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`; }
    x += w + 2 + Math.round(rnd()*3);
  }
  return out;
}
const priceTags = (x0,x1,y,step=26) => { let o=''; for (let x=x0+6;x<x1-8;x+=step) o += `<rect x="${x}" y="${y+1}" width="9" height="5" rx="1" fill="#FFFFFF" ${O(.8)}/><path d="M${x+2} ${y+3.6} h5" stroke="#E2557F" stroke-width="1.2"/>`; return o; };
const flame = flameAt;
const trefoil = (x,y,s=1) => { const sec = a => { const r=Math.PI/180, a1=(a-30)*r, a2=(a+30)*r, P=(Rr,t)=>`${(Rr*Math.cos(t)).toFixed(2)} ${(Rr*Math.sin(t)).toFixed(2)}`;
  return `<path d="M${P(3.6,a1)} L${P(10,a1)} A10 10 0 0 1 ${P(10,a2)} L${P(3.6,a2)} A3.6 3.6 0 0 0 ${P(3.6,a1)}Z" fill="#33304A"/>`; };
  return `<g transform="translate(${x} ${y}) scale(${s})"><circle r="13" fill="#FFD449" ${O(1.4/s)}/>${[-90,30,150].map(sec).join('')}<circle r="2.4" fill="#33304A"/></g>`; };
const bolt = (pts,glow='#CDB8FF') => `<polyline points="${pts}" fill="none" stroke="${glow}" stroke-width="5" stroke-linejoin="round" opacity=".45"/><polyline points="${pts}" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round"/>`;
const SCN = (bg, inner, label, over='') => `<svg viewBox="0 0 320 200" role="img" aria-label="${label}"><rect width="100%" height="100%" fill="${bg}"/>${inner}${over}</svg>`;

const SCENES = {
  mercado: () => SCN('#FBEDDD', `
    <rect width="320" height="18" fill="#F4D3B4"/>
    <path d="M128 0 L132 10 M188 0 L184 10" stroke="${OL}" stroke-width="1.2"/>${R(118,9,84,20,'#F27BA6',6)}
    ${R(14,38,212,98,'#F5DEC2',4,1.3)}
    ${[84,132].map(y=>R(14,y,212,5,'#D7A877',1.5,1.2)).join('')}
    ${(()=>{const row=(y,items)=>items.map(([x,k,c])=>k==='box'?R(x,y-24,16,24,c,2,1.1)+`<rect x="${x+3}" y="${y-18}" width="10" height="7" rx="1.5" fill="#FFFFFF" opacity=".85"/>`
        :k==='can'?R(x,y-14,11,14,c,2,1.1)+`<rect x="${x}" y="${y-10}" width="11" height="5" fill="#FFFFFF" opacity=".8"/>`
        :k==='bottle'?`<path d="M${x+3} ${y-26} h4 v5 l3 4 v17 h-10 v-17 l3 -4z" fill="${c}" ${O(1.1)}/>`
        :`<path d="M${x} ${y} v-16 l3 -5 h8 l3 5 v16z" fill="#FFFFFF" ${O(1.1)}/><rect x="${x+2}" y="${y-12}" width="10" height="7" rx="1" fill="${c}"/>`).join('');
      return row(84,[[22,'box','#F7A8C4'],[44,'can','#9DC3F2'],[61,'can','#8FD3B6'],[80,'box','#FFD27A'],[102,'bottle','#9ED9BE'],[120,'carton','#9DC3F2'],[142,'box','#C7B2F0'],[164,'can','#FFB38A'],[181,'bottle','#F7A8C4'],[199,'carton','#FFD27A']])
        +row(132,[[22,'carton','#F7A8C4'],[42,'box','#8FD3B6'],[64,'bottle','#FFB38A'],[82,'can','#C7B2F0'],[99,'box','#9DC3F2'],[121,'can','#FFD27A'],[138,'bottle','#9DC3F2'],[156,'box','#F7A8C4'],[178,'carton','#8FD3B6'],[198,'can','#F7A8C4']]);})()}
    ${R(244,40,68,16,'#7DBF6C',4)}
    ${[[100,'#F5655F'],[128,'#FFA53D']].map(([y,c])=>`${Array.from({length:6},(_,k)=>`<circle cx="${252+k*10.4}" cy="${y-4}" r="5" fill="${c}" ${O(1)}/>`).join('')}${R(244,y,68,18,'#D9A066',2,1.2)}<path d="M244 ${y+9} h68" stroke="#B57E46" stroke-width="1"/>`).join('')}
    <rect y="146" width="320" height="54" fill="#EEDCC2"/><path d="M0 146 H320" ${O(1.2)}/>${[160,178].map(y=>`<path d="M0 ${y} H320" stroke="#E2CDAE" stroke-width="1"/>`).join('')}${[40,100,160,220,280].map(x=>`<path d="M${x} 146 L${x-10} 200" stroke="#E2CDAE" stroke-width="1"/>`).join('')}
    ${R(88,116,14,42,'#FFFFFF',2,1.2)}<path d="M88 116 l7 -7 l7 7" fill="#FFFFFF" ${O(1.2)}/><rect x="90" y="128" width="10" height="9" rx="1.5" fill="#9DC3F2"/>
    ${R(104,108,18,50,'#FFD27A',2,1.2)}<rect x="107" y="116" width="12" height="10" rx="1.5" fill="#F59AB9"/>
    <g transform="translate(150 158) rotate(-22)"><path d="M-5 -2 C-5 -40 5 -40 5 -2Z" fill="#F4CF92" ${O(1.1)}/>${[-30,-20,-10].map(yy=>`<path d="M-2.4 ${yy} l4.8 -3.4" stroke="#FFF1D4" stroke-width="1.8" stroke-linecap="round"/>`).join('')}</g>
    ${R(158,122,12,36,'#FFB38A',2,1.1)}<path d="M160 122 v-5 h8 v5" fill="#FFFFFF" ${O(1)}/>
    <path d="${cloudPath(98,114,11,8,7,.6)}" fill="#A8D97F" ${O(1.2)}/>
    <circle cx="126" cy="112" r="7" fill="#F5655F" ${O(1.1)}/><path d="M126 105 q2 -3 4 -3" stroke="#6B4A2E" stroke-width="1.4" fill="none"/>
    <g><rect x="172" y="110" width="34" height="48" rx="3" fill="#CFE8FA" fill-opacity=".9" ${O(1.2)}/>${[178,187,196].map(x=>`<rect x="${x}" y="106" width="6" height="6" rx="1.5" fill="#2E7FD1" ${O(.8)}/><rect x="${x-1}" y="112" width="8" height="44" rx="3" fill="#9FD0F5" fill-opacity=".7"/>`).join('')}<rect x="172" y="126" width="34" height="9" fill="#2E7FD1"/><text x="189" y="133" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="6" fill="#FFFFFF">ÁGUA</text></g>
    ${sheep({who:'ela',pose:'turn',x:189,y:140,s:.5,flip:true})}
    <path d="M82 116 H212 L201 158 H93 Z" fill="rgba(255,255,255,.18)"/>
    ${[108,130,152,174,194].map(x=>`<path d="M${x+2} 118 L${x} 157" stroke="#A3AEC2" stroke-width="1.3"/>`).join('')}<path d="M88 137 H206" stroke="#A3AEC2" stroke-width="1.3"/>
    <path d="M82 116 H212 L201 158 H93 Z" fill="none" stroke="#7B879D" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M78 116 H216" stroke="#7B879D" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M212 116 L228 110" stroke="#7B879D" stroke-width="3" stroke-linecap="round"/>${R(224,104,16,8,'#F07AA8',4,1.2)}
    <path d="M93 158 L90 168 H204" fill="none" stroke="#7B879D" stroke-width="2.6" stroke-linecap="round"/>
    ${[100,196].map(x=>`<circle cx="${x}" cy="175" r="6" fill="#4E5368" ${O(1.2)}/><circle cx="${x}" cy="175" r="2.2" fill="#B9BFD0"/>`).join('')}
    ${sheep({who:'ele',pose:'turn',x:268,y:183,s:.8})}
  `,'Corredor do mercado: a ovelha bebê sentada no carrinho cheio de compras e a outra empurrando', `${T(160,23.5,'MERCADO',11.5,'#FFFFFF')}${T(278,51.6,'HORTIFRÚTI',8,'#FFFFFF')}`),

  banho: () => SCN('#E8F2FB', `
    <rect y="70" width="320" height="82" fill="#D3E8F7"/>${Array.from({length:21},(_,i)=>`<path d="M${i*16} 70 V152" stroke="#BDD9EE" stroke-width="1"/>`).join('')}${[86,102,118,134].map(y=>`<path d="M0 ${y} H320" stroke="#BDD9EE" stroke-width="1"/>`).join('')}<path d="M0 70 H320" ${O(1.2)}/>
    ${R(24,12,52,42,'#FFFFFF',4)}<rect x="29" y="17" width="42" height="32" rx="2" fill="#CFE8FF"/>${cloud(46,34,.45)}<path d="M50 17 V49 M29 33 H71" ${O(1.2)}/>
    <path d="M246 40 H306" stroke="#B9C2D0" stroke-width="3" stroke-linecap="round"/>
    <path d="M252 40 h22 v34 q-11 4 -22 0z" fill="#F7A8C4" ${O(1.3)}/><path d="M252 66 h22" stroke="#FFFFFF" stroke-width="2"/>
    <path d="M280 40 h22 v30 q-11 4 -22 0z" fill="#9DC3F2" ${O(1.3)}/><path d="M280 62 h22" stroke="#FFFFFF" stroke-width="2"/>
    ${R(16,92,62,5,'#E9D8C4',2)}${R(22,74,9,18,'#F59AB9',3,1.2)}${R(34,78,9,14,'#8FD3B6',3,1.2)}${R(46,72,8,20,'#FFD27A',3,1.2)}<path d="M62 92 q-2 -10 4 -16 M66 92 q3 -8 8 -11" stroke="#5FA84A" stroke-width="2" fill="none" stroke-linecap="round"/>${R(58,84,14,8,'#E9B266',2,1.1)}
    <rect y="152" width="320" height="48" fill="#C7DDEE"/>${[0,40,80,120,160,200,240,280].map(x=>`<path d="M${x} 152 L${x-14} 200" stroke="#B4CDE2" stroke-width="1"/>`).join('')}<path d="M0 152 H320" ${O(1.2)}/>
    ${sheep({who:'ela',pose:'turn',x:126,y:118,s:.66,wet:true,acc:['foam'],mood:'closed',flip:true})}
    ${sheep({who:'ele',pose:'side',x:214,y:122,s:.74,wet:true,acc:['foam']})}
    <path d="M66 120 H274 C274 152 252 168 222 168 H118 C88 168 66 152 66 120Z" fill="#FFFFFF" ${O()}/><path d="M74 132 C80 154 96 162 120 164 H220 C244 162 262 152 268 134 C254 150 236 156 214 157 H124 C100 156 84 148 74 132Z" fill="#E3EEF8"/>
    ${R(58,112,224,11,'#FFFFFF',5.5)}
    ${[100,240].map(x=>`<path d="M${x-7} 166 q7 14 14 0z" fill="#F1C35E" ${O(1.2)}/>`).join('')}
    ${[[72,110,9],[90,106,10],[108,111,7],[160,110,8],[176,107,9],[256,108,9],[272,110,8]].map(([a,b,r],i)=>wool(a,b,r,r*.8,7,50+i,true)).join('')}
    <g transform="translate(240 98)"><ellipse cx="0" cy="8" rx="13" ry="8" fill="#FFD43B" ${O(1.2)}/><circle cx="-7" cy="-2" r="7.5" fill="#FFD43B" ${O(1.2)}/><path d="M-14 -1 q-6 1 -7 3 q4 2 7 1z" fill="#FF9030" ${O(1)}/><circle cx="-9" cy="-4" r="1.5" fill="#33304A"/></g>
    ${bubble(150,62,8)}${bubble(172,42,5)}${bubble(206,58,6)}${bubble(120,40,4)}${bubble(290,96,5)}
    <ellipse cx="160" cy="189" rx="48" ry="3" fill="#3A3226" opacity=".12"/>
    <path d="${cloudPath(160,183,46,8,20,.62)}" fill="#F7A8C4" ${O(1.2)}/><rect x="122" y="178" width="76" height="10" rx="5" fill="#FBC3D7"/>
    ${[136,148,160,172,184].map((x,k)=>heart(x,183.6,.32,k%2?'#FFFFFF':'#F59AB9')).join('')}
  `,'Banheiro: as ovelhas tomando banho de espuma com patinho de borracha, toalhas rosa e azul'),

  farmacia: () => SCN('#EAF6EF', `
    ${R(132,8,28,28,'#4DB386',7)}<path d="M142 13 h8 v6 h6 v8 h-6 v6 h-8 v-6 h-6 v-8 h6z" fill="#FFFFFF"/>
    ${R(10,44,146,98,'#FFFFFF',3)}${[76,108,140].map(y=>R(10,y,146,5,'#B8DCCB',1.5)+priceTags(10,156,y,30)).join('')}${goods(15,152,76,11,'ph')}${goods(15,152,108,12,'ph')}${goods(15,152,140,13,'ph')}
    ${R(14,47,52,10,'#8FD3B6',3,1)}
    ${R(166,44,144,98,'#FFFFFF',3)}${[76,108,140].map(y=>R(166,y,144,5,'#B8DCCB',1.5)).join('')}
    ${goods(170,232,76,14,'ph')}${goods(170,306,108,15,'ph')}${goods(170,306,140,16,'ph')}
    ${goods(236,270,76,17,'ph')}
    ${Array.from({length:3},(_,i)=>`<g transform="translate(${272+i*11} 60)"><rect width="9.5" height="16" rx="1" fill="#F6D63C" ${O(.9)}/><path d="M0 0 h9.5 v6.4 L0 8.8z" fill="#4A4C52"/><text x="4.75" y="4.6" text-anchor="middle" font-family="Nunito, sans-serif" font-style="italic" font-weight="800" font-size="2.7" fill="#FFFFFF">Jontex</text><rect x="2" y="11.5" width="5.5" height="1.2" rx=".6" fill="#4A4C52"/></g>`).join('')}
    <rect y="142" width="320" height="58" fill="#D6ECDF"/>${[150,164,182].map(y=>`<path d="M0 ${y} H320" stroke="#C2E0CF" stroke-width="1"/>`).join('')}<path d="M0 142 H320" ${O(1.2)}/>
    ${R(8,132,104,50,'#FFFFFF',3)}${R(8,132,104,7,'#4DB386',2)}${R(16,146,40,28,'#F3FAF6',2,1.2)}${R(62,146,42,28,'#F3FAF6',2,1.2)}<circle cx="52" cy="160" r="1.6" fill="${OL}"/><circle cx="66" cy="160" r="1.6" fill="${OL}"/><path d="M33 152 h6 v4 h4 v6 h-4 v4 h-6 v-4 h-4 v-6 h4z" fill="#8FD3B6"/>${R(18,116,26,16,'#C7B2F0',2)}<rect x="22" y="119" width="18" height="6" rx="1" fill="#2E3A52"/>${R(54,122,14,10,'#FFB27A',2,1.1)}<rect x="53" y="118" width="16" height="5" rx="2" fill="#FFFFFF" ${O(1)}/>${R(76,112,24,20,'#F2E3CF',2,1.1)}<path d="M80 118 h16 M80 123 h12" stroke="${OL}" stroke-width=".8"/>
    ${sheep({who:'ela',pose:'front',x:150,y:186,s:.62,acc:['bandaid']})}
    ${sheep({who:'ele',pose:'side',x:248,y:188,s:.78,mood:'o'})}
  ${T(186,140,'atchim!',9,'#6E6890',{f:'Caveat, cursive',w:600})}`,'Farmácia com prateleiras, balcão e, no fundo, uma seção de camisinhas douradas; a ovelha bebê com curativo e a outra com termômetro', `${T(196,28,'FARMÁCIA',11,'#3E9C73')}${T(40,54.6,'VITAMINAS',6,'#FFFFFF')}`),

  limpeza: () => SCN('#F1ECFB', `
    <path d="M10 14 H204" stroke="#B9AFCF" stroke-width="1.6" stroke-linecap="round"/><path d="M10 10 v8 M204 10 v8" stroke="#9E92B8" stroke-width="3" stroke-linecap="round"/>
    ${(()=>{const pin=x=>`<rect x="${x-1.2}" y="-3.4" width="2.4" height="6" rx="1" fill="#E9B266" ${O(.6)}/>`;
      const items=[
        [26,`<path d="M0 0 h7 v11 q0 3 3 3 h3 q3 0 3 3 q0 3 -3 3 h-7 q-6 0 -6 -6z" fill="#F7A8C4" ${O(1)}/><path d="M0 2.6 h7" stroke="#E9789F" stroke-width="1.8"/>${pin(3.5)}`],
        [54,`<path d="M0 0 h6 q2.4 3 4.8 0 h6 l5 5 l-3 3 l-2.6 -2 v13 h-14.4 v-13 l-2.6 2 l-3 -3z" fill="#9DC3F2" ${O(1)}/>${heart(8.4,10,.35,'#FFFFFF')}${pin(2)}${pin(14.8)}`],
        [90,`<path d="M4 0 h8 l2 5 l6 14 h-24 l6 -14z" fill="#C7B2F0" ${O(1)}/><path d="M2 12 h12" stroke="#FFFFFF" stroke-width="1.2" stroke-dasharray="2 1.6"/>${pin(5)}${pin(11)}`],
        [124,`<path d="M0 0 h16 v4 l-2 11 h-5 l-1 -7 l-1 7 h-5 l-2 -11z" fill="#FFD27A" ${O(1)}/>${pin(2.5)}${pin(13.5)}`],
        [156,`<rect width="14" height="18" rx="1.5" fill="#FFFFFF" ${O(1)}/><path d="M0 12 h14 M0 15 h14" stroke="#8FD3B6" stroke-width="1.6"/>${pin(3)}${pin(11)}`],
        [182,`<path d="M0 0 h7 v11 q0 3 3 3 h3 q3 0 3 3 q0 3 -3 3 h-7 q-6 0 -6 -6z" fill="#9DC3F2" ${O(1)}/><path d="M0 2.6 h7" stroke="#6F9FDF" stroke-width="1.8"/>${pin(3.5)}`]];
      return items.map(([x,g])=>`<g transform="translate(${x} 14)">${g}</g>`).join('');})()}
    ${R(238,18,64,62,'#FFFFFF',3)}<rect x="243" y="23" width="54" height="52" fill="#DCEFFF"/>${cloud(262,44,.4)}<path d="M270 23 V75 M243 49 H297" ${O(1.2)}/>
    <path d="M232 14 q8 30 2 68 h12 q4 -40 -2 -68z M308 14 q-8 30 -2 68 h-12 q-4 -40 2 -68z" fill="#F7A8C4" ${O(1.2)}/><path d="M228 14 H312" stroke="${OL}" stroke-width="2.4" stroke-linecap="round"/>
    <rect y="148" width="320" height="52" fill="#E8D7C3"/>${[156,170,188].map(y=>`<path d="M0 ${y} H320" stroke="#D6C1A8" stroke-width="1.2"/>`).join('')}${[40,110,190,260].map((x,i)=>`<path d="M${x+(i%2)*20} 148 v8 M${x+30} 156 v14 M${x+6} 170 v18" stroke="#D6C1A8" stroke-width="1.2"/>`).join('')}<path d="M0 148 H320" ${O(1.2)}/>
    ${R(10,72,74,5,'#D9C6EE',2)}
    <g transform="translate(14 46)"><path d="M2 26 V10 Q2 6 6 6 H9 L12 1 Q14 -1 15 1 L14 6 Q16 7 16 10 V26Z" fill="#2E7FD1" ${O(1)}/><rect x="3.5" y="13" width="11" height="8" rx="1" fill="#FFFFFF"/><text x="9" y="19" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="3.6" fill="#2E7FD1">Pato</text></g>
    <g transform="translate(33 50)"><rect x="1" y="4" width="12" height="18" rx="3" fill="#7DC36B" fill-opacity=".85" ${O(1)}/><rect x="4" y="0" width="6" height="5" rx="1" fill="#2F8A3B" ${O(.8)}/><rect x="2.5" y="10" width="9" height="6" rx="1" fill="#FFFFFF"/><text x="7" y="14.6" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="3.4" fill="#2F8A3B">Ypê</text></g>
    <g transform="translate(49 44)"><path d="M2 28 V8 Q2 4 6 4 H12 Q16 4 16 8 V28Z" fill="#7FB8F0" ${O(1)}/><path d="M12 8 q5 0 5 5 v4 q0 3 -3 3" fill="none" stroke="#7A5E4C" stroke-width="1.6"/><rect x="5" y="0" width="7" height="5" rx="1" fill="#2E5FB8" ${O(.8)}/><rect x="4" y="14" width="10" height="7" rx="1" fill="#FFFFFF"/><text x="9" y="19.2" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="3" fill="#2E5FB8">Comfort</text></g>
    <g transform="translate(67 52)"><rect x="0" y="0" width="15" height="20" rx="1.5" fill="#E8453F" ${O(1)}/><circle cx="7.5" cy="8.6" r="5" fill="#1E5FB8"/><text x="7.5" y="10" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="4" fill="#FFFFFF">Omo</text><rect x="2" y="15" width="11" height="2.4" rx="1" fill="#FFFFFF"/></g>
    ${R(14,92,66,82,'#FFFFFF',6)}${R(14,92,66,14,'#EEF0F7',4,1.2)}<circle cx="26" cy="99" r="3" fill="#F59AB9" ${O(1)}/><circle cx="38" cy="99" r="3" fill="#9DC3F2" ${O(1)}/>
    <circle cx="47" cy="140" r="21" fill="#E1E6F0" ${O(1.4)}/><circle cx="47" cy="140" r="15" fill="#BFE3F7" ${O(1.2)}/>${bubble(42,136,4)}${bubble(52,144,3)}${bubble(46,147,2)}
    <g><path d="M222 66 L206 182" stroke="#C99A62" stroke-width="5" stroke-linecap="round"/><path d="M222 66 L206 182" ${O(1)}/><path d="M192 176 h26 l6 12 h-38z" fill="#FFD27A" ${O(1.2)}/>${[196,202,208,214].map(x=>`<path d="M${x} 178 l-1 9" stroke="#E0A94A" stroke-width="1.3"/>`).join('')}</g>
    ${sheep({who:'ela',pose:'sit',x:136,y:158,s:.58,mood:'closed'})}
    <path d="M100 144 H172 L166 182 H106Z" fill="#E7C08F" ${O(1.4)}/>${[[104,144,7],[116,140,8],[128,145,6],[150,145,6],[160,140,8],[171,144,6.5]].map(([a,b,r],i)=>wool(a,b,r,r*.8,7,90+i,true)).join('')}${bubble(184,128,3)}${bubble(96,132,2.4)}${[152,160,168,176].map(y=>`<path d="M${102+(y-144)*.16} ${y} H${170-(y-144)*.16}" stroke="#C99A62" stroke-width="1.1"/>`).join('')}
    ${sheep({who:'ele',pose:'turn',x:246,y:186,s:.78})}
    <g transform="translate(292 158) scale(.85)"><path d="M0 0 h28 l-4 32 h-20z" fill="#8FD3B6" ${O(1.3)}/>${[[4,-2,6],[13,-5,7],[22,-2,6]].map(([a,b,r],i)=>wool(a,b,r,r*.85,6,70+i,true)).join('')}</g>
    ${sparkle(178,110,1)}${sparkle(98,88,.7,'#C7B2F0')}${bubble(188,92,4)}${bubble(198,76,3)}
  `,'Lavanderia: a ovelha bebê sentada no cesto de roupas e a outra ao lado da vassoura e do balde'),

  pesquisa: () => SCN('#252E4C', `
    <rect width="320" height="200" fill="#283253"/>
    <path d="M0 9 H320 M0 15 H320" stroke="#5E6A92" stroke-width="4"/><path d="M0 9 H320 M0 15 H320" ${O(1)}/>${[60,210].map(x=>`<circle cx="${x}" cy="12" r="5" fill="#C9574F" ${O(1.1)}/>`).join('')}
    <path d="M150 18 V30" stroke="${OL}" stroke-width="1.2"/><path d="M140 30 h20 l6 8 h-32z" fill="#7C87AB" ${O(1.2)}/>
    ${R(10,24,118,56,'#2F4A42',3,1.6)}<rect x="10" y="24" width="118" height="56" rx="3" fill="none" stroke="#B8875A" stroke-width="3"/>

    ${R(134,26,62,40,'#F5F0E6',2)}
    ${(()=>{let o='';const rows=[[0,17],[0,1,12,13,14,15,16,17],[0,1,12,13,14,15,16,17],[...Array(18).keys()],[...Array(18).keys()]];rows.forEach((r,ri)=>r.forEach(ci=>{const c=ci<2?'#F59AB9':ci>11?'#9DC3F2':'#FFD27A';o+=`<rect x="${137+ci*3.15}" y="${36+ri*5.2}" width="2.7" height="4.4" fill="${ci===17?'#C7B2F0':c}"/>`}));return o;})()}
    <path d="M214 26 l14 24 h-28z" fill="#FFD449" ${O(1.3)}/><path d="M215 32 l-5 9 h4 l-2 6 l6 -9 h-4z" fill="#33304A"/>
    <circle cx="281" cy="62" r="34" fill="url(#ov-glow-v)"/>
    ${bolt('296,56 306,40 300,34 312,22')}${bolt('281,54 278,40 285,32 280,24')}
    <circle cx="305" cy="88" r="24" fill="url(#ov-glow-v)"/>
    ${R(295,160,22,26,'#6F7AA5',4)}${R(299,96,13,64,'#8E7FE0',4,1.3)}${Array.from({length:20},(_,i)=>`<path d="M299 ${99+i*3.0} h13" stroke="#6A5BC4" stroke-width=".9"/>`).join('')}<path d="M302 99 v58" stroke="#B8AEF2" stroke-width="1.6" opacity=".7"/>
    <ellipse cx="305.5" cy="92" rx="11" ry="4.8" fill="#D4DAEA" ${O(1.3)}/>${bolt('298,88 293,80 298,76 291,70')}${bolt('311,87 316,76 310,71 315,62')}
    ${R(264,158,36,28,'#6F7AA5',4)}${R(270,74,22,84,'#8E7FE0',4,1.4)}${Array.from({length:26},(_,i)=>`<path d="M270 ${78+i*3.1} h22" stroke="#6A5BC4" stroke-width=".9"/>`).join('')}<path d="M274 78 v76" stroke="#B8AEF2" stroke-width="2" opacity=".7"/>
    <ellipse cx="281" cy="66" rx="23" ry="8.5" fill="#D4DAEA" ${O(1.4)}/><path d="M264 63 q10 -5 24 -3" stroke="#FFFFFF" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    ${R(0,126,204,9,'#E9EEF6',2)}${R(4,135,196,52,'#AFC0DA',2)}${[52,100,148].map(x=>`<path d="M${x} 135 V187" ${O(1.2)}/><rect x="${x-10}" y="158" width="6" height="2.4" rx="1.2" fill="#6F7AA5"/>`).join('')}
    <circle cx="28" cy="112" r="16" fill="url(#ov-glow-g)"/><path d="M24 96 h8 M25 96 v10 l-9 16 a3 3 0 0 0 3 4 h18 a3 3 0 0 0 3 -4 l-9 -16 v-10" fill="#FFFFFF" fill-opacity=".55" ${O(1.2)}/><path d="M17 118 h22 l3 5 a3 3 0 0 1 -3 3 h-22 a3 3 0 0 1 -3 -3z" fill="#5BE39A"/>${bubble(28,104,2)}${bubble(30,92,2.4)}${bubble(26,82,1.8)}
    <path d="M62 126 V100 M54 100 h16" stroke="#7C87AB" stroke-width="2"/><circle cx="62" cy="94" r="9" fill="#FFFFFF" fill-opacity=".6" ${O(1.2)}/><path d="M53.5 96 a9 9 0 0 0 17 0z" fill="#F07AA8"/><path d="M60 85 v-6 h4 v6" fill="none" ${O(1)}/>
    <path d="M58 126 v-6 h8 v6" fill="#7C87AB" ${O(1)}/><path d="M62 119 c3 -3 3 -6 0 -9 c-3 3 -3 6 0 9z" fill="#6FA8FF"/>
    ${R(76,112,30,6,'#C99A62',1.5,1.1)}${['#F59AB9','#FFD27A','#8FD3B6','#9DC3F2'].map((c,i)=>`<rect x="${79+i*7}" y="100" width="4.6" height="24" rx="2.3" fill="#FFFFFF" fill-opacity=".6" ${O(1)}/><rect x="${79+i*7}" y="${110+i}" width="4.6" height="${14-i}" rx="2.3" fill="${c}"/>`).join('')}
    ${R(110,98,36,28,'#3E4770',3)}<rect x="114" y="102" width="22" height="16" rx="1.5" fill="#12233A"/><path d="M116 110 q2.5 -6 5 0 t5 0 t5 0 t4 0" stroke="#7DF0B4" stroke-width="1.2" fill="none"/>${[140,140].map((x,i)=>`<circle cx="${x}" cy="${106+i*8}" r="2.2" fill="${i?'#F59AB9':'#FFD27A'}"/>`).join('')}
    ${R(152,114,18,12,'#5A6386',2)}<rect x="168" y="117" width="4" height="6" fill="#33304A"/>
    <path d="M172 120 H188" stroke="#FF4F7E" stroke-width="2.2"/><path d="M188 110 L196 126 H180Z" fill="#E6F6FF" fill-opacity=".8" ${O(1.1)}/>
    ${['#FF5C5C','#FFA53D','#FFE14D','#5BE39A','#5BB8FF','#B07CFF'].map((c,i)=>`<path d="M193 119 L240 ${104+i*5}" stroke="${c}" stroke-width="1.6" opacity=".9"/>`).join('')}
    <g transform="translate(244 40)"><circle r="3" fill="#FFE14D"/>${[0,60,-60].map(a=>`<ellipse rx="13" ry="4.6" fill="none" stroke="#9FD0FF" stroke-width="1.2" transform="rotate(${a})"/>`).join('')}</g>
    <rect y="187" width="320" height="13" fill="#1E2540"/>
    ${sheep({who:'ela',pose:'front',x:92,y:196,s:.64,acc:['coat','goggles']})}
    ${sheep({who:'ele',pose:'front',x:226,y:196,s:.72,mood:'o'})}
    ${bolt('214,140 218,132 214,128 220,120',"#FFE14D")}${bolt('238,140 234,132 240,128 236,120',"#FFE14D")}
  `,'Laboratório de pesquisa com bobina de Tesla soltando raios, equações de Maxwell na lousa, laser num prisma, frascos borbulhando; a ovelha bebê de jaleco e a outra eletrizada', `    <g fill="#F2F0E6" font-family="Caveat, cursive" font-size="10.5" font-weight="600">
      <text x="18" y="37">∇·E = ρ/ε₀</text><text x="74" y="37">∇·B = 0</text>
      <text x="18" y="50">∇×E = −∂B/∂t</text><text x="80" y="50" font-size="9" fill="#FFD27A">E = mc²</text>
      <text x="18" y="63">∇×B = μ₀J + μ₀ε₀ ∂E/∂t</text>
      <text x="18" y="76" font-size="9.5" fill="#BFE6FF">iħ ∂ψ/∂t = Ĥψ</text></g>${T(165,33,'TABELA PERIÓDICA',4.2,'#33304A')}${T(214,58,'ALTA TENSÃO',4.6,'#FFD449')}`),

  presentes: () => SCN('#FFEFF5', `
    <path d="M14 12 Q118 30 226 12" fill="none" stroke="#B9A9B6" stroke-width="1.2"/>
    ${(()=>{const W=28,H=44,shape=`M0 0 H${W} V${H} L${W/2} ${H-8} L0 ${H}Z`;
      const B=(x,y,r,inner)=>`<g transform="translate(${x} ${y}) rotate(${r})"><clipPath id="bnr${x}"><path d="${shape}"/></clipPath><g clip-path="url(#bnr${x})">${inner}</g><path d="${shape}" fill="none" ${O(1.2)}/><path d="M-2 0 H${W+2}" stroke="#C99A62" stroke-width="2.4" stroke-linecap="round"/></g>`;
      const star=(cx,cy,r)=>`<path d="M${cx} ${cy-r} L${cx+r*.866} ${cy+r/2} L${cx-r*.866} ${cy+r/2}Z M${cx} ${cy+r} L${cx+r*.866} ${cy-r/2} L${cx-r*.866} ${cy-r/2}Z" fill="none" stroke="#1F4FA0" stroke-width="1.6" stroke-linejoin="round"/>`;
      return B(46,18,-5,`<rect width="${W}" height="${H}" fill="#74ACDF"/><rect y="${H*.33}" width="${W}" height="${H*.3}" fill="#FFFFFF"/><circle cx="${W/2}" cy="${H*.48}" r="3" fill="#F6B40E"/>${Array.from({length:8},(_,k)=>`<path d="M${W/2} ${H*.48} l0 -4.6" stroke="#F6B40E" stroke-width=".9" transform="rotate(${k*45} ${W/2} ${H*.48})"/>`).join('')}`)
        +B(106,21,3,`<rect width="${W}" height="${H}" fill="#009C3B"/><path d="M${W/2} 5 L${W-1.2} 18 L${W/2} 31 L1.2 18Z" fill="#FFDF00"/><circle cx="${W/2}" cy="18" r="6.8" fill="#002776"/><path d="M${W/2-6.6} 16.6 q6.6 -2.8 13.2 1.8" stroke="#FFFFFF" stroke-width="1.3" fill="none"/>${[[-3,20.5],[0,22.5],[3,20.8],[1.5,24.5],[-2,24]].map(([dx,y])=>`<circle cx="${W/2+dx}" cy="${y}" r=".55" fill="#FFFFFF"/>`).join('')}`)
        +B(166,19,-3,`<rect width="${W}" height="${H}" fill="#FFFFFF"/><rect y="4" width="${W}" height="3.6" fill="#1F4FA0"/><rect y="${H*.66}" width="${W}" height="3.6" fill="#1F4FA0"/>${star(W/2,H*.41,8)}`);})()}
    <rect y="150" width="320" height="50" fill="#F2D7C9"/>${[160,176].map(y=>`<path d="M0 ${y} H320" stroke="#E5C2B0" stroke-width="1.2"/>`).join('')}<path d="M0 150 H320" ${O(1.2)}/>
    ${R(36,118,140,8,'#F7A8C4',3)}<path d="M40 126 v40 M172 126 v40" stroke="#C99A62" stroke-width="4" stroke-linecap="round"/><path d="M36 126 q70 14 140 0" fill="#F7A8C4" ${O(1.2)}/>
    <path d="M76 118 h12 l-2 -6 h-8z" fill="#E6F2FF" ${O(1)}/><ellipse cx="82" cy="111" rx="28" ry="3.6" fill="#E6F2FF" ${O(1.1)}/>
    ${R(60,90,44,20,'#F7A8C4',3,1.3)}<path d="M60 94 h44 v-1 a3 3 0 0 0 -3 -3 h-38 a3 3 0 0 0 -3 3z" fill="#FFFFFF"/><path d="M60 93 ${Array.from({length:6},(_,k)=>'q3.67 6 7.33 0').join(' ')}" fill="#FFFFFF" ${O(1)}/>
    ${[66,73,80,87,94,99].map((x,k)=>`<rect x="${x}" y="${100+(k%2)*4}" width="2.6" height="1.2" rx=".6" fill="${['#FFD27A','#9DC3F2','#8FD3B6','#C7B2F0'][k%4]}" transform="rotate(${k*35} ${x} ${100+(k%2)*4})"/>`).join('')}
    ${R(68,74,28,17,'#FFF4D6',3,1.2)}<path d="M68 78 ${Array.from({length:4},()=>'q3.5 5 7 0').join(' ')}" fill="#F59AB9" ${O(.9)}/>
    ${[[70,73],[76.5,72],[83,72],[89.5,73]].map(([x,y])=>`<path d="${cloudPath(x+2,y,3.4,2.4,6,.6)}" fill="#FFFFFF" ${O(.8)}/>`).join('')}
    <path d="M74 70 c-2 -4 1 -6 3 -5 c2 -1 5 1 3 5z" fill="#E5384B" ${O(.9)}/><path d="M86 70 c-2 -4 1 -6 3 -5 c2 -1 5 1 3 5z" fill="#E5384B" ${O(.9)}/>
    <rect x="80.6" y="60" width="2.8" height="11" rx="1" fill="#9DC3F2" ${O(.8)}/><path d="M80.6 63 l2.8 -2 M80.6 66 l2.8 -2 M80.6 69 l2.8 -2" stroke="#FFFFFF" stroke-width=".7"/>${flame(82,60,.6)}
    ${(()=>{const b=(x,y,w,h,c,rb)=>R(x,y,w,h,c,2)+`<rect x="${x+w/2-2.5}" y="${y}" width="5" height="${h}" fill="${rb}"/><path d="M${x+w/2} ${y} c-6 -8 -13 -4 -7 1z M${x+w/2} ${y} c6 -8 13 -4 7 1z" fill="${rb}" ${O(1)}/>`;
      return b(118,92,30,26,'#9DC3F2','#FFD27A')+b(148,100,22,18,'#C7B2F0','#FFFFFF')+b(12,154,36,30,'#8FD3B6','#F59AB9')+b(50,166,22,18,'#FFD27A','#9DC3F2');})()}
    ${[[262,48,'#FF7FA3',true],[288,36,'#C7B2F0'],[300,64,'#8FD3B6'],[274,72,'#FFD27A']].map(([x,y,c,h])=>`<path d="M${x} ${y+14} Q${x+4} ${y+60} 292 168" fill="none" stroke="#B9A9B6" stroke-width="1"/>${h?heart(x,y+4,1.6,c):`<ellipse cx="${x}" cy="${y}" rx="10" ry="12" fill="${c}" ${O(1.2)}/><path d="M${x-4} ${y-6} q2 -3 5 -3" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M${x-2} ${y+12} h4 l-2 3z" fill="${c}" ${O(.8)}/>`}`).join('')}
    ${R(282,166,20,18,'#F59AB9',2)}
    ${sheep({who:'ela',pose:'sit',x:196,y:184,s:.64,mood:'closed'})}
    ${sheep({who:'ele',pose:'turn',x:262,y:188,s:.76})}
  `,'Festa com bandeirinhas, bolo, presentes e balões; a ovelha bebê sentada entre os presentes'),

  viagem: () => SCN('#EAF4FC', `
    ${R(10,16,190,98,'#9FB3CC',4)}<rect x="16" y="22" width="178" height="86" fill="#CFE8FF"/>${cloud(52,48,.6)}${cloud(150,40,.45)}
    <g transform="translate(108 64) rotate(-14)">
      <path d="M-34 -2 C-30 -8 26 -8 36 -2 C40 0 40 3 36 4 C26 8 -30 8 -34 2Z" fill="#FFFFFF" ${O(1.2)}/>
      <path d="M-33 1 H36" stroke="#1F4FA0" stroke-width="2.4"/><path d="M-30 3.4 H33" stroke="#9BB4D8" stroke-width="1"/>
      <path d="M-24 -3 L-38 -24 h12 l14 21z" fill="#1F4FA0" ${O(1.1)}/><g transform="translate(-25 -13.5)"><path d="M0 -4.4 L3.8 2.2 H-3.8Z M0 4.4 L3.8 -2.2 H-3.8Z" fill="none" stroke="#FFFFFF" stroke-width="1.1" stroke-linejoin="round"/></g>
      <path d="M-4 3 L-16 20 h7 l16 -16z" fill="#E6ECF5" ${O(1.1)}/><path d="M-6 -4 L-14 -14 h5 l10 9z" fill="#E6ECF5" ${O(1)}/>
      ${[0,6,12,18,24].map(x=>`<rect x="${x-14}" y="-3.6" width="3" height="2.4" rx=".8" fill="#9DC3F2"/>`).join('')}<path d="M30 -3 q4 0 5 2" fill="none" stroke="#33304A" stroke-width="1.1"/>
      <text x="10" y="-.4" text-anchor="middle" font-family="Grandstander, sans-serif" font-weight="800" font-size="4.4" fill="#1F4FA0">EL AL</text>
    </g>
    <path d="M16 98 H194" stroke="#B9C9DA" stroke-width="3"/><path d="M30 98 h14 M60 98 h14 M90 98 h14 M120 98 h14 M150 98 h14" stroke="#FFFFFF" stroke-width="1.4"/>
    <path d="M75 22 V108 M135 22 V108" stroke="#9FB3CC" stroke-width="3"/>
    ${R(212,16,98,66,'#2D3550',3)}

    <rect y="150" width="320" height="50" fill="#D9E5F0"/>${[0,64,128,192,256].map(x=>`<path d="M${x} 150 L${x-20} 200" stroke="#C6D6E6" stroke-width="1.2"/>`).join('')}<path d="M0 150 H320" ${O(1.2)}/>
    ${[218,246,274].map(x=>R(x,140,24,14,'#7EA8E6',4)+R(x,124,24,18,'#9DC3F2',4)+`<path d="M${x+4} 154 v10 M${x+20} 154 v10" ${O(1.2)}/>`).join('')}
    ${R(44,117,16,6,'#3A3C44',3,1.1)}
    <rect x="28" y="122" width="48" height="58" rx="7" fill="#F6C915" ${O(1.4)}/>
    ${[35,41.5,48,56,62.5,69].map(x=>`<path d="M${x} 140 V174" stroke="#D9A90B" stroke-width="2.2" stroke-linecap="round"/><path d="M${x+1.6} 140 V174" stroke="#FFE36B" stroke-width=".9" stroke-linecap="round"/>`).join('')}
    <path d="M30 138 H74" stroke="#D9A90B" stroke-width="1.4"/>
    <rect x="38" y="126" width="28" height="9" rx="2" fill="#2B2D33" ${O(1)}/><text x="52" y="133" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-style="italic" font-size="6.6" fill="#F6C915">CR7</text>
    ${[[28,122,1,1],[76,122,-1,1],[28,180,1,-1],[76,180,-1,-1]].map(([x,y,sx,sy])=>`<path d="M${x} ${y+sy*9} V${y+sy*4} Q${x} ${y} ${x+sx*4} ${y} H${x+sx*9}" fill="none" stroke="#3A3C44" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <rect x="76" y="148" width="3" height="12" rx="1.5" fill="#3A3C44"/>
    ${[33,45,59,71].map(x=>`<rect x="${x-3}" y="180" width="6" height="3" fill="#3A3C44"/><circle cx="${x}" cy="185" r="3" fill="#2B2D33" ${O(.8)}/>`).join('')}
    ${sheep({who:'ela',pose:'sit',x:52,y:124,s:.48})}
    <path d="M88 156 q-6 2 -5 14 l2 10" fill="none" stroke="#4FA27F" stroke-width="2.4" stroke-linecap="round"/>
    ${R(84,148,28,34,'#8FD3B6',9)}<path d="M84 160 q14 -8 28 0" fill="none" ${O(1.1)}/><path d="M88 158 q10 -6 20 0" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="1.6 1.6"/>
    ${R(89,166,18,12,'#6FC29E',3,1)}<path d="M91 169 h14" stroke="#FFFFFF" stroke-width=".9" stroke-dasharray="1.4 1.4"/><circle cx="104" cy="164" r="1.4" fill="#C9CED6"/>
    <path d="M92 148 q6 -8 12 0" fill="none" stroke="#4FA27F" stroke-width="2.4"/><path d="M108 172 l4 4" stroke="#C9CED6" stroke-width="1"/>${heart(113,179,.42,'#F59AB9')}
    <g transform="translate(120 168) rotate(-8)">${R(0,0,14,18,'#1F3F8F',1.5,1.1)}<circle cx="7" cy="7" r="3.4" fill="none" stroke="#E9C46A" stroke-width=".9"/><path d="M4 13 h6" stroke="#E9C46A" stroke-width=".9"/><path d="M5 15.4 h4" stroke="#E9C46A" stroke-width=".7"/></g>
    <g transform="translate(130 176) rotate(10)">${R(0,0,16,8,'#FFFFFF',1,1)}<rect x="0" y="0" width="4" height="8" fill="#2E7FD1"/><path d="M6 3 h8 M6 5.4 h6" stroke="#9AA3B8" stroke-width=".8"/></g>
    ${sheep({who:'ele',pose:'side',x:180,y:188,s:.8})}
  `,'Aeroporto: avião da El Al decolando na janela, painel de partidas e a ovelha bebê sentada na mala', `${T(261,27,'PARTIDAS',6.5,'#FFD27A')}    <g font-family="DM Mono, monospace" font-size="5.6" fill="#EAF4FF">${[['TEL AVIV','09:40','#7DF0B4'],['PARIS','11:15','#EAF4FF'],['NOVA YORK','13:20','#EAF4FF'],['TÓQUIO','22:05','#FFD27A']].map(([c,h,s],i)=>`<text x="218" y="${40+i*11}">${c}</text><text x="292" y="${40+i*11}" text-anchor="end" fill="${s}">${h}</text>`).join('')}</g>`),

  guaruja: () => SCN('#E4F6FF', `
    <rect width="320" height="98" fill="url(#ov-beachsky)"/>
    <circle cx="272" cy="34" r="32" fill="url(#ov-glow)"/><circle cx="272" cy="34" r="15" fill="#FFE59A" ${O(1.2)}/>
    ${cloud(66,28,.55)}${cloud(178,20,.4)}
    ${[[120,40],[136,33],[212,50]].map(([x,y])=>`<path d="M${x-5} ${y} q2.5 -3 5 0 q2.5 -3 5 0" fill="none" ${O(1.2)}/>`).join('')}
    <path d="M0 98 C18 62 58 50 92 68 C112 80 122 90 132 98Z" fill="#7FBF7A" ${O(1.3)}/><path d="M14 90 C32 72 56 66 80 76" fill="none" stroke="#9AD18F" stroke-width="3" stroke-linecap="round"/>
    ${[[132,70,12],[146,60,10],[158,74,11],[171,64,9],[182,78,10],[194,70,12],[208,82,9],[219,76,10]].map(([x,y,w],i)=>R(x,y,w,98-y,i%2?'#F5F1EA':'#E7EEF6',1,1)+Array.from({length:Math.floor((98-y)/7)},(_,k)=>`<rect x="${x+2}" y="${y+3+k*7}" width="${w-4}" height="2" fill="#9DC3F2"/>`).join('')).join('')}
    <rect y="98" width="320" height="64" fill="url(#ov-sea)"/><path d="M0 98 H320" ${O(1.2)}/>
    ${[108,120,134,148].map((y,i)=>`<path d="M${-10+i*9} ${y} ${Array.from({length:18},()=>'q10 -4 20 0').join(' ')}" fill="none" stroke="#C8EEF9" stroke-width="1.5" opacity=".75"/>`).join('')}
    <path d="M136 162 C158 128 200 104 246 100 C282 97 308 112 310 134 C310 146 298 150 290 142 C288 128 276 120 262 121 C246 123 238 140 240 162Z" fill="#2B8EC4" ${O(1.3)}/>
    <path d="M166 162 C182 136 210 118 238 113 C226 126 222 144 224 162Z" fill="#5CC0E3" opacity=".75"/>
    <ellipse cx="270" cy="134" rx="13" ry="9" fill="#1E74A6"/>
    <path d="M246 100 C282 97 308 112 310 134 C310 146 298 150 290 142 C291 130 284 118 270 113 C262 110 252 111 246 114Z" fill="#E8F8FF" ${O(1.2)}/>
    <path d="M238 104 C258 93 292 97 308 116 C313 124 312 134 306 140 q-2 -7 -7 -6 q-1 -7 -7 -7 q-2 -6 -8 -6 q-3 -5 -9 -4 q-4 -4 -10 -3 q-5 -3 -10 0 q-4 -2 -7 1 Z" fill="#FFFFFF" ${O(1.2)}/>
    <path d="M250 101 q14 -4 28 0 M286 106 q8 4 12 10" fill="none" stroke="#D3F0FA" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M200 112 q14 -8 30 -10 M186 126 q12 -8 24 -10" fill="none" stroke="#9EDDF2" stroke-width="1.6" stroke-linecap="round"/>
    ${[[240,92,2],[250,88,1.6],[230,96,1.4],[312,128,1.8],[316,138,1.4]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" ${O(.8)}/>`).join('')}
    <g transform="rotate(-7 106 142)"><ellipse cx="106" cy="142" rx="28" ry="5.2" fill="#F78DB8" ${O(1.3)}/><path d="M80 142 H132" stroke="#FFFFFF" stroke-width="1.6"/></g>
    ${sheep({who:'ela',pose:'turn',x:106,y:140,s:.52,flip:true})}
    <path d="M76 148 q8 -6 16 0 M120 146 q8 -6 14 0" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
    <g transform="rotate(-20 214 128)"><ellipse cx="214" cy="128" rx="42" ry="7.4" fill="#FFD449" ${O(1.4)}/><path d="M176 128 H252" stroke="#F2A541" stroke-width="2"/><path d="M180 125.6 q20 -3 40 -3" stroke="#FFF3B0" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>
    ${sheep({who:'ele',pose:'turn',x:214,y:124,s:.6})}
    <path d="M0 162 C80 154 220 158 320 151 V200 H0Z" fill="#F3DDA8" ${O(1.3)}/>${Array.from({length:22},(_,i)=>`<circle cx="${(i*47)%316+4}" cy="${168+(i*13)%28}" r=".9" fill="#D9BC82"/>`).join('')}
    ${(()=>{const ax=36,ay=112,pts=Array.from({length:7},(_,k)=>[2+k*11.4,140-Math.sin(Math.PI*k/6)*4]);let o=`<path d="M${ax} ${ay} L${ax+4} 194" stroke="#B98A61" stroke-width="3" stroke-linecap="round"/><path d="M${ax} ${ay} L${ax+4} 194" ${O(.8)}/>`;
      for(let k=0;k<6;k++){const [x1,y1]=pts[k],[x2,y2]=pts[k+1];o+=`<path d="M${ax} ${ay} Q${(x1+ax)/2-4} ${(y1+ay)/2-6} ${x1} ${y1} Q${(x1+x2)/2} ${y1+5} ${x2} ${y2} Q${(x2+ax)/2+4} ${(y2+ay)/2-6} ${ax} ${ay}Z" fill="${k%2?'#FFFFFF':'#F78DB8'}" ${O(1.2)}/>`;}
      return o+`<circle cx="${ax}" cy="${ay-2}" r="2.4" fill="#F2A541" ${O(1)}/>`;})()}
    <path d="M74 176 L178 172 L172 198 L64 198Z" fill="#FFD27A" ${O(1.3)}/><path d="M80 180 L176 176.4 M76 186 L174 182.6 M72 192 L172 189" stroke="#F78DB8" stroke-width="3"/><path d="M78 178.4 L176 174.6" stroke="#9DC3F2" stroke-width="1.6"/>
    ${[[110,184],[140,182],[96,192],[150,191]].map(([x,y])=>`<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-2.2" rx="1.4" ry="2.2" fill="#FFFFFF" transform="rotate(${a})"/>`).join('')}<circle r="1.2" fill="#F2A541"/></g>`).join('')}
    ${Array.from({length:6},(_,k)=>`<path d="M${74-k*1.9} ${177+k*4.2} l-4 0" stroke="#F2A541" stroke-width="1.2"/><path d="M${178-k*1.1} ${173+k*4.2} l4 0" stroke="#F2A541" stroke-width="1.2"/>`).join('')}
    <g transform="translate(234 194)">
      <ellipse cx="23" cy="0" rx="28" ry="4.4" fill="#E2BF84" ${O(1.1)}/>
      <path d="M1 -1 V-15 h4.2 v-3 h4.2 v3 h4.2 v-3 h4.2 v3 h4.2 v-3 h4.2 v3 h4.2 v-3 h4.2 v3 h4.2 v-3 h4.2 v3 h3.4 V-1Z" fill="#EDCB8F" ${O(1.2)}/>
      <path d="M-1 -1 L1 -24 h2.4 v-3 h2.6 v3 h2.6 v-3 h2.6 v3 h2.4 L15 -1Z" fill="#F2D49C" ${O(1.2)}/>
      <path d="M31 -1 L33 -24 h2.4 v-3 h2.6 v3 h2.6 v-3 h2.6 v3 h2.4 L47 -1Z" fill="#EDCB8F" ${O(1.2)}/>
      <path d="M15 -14 L17 -33 h2.5 v-3.2 h2.5 v3.2 h2 v-3.2 h2 v3.2 h2.5 v-3.2 h2.5 v3.2 L31 -14Z" fill="#F6DCA8" ${O(1.2)}/>
      <path d="M12 -2 L13.6 -22 M44 -2 L45.4 -22 M28.6 -15 L29.8 -31" stroke="#D4AE6E" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M3 -18 L3.6 -21 M18.4 -18 L19 -31" stroke="#FFF1D4" stroke-width="1.4" stroke-linecap="round"/>
      ${[-6,-10.5].map(y=>`<path d="M2 ${y} H45" stroke="#DDB878" stroke-width=".8" stroke-dasharray="2.4 2.2"/>`).join('')}
      <path d="M18.5 -1 v-6.5 a4.5 4.5 0 0 1 9 0 v6.5Z" fill="#B88A50" ${O(1)}/><path d="M23 -11.5 v10.5" stroke="#A47A44" stroke-width=".8"/>
      ${[[8,-17],[40,-17],[23,-25]].map(([x,y])=>`<path d="M${x-1.6} ${y+2.4} v-2.2 a1.6 1.6 0 0 1 3.2 0 v2.2Z" fill="#B88A50"/>`).join('')}
      <path d="M23 -36 V-43" stroke="#9E7650" stroke-width="1.1"/><path d="M23 -43 q4 1 8 -1 q-1 3 1 5 q-4 1 -9 0Z" fill="#F59AB9" ${O(.9)}/>
      <path d="M8 -27 V-32" stroke="#9E7650" stroke-width=".9"/><path d="M8 -32 l4.4 1.4 l-4.4 1.4Z" fill="#9DC3F2"/>
      <path d="M40 -27 V-32" stroke="#9E7650" stroke-width=".9"/><path d="M40 -32 l4.4 1.4 l-4.4 1.4Z" fill="#FFD27A"/>
      <g transform="translate(33 -6) scale(.55)"><path d="M0 -5 C4 -5 6 -1 5 3 H-5 C-6 -1 -4 -5 0 -5Z" fill="#FFB3C8" ${O(1.4)}/><path d="M0 -4.4 V3 M-2.6 -3.4 L-1.6 3 M2.6 -3.4 L1.6 3" stroke="#E57FA0" stroke-width=".9"/></g>
      <g transform="translate(7 -7) scale(.5)"><path d="M0 -6 L1.6 -2 L6 -1.6 L2.6 1.2 L3.6 5.6 L0 3.2 L-3.6 5.6 L-2.6 1.2 L-6 -1.6 L-1.6 -2Z" fill="#FF9E6B" ${O(1.4)}/></g>
      <g transform="translate(52 0)"><path d="M-6 -1 L-5 -11 H5 L6 -1Z" fill="#9DC3F2" ${O(1.1)}/><path d="M-5 -11 q5 -6 10 0" fill="none" stroke="#7A5E4C" stroke-width="1"/><path d="M-5.4 -7 H5.4" stroke="#FFFFFF" stroke-width="1.2"/></g>
    </g>
    <path d="M300 198 V150" stroke="#9E7650" stroke-width="4"/>${R(262,130,56,20,'#C99A62',3,1.4)}<path d="M266 134 h48" stroke="#E2B98A" stroke-width="1.2"/>
  `,'Praia do Guarujá: as duas ovelhas surfando nas ondas, com guarda-sol, toalha e castelo de areia', `${T(290,144.5,'GUARUJÁ',10,'#FFFFFF')}`),

  dates: () => SCN('#F7E3D7', `
    <path d="M126 104 V52 a34 34 0 0 1 68 0 V104Z" fill="#2D3570" ${O(1.6)}/><path d="M168 40 a8 8 0 1 0 7 11 a6 6 0 1 1 -7 -11z" fill="#FFE59A"/>${[[138,86],[146,80],[156,90],[176,84],[184,92]].map(([x,y])=>`<rect x="${x}" y="${y}" width="4" height="${104-y}" fill="#4A4F86"/><rect x="${x+1}" y="${y+3}" width="2" height="2" fill="#FFE59A"/>`).join('')}<path d="M160 18 V104 M126 66 H194" stroke="#FFFFFF" stroke-width="3"/><path d="M126 104 V52 a34 34 0 0 1 68 0 V104Z" fill="none" ${O(1.6)}/>
    ${R(14,28,64,56,'#2F4A42',3,1.4)}<rect x="14" y="28" width="64" height="56" rx="3" fill="none" stroke="#B8875A" stroke-width="3"/>
    ${R(238,26,60,44,'#E1B54A',2,1.4)}<clipPath id="tlv-photo"><rect x="243" y="31" width="50" height="34"/></clipPath><g clip-path="url(#tlv-photo)"><rect x="243" y="31" width="50" height="34" fill="#BFE6FF"/><circle cx="287" cy="37" r="3.4" fill="#FFE59A"/>
    <rect x="256" y="38" width="6" height="18" rx="3" fill="#E7EEF6" stroke="#9AA6BC" stroke-width=".6"/><path d="M264 56 L267.5 39 L271 56Z" fill="#DCE6F2" stroke="#9AA6BC" stroke-width=".6"/><rect x="273" y="41" width="5.5" height="15" fill="#E7EEF6" stroke="#9AA6BC" stroke-width=".6"/>
    ${[[245,48,5],[251,45,4],[280,47,5],[286,50,6]].map(([x,y,w])=>`<rect x="${x}" y="${y}" width="${w}" height="${56-y}" fill="#F3EEE6" stroke="#B9AFA2" stroke-width=".5"/>`).join('')}
    <rect x="243" y="55.5" width="50" height="2.6" fill="#F3DDA8"/><rect x="243" y="58" width="50" height="7" fill="#4FB3D9"/><path d="M245 61 q3 -1.4 6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0" fill="none" stroke="#BFEAF7" stroke-width=".7"/>
    <path d="M249 57 q1 -7 -1 -12" stroke="#8B6A43" stroke-width="1.2" fill="none"/><path d="M248 45 q-4 -1 -6 2 M248 45 q4 -2 6 1 M248 45 q-2 -3 -5 -3 M248 45 q2 -3 5 -2" stroke="#4E8F57" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <rect x="290" y="40" width=".7" height="12" fill="#8A8F9C"/><rect x="290.7" y="40" width="5" height="3.4" fill="#FFFFFF" stroke="#9AA6BC" stroke-width=".3"/><path d="M290.7 40.7 h5 M290.7 42.7 h5" stroke="#2F5BB7" stroke-width=".4"/>
    ${sheep({who:'ela',x:262,y:64,s:.14,pose:'turn',flip:true,cls:''})}${sheep({who:'ele',x:280,y:64,s:.15,pose:'turn',cls:''})}</g><rect x="243" y="31" width="50" height="34" fill="none" ${O(1)}/>

    <rect y="118" width="320" height="60" fill="#C97F6A"/><path d="M0 118 H320" stroke="#A85F4C" stroke-width="5"/>
    <rect y="176" width="320" height="24" fill="#8E5A44"/><path d="M0 176 H320" ${O(1.3)}/>${[40,120,200,280].map(x=>`<path d="M${x} 176 v24" stroke="#7A4C38" stroke-width="1.2"/>`).join('')}
    <g transform="translate(304 140)"><path d="M-10 36 h20 l-3 -18 h-14z" fill="#C99A62" ${O(1.2)}/>${[[-12,-4,-40],[0,-12,0],[12,-2,40],[-6,6,-20],[8,6,25]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="5" ry="12" transform="rotate(${r} ${x} ${y})" fill="#6FB36A" ${O(1)}/>`).join('')}</g>
    <path d="M42 176 V96 M72 176 V96 M42 100 H72 M42 116 H72" stroke="#7A4C38" stroke-width="4" stroke-linecap="round"/>
    <path d="M248 176 V96 M278 176 V96 M248 100 H278 M248 116 H278" stroke="#7A4C38" stroke-width="4" stroke-linecap="round"/>
    ${sheep({who:'ela',pose:'side',x:86,y:146,s:.66,flip:true})}
    ${sheep({who:'ele',pose:'side',x:236,y:150,s:.76})}
    ${R(40,145,60,5,'#9A6242',2,1.2)}<path d="M46 150 V176 M94 150 V176" stroke="#7A4C38" stroke-width="3.4" stroke-linecap="round"/>
    ${R(214,149,70,5,'#9A6242',2,1.2)}<path d="M220 154 V176 M278 154 V176" stroke="#7A4C38" stroke-width="3.4" stroke-linecap="round"/>
    ${R(62,128,196,6,'#FFFFFF',2,1.3)}
    <rect x="66" y="134" width="188" height="40" fill="#FFFFFF"/>${(()=>{let o='';for(let r=0;r<4;r++)for(let c=0;c<19;c++) if((r+c)%2===0) o+=`<rect x="${66+c*9.9}" y="${134+r*10}" width="9.9" height="10" fill="#E5534B"/>`; return o;})()}<rect x="66" y="134" width="188" height="40" fill="none" ${O(1.3)}/>
    ${[120,200].map(x=>`<ellipse cx="${x}" cy="129" rx="19" ry="4.6" fill="#FFFFFF" ${O(1.2)}/><ellipse cx="${x}" cy="128.6" rx="13" ry="2.8" fill="none" stroke="#E7E1EE" stroke-width="1"/><path d="M${x-12} 128.4 C${x-12} 121 ${x+12} 121 ${x+12} 128.4 Z" fill="#F2C25B" ${O(1)}/><path d="M${x-8} 127 q4 -3.6 8 0 q4 3.6 8 0 M${x-6} 124.6 q3 -2.4 6 0 q3 2.4 6 0" fill="none" stroke="#E3AE47" stroke-width="1" stroke-linecap="round"/><ellipse cx="${x}" cy="123.4" rx="6.5" ry="2.6" fill="#D9433A" ${O(.9)}/><ellipse cx="${x-2}" cy="122.6" rx="2" ry=".8" fill="#F27A6E"/><ellipse cx="${x+3}" cy="121.4" rx="2.6" ry="1.3" fill="#5FA84A" transform="rotate(-24 ${x+3} 121.4)"/>`).join('')}
    <path d="M118 124 Q157 148 195 118" fill="none" stroke="#E3AE47" stroke-width="2.6" stroke-linecap="round"/><path d="M118 124 Q157 148 195 118" fill="none" stroke="#F7D27A" stroke-width="1.2" stroke-linecap="round"/>
    <g transform="translate(160 129)"><path d="M-7 0 a9 11 0 1 1 14 0 Z" fill="#7DBF6C" ${O(1.2)}/><path d="M-8 -12 l16 10 M8 -12 l-16 10 M-9 -6 h18" stroke="#E3B866" stroke-width="2.2"/><rect x="-2.5" y="-26" width="5" height="10" fill="#4E8F57" ${O(1)}/><rect x="-2.2" y="-36" width="4.4" height="10" rx="1" fill="#FFFDF7" ${O(1)}/>${flame(0,-37,.8)}</g>
    ${[143,177].map((x,i)=>`<g transform="translate(${x} 130) scale(.82)"><path d="M-3 0 h6 l-1 -10 h-4z" fill="#E6F2FF" ${O(1)}/><path d="M-9 -10 h18 c0 6 -4 10 -9 10 c-5 0 -9 -4 -9 -10z" fill="#E6F2FF" fill-opacity=".9" ${O(1.1)}/><circle cx="-4" cy="-13" r="5" fill="${i?'#8B5A3C':'#F59AB9'}" ${O(1)}/><circle cx="4" cy="-13" r="5" fill="${i?'#F59AB9':'#FFF4D6'}" ${O(1)}/><circle cx="0" cy="-19" r="5" fill="#FFF4D6" ${O(1)}/><path d="${cloudPath(0,-24,6,3.6,6,.6)}" fill="#FFFFFF" ${O(1)}/><circle cx="1" cy="-29" r="2.4" fill="#E5384B" ${O(.9)}/><path d="M1 -31 q2 -4 5 -4" stroke="#5FA84A" stroke-width="1" fill="none"/><rect x="5" y="-30" width="2.4" height="12" rx="1" fill="#E9B266" transform="rotate(20 6 -24)" ${O(.7)}/></g>`).join('')}
  `,'Date num restaurante italiano: as ovelhas dividem um fio de macarrão ao sugo, com taças de sundae, vela na garrafa e luzinhas', `<g font-family="Caveat, cursive" font-weight="600" text-anchor="middle"><text x="46" y="42" font-size="8" fill="#FFD27A">MENU</text><text x="46" y="57" font-size="7" fill="#FFFFFF">Macarrão ao sugo</text><text x="46" y="68" font-size="7" fill="#FFFFFF">Sundae duplo</text><text x="46" y="77" font-size="7" fill="#F59AB9">♥</text></g>`),

  outros: () => SCN('#F1E9DE', `
    ${Array.from({length:12},(_,i)=>`<path d="M${i*28} 0 V150" stroke="#E2D4C2" stroke-width="1.2"/>`).join('')}
    <circle cx="160" cy="34" r="18" fill="#2D3570" ${O(1.6)}/><path d="M165 24 a9 9 0 1 0 6 14 a7 7 0 1 1 -6 -14z" fill="#FFE59A"/>${sparkle(152,30,.35,'#FFFFFF')}<path d="M142 34 h36 M160 16 v36" stroke="#C99A62" stroke-width="2"/>
    ${R(12,58,84,5,'#C99A62',1.5)}${R(12,96,84,5,'#C99A62',1.5)}
    <circle cx="28" cy="46" r="11" fill="#9DC3F2" ${O(1.2)}/><path d="M20 42 q8 4 16 0 M22 50 q6 -3 12 0" stroke="#8FD3B6" stroke-width="2" fill="none"/><path d="M28 57 v1" ${O(1)}/>
    ${R(46,40,16,18,'#FFD27A',3,1.2)}<circle cx="54" cy="49" r="5" fill="#FFFFFF" ${O(1)}/><path d="M54 46 v3 l2 1.5" ${O(.9)}/>
    ${R(68,40,22,18,'#E5384B',2,1.2)}<ellipse cx="79" cy="49" rx="8" ry="5" fill="#FFD449" transform="rotate(-18 79 49)"/><text x="79" y="51.4" text-anchor="middle" font-family="Grandstander, sans-serif" font-weight="800" font-size="6" fill="#E5384B" transform="rotate(-18 79 49)">UNO</text>
    ${R(18,74,26,22,'#E9C38F',2,1.2)}${[0,1,2,3,4].map(r=>`<rect x="${24+(r%2)*2}" y="${78+r*3.4}" width="12" height="3" rx=".6" fill="#D49A55" ${O(.5)}/>`).join('')}<text x="31" y="94" text-anchor="middle" font-family="Grandstander, sans-serif" font-weight="800" font-size="4.4" fill="#7A4E1F">JENGA</text>
    ${R(50,80,40,16,'#33304A',2,1.2)}${Array.from({length:8},(_,k)=>`<rect x="${54+k*4}" y="${83+(k%2)*4}" width="4" height="4" fill="#FFFFFF"/><rect x="${54+k*4}" y="${87-(k%2)*4}" width="4" height="4" fill="#C9C2E6"/>`).join('')}<text x="70" y="94.6" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="3.6" fill="#FFFFFF">XADREZ</text>
    <rect y="150" width="320" height="50" fill="#E3CFB6"/>${[160,176,192].map(y=>`<path d="M0 ${y} H320" stroke="#D2B998" stroke-width="1.2"/>`).join('')}<path d="M0 150 H320" ${O(1.2)}/>
    ${R(220,58,90,5,'#C99A62',1.5)}${R(220,96,90,5,'#C99A62',1.5)}
    ${R(224,38,46,20,'#FFFFFF',2)}<rect x="226" y="40" width="42" height="16" fill="none" stroke="#2F9E5B" stroke-width="1.6"/><rect x="224" y="43" width="46" height="9" fill="#E5384B"/><text x="247" y="50" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="6" fill="#FFFFFF">MONOPOLY</text>
    ${R(274,36,32,22,'#FFFFFF',2)}${[[281,42,'#E5384B'],[290,42,'#2E7FD1'],[299,42,'#FFD449'],[285.5,49,'#2F9E5B'],[294.5,49,'#E5384B']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="3" fill="${c}" ${O(.6)}/>`).join('')}<text x="290" y="56" text-anchor="middle" font-family="Grandstander, sans-serif" font-weight="800" font-size="5.4" fill="#2E7FD1">Twister</text>
    ${R(244,78,40,18,'#F2E3C4',2)}${['A','M','O','R'].map((l,k)=>`<rect x="${248+k*8.4}" y="${84}" width="7" height="8" rx="1" fill="#FFF8E6" ${O(.7)}/><text x="${251.5+k*8.4}" y="90.6" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="5.4" fill="#7A4E1F">${l}</text>`).join('')}<rect x="244" y="78" width="40" height="4" fill="#C99A62"/>
    <path d="M92 150 L98 120 H162 L168 150" fill="#C99A62" ${O(1.3)}/>
    ${sheep({who:'ela',pose:'sit',x:130,y:150,s:.56})}
    <path d="M90 150 H170 V184 H90Z" fill="#E8C49A" ${O(1.4)}/><path d="M90 150 L78 140 M170 150 L182 140" ${O(1.4)}/><path d="M118 150 v34 M142 150 v34" stroke="#F2DCC0" stroke-width="4"/>
    ${sheep({who:'ele',pose:'side',x:236,y:192,s:.74,mood:'o'})}
  `,'Sótão cheio de caixas: a ovelha bebê espiando de dentro de uma caixa e a outra com lupa'),
};

/** Shabat: aparece no painel do dia nas sextas e sábados */
function shabatScene(){
  return SCN('#EDE6FA', `
    ${R(232,14,70,72,'#C8B8E8',4)}<rect x="237" y="19" width="60" height="62" fill="#2D3570"/><path d="M262 32 a12 12 0 1 0 10 18 a9 9 0 1 1 -10 -18z" fill="#FFE59A"/>${[[246,28],[286,36],[252,66],[284,70]].map(([x,y])=>sparkle(x,y,.35,'#FFFFFF')).join('')}<path d="M267 19 V81 M237 50 H297" stroke="#C8B8E8" stroke-width="2.4"/>
    <circle cx="40" cy="40" r="26" fill="url(#ov-glow)"/>${R(34,26,12,10,'#FFE59A',4)}<path d="M40 14 V26" ${O(1)}/>
    ${sheep({who:'ela',pose:'side',x:93,y:132,s:.66,acc:['match'],mood:'closed',flip:true})}
    ${sheep({who:'ele',pose:'side',x:270,y:136,s:.74,acc:['kippah']})}
    <rect x="0" y="156" width="320" height="44" fill="#D9CDEB"/><path d="M0 156 H320" ${O(1.2)}/>
    <path d="M6 126 H314 V146 ${Array.from({length:14},()=>`a11 6 0 0 1 -22 0`).join(' ')} Z" fill="#FFFFFF" ${O(1.4)}/>${[60,120,180,240].map(x=>`<path d="M${x} 186 h30" stroke="#C8B8E8" stroke-width="1.2"/>`).join('')}<path d="M6 126 H314" ${O(1.4)}/>
    <g transform="translate(22 92)"><path d="M-8 34 q8 -4 16 0 l-2 -20 h-12z" fill="#9DC3F2" fill-opacity=".7" ${O(1.2)}/>${[[-6,8,'#F59AB9'],[0,2,'#FFD27A'],[6,8,'#C7B2F0']].map(([x,y,c])=>`<path d="M0 16 L${x} ${y}" stroke="#5FA84A" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="4" fill="${c}" ${O(1)}/>`).join('')}</g>
    ${[146,174].map(x=>`<g transform="translate(${x} 0)"><path d="M-9 126 q9 -6 18 0z" fill="#E1B54A" ${O(1.1)}/><rect x="-2" y="112" width="4" height="12" fill="#E1B54A" ${O(1)}/><path d="M-7 112 h14 l-2 3 h-10z" fill="#E1B54A" ${O(1)}/><rect x="-4.5" y="90" width="9" height="22" rx="2" fill="#FFFDF7" ${O(1.1)}/><path d="M0 90 v-4" stroke="#5A5168" stroke-width="1.3"/>${flame(0,86,1)}</g>`).join('')}
    ${R(194,118,52,8,'#B98A61',3)}<g transform="translate(202 112)">${[0,1,2,3].map(i=>`<ellipse cx="${i*11}" cy="${i%2?-1:0}" rx="8.5" ry="6.5" fill="#D9933F" ${O(1.1)}/><path d="M${i*11-4} -2.5 q4 3 8 0" stroke="#F4CE8E" stroke-width="1.5" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <g transform="translate(298 106)"><path d="M-9 0 h18 a9 11 0 0 1 -18 0z" fill="#B23A5B" ${O(1.2)}/><path d="M-9 0 h18" stroke="#E1B54A" stroke-width="2.2"/><rect x="-1.5" y="10" width="3" height="10" fill="#E1B54A"/><path d="M-6 21 q6 -4 12 0z" fill="#E1B54A" ${O(1)}/></g>
  `,'Mesa de Shabat: a ovelha bebê acende as velas com um fósforo e a outra, de kipá, observa');
}
