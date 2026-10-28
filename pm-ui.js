/* 批命工作表（實驗）— 來源待核（參考外站：Claude 研究站／批命工作表）。演算由 tbeng.js（外站移植）執行，資料 claude9.json 為另一版本，非本站主版。 */
(function(){
var D=document,TBD=null,POOL=null,ld=0,cbs=[];
var EL=["木","火","土","金","水"];
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function need(cb){if(TBD&&window.TB)return cb();cbs.push(cb);if(ld)return;ld=1;
 var s=D.createElement("script");s.src="tbeng.js";s.onload=function(){var x=new XMLHttpRequest();x.open("GET","claude9.json");x.onload=function(){try{TBD=JSON.parse(x.responseText);POOL=TB.buildPool(TBD.T)}catch(e){fail("資料解析失敗");return}var c=cbs;cbs=[];c.forEach(function(f){f()})};x.onerror=function(){fail("資料載入失敗")};x.send()};s.onerror=function(){fail("tbeng.js 載入失敗")};D.head.appendChild(s)}
function fail(m){ld=0;var e=D.getElementById("pm-out");if(e)e.innerHTML='<p class="pm-warn">'+esc(m)+'</p>'}
var PRE={sex:"乾",p:["壬寅","丁未","戊寅","壬子"],birth:1962,start:3,facts:"父虎 母雞\n兄弟3人\n妻己酉\n1993 婚、生長男"};
var CSS=".pm-warn{border:1px solid #b45;background:#fff4f2;padding:8px;font-size:14px;line-height:1.6}.pm-g{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.pm-g label{font-size:14px}.pm input,.pm select,.pm textarea{font-size:16px;max-width:100%;box-sizing:border-box}.pm-p{width:4.2em}.pm textarea{width:100%;min-height:6em}.pm table{border-collapse:collapse;font-size:14px;width:100%}.pm td,.pm th{border:1px solid #ccc;padding:2px 4px}.pm-pre{white-space:pre-wrap;font-size:14px;line-height:1.6;border:1px solid #ddd;padding:6px;max-height:60vh;overflow:auto}.pm-lq li{margin:3px 0;font-size:14px}.pm-b{margin:4px 4px 4px 0}";
function sel(id,opts,v){var h='<select id="'+id+'">';opts.forEach(function(o){h+='<option'+(o===v?' selected':'')+'>'+o+'</option>'});return h+'</select>'}
function mount(el){
 if(!D.getElementById("pm-css")){var st=D.createElement("style");st.id="pm-css";st.textContent=CSS;D.head.appendChild(st)}
 var h='<div class="pm"><div class="pm-warn"><b>實驗性研究流程</b>：來源待核（參考外站：Claude 研究站／批命工作表）。所用條文為外站整理之港本／庫本（claude9.json），屬另一版本，非本站主版；六親公式取自其所引《鐵板神數》書例。<br>原站統計註記：取線「流年優先」為事後所定（擬合既有個案），待新造重驗；「大運優先」檢驗 p＝0.066，未達顯著。池基率 順 49・滯 34・平 11・轉 6（%）。結果僅供研究對照，不作定論。</div>';
 h+='<div class="pm-g"><label>造 '+sel("pm-sex",["乾","坤"],PRE.sex)+'</label><label>歲法 '+sel("pm-sf",["實","虛"],"實")+'</label><label>取線 '+sel("pm-md",["流年優先","大運優先"],"流年優先")+'</label></div>';
 h+='<div class="pm-g">';["年","月","日","時"].forEach(function(k,i){h+='<label>'+k+'<input class="pm-p" id="pm-p'+i+'" value="'+PRE.p[i]+'"></label>'});h+='</div>';
 h+='<div class="pm-g"><label>出生年<input id="pm-by" type="number" style="width:5.5em" value="'+PRE.birth+'"></label><label>起運歲<input id="pm-st" type="number" style="width:4em" value="'+PRE.start+'"></label><label>行運 '+sel("pm-dir",["自動","順行","逆行"],"自動")+'</label></div>';
 h+='<div class="pm-g">';EL.forEach(function(e,i){h+='<label>'+e+' '+sel("pm-x"+i,["平","喜","忌"],"平")+'</label>'});h+='<button type="button" class="pm-b" id="pm-mech">機械起手</button></div>';
 h+='<div class="pm-g"><label>歲 由<input id="pm-f" type="number" style="width:4em" value="1"></label><label>至<input id="pm-t" type="number" style="width:4em" value="90"></label></div>';
 h+='<label style="font-size:14px">家庭與事件（一行一組，如「父虎 母雞」「妻己酉」「1993 婚、生長男」「父鼠 2003歿」）</label><textarea id="pm-fx">'+esc(PRE.facts)+'</textarea>';
 h+='<div><button type="button" class="pm-b" id="pm-pre">帶入書例 壬寅乾造（總錄第七節）</button><button type="button" class="pm-b" id="pm-run">起批</button></div><div id="pm-luck"></div><div id="pm-out"></div>';
 h+='<h4>批書</h4><div><label>版式 '+sel("pm-ver",["研究版","客人版"],"研究版")+'</label> <button type="button" class="pm-b" id="pm-cp">複製</button><button type="button" class="pm-b" id="pm-dl">下載文字檔</button></div><textarea id="pm-book" placeholder="起批後生成，可自行刪改"></textarea></div>';
 el.innerHTML=h;
 D.getElementById("pm-mech").onclick=function(){need(function(){var m=TB.mechXiJi(pil().join(" "));m.xi=A(m.xi);m.ji=A(m.ji);EL.forEach(function(e,i){D.getElementById("pm-x"+i).value=m.xi.indexOf(e)>=0?"喜":(m.ji.indexOf(e)>=0?"忌":"平")});D.getElementById("pm-mech").textContent="機械起手（"+(m.strong?"身強":"身弱")+"，喜"+m.xi.join("")+"）"})};
 D.getElementById("pm-pre").onclick=function(){D.getElementById("pm-sex").value=PRE.sex;PRE.p.forEach(function(v,i){D.getElementById("pm-p"+i).value=v});D.getElementById("pm-by").value=PRE.birth;D.getElementById("pm-st").value=PRE.start;D.getElementById("pm-fx").value=PRE.facts};
 D.getElementById("pm-run").onclick=function(){D.getElementById("pm-out").textContent="載入中…";need(run)};
 D.getElementById("pm-ver").onchange=book;
 D.getElementById("pm-cp").onclick=function(){var t=D.getElementById("pm-book");t.select();try{D.execCommand("copy")}catch(e){}};
 D.getElementById("pm-dl").onclick=function(){var b=new Blob([D.getElementById("pm-book").value],{type:"text/plain;charset=utf-8"}),a=D.createElement("a");a.href=URL.createObjectURL(b);a.download="批命_"+pil().join("")+"_"+D.getElementById("pm-ver").value+".txt";D.body.appendChild(a);a.click();D.body.removeChild(a)};
}
function pil(){var r=[],i;for(i=0;i<4;i++)r.push(D.getElementById("pm-p"+i).value.replace(/\s/g,""));return r}
var LAST=null;function A(v){return typeof v==="string"?v.replace(/[,，、\s]/g,"").split(""):v}
function compute(o){
 var xi=[],ji=[];if(o.xi){xi=o.xi;ji=o.ji}else if(o.mech){var m=TB.mechXiJi(o.p.join(" "));xi=A(m.xi);ji=A(m.ji)}
 var dir=o.dir||TB.luckDir(o.p[0].charAt(0),o.sex);
 var ch={name:o.name||"",sex:o.sex,birth:o.birth,yearGZ:o.p[0],suifa:o.suifa||"實",xj:{xi:A(xi).join(""),ji:A(ji).join("")}};
 ch.luck=TB.makeLuck(o.p[1],dir,o.start,ch.xj);
 var f=TB.parseFacts(o.facts||"",ch),lq=TB.liuqin(ch,f),rows=TB.yearly(ch,TBD.T,POOL,{from:1,to:100}),ev=TB.eventGroups(f,ch,TBD.T,POOL,TBD.SL);
 var rd=TB.autoReading(ch,rows,TBD.T,TBD.KP,lq,ev,{model:o.model||"ln",from:o.from||1,to:o.to||90,now:new Date().getFullYear(),pick:{},pillars:o.p,dir:dir});
 return {ch:ch,f:f,lq:lq,rows:rows,rd:rd,dir:dir};
}
function run(){
 var p=pil(),i,xi=[],ji=[];for(i=0;i<4;i++)if(!TB.isGZ(p[i])){D.getElementById("pm-out").innerHTML='<p class="pm-warn">四柱須為六十甲子</p>';return}
 for(i=0;i<5;i++){var v=D.getElementById("pm-x"+i).value;if(v==="喜")xi.push(EL[i]);if(v==="忌")ji.push(EL[i])}
 var dv=D.getElementById("pm-dir").value,o={sex:D.getElementById("pm-sex").value,p:p,birth:+D.getElementById("pm-by").value,start:+D.getElementById("pm-st").value||1,suifa:D.getElementById("pm-sf").value,model:D.getElementById("pm-md").value==="大運優先"?"dy":"ln",from:+D.getElementById("pm-f").value||1,to:+D.getElementById("pm-t").value||90,facts:D.getElementById("pm-fx").value,dir:dv==="順行"?1:(dv==="逆行"?-1:0)};
 if(xi.length||ji.length){o.xi=xi;o.ji=ji}else o.mech=1;
 var R=compute(o);LAST={o:o,R:R};
 var lh='<table><tr><th>大運</th><th>起歲</th><th>上五年</th><th>下五年</th></tr>';R.ch.luck.forEach(function(l){lh+='<tr><td>'+esc(l.gz)+'</td><td>'+l.start+'</td><td>'+l.up+'</td><td>'+l.down+'</td></tr>'});
 D.getElementById("pm-luck").innerHTML=lh+'</table>'+(o.mech?'<p style="font-size:13px">未設喜忌，已用機械起手（喜'+R.ch.xj.xi+'）。</p>':'');
 var h='<p>'+esc(TB.readingLead(R.rd).join(" "))+'</p><h4>六親直取（'+R.lq.length+'）</h4><ul class="pm-lq">';
 R.lq.forEach(function(e){var t=TB.textMain(TBD.T,e.n,e.conf==="庫本");h+="<li><b>"+e.n+"</b> "+esc(t&&t.t)+' <small>〔'+esc(e.title)+'・'+esc(e.formula)+'・'+esc(e.basis)+'〕</small></li>'});
 h+='</ul><h4>逐歲</h4><div class="pm-pre" id="pm-txt"></div>';
 D.getElementById("pm-out").innerHTML=h;
 var full=TB.readingText(R.rd,TBD.T,{name:"",sex:o.sex,pillars:p,birth:o.birth,suifa:o.suifa});
 var k=full.indexOf("【歲運】");D.getElementById("pm-txt").textContent=k>=0?full.slice(k):full;LAST.full=full;book();
}
function book(){if(!LAST)return;var t=LAST.full,src="\n\n——\n來源待核（參考外站：Claude 研究站／批命工作表）；實驗流程，非定論。";
 if(D.getElementById("pm-ver").value==="客人版")t=t.split("\n").map(function(l){return l.replace(/^\d+\u3000/,"").replace(/〔[^〕]*〕/g,"").replace(/^(\s*\d+ 歲 \d+ \S+：)[^—]*——\d+/,"$1")}).join("\n");
 D.getElementById("pm-book").value=t+src}
window.PMUI={mount:mount,need:need,compute:compute};
})();
