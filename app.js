'use strict';
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let DATA, STYLES, active='all', query='', sort='newest', currentId=null, uploadUrl=null, toastTimer;
let selected=new Set(), prefs={includeDna:false,overrides:''};
try { prefs={...prefs,...JSON.parse(localStorage.getItem('taste-vault-preferences')||'{}')}; selected=new Set(JSON.parse(localStorage.getItem('taste-vault-selection')||'[]').slice(0,3)); } catch {}
const collectionFor = id => DATA.collections.find(c=>c.id===id);
const entryFor = id => DATA.entries.find(e=>e.id===id);
const imagePath = e => 'images/'+encodeURIComponent(e.file);
const referencePath = e => (DATA.meta.imagesPath||'images/')+e.file;
function saveLocal(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
function notify(message){clearTimeout(toastTimer); const host=[...document.querySelectorAll('dialog[open]')].at(-1)||document.body;host.append($('toast'));$('toast').textContent=message;$('toast').classList.add('show');toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2600);}
function openDialog(id){$(id).showModal();}
function closeDialog(id){$(id).close();}
function tags(words){return (words||[]).map(v=>`<span>${esc(v)}</span>`).join('');}
function setActive(id){active=(id==='all'||id==='styles'||collectionFor(id))?id:'all';history.replaceState(null,'','#'+active);render();}
function visibleEntries(){let entries=DATA.entries.filter(e=>(active==='all'||e.collection===active)&&(!query||[e.title,e.family,e.note,...e.vocabulary,collectionFor(e.collection)?.name].join(' ').toLowerCase().includes(query)));return entries.sort(sort==='name'?(a,b)=>a.title.localeCompare(b.title):(a,b)=>b.added.localeCompare(a.added));}
function visibleStyles(){return STYLES.styles.filter(s=>!query||[s.name,...s.vocabulary,...s.recognize].join(' ').toLowerCase().includes(query)).sort(sort==='name'?(a,b)=>a.name.localeCompare(b.name):()=>0);}
function renderNav(){
 const nav=(id,label,count,icon)=>`<button class="nav-item${active===id?' active':''}" data-collection="${esc(id)}"${active===id?' aria-current="page"':''}>${icon}<span>${esc(label)}</span><span class="nav-count">${count}</span></button>`;
 $('libraryNav').innerHTML=nav('all','All references',DATA.entries.length,'<span class="nav-icon" aria-hidden="true">▦</span>')+nav('styles','Style guide',STYLES.styles.length,'<span class="nav-icon" aria-hidden="true">◈</span>');
 $('collectionNav').innerHTML=DATA.collections.map(c=>nav(c.id,c.name,DATA.entries.filter(e=>e.collection===c.id).length,`<span class="collection-dot" style="--dot:${/^#[0-9a-f]{6}$/i.test(c.accent)?c.accent:'#8b91a0'}" aria-hidden="true"></span>`)).join('');
 $('collectionCount').textContent=DATA.collections.length;
 $('libraryCount').textContent=DATA.entries.length+' references · '+DATA.collections.length+' collections';
 $('collectionSelect').innerHTML='<option value="all">All references</option>'+DATA.collections.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')+'<option value="styles">Style guide</option>';
 $('collectionSelect').value=active;
 document.querySelectorAll('[data-collection]').forEach(button=>button.onclick=()=>setActive(button.dataset.collection));
}
function render(){
 renderNav();
 const collection=collectionFor(active), isStyles=active==='styles', list=isStyles?visibleStyles():visibleEntries();
 $('pageTitle').firstChild.textContent=isStyles?'Style guide':collection?.name||'All references';
 $('resultCount').textContent=list.length;
 $('pageDescription').textContent=isStyles?'Explore the visual languages behind the work.':collection?'A different point of view. Saved for the right project.':'Collect what catches your eye. Make it your own.';
 $('collectionDetailsButton').hidden=!collection;
 $('browseHint').hidden=isStyles;
 $('footerCount').textContent=list.length+(isStyles?' styles':' references')+(query?' matching “'+$('searchInput').value+'”':' in view');
 $('emptyState').hidden=list.length>0;
 $('grid').innerHTML=isStyles?list.map(styleCard).join(''):list.map(referenceCard).join('');
 document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openReference(b.dataset.open));
 document.querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>toggleSelection(b.dataset.select));
 document.querySelectorAll('[data-style-brief]').forEach(b=>b.onclick=()=>copyText(styleBrief(b.dataset.styleBrief)));
 document.querySelectorAll('[data-style-vocabulary]').forEach(b=>b.onclick=()=>copyText(STYLES.styles.find(s=>s.id===b.dataset.styleVocabulary).vocabulary.join(', '),'Vocabulary copied'));
 renderTray();
}
function referenceCard(e){return `<article class="reference-card"><button class="select-reference${selected.has(e.id)?' selected':''}" data-select="${esc(e.id)}" aria-label="${selected.has(e.id)?'Deselect':'Select'} ${esc(e.title)} for comparison" aria-pressed="${selected.has(e.id)}">${selected.has(e.id)?'✓':'+'}</button><button class="image-button" data-open="${esc(e.id)}" aria-label="Open ${esc(e.title)}"><img loading="lazy" src="${imagePath(e)}" alt="${esc(e.title)}"><span class="open-label">View reference ↗</span></button><div class="card-meta"><div><h2>${esc(e.title)}</h2><p><span class="collection-dot" style="--dot:${/^#[0-9a-f]{6}$/i.test(collectionFor(e.collection).accent)?collectionFor(e.collection).accent:'#8b91a0'}" aria-hidden="true"></span>${esc(collectionFor(e.collection).name)}</p></div><span class="card-arrow" aria-hidden="true">↗</span></div></article>`;}
function styleCard(s){return `<article class="style-card"><div class="style-preview spx-${esc(s.id)}">${SPECIMENS[s.id]||''}</div><div class="style-copy"><h2>${esc(s.name)}</h2><p>${s.recognize.map(esc).join(' · ')}</p><div class="tags">${tags(s.vocabulary)}</div>${s.warning?`<p class="style-warning">${esc(s.warning)}</p>`:''}<div class="style-links">${s.canonical.filter(c=>/^https?:\/\//.test(c.url)).map(c=>`<a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.name)} ↗</a>`).join('')}</div><div class="style-actions"><button class="button" data-style-brief="${esc(s.id)}">Copy brief</button><button class="button quiet" data-style-vocabulary="${esc(s.id)}">Vocabulary</button></div></div></article>`;}
function renderTray(){
 $('compareTray').hidden=!selected.size;
 $('trayThumbs').innerHTML=[...selected].map(id=>{const e=entryFor(id);return `<img src="${imagePath(e)}" alt="${esc(e.title)}">`;}).join('');
 $('selectionCount').textContent=selected.size+' / 3 selected';
 $('compareButton').disabled=selected.size<2;
 if(currentId){$('detailSelect').textContent=selected.has(currentId)?'Remove from comparison':'Select to compare';$('detailSelect').setAttribute('aria-pressed',selected.has(currentId));}
}
function toggleSelection(id){
 const focused=document.activeElement?.dataset?.select;
 if(selected.has(id))selected.delete(id);else if(selected.size<3)selected.add(id);else{notify('Three selected. Remove one to add another.');return;}
 saveLocal('taste-vault-selection',[...selected]);render();
 if(focused)document.querySelector(`[data-select="${CSS.escape(focused)}"]`)?.focus();
}
function openReference(id){
 const e=entryFor(id);if(!e)return;currentId=id;
 const list=visibleEntries(), at=list.findIndex(x=>x.id===id);
 $('inspectorLabel').textContent=at>=0?`Reference ${at+1} of ${list.length}`:'Reference';
 $('previousReference').disabled=at<=0;$('nextReference').disabled=at<0||at>=list.length-1;
 $('detailImage').src=imagePath(e);$('detailImage').alt=e.title;
 $('detailCollection').textContent=collectionFor(e.collection).name;$('detailTitle').textContent=e.title;$('detailFamily').textContent=e.family;
 $('detailNote').textContent=e.note||'A visual reference for your next project.';$('detailVocabulary').innerHTML=tags(e.vocabulary);
 $('detailPlacement').textContent=e.heroUsage||'Use the reference to guide composition and hierarchy.';$('detailRecipe').textContent=e.imageRecipe||'No image recipe saved.';$('copyImagePrompt').disabled=!e.imageRecipe;
 $('detailPreferenceStatus').textContent=(prefs.includeDna?'Includes your general preferences.':'Reference-led brief · House DNA is off.')+(prefs.overrides.trim()?' Project notes included.':'');
 $('imageStage').classList.remove('zoomed');$('zoomButton').textContent='Zoom in';$('zoomButton').setAttribute('aria-pressed','false');
 renderTray();if(!$('inspector').open)openDialog('inspector');$('imageStage').scrollTop=0;$('imageStage').scrollLeft=0;document.querySelector('.detail-panel').scrollTop=0;
}
function navigateReference(delta){const list=visibleEntries(), index=list.findIndex(e=>e.id===currentId);if(index>=0&&list[index+delta])openReference(list[index+delta].id);}
function openComparison(){
 const entries=[...selected].map(entryFor);if(entries.length<2)return;
 $('comparisonGrid').style.setProperty('--compare-columns',entries.length);
 $('comparisonGrid').innerHTML=entries.map(e=>`<article class="compare-item"><div class="compare-image"><img src="${imagePath(e)}" alt="${esc(e.title)}"></div><h3>${esc(e.title)}</h3><p class="detail-family">${esc(e.family)}</p><div class="tags">${tags(e.vocabulary.slice(0,3))}</div><p>${esc(e.note)}</p><button class="button" data-inspect="${esc(e.id)}">Inspect reference ↗</button></article>`).join('');
 document.querySelectorAll('[data-inspect]').forEach(b=>b.onclick=()=>openReference(b.dataset.inspect));openDialog('comparison');
}
function preferenceBrief(){return [prefs.includeDna?`General preferences (defaults, not absolute rules):\n${DATA.dna.constants.map(s=>'- '+s).join('\n')}\nUsually avoid: ${DATA.dna.never.join('; ')}.`:'',prefs.overrides.trim()?`Project-specific directions (take priority):\n${prefs.overrides.trim()}`:'','Follow the selected references and explicit project directions when they differ from general preferences.'].filter(Boolean).join('\n\n');}
function entrySection(e){return `Reference: ${e.title}\nScreenshot: ${referencePath(e)}\nAesthetic: ${e.family} (${collectionFor(e.collection).name})\nVocabulary: ${e.vocabulary.join(', ')}\nWhat to borrow: ${e.note}\nComposition: ${e.heroUsage||'Use the reference image for composition.'}${e.imageRecipe?'\nImage recipe: '+e.imageRecipe:''}`;}
function buildBrief(entries){return `Build [describe the website or product] for [audience].\nPrimary action: [what the visitor should do].\nRequired content: [sections and copy].\n\n${entries.map(entrySection).join('\n\n---\n\n')}\n\n${entries.length>1?'Use these as a reference set. If they represent different aesthetics, create one direction per reference before choosing one; do not automatically blend them.\n\n':''}${preferenceBrief()}\n\nRead the reference images before designing. Borrow their visual treatment and hierarchy; write for our product and use our content. Do not reuse sample claims or endorsements. Generate original image assets where useful with the available image-generation tool, using the recipes and composition notes. Build real responsive HTML text, controls, and components around those assets. Verify the result in a browser on desktop and mobile.`;}
function styleBrief(id){const s=STYLES.styles.find(x=>x.id===id);return `Build [project] for [audience].\nPrimary action: [action].\n\nAesthetic: ${s.name}\nVocabulary: ${s.vocabulary.join(', ')}\nReferences: ${s.canonical.map(c=>c.name+' '+c.url).join('\n')}\nDirection to explore: ${s.risk}\nImage direction: ${s.imageStyle||'Use type and layout to lead.'}\n\n${preferenceBrief()}\n\nImplement as a responsive interface and verify desktop and mobile in a browser.`;}
function imagePrompt(e){return `${e.imageRecipe}\n\nComposition: ${e.heroUsage||'Use the reference composition.'}\n\nUse ${referencePath(e)} as a style reference. Match treatment, texture, palette and balance while adapting the subject to our project. Return the artwork asset only; keep interface text and controls in code.`;}
async function copyText(text,message='Brief copied'){
 try{await navigator.clipboard.writeText(text);notify(message);}catch{$('copyFallback').value=text;if(!$('copyDialog').open)openDialog('copyDialog');$('copyFallback').focus();$('copyFallback').select();}
}
function openCollection(){const c=collectionFor(active);if(!c)return;$('collectionDialogTitle').textContent=c.name;$('collectionDescription').textContent=c.description;$('collectionUse').textContent=c.deployFor;$('collectionVocabulary').innerHTML=tags(c.vocabulary);$('collectionRisk').textContent=c.risk;openDialog('collectionDialog');}
function openPreferences(){$('includeDna').checked=!!prefs.includeDna;$('projectOverrides').value=prefs.overrides;$('dnaConstants').innerHTML=DATA.dna.constants.map(s=>`<li>${esc(s)}</li>`).join('');$('dnaNever').innerHTML=DATA.dna.never.map(s=>`<li>${esc(s)}</li>`).join('');openDialog('preferences');}
function openAdd(){
 $('addForm').reset();$('uploadPreview').hidden=true;$('uploadError').textContent='';$('uploadLabel').textContent='Choose a screenshot';
 $('referenceCollection').innerHTML=DATA.collections.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
 if(collectionFor(active))$('referenceCollection').value=active;
 openDialog('addDialog');
}
function fileBase64(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('Unable to read that file.'));reader.readAsDataURL(file);});}
async function submitReference(event){event.preventDefault();const file=$('referenceFile').files[0];if(!file)return;
 $('uploadError').textContent='';if(file.size>20*1024*1024){$('uploadError').textContent='Please choose an image smaller than 20 MB.';return;}
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)){$('uploadError').textContent='Please choose a PNG, JPEG or WebP image.';return;}
 const button=$('saveReference');button.disabled=true;button.textContent='Saving…';
 try{
  const response=await fetch('/api/references',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:$('referenceTitle').value.trim(),collection:$('referenceCollection').value,note:$('referenceNote').value.trim(),vocabulary:$('referenceVocabulary').value.split(',').map(s=>s.trim()).filter(Boolean),imageRecipe:$('referenceRecipe').value.trim(),image:await fileBase64(file)})});
  const result=await response.json().catch(()=>({error:'Saving is unavailable. Start the Taste Vault server and try again.'}));if(!response.ok)throw new Error(result.error||'Could not save this reference.');
  DATA=await (await fetch('data/gallery.json',{cache:'no-store'})).json();query='';$('searchInput').value='';setActive(result.entry.collection);closeDialog('addDialog');notify('Reference saved to your library');
 }catch(error){$('uploadError').textContent=error.message;}finally{button.disabled=false;button.textContent='Save reference';}
}
async function boot(){
 try{
  [DATA,STYLES]=await Promise.all(['data/gallery.json','data/styles.json'].map(async url=>{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('Unable to load your library.');return r.json();}));
  selected=new Set([...selected].filter(id=>entryFor(id)));setActive(location.hash.slice(1)||'all');
 }catch(error){$('grid').innerHTML=`<div class="empty-state"><h2>Your library couldn't load</h2><p>${esc(error.message)} Refresh the page to try again.</p></div>`;return;}
 $('searchInput').oninput=event=>{query=event.target.value.trim().toLowerCase();render();};$('sortSelect').onchange=event=>{sort=event.target.value;render();};$('collectionSelect').onchange=event=>setActive(event.target.value);
 $('resetSearch').onclick=()=>{query='';$('searchInput').value='';setActive('all');};
 $('clearSelection').onclick=()=>{selected.clear();saveLocal('taste-vault-selection',[]);render();};$('compareButton').onclick=openComparison;$('copyCombinedBrief').onclick=()=>copyText(buildBrief([...selected].map(entryFor)));
 $('detailSelect').onclick=()=>toggleSelection(currentId);$('copyReferenceBrief').onclick=()=>copyText(buildBrief([entryFor(currentId)]));$('copyImagePrompt').onclick=()=>copyText(imagePrompt(entryFor(currentId)),'Image prompt copied');
 $('previousReference').onclick=()=>navigateReference(-1);$('nextReference').onclick=()=>navigateReference(1);
 $('zoomButton').onclick=()=>{const zoomed=$('imageStage').classList.toggle('zoomed');$('zoomButton').textContent=zoomed?'Fit image':'Zoom in';$('zoomButton').setAttribute('aria-pressed',zoomed);};
 $('preferencesButton').onclick=openPreferences;$('savePreferences').onclick=()=>{prefs={includeDna:$('includeDna').checked,overrides:$('projectOverrides').value};saveLocal('taste-vault-preferences',prefs);closeDialog('preferences');notify('Preferences saved');};
 $('collectionDetailsButton').onclick=openCollection;
 $('copyCollectionBrief').onclick=()=>{const c=collectionFor(active);copyText(`Collection: ${c.name}\n${c.description}\nVocabulary: ${c.vocabulary.join(', ')}\nDirection to explore: ${c.risk}\n\n`+buildBrief(DATA.entries.filter(e=>e.collection===active)));};
 $('copyCollectionVocabulary').onclick=()=>copyText(collectionFor(active).vocabulary.join(', '),'Vocabulary copied');
 $('addButton').onclick=openAdd;$('addForm').onsubmit=submitReference;
 $('referenceFile').onchange=()=>{const file=$('referenceFile').files[0];if(uploadUrl)URL.revokeObjectURL(uploadUrl);$('uploadPreview').hidden=true;$('uploadError').textContent='';if(!file)return;$('uploadLabel').textContent=file.name;if(file.size>20*1024*1024){$('uploadError').textContent='Please choose an image smaller than 20 MB.';return;}uploadUrl=URL.createObjectURL(file);$('uploadPreview').src=uploadUrl;$('uploadPreview').hidden=false;if(!$('referenceTitle').value)$('referenceTitle').value=file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');};
 document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeDialog(b.dataset.close));
 document.querySelectorAll('dialog').forEach(dialog=>{dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});dialog.addEventListener('close',()=>{if(dialog.contains($('toast')))document.body.append($('toast'));});});
 window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(id==='all'||id==='styles'||collectionFor(id))setActive(id);});
 document.addEventListener('keydown',event=>{const editing=/INPUT|TEXTAREA|SELECT/.test(event.target.tagName);if(event.key==='/'&&!editing&&!document.querySelector('dialog[open]')){event.preventDefault();$('searchInput').focus();}if($('inspector').open&&!editing&&!$('copyDialog').open){if(event.key==='ArrowLeft')navigateReference(-1);if(event.key==='ArrowRight')navigateReference(1);}});
}
boot();
