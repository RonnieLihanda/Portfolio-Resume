// Intent forms. To receive submissions without email, set ENDPOINT to a webhook
// (an n8n Webhook URL, Formspree or Web3Forms). With ENDPOINT empty, the form opens a ready-written email.
(function(){
  var ENDPOINT="";
  var TO="hillarylihandapro@gmail.com";
  var T=function(n,l,o){o=o||{};o.n=n;o.l=l;o.t=o.t||"text";return o};
  var NAME=[T("name","Your name",{req:1,auto:"name"}),T("email","Email",{req:1,t:"email",auto:"email"}),T("org","Organisation",{req:1,auto:"organization"})];
  var F={
    hello:{chip:"Say hello",title:"Say hello",intro:"Tell me who you are and what you are working on.",f:[NAME[0],NAME[1],T("org","Organisation (optional)"),T("message","What would you like to talk about?",{t:"area",req:1})]},
    automation:{chip:"Automate a process",title:"Tell me your hardest process",intro:"The more specific you are, the more useful my first reply will be.",f:[NAME[0],NAME[1],NAME[2],
      T("area","Which part of the business?",{t:"select",req:1,o:["Operations","Sales","Marketing","Finance","People and hiring","Compliance","Customer service","Not sure"]}),
      T("process","Describe the process that costs you the most time",{t:"area",req:1,ph:"For example: every Friday we build a status report by hand from three spreadsheets."}),
      T("freq","How often does it happen?",{t:"select",o:["Daily","Weekly","Monthly","Occasionally"]}),
      T("hours","Roughly how many hours a week does it take?",{ph:"For example: 5"}),
      T("tools","Which tools are involved today?",{ph:"Spreadsheets, Jira, email, QuickBooks"}),
      T("when","When do you want it solved?",{t:"select",o:["This month","In the next 3 months","Just exploring"]})]},
    knowledge:{chip:"Documents and knowledge",title:"Talk to me about your documents",intro:"Tell me where your documents live and what goes wrong, and I will suggest a first step.",f:[NAME[0],NAME[1],NAME[2],
      T("size","How many people use the documents?",{t:"select",o:["1 to 10","11 to 50","51 to 200","More than 200"]}),
      T("where","Where do documents live today?",{t:"checks",o:["Google Drive","SharePoint or OneDrive","Email","WhatsApp","Paper","Personal laptops","Other"]}),
      T("problem","What goes wrong most often?",{t:"area",req:1,ph:"People cannot find the latest version, old files are still in use, new staff keep asking the same questions."}),
      T("tools","Which tools do you already pay for?",{ph:"Google Workspace, Microsoft 365, Notion, Confluence"}),
      T("field","Do some staff work in the field, away from desks?",{t:"select",o:["Yes","Some","No"]}),
      T("when","When do you want to start?",{t:"select",o:["This month","In the next 3 months","Just exploring"]})]},
    onboarding:{chip:"Onboarding",title:"Tell me how you onboard today",intro:"Describe the way new people start with you, and I will point out what to write down and what to automate.",f:[NAME[0],NAME[1],NAME[2],
      T("who","Who do you onboard?",{t:"select",req:1,o:["New staff","New clients or partners","Both"]}),
      T("volume","How many people per year?",{t:"select",o:["1 to 5","6 to 20","21 to 50","More than 50"]}),
      T("owner","Who runs onboarding today?",{ph:"HR, the line manager, nobody in particular"}),
      T("tools","Tools involved today",{ph:"Email, Google Forms, Trello, spreadsheets"}),
      T("problem","What goes wrong or takes too long?",{t:"area",req:1,ph:"Accounts are late, checklists live in people's heads, nobody follows up."})]},
    workshop:{chip:"Book a workshop",title:"Book a workshop",intro:"Tell me about your group and I will come back with a proposed outline, format and price.",f:[NAME[0],NAME[1],NAME[2],
      T("topic","Topic",{t:"select",req:1,o:["AI and automation basics","Knowledge systems and documentation","Onboarding and written procedures","Jira, boards and reporting","Digital skills for young people","Something else"]}),
      T("audience","Who is the audience?",{t:"select",o:["Young people","Staff","Managers","Community or refugee groups","Mixed"]}),
      T("size","How many participants?",{t:"select",o:["Up to 15","16 to 40","41 to 100","More than 100"]}),
      T("format","Format",{t:"select",o:["In person","Online","Either"]}),
      T("place","Where? (county or town, for in person)",{}),
      T("dates","Preferred dates",{ph:"For example: the second week of November"}),
      T("funding","Who is paying?",{t:"select",o:["My organisation","A donor or grant","Free community session","Not sure yet"]}),
      T("notes","Anything else I should know?",{t:"area"})]},
    contracts:{chip:"Government contracts",title:"Get help winning government contracts",intro:"Tell me where you are in the process, and I will tell you where I would start.",f:[NAME[0],NAME[1],NAME[2],
      T("goal","What do you need most?",{t:"select",req:1,o:["Find opportunities to bid on","Get eligible (certifications and registrations)","Write a bid","Review a bid before submission","Not sure"]}),
      T("certs","What do you hold today?",{t:"checks",o:["SAM.gov registration","Small business","8(a)","WOSB or EDWOSB","HUBZone","SDVOSB","None yet"]}),
      T("naics","NAICS codes (if you know them)",{}),
      T("deadline","Is there a deadline coming?",{ph:"Solicitation name and due date, if any"}),
      T("notes","Anything else?",{t:"area"})]}
  };
  var form=document.getElementById("lead"),chips=document.getElementById("lead-chips"),title=document.getElementById("lead-title"),intro=document.getElementById("lead-intro"),status=document.getElementById("lead-status");
  if(!form)return;
  var cur="";
  var esc=function(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")};
  function field(f){
    var id="f-"+f.n,req=f.req?" required":"",lab='<label for="'+id+'">'+esc(f.l)+(f.req?"":' <span>optional</span>')+"</label>";
    if(f.t==="area")return '<div class="fld">'+lab+'<textarea id="'+id+'" name="'+f.n+'" rows="4"'+req+(f.ph?' placeholder="'+esc(f.ph)+'"':"")+"></textarea></div>";
    if(f.t==="select")return '<div class="fld">'+lab+'<select id="'+id+'" name="'+f.n+'"'+req+'><option value="">Choose</option>'+f.o.map(function(o){return "<option>"+esc(o)+"</option>"}).join("")+"</select></div>";
    if(f.t==="checks")return '<fieldset class="fld"><legend>'+esc(f.l)+' <span>optional</span></legend><div class="checks">'+f.o.map(function(o,i){return '<label><input type="checkbox" name="'+f.n+'" value="'+esc(o)+'"> '+esc(o)+"</label>"}).join("")+"</div></fieldset>";
    return '<div class="fld">'+lab+'<input id="'+id+'" name="'+f.n+'" type="'+f.t+'"'+req+(f.auto?' autocomplete="'+f.auto+'"':"")+(f.ph?' placeholder="'+esc(f.ph)+'"':"")+"></div>";
  }
  function set(k){
    if(!F[k])k="hello";cur=k;var d=F[k];
    title.textContent=d.title;intro.textContent=d.intro;status.textContent="";status.className="note";
    form.innerHTML=d.f.map(field).join("")+'<div class="hp" aria-hidden="true"><label>Leave empty<input name="website" tabindex="-1" autocomplete="off"></label></div><button class="btn primary" type="submit">Send</button> <span class="fine">I reply from Kenya, usually within one working day.</span>';
    [].forEach.call(chips.children,function(b){b.classList.toggle("on",b.getAttribute("data-i")===k)});
  }
  chips.innerHTML=Object.keys(F).map(function(k){return '<button type="button" class="filter" data-i="'+k+'">'+esc(F[k].chip)+"</button>"}).join("");
  chips.addEventListener("click",function(e){var b=e.target.closest("button");if(b)set(b.getAttribute("data-i"))});
  document.addEventListener("click",function(e){var a=e.target.closest("[data-intent]");if(a)set(a.getAttribute("data-intent"))},true);
  function collect(){
    var d=F[cur],out={},fd=new FormData(form);
    d.f.forEach(function(f){out[f.l]=f.t==="checks"?fd.getAll(f.n).join(", "):(fd.get(f.n)||"")});
    return out;
  }
  form.addEventListener("submit",function(e){
    e.preventDefault();
    if(form.website&&form.website.value)return;
    var d=F[cur],a=collect(),subject="Portfolio enquiry: "+d.title+" ("+a["Your name"]+")";
    var body=Object.keys(a).filter(function(k){return a[k]}).map(function(k){return k+": "+a[k]}).join("\n");
    function mail(){location.href="mailto:"+TO+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);status.textContent="Your email app should open with the message ready. Press send there.";status.className="note ok"}
    if(!ENDPOINT){mail();return}
    status.textContent="Sending";
    fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({intent:cur,subject:subject,answers:a,sent:new Date().toISOString(),page:location.href})})
      .then(function(r){if(!r.ok)throw 0;form.reset();status.textContent="Thank you. I have your message and will reply within one working day.";status.className="note ok"})
      .catch(function(){status.textContent="That did not send. Opening your email app instead.";mail()});
  });
  set("hello");
})();
