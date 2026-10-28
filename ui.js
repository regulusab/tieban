/* ui.js — 兩頁共用：字級、精簡顯示、PWA、加到主畫面提示、?selftest=1 自我檢測（ES5） */
(function(){
var LS={g:function(k){try{return localStorage.getItem(k)}catch(e){return null}},s:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var FS=[["標準",1],["大",1.15],["特大",1.3]],isProc=/process\.html/.test(location.pathname);
var css=document.createElement("style");css.textContent=
 '#uibar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:13px;margin:4px 0 8px}#uibar button.fsb{width:auto!important;display:inline-block;margin:0!important;padding:3px 10px!important;min-height:0!important;height:auto!important;border:1px solid #c9a55a!important;background:#fff!important;color:#5a3b10!important;border-radius:14px!important;font-size:13px!important;letter-spacing:0!important;line-height:1.4!important;box-shadow:none!important;cursor:pointer}#uibar button.fsb.on{background:#8b2f1e!important;color:#fff!important;border-color:#8b2f1e!important}#uibar span{font-size:13px}#uibar label{display:inline-flex;align-items:center;gap:3px;font-size:13px;margin:0}#uibar input{width:auto;margin:0}'+
 'html.cmp .c2:not(.op)>*:not(h2){display:none!important}html.cmp .c2>h2{cursor:pointer}html.cmp .c2:not(.op)>h2:after{content:"（精簡：點此展開）";font-size:12px;color:#8a5a00;font-weight:normal}'+
 'html.cmp #secs [id$="_o"]>h3,html.cmp #secs [id$="_o"]>ol,html.cmp #secs .sb>p,html.cmp #secs details.sin{display:none!important}'+
 '#iostip{position:fixed;left:8px;right:8px;bottom:8px;z-index:99;background:#fffbe9;border:1px solid #c9a55a;border-radius:10px;padding:10px 34px 10px 12px;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.2)}#iostip button{position:absolute;right:6px;top:6px;border:0;background:none;font-size:18px;cursor:pointer}'+
 '#swup{position:fixed;left:8px;right:8px;top:8px;z-index:99;background:#8b2f1e;color:#fff;border-radius:10px;padding:8px 12px;font-size:14px}#swup button{width:auto!important;margin:0 0 0 8px!important;padding:2px 8px!important}#iostip button{position:absolute!important;right:4px;top:4px;width:30px!important;height:30px!important;margin:0!important;padding:0!important;background:none!important;border:0!important;color:#5a3b10!important;font-size:20px!important;box-shadow:none!important}'+
 '#selftest{border:2px solid #555;border-radius:10px;padding:8px 10px;margin:8px 0;background:#fff;font-size:13px}#selftest .ok{color:#17702b;font-weight:bold}#selftest .ng{color:#b00020;font-weight:bold}';
document.head.appendChild(css);
function fsApply(i){var z=FS[i]?FS[i][1]:1;document.body.style.zoom=z===1?"":String(z);var b=document.querySelectorAll("#uibar .fsb");for(var k=0;k<b.length;k++)b[k].className="fsb"+(k===i?" on":"")}
function cmpApply(on){var h=document.documentElement;h.className=h.className.replace(/\s*\bcmp\b/g,"")+(on?" cmp":"");markC2()}
var SECOND=["大運","鐵板神數起數","命盤存檔","搜尋條文（關鍵字或條文號）"];
function markC2(){if(isProc)return;var cs=document.querySelectorAll(".card"),i,h;for(i=0;i<cs.length;i++){h=cs[i].querySelector("h2");if(h&&h.parentNode===cs[i]){var t=h.textContent.replace(/（精簡：點此展開）/,"");for(var j=0;j<SECOND.length;j++)if(t.indexOf(SECOND[j])===0){if(!/\bc2\b/.test(cs[i].className))cs[i].className+=" c2";break}}}}
function bar(){var w=document.querySelector(".wrap")||document.body,h1=w.querySelector(".sub")||w.querySelector(".note")||w.querySelector("h1"),d=document.createElement("div");d.id="uibar";
  var s='<span>字級：</span>';for(var i=0;i<FS.length;i++)s+='<button type="button" class="fsb" data-fs="'+i+'">'+FS[i][0]+'</button>';
  s+='<label><input type="checkbox" id="cmpchk"> 精簡顯示</label>';d.innerHTML=s;
  if(h1&&h1.nextSibling)h1.parentNode.insertBefore(d,h1.nextSibling);else w.insertBefore(d,w.firstChild);
  var fi=+(LS.g("tb_fs")||0);if(!(fi>=0&&fi<3))fi=0;fsApply(fi);var cm=LS.g("tb_cmp")==="1";document.getElementById("cmpchk").checked=cm;cmpApply(cm);
  d.addEventListener("click",function(e){var t=e.target;if(t&&t.getAttribute&&t.getAttribute("data-fs")!==null){var k=+t.getAttribute("data-fs");LS.s("tb_fs",String(k));fsApply(k)}});
  document.getElementById("cmpchk").addEventListener("change",function(){LS.s("tb_cmp",this.checked?"1":"0");cmpApply(this.checked)});
  document.addEventListener("click",function(e){var t=e.target;if(t&&t.tagName==="H2"&&/\bc2\b/.test(t.parentNode.className)&&/\bcmp\b/.test(document.documentElement.className)){var p=t.parentNode;p.className=/\bop\b/.test(p.className)?p.className.replace(/\s*\bop\b/,""):p.className+" op"}});
  var o=document.getElementById("out");if(o&&window.MutationObserver)new MutationObserver(function(){markC2()}).observe(o,{childList:true});markC2()}
function iosTip(){var ua=navigator.userAgent||"",ios=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1);
  var sa=window.navigator.standalone===true||(window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches);
  if(!ios||sa||LS.g("tb_iostip")==="1")return;var d=document.createElement("div");d.id="iostip";
  d.innerHTML='<b>加到主畫面</b>：在 Safari 點下方「分享」（方框加向上箭頭），再選「加入主畫面」，即可像 App 一樣開啟（離線亦可用）。<button type="button" aria-label="關閉">×</button>';
  d.querySelector("button").onclick=function(){LS.s("tb_iostip","1");d.parentNode.removeChild(d)};document.body.appendChild(d)}
function sw(){if(!("serviceWorker" in navigator)||!/^https?:$/.test(location.protocol))return;var had=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.register("sw.js").then(function(r){try{r.update()}catch(e){}}).catch(function(){});
  navigator.serviceWorker.addEventListener("controllerchange",function(){if(!had){had=true;return}if(document.getElementById("swup"))return;var d=document.createElement("div");d.id="swup";d.innerHTML='已有新版本。<button type="button">重新整理</button>';d.querySelector("button").onclick=function(){location.reload()};document.body.appendChild(d)})}
var ST={"1962男":{"i":{"y":1962,"mo":8,"d":8,"h":0,"mi":10,"sex":"男"},"x":{"pillars":["壬寅","丁未","戊寅","壬子"],"lunar":"一九六二年（壬寅年）七月初九","base":2632,"kes":[2632,3959,5286,6613,7940,9267,10594,11921],"main":909,"hex":"泰","ke":"正刻","ben":[1353,7005,7575,7820,6584,3290]}},"閏月2023閏二月初一":{"i":{"cal":"L","ly":2023,"lm":2,"ld":1,"lleap":1,"h":10,"mi":0,"sex":"女"},"x":{"pillars":["癸卯","乙卯","己卯","己巳"],"lunar":"二〇二三年（癸卯年）閏二月初一","base":2636,"kes":[2636,3963,5290,6617,7944,9271,10598,11925],"main":211,"hex":"大壮","ke":"初刻","ben":[12294,4534,5435,2287,7314]}},"晚子換日":{"i":{"y":1985,"mo":3,"d":10,"h":23,"mi":30,"sex":"男","zi":1},"x":{"pillars":["乙丑","己卯","己酉","甲子"],"lunar":"一九八五年（乙丑年）正月十九","base":3788,"kes":[3788,5115,6442,7769,9096,10423,11750,1077],"main":860,"hex":"乾","ke":"正刻","ben":[2542,3659,6465,6123,8082]}},"1990女":{"i":{"y":1990,"mo":5,"d":20,"h":14,"mi":30,"sex":"女"},"x":{"pillars":["庚午","辛巳","乙酉","癸未"],"lunar":"一九九〇年（庚午年）四月廿六","base":9321,"kes":[9321,10648,11975,1302,2629,3956,5283,6610],"main":836,"hex":"坤","ke":"正刻","ben":[1353,7895,3227,3880,3870]}}};
function selftest(){var E=window.TBENG;if(!E){return}var ids=["y","mo","d","h","mi","sex","reg","utc","lon","fa","mom","sp","sib","kid","pf"],sv={},i,$=E.$;
  for(i=0;i<ids.length;i++)sv[ids[i]]=$(ids[i]).value;var svz=$("zi").checked,svt=$("tst").checked,rows=[],pass=0,tot=0;
  try{for(var n in ST){var c=ST[n].i,x=ST[n].x,y=c.y,mo=c.mo,d=c.d;$("zi").checked=!!c.zi;$("tst").checked=false;$("reg").value="tw";$("utc").value="8";
    if(c.cal==="L"){var s=E.l2s(c.ly,c.lm,!!c.lleap,c.ld);y=s.y;mo=s.mo;d=s.d}
    $("y").value=y;$("mo").value=mo;$("d").value=d;$("h").value=c.h;$("mi").value=c.mi;$("sex").value=c.sex;
    var b=E.birthCorr(),male=c.sex==="男",r=E.compute(b.y,b.mo,b.d,b.h,b.mi,male,!!c.zi);E.birthCorr();var L=E.lifeCalc(b.y,b.mo,b.d,b.h,b.mi,male,null,"");
    var t=L.tbl,ben=[];if(t)for(var k in t.offsets)t.offsets[k].forEach(function(f){ben.push(t.base+t.seq+f)});
    var got={pillars:r.pillars,lunar:r.lunar,base:r.base,kes:r.kes.map(function(q){return q.n}),main:L.main,hex:L.hex,ke:L.ke,ben:ben},bad=[];
    for(var f in x){tot++;if(JSON.stringify(x[f])===JSON.stringify(got[f]))pass++;else bad.push(f)}
    rows.push('<tr><td>'+n+'</td><td class="'+(bad.length?'ng">✗ '+bad.join("、"):'ok">✓')+'</td></tr>')}}catch(e){rows.push('<tr><td colspan="2" class="ng">錯誤：'+String(e.message||e)+'</td></tr>');tot++}
  finally{for(i=0;i<ids.length;i++)$(ids[i]).value=sv[ids[i]];$("zi").checked=svz;$("tst").checked=svt;try{E.birthCorr()}catch(e){}}
  try{var LKx=window.TBLK,LBx=window.TBLAB,v11=[],chk=function(nm,ok){tot++;if(ok)pass++;else v11.push(nm)};
    if(LKx){chk("密碼轉碼",LKx.decode("庚甲戊丙").v==="4132"&&LKx.decode("甲ヒ").v==="11"&&LKx.encode("4132").v==="庚甲戊丙")}
    if(LBx){chk("A公式直線",LBx.computeA("father-gz",{value:"0"}).ids[0]==="9003"&&LBx.computeA("parent-death-son",{age:"19"}).ids[0]==="9799")}
    if(window.RuleEngines){var sm=RuleEngines.registry["B8-01"].sample;chk("C規則引擎",RuleEngines.run("B8-01",sm,null).numbers[4].value===2253)}
    if(window.BaguaFlow){var bc=BaguaFlow.getConfig(),bv={};bc.fields.forEach(function(f){bv[f.key]=f.example});var br=BaguaFlow.run(bv);chk("C八卦滾",br.numbers.length===48&&br.numbers[0].value===5349)}
    if(LKx||LBx)rows.push('<tr><td>v11 研究工具</td><td class="'+(v11.length?'ng">✗ '+v11.join("、"):'ok">✓')+'</td></tr>')}catch(e){tot++;rows.push('<tr><td colspan="2" class="ng">v11 錯誤：'+String(e.message||e)+'</td></tr>')}
  var ok=pass===tot,box=document.createElement("div");box.id="selftest";box.setAttribute("data-result",ok?"pass":"fail");
  box.innerHTML='<b>自我檢測（?selftest=1）</b>：<span class="'+(ok?'ok">全部通過':'ng">有誤')+'</span>（'+pass+'／'+tot+' 項；比對 v10 改版前之標準答案）<table>'+rows.join("")+'</table>';
  var u=document.getElementById("uibar");u.parentNode.insertBefore(box,u.nextSibling);
  if(window.PMUI){var tb=box.querySelector("table"),tr=document.createElement("tr");tr.innerHTML='<td>v12 批命工作表</td><td>載入中…</td>';tb.appendChild(tr);
   PMUI.need(function(){var bad=[],R,G=[9354,9103,10055,9883,10237,9082,12093,10537];try{R=PMUI.compute({sex:"乾",p:["壬寅","丁未","戊寅","壬子"],birth:1962,start:1,mech:1,facts:"父虎 母雞\n兄弟3人\n妻己酉\n1993 婚、生長男"});
    var ns=R.lq.map(function(e){return e.n});G.forEach(function(g){if(ns.indexOf(g)<0)bad.push(g)});if(String(R.ch.xj.xi)!=="火土")bad.push("機械喜忌")}catch(e){bad.push(String(e.message||e))}
    tot+=2;if(!bad.length)pass+=2;tr.innerHTML='<td>v12 批命工作表</td><td class="'+(bad.length?'ng">✗ '+bad.join("、"):'ok">✓')+'</td></tr>';
    var ok2=pass===tot;box.setAttribute("data-result",ok2?"pass":"fail");var sp=box.querySelector("span");sp.className=ok2?"ok":"ng";sp.textContent=ok2?"全部通過":"有誤";sp.nextSibling.nodeValue="（"+pass+"／"+tot+" 項；比對 v10 改版前之標準答案）"})}}
function go(){bar();iosTip();sw();if(/[?&]selftest=1/.test(location.search)){var tries=0;(function w(){if(window.TBENG&&TBENG.full&&TBENG.full().st!==0)return selftest();if(++tries<100)setTimeout(w,100);else selftest()})()}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();
})();
