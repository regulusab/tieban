/* export.js — 兩頁共用之 Word(.docx)／PDF 匯出工具（ES5） */
function xesc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]}).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"")}
function u8(s){var o=[],i,c;for(i=0;i<s.length;i++){c=s.charCodeAt(i);if(c>=0xD800&&c<0xDC00&&i+1<s.length){c=0x10000+((c-0xD800)<<10)+(s.charCodeAt(++i)-0xDC00)}
  if(c<128)o.push(c);else if(c<2048)o.push(192|c>>6,128|c&63);else if(c<65536)o.push(224|c>>12,128|c>>6&63,128|c&63);else o.push(240|c>>18,128|c>>12&63,128|c>>6&63,128|c&63)}return new Uint8Array(o)}
var CRCT=null;function crc32(a){if(!CRCT){CRCT=[];for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;CRCT[n]=c>>>0}}var x=-1;for(var i=0;i<a.length;i++)x=(x>>>8)^CRCT[(x^a[i])&255];return(x^-1)>>>0}
function zipStore(files){var parts=[],cd=[],off=0;function w16(v){return[v&255,v>>8&255]}function w32(v){return[v&255,v>>8&255,v>>16&255,v>>>24&255]}
  files.forEach(function(f){var nm=u8(f.name),d=f.data,c=crc32(d);var h=[].concat([0x50,0x4b,3,4],w16(20),w16(0x0800),w16(0),w16(0),w16(0x21),w32(c),w32(d.length),w32(d.length),w16(nm.length),w16(0));
    parts.push(new Uint8Array(h),nm,d);cd.push([].concat([0x50,0x4b,1,2],w16(20),w16(20),w16(0x0800),w16(0),w16(0),w16(0x21),w32(c),w32(d.length),w32(d.length),w16(nm.length),w16(0),w16(0),w16(0),w16(0),w32(0),w32(off)),nm);off+=h.length+nm.length+d.length});
  var cdl=0,cdp=[];for(var i=0;i<cd.length;i+=2){var a=new Uint8Array(cd[i]);cdp.push(a,cd[i+1]);cdl+=a.length+cd[i+1].length}
  var end=new Uint8Array([].concat([0x50,0x4b,5,6],w16(0),w16(0),w16(files.length),w16(files.length),w32(cdl),w32(off),w16(0)));
  return new Blob(parts.concat(cdp,[end]),{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"})}
function cellText(el){var c=el.cloneNode(true),b=c.querySelectorAll("br");for(var i=0;i<b.length;i++)b[i].parentNode.replaceChild(document.createTextNode("\n"),b[i]);
  var bl=c.querySelectorAll(".bh,.dy,div");for(i=0;i<bl.length;i++)bl[i].insertBefore(document.createTextNode("\n"),bl[i].firstChild);
  {var bh=c.querySelectorAll(".bh");for(i=bh.length-1;i>=0;i--)bh[i].parentNode.removeChild(bh[i])}
  return c.textContent.replace(/\n{2,}/g,"\n").replace(/^\n|\n$/g,"")}
function wr(t,o){o=o||{};var rp='<w:rPr><w:rFonts w:ascii="PMingLiU" w:hAnsi="PMingLiU" w:eastAsia="PMingLiU"/><w:lang w:eastAsia="zh-TW"/>'+(o.b?'<w:b/>':'')+(o.sz?'<w:sz w:val="'+o.sz+'"/><w:szCs w:val="'+o.sz+'"/>':'')+(o.col?'<w:color w:val="'+o.col+'"/>':'')+'</w:rPr>';
  return String(t).split("\n").map(function(s,i){return(i?'<w:r>'+rp+'<w:br/></w:r>':'')+'<w:r>'+rp+'<w:t xml:space="preserve">'+xesc(s)+'</w:t></w:r>'}).join("")}
function wp(t,o){return '<w:p>'+(o&&o.ctr?'<w:pPr><w:jc w:val="center"/></w:pPr>':'')+wr(t,o)+'</w:p>'}
function docxBody(R){var X=[];function walk(n){for(var c=n.firstChild;c;c=c.nextSibling){if(c.nodeType!==1)continue;var tg=c.tagName;
  if(tg==="H1")X.push(wp(c.textContent,{b:1,sz:36,ctr:1}));else if(tg==="H2")X.push(wp(c.textContent,{b:1,sz:30,col:"8B2F1C"}));else if(tg==="H3"||tg==="SUMMARY")X.push(wp(c.textContent,{b:1,sz:24}));
  else if(tg==="P"||tg==="LI")X.push(wp(cellText(c),{sz:c.className.indexOf("note")>=0?18:21}));
  else if(tg==="TABLE"){var rows=c.querySelectorAll("tr"),t='<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="BBBBBB"/><w:bottom w:val="single" w:sz="4" w:color="BBBBBB"/><w:insideH w:val="single" w:sz="4" w:color="DDDDDD"/></w:tblBorders></w:tblPr>';
    for(var r=0;r<rows.length;r++){t+='<w:tr>';var cs=rows[r].children;for(var j=0;j<cs.length;j++)t+='<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>'+wp(cellText(cs[j]),{sz:20,b:cs[j].tagName==="TH"?1:0})+'</w:tc>';if(!cs.length)t+='<w:tc>'+wp("")+'</w:tc>';t+='</w:tr>'}X.push(t+'</w:tbl>');X.push(wp(""))}
  else if(c.className&&/\bpillars\b/.test(c.className)){var ps=c.querySelectorAll(".p");var a=[];for(var q=0;q<ps.length;q++)a.push(ps[q].querySelector(".l").textContent+" "+ps[q].querySelector(".c").textContent);X.push(wp(a.join("　"),{b:1,sz:28}))}
  else if(c.className&&/\byao\b/.test(c.className)){}
  else if(c.className==="bh"){}
  else walk(c)}}walk(R);return X.join("")}
function docxPack(body){var doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>';
  var ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>';
  var rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
  var drels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
  var sty='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="PMingLiU" w:hAnsi="PMingLiU" w:eastAsia="PMingLiU" w:cs="PMingLiU"/><w:sz w:val="21"/><w:lang w:val="zh-TW" w:eastAsia="zh-TW"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="60" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>';
  return zipStore([{name:"[Content_Types].xml",data:u8(ct)},{name:"_rels/.rels",data:u8(rels)},{name:"word/_rels/document.xml.rels",data:u8(drels)},{name:"word/document.xml",data:u8(doc)},{name:"word/styles.xml",data:u8(sty)}])}
function loadJs(u){return new Promise(function(res,rej){var s=document.createElement("script");s.src=u;s.onload=res;s.onerror=function(){rej(new Error("無法載入 "+u))};document.head.appendChild(s)})}
var CDN=["https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js","https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"];
function libs(){if(window.jspdf&&window.html2canvas)return Promise.resolve();return loadJs(CDN[0]).then(function(){return loadJs(CDN[1])})}
function blocksOf(R){var out=[];for(var c=R.firstChild;c;c=c.nextSibling){if(c.nodeType!==1)continue;
  if(c.offsetHeight>1400&&c.children.length>1){var kids=[].slice.call(c.children);var cls=c.className;c.parentNode.removeChild?0:0;
    kids.forEach(function(k){if(k.tagName==="DETAILS"||k.tagName==="TABLE"&&k.offsetHeight>1400){out.push({el:k,split:true})}else out.push({el:k})})}else out.push({el:c})}return out}
function pdfFrom(R,props,msg,done,fail){var __z=document.body.style.zoom;document.body.style.zoom="";var rz=function(){document.body.style.zoom=__z};
  libs().then(function(){R.style.cssText="position:absolute;left:-10000px;top:0;width:720px;background:#fff";document.body.appendChild(R);
    var pdf=new window.jspdf.jsPDF({unit:"pt",format:"a4"}),PW=595.28,PH=841.89,M=28,CW=PW-2*M,y=M,scale=CW/720;try{if(props)pdf.setProperties(props)}catch(e){}
    var bl=blocksOf(R),i=0;
    function addCanvas(cv){var sy=0;
      while(sy<cv.height){var room=PH-M-y;if(room<40){pdf.addPage();y=M;room=PH-2*M}
        var sliceH=Math.min(cv.height-sy,Math.floor(room/scale*2));var t=document.createElement("canvas");t.width=cv.width;t.height=sliceH;t.getContext("2d").drawImage(cv,0,sy,cv.width,sliceH,0,0,cv.width,sliceH);
        if(sliceH<cv.height-sy&&sy===0&&cv.height/2*scale<=PH-2*M&&y>M){pdf.addPage();y=M;continue}
        pdf.addImage(t.toDataURL("image/jpeg",0.85),"JPEG",M,y,CW,sliceH/2*scale);y+=sliceH/2*scale+4;sy+=sliceH}}
    function next(){if(i>=bl.length){R.parentNode.removeChild(R);rz();done(pdf.output("blob"));return}
      var el=bl[i++].el;msg(i,bl.length);
      window.html2canvas(el,{scale:2,backgroundColor:"#ffffff",logging:false,windowWidth:720}).then(function(cv){if(cv.width&&cv.height)addCanvas(cv);setTimeout(next,0)},function(e){rz();if(R.parentNode)R.parentNode.removeChild(R);fail(e)})}
    next()}).catch(function(e){rz();fail(e)})}
