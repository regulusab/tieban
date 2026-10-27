/* lookup.js（v11）— 多版本條號直查、十干密碼轉碼、本機條文檔（IndexedDB）。ES5。
   十干密碼規則移植自外站 ironplate-methods-research.pages.dev（原站註：○／癸／月／支作0；巳按己作8；「ヒ」重複前一碼；不補前導零）——來源待核（參考外站）。 */
(function(W){
var D=document,ED={tyg:{st:0,d:null},kuji:{st:0,d:null},user:{st:0,d:{},n:0,file:""}};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function getJ(u,cb){var x=new XMLHttpRequest();x.open("GET",u,true);x.onload=function(){var o=null;try{o=JSON.parse(x.responseText)}catch(e){}cb(o)};x.onerror=function(){cb(null)};x.send()}
function load(k,cb){var e=ED[k];if(e.st===1||e.st===-1){cb&&cb();return}if(e.q){e.q.push(cb);return}e.q=[cb];
 var done=function(){var q=e.q;e.q=null;for(var i=0;i<q.length;i++)q[i]&&q[i]()};
 if(k==="user"){idbGet(function(o){if(o){e.d=o.d;e.n=o.n;e.file=o.file}e.st=1;done()});return}
 getJ(k==="tyg"?"tiaowen_tyg.json":"kuji.json",function(o){if(o&&o.d){e.d=o.d;e.src=o._src;e.st=1}else e.st=-1;done()})}
function loadAll(cb){var n=3,f=function(){if(--n===0&&cb)cb()};load("tyg",f);load("kuji",f);load("user",f)}
/* IndexedDB（本機條文檔，只存在此瀏覽器） */
function idb(cb){try{var r=indexedDB.open("tieban_lab",1);r.onupgradeneeded=function(){r.result.createObjectStore("kv")};r.onsuccess=function(){cb(r.result)};r.onerror=function(){cb(null)}}catch(e){cb(null)}}
function idbGet(cb){idb(function(db){if(!db)return cb(null);try{var q=db.transaction("kv","readonly").objectStore("kv").get("corpus");q.onsuccess=function(){cb(q.result||null)};q.onerror=function(){cb(null)}}catch(e){cb(null)}})}
function idbPut(v,cb){idb(function(db){if(!db)return cb&&cb(false);try{var t=db.transaction("kv","readwrite");if(v)t.objectStore("kv").put(v,"corpus");else t.objectStore("kv")["delete"]("corpus");t.oncomplete=function(){cb&&cb(true)};t.onerror=function(){cb&&cb(false)}}catch(e){cb&&cb(false)}})}
function parseCSV(t){var rows=[],row=[],f="",q=false,i,c;for(i=0;i<t.length;i++){c=t.charAt(i);if(q){if(c==='"'){if(t.charAt(i+1)==='"'){f+='"';i++}else q=false}else f+=c}else if(c==='"')q=true;else if(c===","){row.push(f);f=""}else if(c==="\n"||c==="\r"){if(c==="\r"&&t.charAt(i+1)==="\n")i++;row.push(f);rows.push(row);row=[];f=""}else f+=c}if(f||row.length){row.push(f);rows.push(row)}return rows}
var IDK=["條號","id","no","號"],TXK=["庫正文","正文","text","條文","t"];
function pick(o,ks){for(var i=0;i<ks.length;i++)if(o[ks[i]]!=null&&o[ks[i]]!=="")return String(o[ks[i]]);return""}
function importFile(file,cb){if(!file)return;if(file.size>20*1024*1024)return cb("檔案超過 20 MB，未載入。");var r=new FileReader();r.onload=function(){var t=String(r.result).replace(/^\uFEFF/,""),d={},n=0,i,j,o,arr=[];
 try{if(/\.json$/i.test(file.name)){o=JSON.parse(t);if(o&&o.d&&typeof o.d==="object"){for(j in o.d){d[j]=String(o.d[j]).split("|")[0];n++}}else{arr=o&&o.length!=null?o:(o&&o.data)||[];if(!arr.length&&o&&typeof o==="object"){for(j in o)if(/^\d{4,5}$/.test(j)){d[j]=String(o[j]);n++}}}}
  else{var R=parseCSV(t),h=R[0]||[];for(i=1;i<R.length;i++){o={};for(j=0;j<h.length;j++)o[String(h[j]).trim()]=R[i][j];arr.push(o)}}
  for(i=0;i<arr.length;i++){var id=pick(arr[i],IDK).trim(),tx=pick(arr[i],TXK);if(/^\d{4,5}$/.test(id)&&tx){d[id]=tx;n++}}}catch(e){return cb("無法解析："+e.message)}
 if(!n)return cb("找不到可用欄位（需要 條號／id 與 正文／庫正文／text／條文）。");
 var v={d:d,n:n,file:file.name,at:new Date().toISOString()};ED.user.d=d;ED.user.n=n;ED.user.file=file.name;ED.user.st=1;idbPut(v,function(){cb(null,n)})};r.readAsText(file,"utf-8")}
function clearUser(cb){ED.user.d={};ED.user.n=0;ED.user.file="";idbPut(null,cb)}
/* 十干密碼 */
var C2D={"甲":"1","丙":"2","戊":"3","庚":"4","壬":"5","乙":"6","丁":"7","己":"8","巳":"8","辛":"9","癸":"0","月":"0","支":"0","○":"0"},D2C={"0":"癸","1":"甲","2":"丙","3":"戊","4":"庚","5":"壬","6":"乙","7":"丁","8":"己","9":"辛"};
function decode(s){s=String(s).replace(/\s/g,"");var out="",prev="",i,c;if(!s)return{err:"請輸入密碼字。"};for(i=0;i<s.length;i++){c=s.charAt(i);if(c==="ヒ"){if(!prev)return{err:"首碼不能為重文號「ヒ」。"};out+=prev;continue}if(!C2D.hasOwnProperty(c))return{err:"無法辨識「"+c+"」。"};prev=C2D[c];out+=prev}return{v:out}}
function encode(s){s=String(s).replace(/\s/g,"");if(!/^\d+$/.test(s))return{err:"請輸入十進位數字。"};var o="",i;for(i=0;i<s.length;i++)o+=D2C[s.charAt(i)];return{v:o}}
/* 各版本取文 */
function texts(id){id=String(id);var r=[],T=(typeof TEXTS!=="undefined")?TEXTS:null,t,k;
 t=T&&T[id];r.push({ed:"本站主版（tiaowen.json）",t:t&&t.t,m:t&&t.age?"歲標 "+t.age:""});
 if(ED.tyg.d){t=ED.tyg.d[id];r.push({ed:"天玉宮本（另版，未與清刻校勘）",t:t?String(t).split("|")[0]:"",m:t&&String(t).split("|")[1]?"歲標 "+String(t).split("|")[1]:""})}
 if(ED.kuji.d){k=ED.kuji.d[id];r.push({ed:"坤集卷首索引・庫本欄（外站轉錄，局部）",t:k&&k[0],m:k?"排印頁 "+(k[4]||"—")+"｜"+(k[5]||"")+"｜港歲標 "+(k[2]||"未標")+"｜"+(k[3]||""):""});r.push({ed:"坤集卷首索引・港派欄（外站轉錄，局部）",t:k&&k[1],m:""})}
 if(ED.user.n)r.push({ed:"本機自有資料（"+ED.user.file+"）",t:ED.user.d[id],m:"只存在此瀏覽器"});return r}
function textsHtml(id){var a=texts(id),h="",i;for(i=0;i<a.length;i++)h+='<div class="lkr"><span class="lked">'+esc(a[i].ed)+'</span>'+(a[i].t?'<div class="lkt">'+esc(a[i].t)+'</div>':'<div class="lkt miss">此資料集未收錄（不代表原書無此條）</div>')+(a[i].m?'<div class="note">'+esc(a[i].m)+'</div>':'')+'</div>';return h}
function css(){if(D.getElementById("lkcss"))return;var s=D.createElement("style");s.id="lkcss";s.textContent=".lkr{border-left:3px solid #c9a46a;padding:4px 8px;margin:6px 0}.lked{font-size:12px;color:#7a3b12;font-weight:bold}.lkt{font-size:15px;margin:2px 0}.lkno{font-weight:bold;font-size:17px;color:#7a3b12}.lkrow{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.lkrow input,.lkrow select{min-width:0;flex:1 1 140px}.lab button,.lkw button{padding:6px 10px;margin:2px}";D.head.appendChild(s)}
function card(el,opt){css();opt=opt||{};el.className=(el.className?el.className+" ":"")+"lkw";
 el.innerHTML='<h2>條號直查與十干密碼</h2><p class="note">輸入四或五位條號，或十干密碼字（如「庚甲戊丙」）。各版本分列，不互相補文。密碼規則：○／癸／月／支作0；巳按己作8；「ヒ」重複前一碼；不補前導零（規則移植自外站 ironplate 研究站，來源待核（參考外站））。</p>'+
 '<div class="lkrow"><input id="lkq" placeholder="條號或密碼字" maxlength="12"><button type="button" id="lkgo">查條文</button><button type="button" id="lkenc">數值→密碼</button></div><div id="lkmsg" class="note"></div><div id="lkout"></div>'+
 (opt.imp?'<details style="margin-top:8px"><summary><b>載入自有完整條文（本機 CSV／JSON）</b></summary><p class="note">檔案只在此瀏覽器讀取，存入 IndexedDB，不會上傳。欄位：條號（或 id）與 庫正文／正文／text／條文。不作本站主版，只在直查中另列。</p><input type="file" id="lkfile" accept=".csv,.json,text/csv,application/json"> <button type="button" id="lkclr">清除本機資料</button><div id="lkfmsg" class="note"></div></details>':'');
 var q=D.getElementById("lkq"),out=D.getElementById("lkout"),msg=D.getElementById("lkmsg");
 function go(){var s=q.value.replace(/\s/g,""),id=s,note="";if(!s){out.innerHTML="";return}if(!/^\d+$/.test(s)){var r=decode(s);if(r.err){msg.textContent="錯誤："+r.err;out.innerHTML="";return}id=r.v;note="密碼「"+s+"」→ "+id+"。"}
  if(!/^\d{4,5}$/.test(id)){msg.textContent=note+"條號須為四或五位數。";out.innerHTML="";return}msg.textContent=note+"載入版本中…";
  loadAll(function(){msg.textContent=note+(ED.kuji.st===-1||ED.tyg.st===-1?"部分另版檔案未能載入。":"");out.innerHTML='<div class="lkno">'+esc(id)+'</div>'+textsHtml(id)})}
 D.getElementById("lkgo").onclick=go;q.onkeydown=function(e){if(e.keyCode===13)go()};
 D.getElementById("lkenc").onclick=function(){var r=encode(q.value);msg.textContent=r.err?"錯誤："+r.err:q.value.replace(/\s/g,"")+" → 密碼 "+r.v};
 if(opt.imp){var fm=D.getElementById("lkfmsg");load("user",function(){fm.textContent=ED.user.n?"已載入："+ED.user.file+"（"+ED.user.n+" 條）":"尚未載入自有檔案。"});
  D.getElementById("lkfile").onchange=function(){var f=this.files[0];fm.textContent="讀取中…";importFile(f,function(err,n){fm.textContent=err?"錯誤："+err:"已載入："+f.name+"（"+n+" 條），已存入本機 IndexedDB。"})};
  D.getElementById("lkclr").onclick=function(){clearUser(function(){fm.textContent="已清除本機自有資料。"})}}}
W.TBLK={esc:esc,load:load,loadAll:loadAll,ED:ED,texts:texts,textsHtml:textsHtml,decode:decode,encode:encode,card:card,importFile:importFile,parseCSV:parseCSV,css:css,getJ:getJ};
})(window);
