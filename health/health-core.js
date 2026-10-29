/* health-core.js — 排盤與分析核心（ES5，瀏覽器與 node 共用） */
(function(root){
var GAN='甲乙丙丁戊己庚辛壬癸'.split(''),ZHI='子丑寅卯辰巳午未申酉戌亥'.split('');
var GWX='木木火火土土金金水水'.split(''),ZWX='水土木木土火火土金金土水'.split('');
var WX=['木','火','土','金','水'];
var POS=['年','月','日','時'];
function wxOf(c){var i=GAN.indexOf(c);if(i>=0)return GWX[i];i=ZHI.indexOf(c);return i>=0?ZWX[i]:'';}
function gen(a){return WX[(WX.indexOf(a)+1)%5];}      // a 生者
function ke(a){return WX[(WX.indexOf(a)+2)%5];}       // a 剋者
function keBy(a){return WX[(WX.indexOf(a)+3)%5];}     // 剋 a 者
function genBy(a){return WX[(WX.indexOf(a)+4)%5];}    // 生 a 者
/* ---- 曆法：公曆 → 四柱 ---- */
function jd(y,m,d,h){if(m<=2){y--;m+=12;}var A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+h/24+B-1524.5;}
function sunLon(J){var T=(J-2451545)/36525,L0=280.46646+36000.76983*T+0.0003032*T*T,M=(357.52911+35999.05029*T-0.0001537*T*T)*Math.PI/180;
 var C=(1.914602-0.004817*T-0.000014*T*T)*Math.sin(M)+(0.019993-0.000101*T)*Math.sin(2*M)+0.000289*Math.sin(3*M);
 var om=(125.04-1934.136*T)*Math.PI/180,l=L0+C-0.00569-0.00478*Math.sin(om);l%=360;if(l<0)l+=360;return l;}
/* y,m,d,hh,mm 為當地鐘錶時間；tz 為時區(小時)；lateZi: true=23時後日柱換次日 */
function fromSolar(y,m,d,hh,mm,tz,lateZi){if(tz==null)tz=8;
 var J=jd(y,m,d,(hh+mm/60-tz)),L=sunLon(J+69/86400);
 // 年：以立春(315°)為界
 var yy=y;var mon=Math.floor((((L-315)%360)+360)%360/30); // 0=寅月
 if(m<=2||(m===3&&d<10)){ if(L<315&&L>=270)yy=y-1; else if(m<=1&&L>=240)yy=y-1;}
 var yi=((yy-4)%60+60)%60,ys=yi%10,yb=yi%12;
 var ms=((ys%5)*2+2+mon)%10,mb=(mon+2)%12;
 var dj=Math.floor(jd(y,m,d,12)+0.5);var useNext=lateZi&&hh>=23;var di=((dj+49+(useNext?1:0))%60+60)%60,ds=di%10,db=di%12;
 var hb=Math.floor((hh+1)/2)%12,hs=((ds%5)*2+hb)%10;
 return {pillars:[GAN[ys]+ZHI[yb],GAN[ms]+ZHI[mb],GAN[ds]+ZHI[db],GAN[hs]+ZHI[hb]],sunLon:L,note:(hh===0?'早子時（00–01時），日柱用當日':(hh>=23?(lateZi?'夜子時（23–24時），日柱換次日':'夜子時（23–24時），日柱仍用當日'):''))};}
/* ---- 分析 ---- */
function analyze(p,D,gender){ // p: ['壬寅','丁未','戊寅','壬子']
 var R={pillars:p,gender:gender,stems:[],branches:[],count:{},chars:[]};
 WX.forEach(function(w){R.count[w]=0;});
 for(var i=0;i<4;i++){var g=p[i].charAt(0),z=p[i].charAt(1);
  var sr=D.stemRule[g][i],br=D.branchRule[z][i];
  R.stems.push({pos:POS[i]+'干',c:g,wx:wxOf(g),text:sr.t,uncertain:!!sr.u,organ:D.stemOrgan[g],body:D.stemBody[g]});
  R.branches.push({pos:POS[i]+'支',c:z,wx:wxOf(z),text:br.t,uncertain:!!br.u,organ:D.branchOrgan[z]});
  R.count[wxOf(g)]++;R.count[wxOf(z)]++;R.chars.push(g,z);}
 R.missing=WX.filter(function(w){return !R.count[w];});
 // 被剋：該五行存在，且剋它的五行數 ≥2 且不少於它（「多」的門檻為本站設定）
 R.keHit=WX.filter(function(w){var k=R.count[keBy(w)];return R.count[w]>0&&k>=2&&k>=R.count[w];}).map(function(w){return{wx:w,by:keBy(w),n:R.count[w],kn:R.count[keBy(w)]};});
 // 日主強弱
 var dm=p[2].charAt(0),dw=wxOf(dm),mw=wxOf(p[1].charAt(1));
 var ling=mw===dw?'旺':(mw===genBy(dw)?'相':'');
 var roots=[0,2,3].filter(function(i){var w=wxOf(p[i].charAt(1));return w===dw||w===genBy(dw);}).map(function(i){return POS[i]+'支'+p[i].charAt(1);});
 var help=0,opp=0;for(var j=0;j<8;j++){if(j===4)continue;var w=wxOf(R.chars[j]);if(w===dw||w===genBy(dw))help++;else opp++;}
 var lv;if(ling&&help>opp)lv='最強';else if(!ling&&help>opp)lv='中強';else if(!ling&&roots.length)lv='次強';else if(ling&&!roots.length)lv='次弱';else if(ling)lv='中弱';else lv='最弱';
 R.dm={c:dm,wx:dw,ling:ling,roots:roots,help:help,opp:opp,level:lv};
 // 沖
 R.chong=[];var CH=[['子','午'],['丑','未'],['寅','申'],['卯','酉'],['辰','戌'],['巳','亥']],SC=[['甲','庚'],['乙','辛'],['丙','壬'],['丁','癸']];
 for(var a=0;a<4;a++)for(var b=a+1;b<4;b++){var x=p[a].charAt(1),y=p[b].charAt(1);
  CH.forEach(function(c){if((c[0]===x&&c[1]===y)||(c[1]===x&&c[0]===y))R.chong.push({type:'支',a:POS[a]+'支'+x,b:POS[b]+'支'+y,key:c.join(''),text:D.chong[c.join('')]});});
  x=p[a].charAt(0);y=p[b].charAt(0);
  SC.forEach(function(c){if((c[0]===x&&c[1]===y)||(c[1]===x&&c[0]===y))R.chong.push({type:'干',a:POS[a]+'干'+x,b:POS[b]+'干'+y,key:c.join(''),text:D.stemChong[c.join('')]});});}
 R.hourZhi=p[3].charAt(1);
 return R;}
var SAMPLE={pillars:['壬寅','丁未','戊寅','壬子'],expect:{stems:['舌耳朵','心臟血液病','胃不好','難以具體定位'],branches:['頭、頭髮、腦部神經、血脈','膈膜、脊樑、胸肌','大腿','足']}};
function selftest(D){var out=[],ok=true;function chk(n,a,e){var p=a===e;ok=ok&&p;out.push((p?'✔ ':'✘ ')+n+' → '+a+(p?'':'（應為 '+e+'）'));}
 var f=fromSolar(1962,8,8,0,10,8,true);chk('1962-08-08 00:10 男 四柱',f.pillars.join(' '),'壬寅 丁未 戊寅 壬子');
 var f2=fromSolar(1984,2,4,23,30,8,true);chk('1984-02-04 23:30（立春後）年柱',f2.pillars[0],'甲子');
 var f3=fromSolar(1984,2,4,10,0,8,true);chk('1984-02-04 10:00（立春前）年柱',f3.pillars[0],'癸亥');
 chk('1949-10-01 日柱',fromSolar(1949,10,1,12,0,8,true).pillars[2],'甲子');
 var R=analyze(SAMPLE.pillars,D,'男');
 for(var i=0;i<4;i++){chk(R.stems[i].c+' '+R.stems[i].pos,R.stems[i].text,SAMPLE.expect.stems[i]);}
 for(i=0;i<4;i++){chk(R.branches[i].c+' '+R.branches[i].pos,R.branches[i].text,SAMPLE.expect.branches[i]);}
 chk('壬 時干 標示難定位',String(R.stems[3].uncertain),'true');
 return {ok:ok,lines:out,R:R};}
var API={GAN:GAN,ZHI:ZHI,WX:WX,POS:POS,wxOf:wxOf,fromSolar:fromSolar,analyze:analyze,selftest:selftest,SAMPLE:SAMPLE,gen:gen,ke:ke,keBy:keBy,genBy:genBy};
if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.HC=API;
})(this);
