const $ = (selector) => document.querySelector(selector);
let saved = new Set();
let storageAvailable = true;
try {
  const stored = JSON.parse(localStorage.getItem('playpicker-saved') || '[]');
  if (Array.isArray(stored)) saved = new Set(stored.filter(id => ACTIVITIES.some(a => a.id === id)));
} catch { storageAvailable = false; }
let category = 'All';
let collection = false;
let toastTimer;
const seen = new Set();
const history = [];
let busy = false;
let suppressClickUntil = 0;
const colors = ['#e58e71', '#eab951', '#8caa7b', '#90b4b6', '#a69abf'];
function illustration(a) {
  let shapes = '';
  if (a.art === 'town') shapes = '<path d="M67 157V91L113 56 158 91V157" fill="#ce9d69"/><path d="M158 157V72L210 36 257 73V157" fill="#e2b77f"/><path d="M65 92L113 52 160 92 M157 75L210 33 260 75" fill="none" stroke="#9d7957" stroke-width="6"/><rect x="98" y="120" width="27" height="37" rx="12" fill="#71816b"/><rect x="182" y="94" width="20" height="25" fill="#fff2c3"/><rect x="221" y="94" width="20" height="25" fill="#fff2c3"/><path d="M209 156v-24h25v24" fill="#bb805c"/><path d="M42 159h244" stroke="#a1aa80" stroke-width="6"/><path d="M267 155v-42" stroke="#778460" stroke-width="4"/><circle cx="267" cy="104" r="18" fill="#96a17d"/>';
  if (a.art === 'crown') shapes = '<path d="M71 117L85 74 115 99 145 56 172 96 206 62 222 98 251 79 248 135Q157 166 71 133Z" fill="#c29e69"/><path d="M74 123Q156 145 250 124" fill="none" stroke="#e5cba0" stroke-width="13"/>' + [[95,95,-25],[136,97,25],[179,102,-20],[218,105,25]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="13" ry="26" fill="#708863" transform="rotate(${r} ${x} ${y})"/><path d="M${x} ${y-16}v38" stroke="#a9bb8c" stroke-width="2"/>`).join('') + '<circle cx="155" cy="127" r="10" fill="#f3d9bd"/><circle cx="155" cy="127" r="4" fill="#e2ae47"/>';
  if (a.art === 'rainbow') shapes = '<rect x="65" y="28" width="201" height="144" rx="3" fill="#fffcf1" transform="rotate(-7 165 100)"/>' + colors.map((c,i)=>`<path d="M${90+i*14} 140 A${75-i*14} ${75-i*14} 0 0 1 ${240-i*14} 140" fill="none" stroke="${c}" stroke-width="13" stroke-linecap="round"/>`).join('')+'<rect x="233" y="140" width="44" height="23" rx="7" fill="#ddaa58" transform="rotate(17 250 150)"/>';
  if (a.art === 'rocket') shapes = '<g transform="rotate(27 165 105)"><path d="M141 136V74Q148 41 165 25Q185 43 190 74V136Z" fill="#fff7df"/><path d="M142 76Q149 43 165 25Q183 42 190 76" fill="#d8846b"/><circle cx="165" cy="94" r="13" fill="#8eafb5" stroke="#d4dcd6" stroke-width="5"/><path d="M141 114L121 144H141 M190 114L211 144H190" fill="#87977d"/><path d="M148 142L165 178 184 142" fill="#ebbb57"/><path d="M157 142L165 163 175 142" fill="#e79466"/></g><path d="M67 66h15m-7-7v14 M247 133h15m-7-7v14" stroke="#b1b8be" stroke-width="3"/>';
  if (a.art === 'trail') shapes = '<path d="M48 154Q125 90 173 130T282 83" fill="none" stroke="#fbf2d9" stroke-width="5" stroke-dasharray="6 7"/><rect x="49" y="127" width="70" height="35" rx="12" fill="#8f9e7d" transform="rotate(-12 80 140)"/><rect x="137" y="111" width="62" height="31" rx="10" fill="#d58f75" transform="rotate(10 160 130)"/><path d="M201 102L246 28 292 102Z" fill="#c09c6a"/><path d="M225 102L246 61 270 102Z" fill="#6d806d"/><path d="M84 56l6-14 6 14 15 5-15 6-6 14-6-14-15-6Z" fill="#e5b14f"/>';
  if (a.art === 'hotel') shapes = '<path d="M91 163V68L164 24 236 68V163Z" fill="#b78c60"/><path d="M79 70L164 17 247 70" fill="none" stroke="#7f7657" stroke-width="9"/><rect x="104" y="78" width="119" height="72" fill="#7d7853"/><path d="M163 78v72 M104 114h119" stroke="#d2b382" stroke-width="6"/>' + Array.from({length:8},(_,i)=>`<circle cx="${115+i%4*12}" cy="${89+Math.floor(i/4)*14}" r="5" fill="#cdb17d"/>`).join('')+'<path d="M177 87l34 16m-34-1 34-18 M113 125l34 17m-34-3 34-18" stroke="#bca174" stroke-width="5"/><path d="M181 125l27 16m-25 0 22-18" stroke="#c8b58c" stroke-width="5"/><path d="M73 165h181" stroke="#8da075" stroke-width="6"/>';
  if (a.art === 'shadow') shapes = '<circle cx="181" cy="94" r="75" fill="#f9efcb"/><path d="M150 132Q129 108 149 86L145 48Q148 30 158 48L169 80 179 40Q187 25 192 44L190 84Q218 94 209 118L218 147H154Z" fill="#8d829a"/><circle cx="192" cy="97" r="3" fill="#f9efcb"/><path d="M48 162L110 126" stroke="#687c75" stroke-width="23"/><path d="M95 117L110 111 124 136 109 144Z" fill="#dda65e"/>';
  if (a.art === 'water') shapes = '<path d="M65 88L88 157Q160 180 237 156L263 88Z" fill="#9fc7c8"/><ellipse cx="164" cy="88" rx="99" ry="27" fill="#e7f4eb"/><ellipse cx="164" cy="94" rx="86" ry="19" fill="#a6ced0"/><path d="M122 81Q129 46 168 62Q155 93 122 81" fill="#91a471"/><path d="M127 80l32-14" stroke="#697e59" stroke-width="2"/><ellipse cx="184" cy="137" rx="21" ry="12" fill="#859ba0"/><path d="M219 81L250 43" stroke="#bf9769" stroke-width="8"/><ellipse cx="216" cy="85" rx="10" ry="17" fill="#bf9769" transform="rotate(39 216 85)"/>';
  if (a.art === 'leaves') shapes = '<rect x="70" y="28" width="181" height="141" rx="3" fill="#fffaf0" transform="rotate(-6 160 100)"/>' + [[121,96,-25,'#c39e4b'],[180,92,20,'#9da57a'],[213,132,50,'#cd9675']].map(([x,y,r,c])=>`<g transform="rotate(${r} ${x} ${y})"><path d="M${x} ${y+31}Q${x-39} ${y} ${x} ${y-34}Q${x+38} ${y} ${x} ${y+31}" fill="${c}" opacity=".7"/><path d="M${x} ${y-24}v65m0-26-15-12m15 0 15-12m-15-1-12-10" fill="none" stroke="#fff8e0" stroke-width="2"/></g>`).join('')+'<path d="M59 150l31 20" stroke="#c69851" stroke-width="9"/>';
  return `<svg viewBox="0 0 330 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="165" cy="168" rx="114" ry="9" fill="#526447" opacity=".07"/>${shapes}<circle cx="44" cy="47" r="3" fill="#fffaf0"/><path d="M279 43v12m-6-6h12" stroke="#fffaf0" stroke-width="2"/></svg>`;
}
function filteredActivities() {
  const query = normalizeSearch($('#search').value.trim());
  const age = Number($('#age').value);
  return ACTIVITIES.map(localizeActivity).filter(a => (!collection || saved.has(a.id)) && (category === 'All' || a.category === category) && (!query || normalizeSearch([a.title,a.description,t(a.category),...a.materials].join(' ')).includes(query)) && (!age || age >= a.age[0] && age <= a.age[1]) && (!$('#time').value || a.time <= Number($('#time').value)) && (!$('#setting').value || a.setting === $('#setting').value) && (!$('#mess').value || a.mess === $('#mess').value));
}
function render() {
  const activities = filteredActivities();
  $('#saved-count').textContent = saved.size;
  $('#result-count').innerHTML = `<strong>${activities.length} ${activities.length === 1 ? t('activity') : t('activities')}</strong> ${collection ? t('in your collection') : t('for a little everyday adventure')}`;
  $('#browse-title').textContent = collection ? t('Your next little adventures') : t('Your next “let’s do that!”');
  $('#discover').classList.toggle('active', !collection);
  $('#saved').classList.toggle('active', collection);
  $('#discover').setAttribute('aria-pressed', String(!collection));
  $('#saved').setAttribute('aria-pressed', String(collection));
  document.querySelectorAll('.chip').forEach(c => {c.classList.toggle('selected', c.dataset.category === category);c.setAttribute('aria-pressed', String(c.dataset.category === category));});
  $('#activity-grid').innerHTML = activities.map(a => `<article class="card"><button class="save-button ${saved.has(a.id) ? 'is-saved' : ''}" data-save="${a.id}" aria-label="${saved.has(a.id) ? t('Unsave') : t('Save')} ${a.title}" aria-pressed="${saved.has(a.id)}">${saved.has(a.id) ? '♥' : '♡'}</button><button class="card-open" data-open="${a.id}" aria-label="${t('View')} ${a.title}"><div class="card-art" style="background:${a.color}">${illustration(a)}<span class="card-badge">${a.badge}</span></div><div class="card-body"><span class="card-category">${t(a.category).replace('&','&amp;')}</span><h3>${a.title}</h3><p class="card-description">${a.description}</p><div class="card-meta"><span>◷ ${a.time} min</span><span>♧ ${t('Ages')} ${a.age.join('–')}</span><span>${a.setting === 'Outdoors' ? '☀' : '⌂'} ${t(a.setting)}</span></div></div></button></article>`).join('');
  $('#activity-grid').hidden = !collection;
  $('#swipe-discovery').hidden = collection;
  $('#empty').hidden = !collection || activities.length > 0;
  renderDeck();
  const activeFilters = ['search','age','time','setting','mess'].filter(id => $('#'+id).value).length + (category !== 'All' ? 1 : 0);
  $('#filter-count').textContent = activeFilters ? `(${activeFilters})` : '';
  $('#empty-message').textContent = collection && !saved.size ? t('Tap a heart on any activity to keep it here for another day.') : t('No activities match just yet. Try a different filter or explore them all.');
}
function toast(message) { clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.add('visible'); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3000); }
function toggleSave(id) {
  saved.has(id) ? saved.delete(id) : saved.add(id);
  try { localStorage.setItem('playpicker-saved', JSON.stringify([...saved])); storageAvailable = true; } catch { storageAvailable = false; }
  toast(storageAvailable ? (saved.has(id) ? t('Saved for another little adventure ♡') : t('Removed from your collection')) : t('Saved for this visit. Browser storage is unavailable.'));
  render();
  const button = $('.dialog-save');
  if(button && button.dataset.save === id) {button.textContent = saved.has(id) ? t('♥ Saved to my collection') : t('♡ Save to my collection');button.setAttribute('aria-pressed', String(saved.has(id)));}
}
function openActivity(id) {
  const original = ACTIVITIES.find(a => a.id === id);
  const a = original && localizeActivity(original);
  if(!a) return;
  $('#dialog-content').innerHTML = `<div class="dialog-art" style="background:${a.color}">${illustration(a)}</div><div class="dialog-body"><span class="eyebrow">${t(a.category).replace('&','&amp;')}</span><h2 id="dialog-title">${a.title}</h2><p>${a.description}</p><div class="detail-tags"><span>◷ ${a.time} ${t('minutes')}</span><span>${t('Ages')} ${a.age.join('–')}</span><span>${t(a.setting)}</span><span>${t(a.mess + ' mess')}</span></div><h3>${t("Gather a few things")}</h3><ul>${a.materials.map(m => `<li>${m}</li>`).join('')}</ul><h3>${t("Let’s make it happen")}</h3><ol>${a.steps.map(s => `<li>${s}</li>`).join('')}</ol><p class="tip"><strong>${t("A little grown-up note")}</strong><br>${a.tip}</p><button class="primary dialog-save" data-save="${a.id}" aria-pressed="${saved.has(a.id)}">${saved.has(a.id) ? t('♥ Saved to my collection') : t('♡ Save to my collection')}</button></div>`;
  $('#activity-dialog').showModal();
  $('#activity-dialog').scrollTop = 0;
  document.body.classList.add('modal-open');
}
function resetFilters() { ['search','age','time','setting','mess'].forEach(id => $('#'+id).value = '');category = 'All';render(); }
['search','age','time','setting','mess'].forEach(id => $('#'+id).addEventListener(id === 'search' ? 'input' : 'change', render));
document.addEventListener('click', e => {
  const open = e.target.closest('[data-open]');
  const save = e.target.closest('[data-save]');
  const chip = e.target.closest('[data-category]');
  if(open && Date.now() > suppressClickUntil && !busy) openActivity(open.dataset.open);
  if(save && !busy) {const id = save.dataset.save; toggleSave(id); if(!$('#activity-dialog').open) {const replacement = document.querySelector(`[data-save="${id}"]`); (replacement || $('#saved')).focus();}}
  if(chip) { category = chip.dataset.category;render(); }
});
$('#reset').addEventListener('click', resetFilters);
$('#empty-reset').addEventListener('click', () => {collection = false;resetFilters();});
$('#discover').addEventListener('click', () => {collection = false;render();});
$('#saved').addEventListener('click', () => {collection = true;resetFilters();$('.browse').scrollIntoView({behavior:'smooth'});});

