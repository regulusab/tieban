/* app.js — 介面、匯出（ES5） */
(function(){
var D=window.HEALTH_DATA,H=window.HC,$=function(i){return document.getElementById(i);};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function srcTxt(keys){return '來源待核（參考外站：'+keys.map(function(k){return D.src[k].n+' '+D.src[k].u;}).join('；')+'）';}
function srcHtml(keys){return '<div class="src" data-t="'+esc(srcTxt(keys))+'">來源待核（參考外站：'+keys.map(function(k){return '<a href="'+D.src[k].u+'" target="_blank" rel="noopener">'+esc(D.src[k].n)+'</a>';}).join('；')+'）</div>';}
// 下拉
var pg=$('pg'),LAB=['年','月','日','時'];
for(var i=0;i<4;i++){var h='<div><label>'+LAB[i]+'干</label><select id="g'+i+'">';H.GAN.forEach(function(g){h+='<option>'+g+'</option>';});
 h+='</select><label>'+LAB[i]+'支</label><select id="z'+i+'">';H.ZHI.forEach(function(z){h+='<option>'+z+'</option>';});pg.insertAdjacentHTML('beforeend',h+'</select></div>');}
function setP(p){for(var i=0;i<4;i++){$('g'+i).value=p[i].charAt(0);$('z'+i).value=p[i].charAt(1);}}
function getP(){var p=[];for(var i=0;i<4;i++)p.push($('g'+i).value+$('z'+i).value);return p;}
setP(H.SAMPLE.pillars);
$('calc').onclick=function(){var d=$('bd').value,t=$('bt').value||'12:00';if(!/^\d{4}-\d{2}-\d{2}$/.test(d)){$('cnote').textContent='請輸入日期';return;}
 var a=d.split('-'),b=t.split(':');var f=H.fromSolar(+a[0],+a[1],+a[2],+b[0],+b[1],parseFloat($('tz').value)||8,$('lz').checked);setP(f.pillars);
 $('cnote').textContent='排得：'+f.pillars.join(' ')+(f.note?'（'+f.note+'）':'')+'。節氣以太陽黃經近似計算，未作真太陽時校正；出生在節氣交界前後請自行核對。';};
var last=null;
function render(R){var s=[];
 s.push('<h2>命盤</h2><div class="big">'+R.pillars.join('　')+'</div><div>'+R.gender+'造　日主 '+R.dm.c+'（'+R.dm.wx+'）</div>');
 s.push('<h2>一、天干疾病斷訣（使用者提供）</h2><table><tr><th>位置</th><th>干</th><th>斷訣定位</th></tr>');
 R.stems.forEach(function(x){s.push('<tr><td>'+x.pos+'</td><td>'+x.c+'</td><td'+(x.uncertain?' class="u"':'')+'>'+esc(x.text)+(x.uncertain&&!/定位|確定|確切/.test(x.text)?'（難以具體定位）':'')+'</td></tr>');});
 s.push('</table><h2>二、地支疾病定位（使用者提供）</h2><table><tr><th>位置</th><th>支</th><th>定位</th></tr>');
 R.branches.forEach(function(x){s.push('<tr><td>'+x.pos+'</td><td>'+x.c+'</td><td'+(x.uncertain?' class="u"':'')+'>'+esc(x.text)+(x.uncertain&&!/定位|確定|確切/.test(x.text)?'（定位不確切）':'')+'</td></tr>');});
 s.push('</table><p class="note">'+esc(D.userNote)+'</p>');
 s.push('<h2>三、四柱部位與干支配臟腑</h2><table><tr><th>柱</th><th>部位</th><th>天干臟腑／身體</th><th>地支臟腑</th></tr>');
 for(var i=0;i<4;i++)s.push('<tr><td>'+H.POS[i]+'柱 '+R.pillars[i]+'</td><td>'+D.pillarZone[i]+'</td><td>'+R.stems[i].c+'：'+R.stems[i].organ+'／'+R.stems[i].body+'</td><td>'+R.branches[i].c+'：'+R.branches[i].organ+'</td></tr>');
 s.push('</table>'+srcHtml(D.pillarZoneSrc)+srcHtml(['smth','jwz']));
 s.push('<h2>四、五行統計（天干地支表面五行，共八字）</h2><table><tr>');H.WX.forEach(function(w){s.push('<th>'+w+'</th>');});s.push('</tr><tr>');H.WX.forEach(function(w){s.push('<td>'+R.count[w]+'</td>');});
 s.push('</tr><tr>');H.WX.forEach(function(w){s.push('<td class="note">'+D.wxOrgan[w]+'</td>');});s.push('</tr></table>'+srcHtml(D.wxOrganSrc.concat(['suanw'])));
 s.push('<p><b>缺：</b>'+(R.missing.length?R.missing.map(function(w){return w+'（'+D.wxOrgan[w]+'；受虧主病：'+D.wxDeficit[w]+'）';}).join('；'):'無')+'</p>'+srcHtml(D.wxDeficitSrc));
 s.push('<p><b>被剋：</b>'+(R.keHit.length?R.keHit.map(function(k){return k.wx+'（'+k.n+'）被'+k.by+'（'+k.kn+'）剋 → '+D.wxKe[k.wx];}).join('；'):'無明顯')+'</p>'+srcHtml(D.wxKeSrc)+'<p class="note">「多」的門檻：剋方 ≥2 個且不少於被剋方——此為本站計算設定，非原文。</p>');
 var d=R.dm;s.push('<h2>五、日主強弱</h2><p>日主 '+d.c+d.wx+'；月令'+(d.ling?'得令（'+d.ling+'）':'失令')+'；年日時支根（同類或生我）：'+(d.roots.length?d.roots.join('、'):'無')+'；其餘七字生扶 '+d.help+'、剋洩耗 '+d.opp+' → <b>'+d.level+'</b>（依韋千里六級）</p>'+srcHtml(D.strengthSrc)+'<p class="note">僅以表面五行計，未計藏干、長生十二宮及調候。</p>');
 s.push('<h2>六、沖剋（受病之處參考）</h2>'+(R.chong.length?'<ul>'+R.chong.map(function(c){return '<li>'+c.a+' 沖 '+c.b+'：'+esc(c.text)+'</li>';}).join('')+'</ul>':'<p>原局無天干四沖、地支六沖。</p>')+srcHtml(D.chongSrc.concat(D.stemChongSrc)));
 s.push('<h2>七、十二經絡流注</h2><p>出生時支 '+R.hourZhi+'：'+D.ziwu[R.hourZhi]+'</p>'+srcHtml(D.ziwuSrc)+'<p>'+R.hourZhi+'時生人'+D.birthHour[R.hourZhi]+'</p>'+srcHtml(D.birthHourSrc));
 var need=R.missing.concat(R.keHit.map(function(k){return k.wx;})).filter(function(w,i,a){return a.indexOf(w)===i;});
 s.push('<h2>八、養生參考</h2><p>'+(need.length?need.map(function(w){return w+'：'+D.yang[w];}).join('；')+'。':'')+D.yangNote+'</p>'+srcHtml(D.yangSrc)+'<p>'+D.sleep+'</p>'+srcHtml(D.sleepSrc));
 s.push('<p class="warn">命理參考，非醫療診斷。外站規則均「來源待核」。</p>');
 $('out').innerHTML='<div class="card" id="rep">'+s.join('')+'</div>';$('exp').style.display='flex';}
$('go').onclick=function(){last=H.analyze(getP(),D,$('sex').value);render(last);};
/* ---- 匯出：以 DOM 文字為內容 ---- */
function blocks(){var out=[],els=$('rep').children;for(var i=0;i<els.length;i++){var e=els[i],t=e.tagName;
 if(t==='TABLE'){var rows=[],tr=e.querySelectorAll('tr');for(var r=0;r<tr.length;r++){var c=[],cs=tr[r].children;for(var j=0;j<cs.length;j++)c.push(cs[j].textContent);rows.push(c);}out.push({k:'table',rows:rows});}
 else if(t==='UL'){var li=e.querySelectorAll('li');for(var q=0;q<li.length;q++)out.push({k:'p',t:'・'+li[q].textContent});}
 else if(e.getAttribute('data-t'))out.push({k:'s',t:e.getAttribute('data-t')});
 else out.push({k:t==='H2'?'h':(e.className==='src'||e.className==='note'?'s':(e.className==='big'?'big':'p')),t:e.textContent});}
 return out;}
function fname(ext){return '八字健康_'+last.pillars.join('')+'.'+ext;}
function save(blob,name){if(window.navigator&&navigator.msSaveBlob)return navigator.msSaveBlob(blob,name);var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(u);},4000);}
function rasterGlyph(cp){try{var ch=String.fromCodePoint(cp),N=96,font=N+'px "PingFang TC","Noto Serif CJK TC","Noto Sans TC","PMingLiU",serif';var c=document.createElement('canvas'),g=c.getContext('2d');g.font=font;var adv=Math.max(0.25,Math.min(1.6,g.measureText(ch).width/N)),W=Math.ceil(adv*N),Hh=Math.ceil(1.2*N);c.width=W;c.height=Hh;g=c.getContext('2d');g.font=font;g.fillStyle='#000';g.textBaseline='alphabetic';g.fillText(ch,0,N);var px=g.getImageData(0,0,W,Hh).data,rb=Math.ceil(W/8),bits=new Uint8Array(rb*Hh),ink=0;for(var y=0;y<Hh;y++)for(var x=0;x<W;x++)if(px[(y*W+x)*4+3]>110){bits[y*rb+(x>>3)]|=0x80>>(x&7);ink++;}return ink?{w:W,h:Hh,bits:bits,adv:adv}:null;}catch(e){return null;}}
var FONTP=null;
function font(){if(!FONTP)FONTP=fetch('fonts/tb-serif-tc.woff').then(function(r){if(!r.ok)throw new Error('字型載入失敗');return r.arrayBuffer();}).then(function(b){return TBX.loadFont(b);});FONTP['catch'](function(){FONTP=null;});return FONTP;}
function buildPdf(F,B,title){var d=new TBX.Doc(F,{raster:typeof document!=='undefined'?rasterGlyph:null}),ML=46,CW=d.pw-92,BOT=d.ph-50,y=50;d.newPage();
 function para(runs,lf,ind){ind=ind||0;var L=d.lay(runs,CW-ind,lf||1.5);for(var i=0;i<L.lines.length;i++){var ln=L.lines[i];if(y+ln.lh>BOT){d.newPage();y=50;}y=d.draw({lines:[ln],runs:L.runs},ML+ind,y,CW-ind);}}
 para([{t:title,s:18,b:1}]);y+=4;
 B.forEach(function(b){if(b.k==='h'){y+=6;para([{t:b.t,s:13,b:1,c:'7a2a18'}]);}
  else if(b.k==='s')para([{t:b.t,s:8,c:'8a6d3b'}],1.4);
  else if(b.k==='big')para([{t:b.t,s:16,b:1}]);
  else if(b.k==='table'){var n=b.rows[0].length,cw=CW/n;b.rows.forEach(function(r,ri){var Ls=r.map(function(t){return d.lay([{t:t,s:9.5,b:ri===0?1:0}],cw-6,1.4);}),h=0;Ls.forEach(function(L){h=Math.max(h,L.h);});h+=6;if(y+h>BOT){d.newPage();y=50;}
   Ls.forEach(function(L,j){d.rect(ML+j*cw,y,cw,h,ri===0?'f3ece2':null,'ccc4b8',0.5);d.draw(L,ML+j*cw+3,y+3,cw-6);});y+=h;});y+=4;}
  else para([{t:b.t,s:10.5}]);});
 return d.finish({title:title,now:new Date()});}
