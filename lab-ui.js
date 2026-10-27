/* lab-ui.js（v11）— process.html「研究工具」區。ES5。
   外站來源：A＝ironplate-methods-research.pages.dev（公式直線、散列、歲對候選、九盤、方法登錄；原站註依《總錄》第三版筆記）
             B＝ironplate-research.sky-berry.workers.dev（A 之舊版，同一程式）
             C＝tieban-number-research.abraham408499.chatgpt.site（86 取數法目錄、規則引擎、八卦滾、河洛元堂、研究筆記）
             E／F＝ironplate-research.observant-lillipilli.workers.dev／ironplate-station-preview-20261006.fanatical-area.workers.dev（命造工作表批次、CSV、案例 JSON）
   一律標「來源待核（參考外站）」；本站未另行核實，不改寫原站狀態標記，不補造號碼或條文。 */
(function(W){
var D=document,LK=W.TBLK,esc=LK.esc,L=W.IPLAB,CAT=null,LOGK="tb_lab_log",AGEK="tb_lab_age",BATCH=[];
var PEND="來源待核（參考外站）";
var STA={verified:"原站標：明確規則／可試算",partial:"原站標：部分規則／清單",pending:"原站標：待核（僅記錄）"};
function g(id){return D.getElementById(id)}
function lsGet(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
function dl(name,text,type){var b=new Blob(["\uFEFF"+text],{type:type||"text/plain;charset=utf-8"}),a=D.createElement("a");a.href=URL.createObjectURL(b);a.download=name;D.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.parentNode.removeChild(a)},500)}
function csvCell(v){v=String(v==null?"":v);return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}
function csv(rows){var o=[],i;for(i=0;i<rows.length;i++)o.push(rows[i].map(csvCell).join(","));return o.join("\r\n")}
function now8(){return new Date(Date.now()+480*60000).toISOString().replace("T"," ").slice(0,19)+"（UTC+8）"}
function numsHtml(ids){var h="",i;for(i=0;i<ids.length&&i<60;i++)h+='<details class="lknum"><summary><b>'+esc(ids[i].value!=null?ids[i].value:ids[i])+'</b>'+(ids[i].label?' <span class="note">'+esc(ids[i].label)+'</span>':'')+'</summary>'+LK.textsHtml(ids[i].value!=null?ids[i].value:ids[i])+'</details>';if(ids.length>60)h+='<p class="note">共 '+ids.length+' 號，畫面只列前 60 號；存入紀錄／匯出含全部。</p>';return h}
function badge(t){return '<span class="lbg">'+esc(t)+'</span>'}

/* ===== 1 公式取數（A） ===== */
var CURA=null,LASTA=null;
function fieldA(f){var o=L.fieldOptions(f);if(o)return '<label>'+esc(f.label)+'<select name="'+f.name+'">'+o+'</select></label>';
 return '<label>'+esc(f.label)+(f.min!=null?'（'+f.min+'–'+f.max+'）':'')+'<input name="'+f.name+'" type="number" inputmode="numeric"'+(f.min!=null?' min="'+f.min+'" max="'+f.max+'"':'')+'></label>'}
function tabA(el){var cats={},i,m,o='<option value="">請選擇方法</option>';for(i=0;i<L.METHODS.length;i++){m=L.METHODS[i];(cats[m.category]=cats[m.category]||[]).push(m)}
 for(var c in cats){o+='<optgroup label="'+esc(c)+'">';for(i=0;i<cats[c].length;i++)o+='<option value="'+cats[c][i].id+'">'+esc(cats[c][i].title)+'</option>';o+='</optgroup>'}
 el.innerHTML='<p class="note">六親等差直線、夫妻年差、六親五行、科甲、事類歲度直線與散列清單。公式與號碼移植自外站 A／B（原站註依《總錄》第三版研究筆記），'+PEND+'。公式只產生條號，不證明事件屬實。</p><select id="laM">'+o+'</select><form id="laF" onsubmit="return false"></form><div id="laO"></div>';
 g("laM").onchange=function(){CURA=null;for(var j=0;j<L.METHODS.length;j++)if(L.METHODS[j].id===this.value)CURA=L.METHODS[j];var F=g("laF");g("laO").innerHTML="";if(!CURA){F.innerHTML="";return}
  F.innerHTML='<div class="note">'+badge(STA[CURA.status]||CURA.status)+badge(PEND)+' 依據：'+esc(CURA.source||"")+(CURA.note?'；'+esc(CURA.note):'')+'</div><div class="grid">'+CURA.fields.map(fieldA).join("")+'</div><button type="button" id="laGo">試算</button>';
  g("laGo").onclick=runA};}
function runA(){var F=g("laF"),vals={},els=F.querySelectorAll("input,select"),i,f,r,out=g("laO");
 for(i=0;i<els.length;i++)vals[els[i].name]=els[i].value;
 for(i=0;i<CURA.fields.length;i++){f=CURA.fields[i];var v=vals[f.name];if(v===""||v==null){out.innerHTML='<p class="miss">請填「'+esc(f.label)+'」。</p>';return}
  if(f.type==="number"&&f.min!=null&&(+v<f.min||+v>f.max||Math.floor(+v)!==+v)){out.innerHTML='<p class="miss">'+esc(f.label)+'須為 '+f.min+'–'+f.max+' 的整數；超出公式域不試算。</p>';return}
  if(CURA.kind==="age"&&(+v<CURA.start||+v>CURA.end)){out.innerHTML='<p class="miss">本線只適用 '+CURA.start+'–'+CURA.end+' 歲。</p>';return}}
 try{r=L.computeA(CURA,vals)}catch(e){out.innerHTML='<p class="miss">無法試算：'+esc(e.message)+'</p>';return}
 LASTA={t:now8(),src:"A",method:CURA.title,id:CURA.id,inputs:vals,steps:r.steps,ids:r.ids,label:PEND+"；"+(STA[CURA.status]||"")};
 out.innerHTML='<ol class="lst">'+r.steps.map(function(s){return '<li>'+esc(s)+'</li>'}).join("")+'</ol>'+(r.ids.length?'':'<p class="miss">本資料未列號碼。</p>')+'<div id="laN">載入版本中…</div><button type="button" id="laS">存入研究紀錄</button><button type="button" id="laB">加入批次表</button>';
 LK.loadAll(function(){var n=g("laN");if(n)n.innerHTML=numsHtml(r.ids)});
 g("laS").onclick=function(){addLog(LASTA);this.textContent="已存入"};g("laB").onclick=function(){BATCH.push(LASTA);drawBatch();this.textContent="已加入（"+BATCH.length+"）"}}

/* ===== 2 批次表（E／F 命造工作表） ===== */
function tabBatch(el){el.innerHTML='<p class="note">把「公式取數」各次試算加入同一表（仿外站 E／F 命造工作表之「精確取數清單」）。可下載 CSV，或匯出／匯入案例 JSON（只在裝置下載或讀取，不上傳；本站不產生含個資的分享網址）。</p><div id="lbT"></div><button type="button" id="lbC">下載 CSV</button><button type="button" id="lbJ">匯出案例 JSON</button><label class="pxb" style="display:inline-block">匯入案例 JSON<input type="file" id="lbI" accept=".json,application/json" style="display:none"></label><button type="button" id="lbX">清空</button><div id="lbM" class="note"></div>';
 drawBatch();
 g("lbC").onclick=function(){if(!BATCH.length)return;var R=[["時間","來源","方法","輸入","條號","步驟","標記"]];BATCH.forEach(function(x){R.push([x.t,x.src,x.method,JSON.stringify(x.inputs),x.ids.join("／"),x.steps.join(" ｜ "),x.label])});dl("鐵板研究批次表.csv",csv(R),"text/csv;charset=utf-8")};
 g("lbJ").onclick=function(){dl("鐵板研究案例.json",JSON.stringify({schema:"tieban-lab-case",version:1,exportedAt:now8(),rows:BATCH},null,1),"application/json")};
 g("lbX").onclick=function(){BATCH=[];drawBatch()};
 g("lbI").onchange=function(){var f=this.files[0];if(!f)return;if(f.size>2*1024*1024){g("lbM").textContent="檔案超過 2 MiB，未匯入。";return}var r=new FileReader();r.onload=function(){try{var o=JSON.parse(String(r.result).replace(/^\uFEFF/,""));if(o.schema!=="tieban-lab-case"||!o.rows||!o.rows.length)throw new Error("格式不符");if(BATCH.length&&!confirm("取代目前批次表？"))return;BATCH=o.rows.filter(function(x){return x&&x.ids&&x.steps});drawBatch();g("lbM").textContent="已匯入 "+BATCH.length+" 列。"}catch(e){g("lbM").textContent="無法匯入："+e.message}};r.readAsText(f,"utf-8")}}
function drawBatch(){var t=g("lbT");if(!t)return;t.innerHTML=BATCH.length?'<table class="ltb"><tr><th>方法</th><th>條號</th><th>條文（主版）</th></tr>'+BATCH.map(function(x){return '<tr><td>'+esc(x.method)+'</td><td>'+esc(x.ids.join("／"))+'</td><td>'+esc(x.ids.map(function(n){var T=(typeof TEXTS!=="undefined")?TEXTS[n]:null;return T&&T.t?T.t:"（未收錄）"}).join("／"))+'</td></tr>'}).join("")+'</table>':'<p class="note">批次表是空的。</p>'}

/* ===== 3 取數法目錄與試算（C） ===== */
function tabC(el){el.innerHTML='<p class="note">外站 C 的 86 筆取數法目錄（含來源、頁碼、證據狀態、缺口）與其規則引擎。只執行原站已寫成程式的算式；缺規則者只列缺口，不產生號碼。'+PEND+'。</p><div class="lkrow"><select id="lcS"><option value="">所有證據狀態</option><option>規則可重現</option><option>部分規則</option><option>僅名稱／書目</option></select><input id="lcQ" placeholder="搜尋名稱"></div><select id="lcM"></select><div id="lcD"></div>';
 function fill(){if(!CAT)return;var s=g("lcS").value,q=g("lcQ").value.trim(),o='<option value="">請選擇（'+CAT.methods.length+' 筆）</option>',n=0;CAT.methods.forEach(function(m){if(s&&m.evidenceStatus!==s)return;if(q&&m.title.indexOf(q)<0)return;n++;o+='<option value="'+esc(m.id)+'">'+esc((m.displayId||m.id)+' '+m.title)+'</option>'});g("lcM").innerHTML=o.replace(/（\d+ 筆）/,'（'+n+' 筆）')}
 g("lcS").onchange=fill;g("lcQ").oninput=fill;
 g("lcM").innerHTML='<option>目錄載入中…</option>';LK.getJ("lab-cat.json",function(o){CAT=o;if(!o){g("lcM").innerHTML='<option>目錄載入失敗</option>';return}fill()});
 g("lcM").onchange=function(){showC(this.value)}}
function srcName(id){if(!CAT)return id;for(var i=0;i<CAT.sources.length;i++)if(CAT.sources[i].id===id)return CAT.sources[i].title+(CAT.sources[i].version?"（"+CAT.sources[i].version+"）":"");return id}
function flowFor(id){if((id==="B8-10"||id==="modern-suishen-roll")&&W.BaguaFlow)return W.BaguaFlow;if(id==="B8-04"&&W.HeluoFlow)return W.HeluoFlow;return null}
function showC(id){var d=g("lcD"),m=null,i;if(!CAT||!id){d.innerHTML="";return}for(i=0;i<CAT.methods.length;i++)if(CAT.methods[i].id===id)m=CAT.methods[i];if(!m)return;
 var h='<div class="lcard"><b>'+esc(m.title)+'</b><div>'+badge("原站證據狀態："+(m.evidenceStatus||"未標"))+badge(PEND)+'</div>'+(m.summary?'<p>'+esc(m.summary)+'</p>':'')+
 (m.input&&m.input.length?'<p class="note">輸入：'+esc(m.input.join("、"))+'</p>':'')+(m.formula?'<p class="note">算式：'+esc(m.formula)+'</p>':'')+
 (m.steps&&m.steps.length?'<ol class="lst">'+m.steps.map(function(s){return '<li>'+esc(typeof s==="string"?s:(s.text||s.label||JSON.stringify(s)))+'</li>'}).join("")+'</ol>':'')+
 '<p class="note">來源：'+esc((m.sourceIds||[]).map(srcName).join("；"))+(m.page?'｜'+esc(m.page):'')+'</p>'+(m.missingParts&&m.missingParts.length?'<p class="miss">缺口：'+esc(m.missingParts.join("；"))+'</p>':'')+'</div>';
 var fl=flowFor(id),cfgs=[];if(fl)cfgs.push({k:"flow",c:fl.getConfig()});var R=W.RuleEngines;if(R&&R.registry[id])cfgs.push({k:"eng",c:R.registry[id]});
 if(!cfgs.length)h+='<p class="miss">外站未提供此法可執行之規則；只記錄來源與缺口，不產生條號。</p>';
 cfgs.forEach(function(x,j){var c=x.c;h+='<form class="lcf" data-k="'+x.k+'" onsubmit="return false"><b>'+esc(c.title||"")+'</b>'+(c.scope?' '+badge(c.scope):'')+'<div class="grid">'+c.fields.map(function(f){var ex=c.sample&&c.sample[f.key]!=null?c.sample[f.key]:(f.example!=null?f.example:"");
  return '<label>'+esc(f.label)+(f.type==="select"?'<select name="'+esc(f.key)+'">'+f.options.map(function(o){return '<option'+(o===ex?' selected':'')+'>'+esc(o)+'</option>'}).join("")+'</select>':'<input name="'+esc(f.key)+'" value="'+esc(ex)+'" placeholder="'+esc(f.hint||"")+'">')+'</label>'}).join("")+'</div>'+(c.sampleNote?'<p class="note">預填為原站來源例：'+esc(c.sampleNote)+'</p>':'')+'<button type="button" class="lcGo" data-j="'+j+'">試算</button><div class="lcO"></div></form>'});
 d.innerHTML=h;var fs=d.querySelectorAll(".lcf");for(i=0;i<fs.length;i++)(function(f,x){f.querySelector(".lcGo").onclick=function(){runC(id,m,f,x)}})(fs[i],cfgs[i])}
function runC(id,m,f,x){var vals={},els=f.querySelectorAll("input,select"),i,r,o=f.querySelector(".lcO");for(i=0;i<els.length;i++)vals[els[i].name]=els[i].value;
 try{r=x.k==="flow"?flowFor(id).run(vals):W.RuleEngines.run(id,vals,CAT)}catch(e){o.innerHTML='<p class="miss">'+esc(e.message)+'</p>';return}
 var rec={t:now8(),src:"C",method:m.title,id:id,inputs:vals,steps:r.trace||[],ids:(r.numbers||[]).map(function(n){return String(n.value)}),label:PEND+"；原站證據狀態："+(m.evidenceStatus||"")};
 o.innerHTML='<ol class="lst">'+(r.trace||[]).map(function(s){return '<li>'+esc(s)+'</li>'}).join("")+'</ol>'+((r.intermediates||[]).length?'<p class="note">'+r.intermediates.map(function(z){return esc(z.label)+'：'+esc(z.value)}).join("<br>")+'</p>':'')+((r.notices||[]).length?'<p class="note">'+esc(r.notices.join("；"))+'</p>':'')+'<div class="lcN">載入版本中…</div><button type="button" class="lcSv">存入研究紀錄</button><button type="button" class="lcB">加入批次表</button>';
 LK.loadAll(function(){o.querySelector(".lcN").innerHTML=(r.numbers||[]).length?numsHtml(r.numbers):'<p class="note">此步只產生中間值（非條號）。</p>'});
 o.querySelector(".lcSv").onclick=function(){addLog(rec);this.textContent="已存入"};o.querySelector(".lcB").onclick=function(){BATCH.push(rec);drawBatch();this.textContent="已加入（"+BATCH.length+"）"}}

/* ===== 4 歲對候選（A／E／F） ===== */
var AGE=lsGet(AGEK,{}),AROWS=[];
function tabAge(el){el.innerHTML='<p class="note">依所選資料之歲標列出同歲候選；每歲可有多條，<b>不選唯一條</b>。「研究者排除」「喜忌三分線（喜→順、忌→滯、平→平）」是外站所列後設操作，不是已證原法（'+PEND+'）。標記只存在此瀏覽器。</p>'+
 '<div class="grid"><label>歲數<input id="agA" type="number" min="1" max="120" inputmode="numeric"></label><label>資料<select id="agS"><option value="main">本站主版歲標</option><option value="tyg">天玉宮本歲標（另版）</option><option value="kuji">坤集卷首索引港歲標（外站轉錄）</option></select></label><label>順滯平（坤集）<select id="agT"><option value="">不篩</option><option>順</option><option>滯</option><option>平</option></select></label><label>顯示模式<select id="agM"><option value="raw">只看原始候選</option><option value="ex">按已知事件排除</option><option value="line">研究者自定線（喜／忌／平／轉）</option></select></label><label>關鍵字<input id="agK"></label></div><button type="button" id="agGo">查詢歲對</button><button type="button" id="agCsv">匯出目前候選 CSV</button><div id="agSum" class="note"></div><div id="agO"></div>';
 g("agGo").onclick=ageQ;g("agM").onchange=ageDraw;g("agCsv").onclick=function(){if(!AROWS.length)return;var R=[["條號","歲","資料","順滯平","條文","研究者排除","理由","自定線"]];AROWS.forEach(function(x){var a=AGE[x.k]||{};R.push([x.id,x.age,x.ed,x.tr,x.t,a.ex?"是":"",a.why||"",a.line||""])});dl("歲對候選_"+g("agA").value+"歲.csv",csv(R),"text/csv;charset=utf-8")}}
function hasAge(s,a){if(!s)return false;var p=String(s).split(/[、,，;；\s]+/),i;for(i=0;i<p.length;i++)if(+p[i]===a)return true;return false}
function ageQ(){var a=+g("agA").value,s=g("agS").value,tr=g("agT").value,kw=g("agK").value.trim();if(!a){g("agSum").textContent="請先輸入歲數。";return}g("agSum").textContent="載入中…";
 LK.loadAll(function(){var rows=[],k,v,E=LK.ED;
  if(s==="main"&&typeof TEXTS!=="undefined"){for(k in TEXTS)if(hasAge(TEXTS[k].age,a))rows.push({id:k,t:TEXTS[k].t,tr:"",ed:"本站主版"})}
  else if(s==="tyg"&&E.tyg.d){for(k in E.tyg.d){v=String(E.tyg.d[k]).split("|");if(hasAge(v[1],a))rows.push({id:k,t:v[0],tr:"",ed:"天玉宮本"})}}
  else if(s==="kuji"&&E.kuji.d){for(k in E.kuji.d){v=E.kuji.d[k];if(hasAge(v[2],a)&&(!tr||v[3]===tr))rows.push({id:k,t:v[0]||v[1],tr:v[3]||"未標",ed:"坤集卷首索引"})}}
  rows=rows.filter(function(x){return !kw||String(x.t).indexOf(kw)>=0});rows.sort(function(p,q){return +p.id-+q.id});rows.forEach(function(x){x.age=a;x.k=s+":"+x.id+":"+a});AROWS=rows;ageDraw()})}
function ageDraw(){var M=g("agM").value,o=g("agO"),ex=0;if(!o)return;AROWS.forEach(function(x){if((AGE[x.k]||{}).ex)ex++});
 g("agSum").textContent=AROWS.length?(g("agA").value+" 歲：候選 "+AROWS.length+" 條；標記排除 "+ex+" 條。候選並列，不選唯一條。"):"沒有符合候選；資料集未收或該版無歲標，不代表原書無條。";
 o.innerHTML=AROWS.slice(0,300).map(function(x){var a=AGE[x.k]||{},c="";if(M==="ex")c='<div><label class="ck"><input type="checkbox" data-ex="'+esc(x.k)+'"'+(a.ex?' checked':'')+'> 研究者排除</label><input data-why="'+esc(x.k)+'" value="'+esc(a.why||"")+'" placeholder="排除理由" maxlength="240"></div>';
  if(M==="line")c='<label>自定線 <select data-line="'+esc(x.k)+'"><option value="">未標記</option>'+["喜","忌","平","轉"].map(function(v){return '<option'+(a.line===v?' selected':'')+'>'+v+'</option>'}).join("")+'</select></label>';
  return '<div class="lkr"'+(a.ex?' style="opacity:.5"':'')+'><span class="lkno">'+esc(x.id)+'</span> <span class="lked">'+esc(x.ed)+(x.tr?'｜'+esc(x.tr):'')+(a.line?'｜自定線：'+esc(a.line):'')+'</span><div class="lkt">'+esc(x.t)+'</div>'+c+'</div>'}).join("")+(AROWS.length>300?'<p class="note">畫面只列前 300 條；CSV 含全部 '+AROWS.length+' 條。</p>':'');
 var q=o.querySelectorAll("[data-ex],[data-why],[data-line]"),i;for(i=0;i<q.length;i++)q[i].onchange=function(){var k=this.getAttribute("data-ex")||this.getAttribute("data-why")||this.getAttribute("data-line"),a=AGE[k]||{};if(this.hasAttribute("data-ex"))a.ex=this.checked;if(this.hasAttribute("data-why"))a.why=this.value;if(this.hasAttribute("data-line"))a.line=this.value;AGE[k]=a;lsSet(AGEK,AGE);if(!this.hasAttribute("data-why"))ageDraw()}}

/* ===== 5 研究紀錄（A 試算紀錄＋C 研究筆記） ===== */
function getLog(){return lsGet(LOGK,[])}
function addLog(x){var a=getLog();a.unshift(x);if(a.length>500)a.length=500;lsSet(LOGK,a);drawLog()}
function tabLog(el){el.innerHTML='<p class="note">只儲存在此瀏覽器（localStorage），不會上傳或同步；清除瀏覽器資料可能遺失，請定期匯出 JSON。</p><div class="grid"><label>標題／方法／問題<input id="lgT" maxlength="120"></label><label>來源網址（選填）<input id="lgU" maxlength="300"></label></div><label>記錄與待查問題<textarea id="lgN" rows="3" style="width:100%"></textarea></label><button type="button" id="lgAdd">新增筆記</button><button type="button" id="lgE">匯出 JSON</button><label class="pxb" style="display:inline-block">匯入 JSON<input type="file" id="lgI" accept=".json,application/json" style="display:none"></label><div id="lgM" class="note"></div><div id="lgL"></div>';
 g("lgAdd").onclick=function(){var t=g("lgT").value.trim(),n=g("lgN").value.trim();if(!t&&!n)return;addLog({t:now8(),src:"筆記",method:t,url:g("lgU").value.trim(),note:n,ids:[],steps:[]});g("lgT").value=g("lgN").value=g("lgU").value=""};
 g("lgE").onclick=function(){dl("鐵板研究紀錄.json",JSON.stringify({schema:"tieban-lab-log",version:1,exportedAt:now8(),items:getLog()},null,1),"application/json")};
 g("lgI").onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(String(r.result).replace(/^\uFEFF/,""));if(o.schema!=="tieban-lab-log"||!o.items)throw new Error("格式不符");var a=o.items.concat(getLog());if(a.length>500)a.length=500;lsSet(LOGK,a);drawLog();g("lgM").textContent="已匯入 "+o.items.length+" 筆。"}catch(e){g("lgM").textContent="無法匯入："+e.message}};r.readAsText(f,"utf-8")};drawLog()}