$('.close-dialog').addEventListener('click', () => $('#activity-dialog').close());
$('#activity-dialog').addEventListener('close', () => document.body.classList.remove('modal-open'));
$('#activity-dialog').addEventListener('click', e => {if(e.target === $('#activity-dialog')) {const r = e.target.getBoundingClientRect();if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close();}});

function remainingActivities() { return filteredActivities().filter(a => !seen.has(a.id) && !saved.has(a.id)); }
function renderDeck() {
  const remaining = remainingActivities();
  const a = remaining[0];
  $('#undo').disabled = !history.length || busy;
  ['pass','like','details'].forEach(id => $('#'+id).disabled = !a || busy);
  if(collection) return;
  $('#result-count').innerHTML = `<strong>${remaining.length} ${remaining.length === 1 ? t('idea') : t('ideas')}</strong> ${t('left to discover')}`;
  if(!a) {
    const hasMatches = filteredActivities().length > 0;
    $('#deck').innerHTML = `<div class="deck-empty"><span> ${hasMatches ? '♡' : '✳'}</span><h3>${hasMatches ? t('A little inspiration, collected.') : t('Let’s try a different mix.')}</h3><p>${hasMatches ? t('You’ve explored these ideas. Your favorites are waiting in your collection.') : t('No ideas match these filters. Give your next adventure a little more room.')}</p><button class="primary" id="deck-restart">${hasMatches ? t('Revisit passed activities') : t('Reset filters')}</button><button class="text-button" id="deck-collection">${t("View my collection →")}</button></div>`;
    $('#deck-restart').addEventListener('click', () => { if(hasMatches) {seen.clear();history.length = 0;if(!remainingActivities().length) {collection = true;resetFilters();return;}render();} else resetFilters(); });
    $('#deck-collection').addEventListener('click', () => {collection = true;resetFilters();});
    return;
  }
  $('#deck').innerHTML = `<div class="stack-card stack-back" aria-hidden="true"></div><div class="stack-card stack-middle" aria-hidden="true"></div><article class="swipe-card" aria-label="${a.title}" tabindex="0" aria-describedby="swipe-help"><div class="swipe-visual" style="background:${a.color}"><span class="swipe-category">${t(a.category).replace('&','&amp;')}</span><span class="swipe-stamp save-stamp">${t("LOVE IT")}</span><span class="swipe-stamp pass-stamp">${t("NOT TODAY")}</span>${illustration(a)}<span class="swipe-badge">✧ &nbsp; ${a.badge}</span></div><div class="swipe-body"><span class="swipe-kicker">${t("A LITTLE CREATIVITY GOES A LONG WAY")}</span><h3>${a.title}</h3><p>${a.description}</p><div class="swipe-tags"><span>◷ ${a.time} min</span><span>♧ ${t('Ages')} ${a.age.join('–')}</span><span>${a.setting === 'Outdoors' ? '☀' : '⌂'} ${t(a.setting)}</span><span>✳ ${t(a.mess + ' mess')}</span></div><button class="card-details" data-open="${a.id}">${t("See what you’ll need")} <span>↗</span></button></div><span class="sr-only" id="swipe-help">${t("Use the left arrow to pass or right arrow to save. Use the buttons below as an alternative to swiping.")}</span></article>`;
  bindSwipe($('.swipe-card'));
}
function persistSaved() {
  try {localStorage.setItem('playpicker-saved', JSON.stringify([...saved]));storageAvailable = true;} catch {storageAvailable = false;}
}
async function choose(direction) {
  const a = remainingActivities()[0];
  const card = $('.swipe-card');
  if(!a || !card || busy || collection || $('#activity-dialog').open) return;
  busy = true;
  ['pass','like','details','undo'].forEach(id => $('#'+id).disabled = true);
  const restoreFocus = card.contains(document.activeElement) || document.activeElement === card;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  card.style.transition = reduceMotion ? 'none' : 'transform 240ms ease, opacity 240ms ease';
  card.style.transform = `translateX(${direction === 'save' ? 1 : -1}00%) rotate(${direction === 'save' ? 18 : -18}deg)`;
  card.style.opacity = '0';
  if(!reduceMotion) await new Promise(resolve => setTimeout(resolve,240));
  history.push({id:a.id,direction,wasSaved:saved.has(a.id)});
  seen.add(a.id);
  if(direction === 'save') {saved.add(a.id);persistSaved();toast(storageAvailable ? t('It’s a little match! Saved to your collection ♥') : t('Saved for this visit. Browser storage is unavailable.'));}
  busy = false;
  render();
  $('#deck-announcement').textContent = `${a.title} ${direction === 'save' ? t('saved') : t('passed')}. ${remainingActivities().length} ${t('ideas remaining.')}`;
  if(restoreFocus) ($('.swipe-card') || $('#deck-restart')).focus({preventScroll:true});
}
function bindSwipe(card) {
  let drag = null;
  const reset = () => {card.style.transform = '';card.style.transition = '';card.classList.remove('dragging');card.querySelectorAll('.swipe-stamp').forEach(s => s.style.opacity = 0);};
  card.addEventListener('pointerdown', e => {
    if(busy || !e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0) || e.target.closest('button')) return;
    drag = {x:e.clientX,y:e.clientY,id:e.pointerId,dx:0,horizontal:false};
  });
  card.addEventListener('pointermove', e => {
    if(!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX-drag.x, dy = e.clientY-drag.y;
    if(!drag.horizontal && Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {drag=null;reset();return;}
    if(!drag.horizontal && Math.abs(dx) > 10) {drag.horizontal=true;card.setPointerCapture(e.pointerId);card.classList.add('dragging');}
    if(!drag.horizontal) return;
    drag.dx=dx;
    card.style.transform=`translateX(${dx}px) rotate(${dx/22}deg)`;
    $('.save-stamp').style.opacity = dx > 0 ? Math.min(dx/100,1) : 0;
    $('.pass-stamp').style.opacity = dx < 0 ? Math.min(-dx/100,1) : 0;
  });
  card.addEventListener('pointerup', e => {
    if(!drag || e.pointerId !== drag.id) return;
    const {dx,horizontal} = drag;drag=null;
    if(card.hasPointerCapture(e.pointerId)) card.releasePointerCapture(e.pointerId);
    if(horizontal) suppressClickUntil = Date.now()+400;
    if(Math.abs(dx) > Math.min(90,card.offsetWidth*.24)) choose(dx > 0 ? 'save' : 'pass'); else reset();
  });
  card.addEventListener('pointercancel', () => {drag=null;reset();});
  card.addEventListener('lostpointercapture', e => {if(e.target === card && drag) {drag=null;reset();}});
  card.addEventListener('keydown', e => {if(e.target !== card) return;if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') {e.preventDefault();choose(e.key === 'ArrowRight' ? 'save' : 'pass');}});
}
$('#pass').addEventListener('click', () => choose('pass'));
$('#like').addEventListener('click', () => choose('save'));
$('#details').addEventListener('click', () => {const a = remainingActivities()[0];if(a && !busy) openActivity(a.id);});
$('#undo').addEventListener('click', () => {
  if(busy || !history.length) return;
  const last = history.pop();seen.delete(last.id);
  if(last.direction === 'save' && !last.wasSaved) {saved.delete(last.id);persistSaved();}
  render();toast(t('Last swipe undone. Give it another look.'));
});
translateStaticPage();
$('#language-toggle').addEventListener('click', () => {
  if (busy) return;
  language = language === 'en' ? 'es' : 'en';
  try { localStorage.setItem('playpicker-language', language); } catch {}
  translateStaticPage();
  clearTimeout(toastTimer);
  $('#toast').classList.remove('visible');
  $('#deck-announcement').textContent = '';
  render();
});
$('#filter-toggle').addEventListener('click', () => {const open = $('#filter-panel').hidden;$('#filter-panel').hidden = !open;$('#filter-toggle').setAttribute('aria-expanded', String(open));});
render();


let installPrompt;
window.addEventListener('beforeinstallprompt', event => {event.preventDefault();installPrompt=event;$('#native-install').hidden=false;});
$('#install-help').addEventListener('click', () => {$('#install-dialog').showModal();document.body.classList.add('modal-open');});
$('#install-close').addEventListener('click', () => $('#install-dialog').close());
$('#install-dialog').addEventListener('close', () => document.body.classList.remove('modal-open'));
$('#native-install').addEventListener('click', async () => {
  if(!installPrompt) return;
  await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('#native-install').hidden=true;
});
window.addEventListener('appinstalled', () => {installPrompt=null;$('#native-install').hidden=true;$('#install-dialog').close();toast(t('PlayPicker is ready on your home screen.'));});
if('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => console.info('Offline support is unavailable for this visit.')));
}