function crc(a){var c,t=[],x=-1,n,k;for(n=0;n<256;n++){c=n;for(k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}for(n=0;n<a.length;n++)x=(x>>>8)^t[(x^a[n])&255];return(x^-1)>>>0;}
function u8(s){return TBX&&typeof TextEncoder!=='undefined'?new TextEncoder().encode(s):null;}
function zip(files){var parts=[],cd=[],off=0;function w16(v){return[v&255,v>>8&255];}function w32(v){return[v&255,v>>8&255,v>>16&255,v>>>24&255];}
 files.forEach(function(f){var nm=u8(f.name),d=f.data,c=crc(d),h=[0x50,0x4b,3,4].concat(w16(20),w16(0x0800),w16(0),w16(0),w16(0x21),w32(c),w32(d.length),w32(d.length),w16(nm.length),w16(0));
  parts.push(new Uint8Array(h),nm,d);cd.push(new Uint8Array([0x50,0x4b,1,2].concat(w16(20),w16(20),w16(0x0800),w16(0),w16(0),w16(0x21),w32(c),w32(d.length),w32(d.length),w16(nm.length),w16(0),w16(0),w16(0),w16(0),w32(0),w32(off))),nm);off+=h.length+nm.length+d.length;});
 var l=0;cd.forEach(function(a){l+=a.length;});return parts.concat(cd,[new Uint8Array([0x50,0x4b,5,6].concat(w16(0),w16(0),w16(files.length),w16(files.length),w32(l),w32(off),w16(0)))]);}
function xe(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function wp(t,o){o=o||{};return '<w:p><w:r><w:rPr><w:rFonts w:eastAsia="PMingLiU"/>'+(o.b?'<w:b/>':'')+(o.c?'<w:color w:val="'+o.c+'"/>':'')+'<w:sz w:val="'+(o.sz||22)+'"/></w:rPr><w:t xml:space="preserve">'+xe(t)+'</w:t></w:r></w:p>';}
function buildDocx(B,title){var x=[wp(title,{b:1,sz:32})];B.forEach(function(b){if(b.k==='h')x.push(wp(b.t,{b:1,sz:26,c:'7A2A18'}));else if(b.k==='s')x.push(wp(b.t,{sz:16,c:'8A6D3B'}));else if(b.k==='big')x.push(wp(b.t,{b:1,sz:30}));
 else if(b.k==='table'){var t='<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>';b.rows.forEach(function(r,ri){t+='<w:tr>'+r.map(function(c){return '<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>'+wp(c,{b:ri===0,sz:20})+'</w:tc>';}).join('')+'</w:tr>';});x.push(t+'</w:tbl>',wp(''));}
 else x.push(wp(b.t));});
 var doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+x.join('')+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>';
 var ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
 var rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
 return new Blob(zip([{name:'[Content_Types].xml',data:u8(ct)},{name:'_rels/.rels',data:u8(rels)},{name:'word/document.xml',data:u8(doc)}]),{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});}
function title(){return '八字健康疾病參考　'+last.gender+'造 '+last.pillars.join(' ');}
$('pdf').onclick=function(){$('emsg').textContent='產生 PDF 中…';font().then(function(F){return buildPdf(F,blocks(),title());}).then(function(bytes){save(new Blob([bytes],{type:'application/pdf'}),fname('pdf'));$('emsg').textContent='PDF 已產生';},function(e){$('emsg').textContent='PDF 失敗：'+(e&&e.message||e)+'（需經 http(s) 開啟以載入字型）';});};
$('doc').onclick=function(){save(buildDocx(blocks(),title()),fname('docx'));$('emsg').textContent='Word 已產生';};
window.__HX={blocks:blocks,buildPdf:buildPdf,buildDocx:buildDocx,font:font};
/* 自我測試 */
if(/[?&]selftest=1/.test(location.search)){var T=H.selftest(D);$('st').textContent='【自我測試】'+(T.ok?'全部通過':'有失敗')+'\n'+T.lines.join('\n');setP(H.SAMPLE.pillars);$('go').onclick();}
})();