function drawLog(){var el=g("lgL");if(!el)return;var a=getLog();el.innerHTML=a.length?a.map(function(x,i){return '<div class="lkr"><span class="lked">'+esc(x.t)+'｜'+esc(x.src)+'</span> <b>'+esc(x.method||"")+'</b>'+(x.ids&&x.ids.length?'<div>條號：'+esc(x.ids.join("／"))+'</div>':'')+(x.url?'<div class="note">'+esc(x.url)+'</div>':'')+(x.note?'<div>'+esc(x.note)+'</div>':'')+(x.label?'<div class="note">'+esc(x.label)+'</div>':'')+'<button type="button" data-del="'+i+'">刪除</button></div>'}).join(""):'<p class="note">尚無紀錄。</p>';
 var b=el.querySelectorAll("[data-del]"),i;for(i=0;i<b.length;i++)b[i].onclick=function(){var a=getLog();a.splice(+this.getAttribute("data-del"),1);lsSet(LOGK,a);drawLog()}}

/* ===== 6 方法登錄與九盤（A） ===== */
function tabReg(el){var rows=[],i,m;for(i=0;i<L.METHODS.length;i++){m=L.METHODS[i];rows.push([m.title,m.category,m.status,m.source||""])}
 for(i=0;i<L.MANUAL_SOURCES.length;i++){m=L.MANUAL_SOURCES[i];rows.push([m[1],m[0].indexOf("lyc")===0?"魯揚才方法":"近現代／傳承方法","pending",m[2]+"｜"+m[3]+"｜"+m[4]])}
 el.innerHTML='<p class="note">外站 A 的方法登錄（狀態沿用原站：verified／partial／pending）。pending 者原站亦未實作，本站只列來源、不試算。'+PEND+'。</p><select id="rgS"><option value="">全部狀態</option><option value="verified">verified（原站標明確規則）</option><option value="partial">partial（部分／清單）</option><option value="pending">pending（待核，僅記錄）</option></select><div id="rgL"></div><h3>卷末九盤功能分層（外站 A 整理）</h3><table class="ltb"><tr><th>葉碼</th><th>盤名</th><th>功能</th><th>備註</th></tr>'+L.PLATES.map(function(p){return '<tr>'+p.map(function(c){return '<td>'+esc(c)+'</td>'}).join("")+'</tr>'}).join("")+'</table><p class="note">輪盤是多功能查號索引，不是由生日自動得出唯一預測的機制（外站原註）。</p>';
 function dr(){var s=g("rgS").value;g("rgL").innerHTML='<table class="ltb"><tr><th>方法</th><th>類別</th><th>狀態</th><th>依據</th></tr>'+rows.filter(function(r){return !s||r[2]===s}).map(function(r){return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td>'+esc(r[3])+'</td></tr>'}).join("")+'</table>'}
 g("rgS").onchange=dr;dr()}

/* ===== 組裝 ===== */
var TABS=[["公式取數","A",tabA],["取數法目錄","C",tabC],["歲對候選","age",tabAge],["條號直查","lk",function(el){LK.card(el,{imp:true})}],["批次表","bt",tabBatch],["研究紀錄","log",tabLog],["方法登錄・九盤","reg",tabReg]];
function init(){var w=g("labw");if(!w||!L)return;LK.css();var s=D.createElement("style");s.textContent=".lab .ltab{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0}.lab .ltab button{flex:1 1 30%;font-size:13px;border:1px solid #c9a46a;background:#fbf6ee;border-radius:8px}.lab .ltab button.on{background:#7a3b12;color:#fff}.lbg{display:inline-block;font-size:11.5px;border:1px solid #b9935a;border-radius:6px;padding:0 5px;margin:2px 4px 2px 0;color:#6b4a1a}.ltb{border-collapse:collapse;width:100%;font-size:12.5px;display:block;overflow-x:auto}.ltb td,.ltb th{border:1px solid #ddd;padding:3px 5px;vertical-align:top}.lst{padding-left:20px;font-size:13.5px}.lab select,.lab input{max-width:100%;box-sizing:border-box}.lab>select,#laM,#lcM{width:100%;margin:4px 0}.lcard{border:1px solid #e2d3b8;border-radius:8px;padding:6px 8px;margin:6px 0}.lcf{border-top:1px dashed #c9a46a;margin-top:8px;padding-top:6px}";D.head.appendChild(s);
 w.className="card lab";w.innerHTML='<h2>研究工具</h2><p class="note">以下各項移植自外站研究網頁之程式與資料，皆屬「'+PEND+'」；不影響上方原有計算結果與本站主版條文。外站：ironplate-methods-research.pages.dev、ironplate-research.sky-berry.workers.dev、tieban-number-research.abraham408499.chatgpt.site、ironplate-research.observant-lillipilli.workers.dev、ironplate-station-preview-20261006.fanatical-area.workers.dev。</p><div class="ltab" id="ltab"></div><div id="lpane"></div>';
 var bar=g("ltab"),panes={};TABS.forEach(function(t,i){var b=D.createElement("button");b.type="button";b.textContent=t[0];b.setAttribute("data-t",t[1]);b.onclick=function(){var bs=bar.querySelectorAll("button"),j;for(j=0;j<bs.length;j++)bs[j].className="";b.className="on";var p=g("lpane"),k;for(k in panes)panes[k].style.display="none";if(!panes[t[1]]){panes[t[1]]=D.createElement("div");p.appendChild(panes[t[1]]);t[2](panes[t[1]])}panes[t[1]].style.display=""};bar.appendChild(b);if(i===0)b.onclick()})}
W.TBLAB={init:init,computeA:function(id,vals){for(var i=0;i<L.METHODS.length;i++)if(L.METHODS[i].id===id)return L.computeA(L.METHODS[i],vals)}};
if(D.readyState==="loading")D.addEventListener("DOMContentLoaded",init);else init();
})(window);
