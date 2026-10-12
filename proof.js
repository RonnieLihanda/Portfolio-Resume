// Set FEED_URL to the "Publish to web" CSV link of the Portfolio Public Feed sheet.
// While it is empty, or if the fetch fails, the built-in rows below are shown.
var FEED_URL = "";
var FALLBACK = [
 {id:"01",capability:"Automation",title:"Operations automation for a data team",result:"Three n8n workflows across Jira, Tempo and Confluence",status:"In production",page:"case-ops-automation.html"},
 {id:"02",capability:"Proposals",title:"Claude skills and agents for RFP responses",result:"About a week down to about two days per response, across 30+ responses (estimate)",status:"In use",page:"case-claude-skills.html"},
 {id:"03",capability:"Leadership",title:"Leading delivery and proposal teams",result:"Data, web development and testing teams, plus proposal and AI automation teams",status:"In use",page:"team-leadership.html"},
 {id:"04",capability:"Data",title:"Reporting and dashboards from work trackers",result:"Jira, Tempo, Slack, Trello, ClickUp and Power BI",status:"In use",page:"data-dashboards.html"},
 {id:"06",capability:"Proposals",title:"RFP scouting and tracking system",result:"Scouts Sam.gov, FindRFP and other sources, updates Trello, notifies the manager",status:"In use",page:"#solutions"},
 {id:"07",capability:"Automation",title:"Hiring funnel model",result:"Google Sheets connected to hiring sites, tracking every stage",status:"In use",page:"#solutions"},
 {id:"05",capability:"Training",title:"AI and automation training",result:"More than 2,000 young people trained in Kenya",status:"Delivered",page:"training.html"}
];
function parseCSV(t){var r=[],row=[],f="",q=false,i,c;for(i=0;i<t.length;i++){c=t[i];if(q){if(c=='"'){if(t[i+1]=='"'){f+='"';i++}else q=false}else f+=c}else if(c=='"')q=true;else if(c==","){row.push(f);f=""}else if(c=="\n"||c=="\r"){if(c=="\r"&&t[i+1]=="\n")i++;row.push(f);f="";if(row.join("")!=="")r.push(row);row=[]}else f+=c}
 if(f!==""||row.length){row.push(f);r.push(row)}
 var h=r.shift()||[];return r.map(function(x){var o={};h.forEach(function(k,j){o[k.trim()]=(x[j]||"").trim()});return o})}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function safe(u){return /^(https?:\/\/|[\w\-\/.]+\.(html|json)$)/.test(u)?u:""}
function render(rows){
 var caps=[],body=document.getElementById("proof-body"),bar=document.getElementById("proof-filters");
 rows.forEach(function(r){if(r.capability&&caps.indexOf(r.capability)<0)caps.push(r.capability)});
 function draw(f){body.innerHTML=rows.filter(function(r){return !f||r.capability===f}).map(function(r){
  var p=safe(r.page||""),d=safe(r.download||"");
  return '<tr><td data-l="Area">'+esc(r.capability)+'</td><td data-l="Proof">'+(p?'<a href="'+p+'">'+esc(r.title)+'</a>':esc(r.title))+'</td><td data-l="Result">'+esc(r.result)+'</td><td data-l="Status"><span class="chip">'+esc(r.status)+'</span></td><td data-l="File">'+(d?'<a href="'+d+'" download>Download</a>':'')+'</td></tr>'}).join("")}
 bar.innerHTML='<button class="filter on" data-f="">All</button>'+caps.map(function(c){return '<button class="filter" data-f="'+esc(c)+'">'+esc(c)+'</button>'}).join("");
 bar.onclick=function(e){var b=e.target.closest("button");if(!b)return;[].forEach.call(bar.children,function(x){x.classList.remove("on")});b.classList.add("on");draw(b.getAttribute("data-f"))};
 draw("")}
(function(){
 if(!FEED_URL){render(FALLBACK);return}
 fetch(FEED_URL).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){var rows=parseCSV(t);if(!rows.length)throw 0;render(rows)}).catch(function(){render(FALLBACK)})
})();
