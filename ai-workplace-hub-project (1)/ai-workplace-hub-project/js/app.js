const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
const VIEWS=[['dash','Dashboard','<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>'],['email','Email Generator','<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'],['meet','Meeting Summarizer','<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'],['plan','Task Planner','<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'],['res','Research Assistant','<circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/>'],['chat','AI Assistant','<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'],['hist','Work History','<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>'],['resp','Responsible AI','<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>'],['prof','Profile','<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>']];
let S={hist:[],done:0,tasksTotal:0,name:'Sihle',role:'Operations Manager',notes:[],theme:''};
try{Object.assign(S,JSON.parse(localStorage.getItem('awph')||'{}'))}catch(e){}
if(S.name==='Alex Morgan')S.name='Sihle';
const save=()=>{try{localStorage.setItem('awph',JSON.stringify(S))}catch(e){}};
let cur='dash',chatLog=[],sample=null,lastRes={};
if(S.theme)document.documentElement.dataset.theme=S.theme;
(async()=>{try{if(typeof claude!=='undefined')sample=await claude.use('sample')}catch(e){}})();
function note(t){S.notes.unshift({t,d:Date.now()});S.notes=S.notes.slice(0,15);save();$('#dot').style.display='block'}
function log(type,title,content){S.hist.unshift({id:Date.now(),type,title,content,d:Date.now()});S.hist=S.hist.slice(0,80);note(type+' saved to history');save()}
async function ai(sys,user,json){
 const prompt=sys+'\n\n'+user+(json?'\n\nRespond ONLY with valid JSON, no markdown fences, matching this shape: '+json:'');
 let text;
 if(window.AI_CONFIG&&typeof window.AI_CONFIG.complete==='function')text=await window.AI_CONFIG.complete(prompt);
 else{
  if(!sample&&typeof claude!=='undefined')sample=await claude.use('sample');
  if(!sample)throw{message:'No AI provider configured. Open js/config.js and connect one (see README).'};
  text=(await sample([{role:'user',content:prompt}],{cache:false})).text;
 }
 if(!json)return text;
 return JSON.parse(text.replace(/```json|```/g,'').trim());
}
function nav(){$('#nav').innerHTML=VIEWS.map(v=>`<button data-go="${v[0]}" class="${v[0]===cur?'on':''}">${ICON}${v[2]}</svg>${v[1]}</button>`).join('');$('#av').textContent=S.name[0]}
function countUp(){document.querySelectorAll('.stat b').forEach(b=>{const s=b.textContent.trim();if(!/^\d+$/.test(s))return;const n=+s,t0=performance.now(),f=t=>{const p=Math.min(1,(t-t0)/900);b.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}
function go(v){cur=v;nav();$('#ttl').textContent=VIEWS.find(x=>x[0]===v)[1];$('#side').classList.remove('open');$('#pop').style.display='none';const m=$('#main');m.style.animation='none';m.offsetHeight;m.style.animation='';m.innerHTML=R[v]();(B[v]||(()=>{}))();countUp();}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){e.preventDefault();go(g.dataset.go)}});
$('#menu').onclick=()=>$('#side').classList.toggle('open');
$('#th').onclick=()=>{const d=document.documentElement,dark=getComputedStyle(d).colorScheme==='dark';S.theme=dark?'light':'dark';d.dataset.theme=S.theme;save()};
$('#bell').onclick=()=>{const p=$('#pop');$('#dot').style.display='none';p.innerHTML='<b>Notifications</b>'+(S.notes.length?S.notes.slice(0,6).map(n=>`<div class="item"><span class="tag info">New</span><div>${esc(n.t)}<br><small style="color:var(--mu)">${new Date(n.d).toLocaleTimeString()}</small></div></div>`).join(''):'<p style="color:var(--mu)">You’re all caught up.</p>');p.style.display=p.style.display==='block'?'none':'block'};
$('#srch').oninput=e=>{if(e.target.value.trim()){go('hist');$('#hq').value=e.target.value;listHist()}};
const notice='';
const busy=(b,on)=>{b.disabled=on;b.textContent=on?'Generating…':b.dataset.t};
const list=a=>'<ul class="l">'+(a||[]).map(x=>`<li>${esc(x)}</li>`).join('')+'</ul>';
const copyBtn=(id)=>`<button class="btn ghost" onclick="cp('${id}')">📋 Copy</button><button class="btn ghost" onclick="exp('${id}')">⬇ Download</button><button class="btn ghost" onclick="window.print()">🖨 Print / PDF</button>`;
window.cp=async id=>{try{await navigator.clipboard.writeText($('#'+id).innerText);note('Copied to clipboard')}catch(e){alert('Copy failed — select the text manually.')}};
window.exp=id=>{try{const b=new Blob([$('#'+id).innerText],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='ai-hub-output.txt';a.click();URL.revokeObjectURL(a.href)}catch(e){alert('Download failed. Use Print / PDF.')}};
const form=(fields,btn,extra='')=>fields+`<div class="row"><button class="btn" id="go" data-t="${btn}">${btn}</button>${extra}</div>`;
async function run(fn){const b=$('#go');busy(b,true);try{await fn()}catch(e){$('#res').innerHTML=`<div class="card" style="border-color:#EF4444">⚠️ ${esc(e.message||'Something went wrong. Please try again.')}</div>`}busy(b,false)}

const R={
dash(){const c=t=>S.hist.filter(h=>h.type===t).length,tot=S.hist.length,sc=Math.min(99,Math.round(40+tot*4+S.done*3));
 const days=[...Array(7)].map((_,i)=>{const d=new Date(Date.now()-(6-i)*864e5);return[d.toLocaleDateString('en',{weekday:'short'}),S.hist.filter(h=>new Date(h.d).toDateString()===d.toDateString()).length]}),mx=Math.max(1,...days.map(d=>d[1]));
 const st=(n,l,h)=>`<div class="card stat ${h||''}"><b>${n}</b><span>${l}</span></div>`;
 const tools=[['Emails',c('Email')],['Meetings',c('Meeting')],['Plans',c('Plan')],['Research',c('Research')]],tm=Math.max(1,...tools.map(t=>t[1]));
 return `<h2 style="margin:0 0 4px">Welcome back, ${esc(S.name.split(' ')[0])} 👋</h2><p style="color:var(--mu);margin:0 0 14px">Here’s your AI-assisted productivity overview.</p>${notice}
 <div class="grid g4">${st(sc,'AI Productivity Score','hl')}${st(S.done,'Tasks Completed')}${st(c('Email'),'Emails Generated')}${st(c('Research'),'Research Reports')}${st(c('Meeting'),'Meeting Summaries')}${st(tot,'Total AI Uses')}</div>
 <div class="grid g2" style="margin-top:14px"><div class="card"><h3>Activity · last 7 days</h3><div class="bars">${days.map(d=>`<div><i style="height:${d[1]/mx*100+4}px"></i>${d[0]}</div>`).join('')}</div></div>
 <div class="card"><h3>AI usage by tool</h3>${tools.map(t=>`<div style="margin:9px 0"><div style="display:flex;justify-content:space-between"><span>${t[0]}</span><b>${t[1]}</b></div><div style="height:7px;background:var(--bd);border-radius:9px"><div style="height:7px;width:${t[1]/tm*100}%;background:var(--pri);border-radius:9px;transition:width .6s"></div></div></div>`).join('')}</div></div>
 <div class="card" style="margin-top:14px"><h3>Recent activity</h3>${S.hist.slice(0,5).map(h=>`<div class="item"><span class="tag info">${h.type}</span><div style="flex:1">${esc(h.title)}</div><small style="color:var(--mu)">${new Date(h.d).toLocaleString()}</small></div>`).join('')||'<p style="color:var(--mu)">No activity yet — try a tool from the sidebar.</p>'}</div>`},
email(){return `${notice}<div class="grid g2"><div class="card"><h3>Smart Email Generator</h3>${form(`<label>Recipient</label><input id="to" placeholder="e.g. Sarah Lee, Head of Procurement"><label>Subject</label><input id="sub" placeholder="Q4 vendor contract renewal"><label>Key points</label><textarea id="pts" placeholder="One point per line"></textarea><label>Tone</label><select id="tone"><option>Formal<option>Friendly<option>Persuasive<option>Executive<option>Customer Support</select>`,'Generate Email')}</div>
 <div class="card"><h3>Generated email (editable)</h3><div id="res"><div class="out" style="color:var(--mu)">Your email will appear here.</div></div></div></div>`},
meet(){return `${notice}<div class="card"><h3>Meeting Notes Summarizer</h3>${form(`<label>Paste notes or transcript</label><textarea id="nt" style="min-height:160px"></textarea>`,'Summarize Meeting')}</div><div id="res" style="margin-top:14px"></div>`},
plan(){return `${notice}<div class="card"><h3>AI Smart Task Planner</h3>${form(`<label>Tasks (one per line, optionally add “| high/medium/low” and hours)</label><textarea id="tk" placeholder="Finish board report | high | 3h&#10;Reply to vendor emails | medium&#10;Reorganise shared drive | low"></textarea>`,'Build My Plan')}</div><div id="res" style="margin-top:14px"></div>`},
res(){return `${notice}<div class="card"><h3>AI Research Assistant</h3>${form(`<label>Topic or article text</label><textarea id="tp" placeholder="e.g. Impact of hybrid work on team productivity"></textarea>`,'Run Research')}</div><div id="res" style="margin-top:14px"></div>`},
chat(){return `<div class="card chat"><div class="msgs" id="msgs"></div><div class="row" id="sug">${['Draft a polite follow-up after a missed deadline','How do I run a more effective stand-up?','Give me 5 tips to prioritise a heavy workload','Help me prepare for a performance review'].map(p=>`<button class="chip">${p}</button>`).join('')}</div><div class="row"><input id="ci" placeholder="Ask your workplace assistant…" style="flex:1"><button class="btn" id="go" data-t="Send">Send</button></div></div>`},
hist(){return `<div class="card"><h3>Work History</h3><input id="hq" placeholder="Search across all saved outputs…"><div id="hl"></div></div>`},
resp(){return `${notice}<div class="grid g3"><div class="card"><h3>🔒 Data Privacy Notice</h3><p>Content you enter is sent to an AI model only to generate your result. Work history is stored in your own browser and never shared. Avoid entering passwords, personal identifiers or confidential client data.</p></div><div class="card"><h3>🔍 Transparency Statement</h3><p>All outputs on this platform are produced by a large language model guided by role-specific prompts. Results are probabilistic, may be incomplete, and are labelled as AI-generated.</p></div><div class="card"><h3>📋 AI Usage Guidelines</h3>${list(['Review and edit every output before use','Verify facts, figures and dates independently','Don’t use outputs as sole basis for legal, financial or HR decisions','Disclose AI assistance where policy requires','Report problematic output to your administrator'])}</div></div>`},
prof(){return `<div class="card" style="max-width:520px"><h3>User Profile</h3><div style="display:flex;gap:14px;align-items:center"><div class="ib" style="width:56px;height:56px;border-radius:50%;background:var(--pri);color:#fff;font-size:22px;border:0">${esc(S.name[0])}</div><div><b>${esc(S.name)}</b><br><span style="color:var(--mu)">${esc(S.role)}</span></div></div><label>Name</label><input id="pn" value="${esc(S.name)}"><label>Role</label><input id="pr" value="${esc(S.role)}"><div class="row"><button class="btn" id="ps">Save profile</button><button class="btn ghost" id="pc">Clear all history</button></div></div>`}};

const B={
email(){$('#go').onclick=()=>run(async()=>{const v=id=>$('#'+id).value.trim();if(!v('pts'))throw{message:'Please enter some key points.'};
 $('#res').innerHTML='<div class="load">Drafting…</div>';
 const t=await ai('You are an expert corporate communication specialist. Generate a professional, concise, well-structured email based on user requirements. Output the subject line then the body only.',`Recipient: ${v('to')}\nSubject: ${v('sub')}\nKey points:\n${v('pts')}\nTone: ${v('tone')}`);
 $('#res').innerHTML=`<div class="out" id="eo" contenteditable>${esc(t)}</div><div class="row">${copyBtn('eo')}</div>`;log('Email',v('sub')||'Email draft',t)})},
meet(){$('#go').onclick=()=>run(async()=>{const n=$('#nt').value.trim();if(!n)throw{message:'Paste some meeting notes first.'};$('#res').innerHTML='<div class="load">Analysing…</div>';
 const j=await ai('You are a business analyst. Summarize meeting notes and extract actionable outcomes, decisions, owners, and deadlines. Use "Unassigned"/"Not stated" when missing.',n,'{"summary":"string","decisions":["string"],"actions":[{"task":"string","owner":"string","deadline":"string"}]}');
 $('#res').innerHTML=`<div id="mo"><div class="card"><h3>Summary</h3>${esc(j.summary)}</div><div class="grid g2" style="margin-top:14px"><div class="card"><h3>Key decisions</h3>${list(j.decisions)}</div><div class="card"><h3>Action items</h3>${(j.actions||[]).map(a=>`<div class="item"><div style="flex:1"><b>${esc(a.task)}</b><br><small style="color:var(--mu)">👤 ${esc(a.owner)} · 📅 ${esc(a.deadline)}</small></div></div>`).join('')}</div></div></div><div class="row">${copyBtn('mo')}</div>`;
 log('Meeting','Meeting summary: '+(j.summary||'').slice(0,50),$('#mo').innerText)})},
plan(){$('#go').onclick=()=>run(async()=>{const n=$('#tk').value.trim();if(!n)throw{message:'Add at least one task.'};$('#res').innerHTML='<div class="load">Planning…</div>';
 const j=await ai('You are a productivity consultant. Prioritize tasks using urgency and importance frameworks (Eisenhower matrix). Score 0-100 for how realistic and balanced the workload is.',n,'{"score":number,"tasks":[{"name":"string","priority":"High|Medium|Low","quadrant":"Do Now|Schedule|Delegate|Eliminate"}],"daily":[{"time":"string","task":"string"}],"weekly":[{"day":"string","focus":"string"}]}');
 const T=j.tasks||[];S.tasksTotal+=T.length;
 $('#res').innerHTML=`<div id="po"><div class="grid g4"><div class="card stat hl"><b>${esc(j.score)}</b><span>Productivity score</span></div>${['High','Medium','Low'].map(p=>`<div class="card"><h3><span class="tag ${p}">${p} Priority</span></h3>${T.filter(t=>t.priority===p).map(t=>`<label style="font-weight:400;display:flex;gap:6px;margin:6px 0"><input type="checkbox" style="width:auto" class="tc">${esc(t.name)}</label>`).join('')||'<small style="color:var(--mu)">None</small>'}</div>`).join('')}</div>
 <div class="grid g3" style="margin-top:14px"><div class="card"><h3>Priority matrix</h3><div class="mx">${['Do Now','Schedule','Delegate','Eliminate'].map(q=>`<div><b>${q}</b>${T.filter(t=>t.quadrant===q).map(t=>esc(t.name)).join('<br>')}</div>`).join('')}</div></div>
 <div class="card"><h3>Daily schedule</h3>${(j.daily||[]).map(d=>`<div class="item"><b style="width:76px">${esc(d.time)}</b>${esc(d.task)}</div>`).join('')}</div>
 <div class="card"><h3>Weekly planner</h3>${(j.weekly||[]).map(d=>`<div class="item"><b style="width:46px">${esc(d.day)}</b>${esc(d.focus)}</div>`).join('')}</div></div></div><div class="row">${copyBtn('po')}</div>`;
 document.querySelectorAll('.tc').forEach(c=>c.onchange=()=>{S.done+=c.checked?1:-1;S.done=Math.max(0,S.done);save();if(c.checked)note('Task completed — nice work!')});
 log('Plan','Plan: '+T.length+' tasks',$('#po').innerText)})},
res(){$('#go').onclick=()=>run(async()=>{const n=$('#tp').value.trim();if(!n)throw{message:'Enter a topic or article.'};$('#res').innerHTML='<div class="load">Researching…</div>';
 const j=await ai('You are a workplace research analyst. Provide concise insights, recommendations, and executive summaries. Base your answer only on your general knowledge or the supplied text, and flag uncertainty.',n,'{"summary":"string","insights":["string"],"recommendations":["string"],"risks":["string"],"opportunities":["string"]}');
 $('#res').innerHTML=`<div id="ro"><div class="card"><h3>Executive summary</h3>${esc(j.summary)}</div><div class="grid g2" style="margin-top:14px"><div class="card"><h3>💡 Key insights</h3>${list(j.insights)}</div><div class="card"><h3>✅ Recommendations</h3>${list(j.recommendations)}</div><div class="card"><h3>⚠️ Risks</h3>${list(j.risks)}</div><div class="card"><h3>🚀 Opportunities</h3>${list(j.opportunities)}</div></div></div><div class="row">${copyBtn('ro')}</div>`;
 log('Research',n.slice(0,60),$('#ro').innerText)})},
chat(){const box=$('#msgs'),draw=()=>{box.innerHTML=(chatLog.length?chatLog:[{r:'a',c:'Hi! I’m your workplace assistant. Ask me about communication, planning, meetings or career situations.'}]).map(m=>`<div class="m ${m.r}">${esc(m.c)}</div>`).join('');box.scrollTop=1e9};draw();
 const send=async t=>{t=t.trim();if(!t)return;$('#ci').value='';$('#sug').style.display='none';chatLog.push({r:'u',c:t});draw();const b=$('#go');b.disabled=true;
  try{const hist=chatLog.slice(-10).map(m=>(m.r==='u'?'User: ':'Assistant: ')+m.c).join('\n');const a=await ai('You are a professional workplace AI assistant. Be concise, practical and courteous. Encourage verification for important decisions.',hist);chatLog.push({r:'a',c:a});if(chatLog.length==2)log('Chat',t.slice(0,60),t+'\n\n'+a)}catch(e){chatLog.push({r:'a',c:'⚠️ '+(e.message||'Error')})}b.disabled=false;draw()};
 $('#go').onclick=()=>send($('#ci').value);$('#ci').onkeydown=e=>{if(e.key==='Enter')send(e.target.value)};document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>send(c.textContent))},
hist(){$('#hq').oninput=listHist;listHist()},
prof(){$('#ps').onclick=()=>{S.name=$('#pn').value||S.name;S.role=$('#pr').value;save();nav();note('Profile updated');go('prof')};$('#pc').onclick=()=>{if(confirm('Delete all saved history?')){S.hist=[];S.done=0;save();go('prof')}}}};
function listHist(){const q=($('#hq').value||'').toLowerCase(),a=S.hist.filter(h=>(h.title+h.content+h.type).toLowerCase().includes(q));
 $('#hl').innerHTML=a.map(h=>`<div class="item"><span class="tag info">${h.type}</span><div style="flex:1"><b>${esc(h.title)}</b><br><small style="color:var(--mu)">${new Date(h.d).toLocaleString()}</small><details><summary style="cursor:pointer;color:var(--pri)">View output</summary><div class="out" style="margin-top:6px">${esc(h.content)}</div></details></div><button class="btn ghost" data-del="${h.id}">Delete</button></div>`).join('')||'<p style="color:var(--mu)">Nothing found.</p>';
 document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{S.hist=S.hist.filter(h=>h.id!=b.dataset.del);save();listHist()})}
$('#dot').style.display=S.notes.length?'block':'none';
nav();go('dash');
