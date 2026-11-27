/* Constellation journey (home page preview of the unified assessment) */

(function(){
var Q=[
["Do you know who owns and controls your domain name (the address your website and email use)?","Domain control","If you can’t log in to the domain account, you can lose your website and email overnight."],
["Do at least two trusted people have admin access to your email and website accounts?","Second admin","When one person holds every login, a departure or a lost password can stop the organization."],
["Is multi-factor authentication turned on for email and other key accounts?","Multi-factor","Without it, a stolen password alone is enough to get into your accounts."],
["Are your important files backed up, and have you tested restoring them?","Backups","A backup you have never restored from is a hope, not a plan."],
["When someone leaves, is their access removed within a week?","Offboarding","Former staff and volunteers can keep access to your data long after they are gone."],
["Are computers and software updated on a schedule instead of whenever they nag you?","Updates","Missed updates are one of the easiest ways for problems to get in."],
["Do you keep a current list of your computers, software subscriptions, and who uses them?","Inventory","Without a list, you pay for software nobody uses and miss equipment that needs replacing."],
["Do you have a technology budget or plan for the next 12 months?","Budget","Surprise replacements and renewals land on the budget at the worst moments."]];
var PRIORITY=[0,2,1,4,3,5,6,7],BOOK="https://calendar.app.google/3gdVnfZjGvbq7phD7";
var S=[[0,0]],B=[],X=[],webT=0,heading=.6;
var stage=document.getElementById("journey");if(!stage)return;var c=document.createElement("canvas");c.className="j-sky";c.setAttribute("aria-hidden","true");stage.appendChild(c);var card=document.createElement("div");card.className="j-card";card.setAttribute("aria-live","polite");stage.appendChild(card);var g=c.getContext("2d"),W,H,inView=true,dpr=Math.min(devicePixelRatio||1,1.5);
var reduce=matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var fin=false,bF=0,par=[],M=[.85],cam={x:0,y:0,z:1.25},px=0,py=0,anim=null,idx=-1,ans=[],lines=[],seed=11,layers=[],fit=.5,phase="intro",t0=0,last=0;
function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
function size(){W=stage.clientWidth||600;H=stage.clientHeight||600;c.width=W*dpr;c.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0);fit=.5}
function build(){var n=[230,170,120],d=[.15,.4,.7],r=[.7,1.1,1.7];for(var l=0;l<3;l++){var a=[];for(var i=0;i<n[l];i++)a.push({x:(rnd()-.5)*5000,y:(rnd()-.5)*3200,r:r[l]*(.6+rnd()*.9),p:rnd()*6.28});layers.push({d:d[l],s:a})}}
function ease(k){return k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2}
function fly(to,dur,dip,cb){var a={x:cam.x,y:cam.y,z:cam.z};anim={a:a,b:to,t:0,dur:reduce?.01:dur,dip:reduce?0:dip,cb:cb}}
function focus(i){return{x:S[i][0],y:S[i][1],z:3.1}}
function esc(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;")}
function intro(){card.className="j-card";card.innerHTML='<div class="j-qn">Free report preview</div><p class="j-qt">Eight stars. One question each. Fly through them and see your path.</p><div class="j-row"><button class="j-solid" id="go">Begin the journey</button></div>';document.getElementById("go").onclick=begin}
function begin(){card.className="j-card off";phase="fly";idx=0;fly(focus(0),2.4,.5,ask)}
function ask(){phase="ask";card.className="j-card";card.innerHTML='<div class="j-qn">Star '+(idx+1)+' of 8</div><p class="j-qt">'+esc(Q[idx][0])+'</p><div class="j-row"><button data-v="1">Yes</button><button data-v="0">No or not sure</button></div>';
 [].forEach.call(card.querySelectorAll("button"),function(b){b.onclick=function(){answer(b.getAttribute("data-v")==="1")}})}
function nextPos(i,yes){
 var x=7;for(var k=0;k<=i;k++)x=(x*31+(ans[k]?1:2)*(k+3))%9973;
 function r(){x=(x*1103515245+12345)%2147483648;return x/2147483648}r();r();
 var cx=0,cy=0;S.forEach(function(p){cx+=p[0];cy+=p[1]});cx/=S.length;cy/=S.length;
 var nx=0,ny=0,best=-1,bs=-1e9;
 for(var t=0;t<60;t++){var a=S[Math.floor(r()*S.length)],ang=r()*6.283,d=125+r()*120,qx=a[0]+Math.cos(ang)*d,qy=a[1]+Math.sin(ang)*d;
  if(!yes){qx+=(qx-cx)*.12;qy+=(qy-cy)*.12}
  var md=1e9;for(var j=0;j<S.length;j++)md=Math.min(md,Math.hypot(S[j][0]-qx,S[j][1]-qy));
  var sc=(md<115?-1e6:0)-Math.hypot(qx-cx,qy-cy)*.4+r()*40;
  if(sc>bs){bs=sc;nx=qx;ny=qy}}
 var pj=0,pd=1e9;for(var j=0;j<S.length;j++){var dd=Math.hypot(S[j][0]-nx,S[j][1]-ny);if(dd<pd){pd=dd;pj=j}}
 par[S.length]=pj;M[S.length]=.45+r()*.55;
 return[Math.round(nx),Math.round(ny)]}
function stub(i,v){var base=i<7?Math.atan2(S[i+1][1]-S[i][1],S[i+1][0]-S[i][0]):(par[i]!=null?Math.atan2(S[i][1]-S[par[i]][1],S[i][0]-S[par[i]][0]):0);
 var x=(i*53+(v?11:29)+Math.round(S[i][0]))%97,side=x%2?1:-1,off=1.7+(x%7)*.1,L=(v?55:85)+(x%5)*8,a=base+side*off;
 B.push({from:i,x:S[i][0]+Math.cos(a)*L,y:S[i][1]+Math.sin(a)*L,t0:performance.now()/1000,dim:!!v})}
function answer(v){ans[idx]=v;card.className="j-card off";var i=idx;
 if(i<7){S.push(nextPos(i,v));stub(i,v);idx++;phase="fly";anim={a:{x:cam.x,y:cam.y,z:cam.z},b:focus(idx),t:0,dur:reduce?.01:2.0,dip:reduce?0:1.0,seg:i,cb:ask}}
 else{fin=true;phase="fly";lines[7]=1;var mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;S.forEach(function(p){mnx=Math.min(mnx,p[0]);mxx=Math.max(mxx,p[0]);mny=Math.min(mny,p[1]);mxy=Math.max(mxy,p[1])});
  var hw=(mxx-mnx)/2+110,hh2=(mxy-mny)/2+80,z=Math.min(W*.52/hw,H*.2/hh2,2);fly({x:(mnx+mxx)/2,y:(mny+mxy)/2,z:z},3.2,0,finish)}}
function finish(){phase="done";var gaps=PRIORITY.filter(function(i){return !ans[i]});
 var pairs=[];for(var i=0;i<8;i++)for(var j=i+1;j<8;j++)if(par[j]!==i&&par[i]!==j)pairs.push([i,j,Math.hypot(S[i][0]-S[j][0],S[i][1]-S[j][1])]);
 pairs.sort(function(a,b){return a[2]-b[2]});X=pairs.slice(0,1);
 var h='<div class="j-qn">Your constellation</div><p class="j-qt">'+(8-gaps.length)+' of 8 stars are lit.'+(gaps.length?' Here is your path, in order.':' Every star is lit.')+'</p>';
 if(gaps.length){h+='<ol class="j-path">';gaps.slice(0,3).forEach(function(i){h+='<li><b>'+esc(Q[i][1])+'</b><span>'+esc(Q[i][2])+'</span></li>'});h+='</ol>';if(gaps.length>3)h+='<p class="j-fine">Plus '+(gaps.length-3)+' more on the full path.</p>'}
 h+='<div class="j-row"><button class="j-solid" id="em">Email me this path</button><a href="'+BOOK+'">Book a free call</a></div><p class="j-fine">Preview: the emailed report comes with the final assessment.</p>';
 card.className="j-card";card.innerHTML=h;document.getElementById("em").onclick=function(){this.textContent="Coming with the final version"}}
function glow(x,y,r,col,a){var gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,col.replace("A",a));gr.addColorStop(1,col.replace("A",0));g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,6.283);g.fill()}
function frame(ts){requestAnimationFrame(frame);if(document.hidden||!inView)return;var dt=Math.min(.05,(ts-last)/1000||0);last=ts;var t=(ts-t0)/1000;
 if(anim){anim.t+=dt/anim.dur;var k=Math.min(1,anim.t),e=ease(k);cam.x=anim.a.x+(anim.b.x-anim.a.x)*e;cam.y=anim.a.y+(anim.b.y-anim.a.y)*e;cam.z=anim.a.z+(anim.b.z-anim.a.z)*e-anim.dip*Math.sin(Math.PI*k)*Math.min(1,anim.a.z);
  if(anim.seg!=null)lines[anim.seg]=e;if(k>=1){if(anim.seg!=null)lines[anim.seg]=1;var cb=anim.cb;anim=null;if(cb)cb()}}
if(fin)bF=Math.min(1,bF+dt/1.4);
 if(phase==="done")webT=Math.min(1,webT+dt/2.8);var ay=H*.34,ax=W/2;
 var gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,"#050a17");gr.addColorStop(1,"#0f1c38");g.fillStyle=gr;g.fillRect(0,0,W,H);
 for(var l=0;l<3;l++){var L=layers[l],sc=1+(cam.z-1)*L.d;sc=Math.max(.25,sc);g.fillStyle="#fff";
  for(var i=0;i<L.s.length;i++){var s=L.s[i];var x=ax+(s.x-(cam.x+px)*L.d)*sc,y=ay+(s.y-(cam.y+py)*L.d)*sc;if(x<-20||x>W+20||y<-20||y>H+20)continue;
   g.globalAlpha=(.35+l*.25)*(reduce?1:.7+.3*Math.sin(t*1.3+s.p));g.beginPath();g.arc(x,y,s.r*(.8+.2*sc),0,6.283);g.fill()}}
 g.globalAlpha=1;var z=cam.z;
 function P(i){return[ax+(S[i][0]-cam.x)*z,ay+(S[i][1]-cam.y)*z]}
 g.lineWidth=1.6;
 for(var j=1;j<S.length;j++){var p=lines[j-1]||0;if(p<=0)continue;var a=P(par[j]),b=P(j);g.strokeStyle="rgba(226,188,104,.85)";g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(a[0]+(b[0]-a[0])*p,a[1]+(b[1]-a[1])*p);g.stroke()}
 g.lineWidth=1;
 if(webT>0){g.strokeStyle="rgba(226,188,104,"+(.7*webT)+")";for(var j=0;j<X.length;j++){var a=P(X[j][0]),b=P(X[j][1]);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(a[0]+(b[0]-a[0])*webT,a[1]+(b[1]-a[1])*webT);g.stroke()}}
 var now=ts/1000;
 for(var k=0;k<B.length;k++){var bb=B[k],al=Math.min(1,Math.max(0,(now-bb.t0)/1.4))*(1-bF);if(al<=0)continue;var a=P(bb.from),bx=ax+(bb.x-cam.x)*z,by=ay+(bb.y-cam.y)*z;
  g.globalAlpha=(bb.dim?.32:.65)*al;g.strokeStyle=bb.dim?"#e2bc68":"#f0a24a";g.lineWidth=1.2;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(a[0]+(bx-a[0])*al,a[1]+(by-a[1])*al);g.stroke();
  g.globalAlpha=bb.dim?al*.5:al;glow(bx,by,Math.max(8,2.2*z*3.5),"rgba(224,140,58,A)",.45*al);g.fillStyle=bb.dim?"#e2bc68":"#f0a24a";g.beginPath();g.arc(bx,by,Math.max(1.8,1.4*z),0,6.283);g.fill();g.globalAlpha=1}
 for(var i=0;i<S.length;i++){var q=P(i),r=Math.max(2.2,Math.min(9,2.2*z))*(.7+.6*(M[i]||.8)),has=ans[i]!==undefined,cur=(i===idx&&phase==="ask"),vis=i===0?1:(lines[i-1]||0);if(vis<=0)continue;g.globalAlpha=vis;
  if(!has){g.fillStyle="#fff";g.beginPath();g.arc(q[0],q[1],r,0,6.283);g.fill();if(cur||phase==="intro")glow(q[0],q[1],r*(cur?7+Math.sin(t*3)*1.2:5),"rgba(226,188,104,A)",cur?.55:.4)}
  else if(ans[i]){glow(q[0],q[1],r*6,"rgba(226,188,104,A)",.6);g.fillStyle="#f1cd7c";g.beginPath();g.arc(q[0],q[1],r*1.15,0,6.283);g.fill()}
  else{var pu=.75+.25*Math.sin(t*3+i);glow(q[0],q[1],r*7*pu,"rgba(224,140,58,A)",.6);g.strokeStyle="#f0a24a";g.lineWidth=2;g.beginPath();g.arc(q[0],q[1],r*1.8*pu,0,6.283);g.stroke();g.fillStyle="#f0a24a";g.beginPath();g.arc(q[0],q[1],r*.8,0,6.283);g.fill();g.lineWidth=1}
  g.globalAlpha=1;
  if(phase==="done"){var cx=0,cy=0;S.forEach(function(p){cx+=p[0];cy+=p[1]});cx/=S.length;cy/=S.length;var dx=S[i][0]-cx,dy=S[i][1]-cy,dl=Math.sqrt(dx*dx+dy*dy)||1;dx/=dl;dy/=dl;
   g.fillStyle="rgba(230,236,248,.9)";g.font="600 "+Math.max(11,Math.min(14,z*18))+"px Inter,sans-serif";g.textAlign=dx>.35?"left":dx<-.35?"right":"center";var lx=q[0]+dx*16,ly=q[1]+dy*18+4,tw=g.measureText(Q[i][1]).width;if(g.textAlign==="left"){lx=Math.min(lx,W-8-tw)}else if(g.textAlign==="right"){lx=Math.max(lx,8+tw)}else{lx=Math.max(8+tw/2,Math.min(W-8-tw/2,lx))}g.fillText(Q[i][1],lx,ly)}}
 if(!reduce&&!anim){}
}
if(window.ResizeObserver){new ResizeObserver(size).observe(stage)}else{addEventListener("resize",size)}if(window.IntersectionObserver){new IntersectionObserver(function(e){inView=e[0].isIntersecting}).observe(stage)}
stage.addEventListener("pointermove",function(e){var r=stage.getBoundingClientRect();px=((e.clientX-r.left)/W-.5)*70;py=((e.clientY-r.top)/H-.5)*40});
build();size();intro();requestAnimationFrame(function(ts){t0=ts;last=ts;frame(ts)});
})();

(function(){var t=document.getElementById("take"),h=document.getElementById("jhero"),st=document.getElementById("journey");if(!t||!h||!st)return;
t.addEventListener("click",function(){h.classList.add("gone");st.removeAttribute("inert");h.setAttribute("aria-hidden","true");var sec=document.getElementById("journey-section");if(sec)sec.scrollIntoView({behavior:"smooth",block:"start"});setTimeout(function(){h.style.display="none"},900)})})();
