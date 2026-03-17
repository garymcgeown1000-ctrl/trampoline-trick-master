import { useState, useEffect, useRef, useCallback } from "react";

/* ══════ AUDIO (disabled for now) ══════ */
function snd() {}

/* ══════ CHARACTER ══════ */
const SKIN=["#ffcc99","#e8a87c","#c68642","#8d5524","#5c3317"];
const HSTYLES=["short","spiky","long","curly","ponytail","buns"];
const HCOLORS=["#f7d794","#6b4423","#2c2c2c","#c0392b","#3498db","#e84393"];
const SHIRTS=["#e74c3c","#3498db","#2ecc71","#9b59b6","#f1c40f","#fd79a8"];
const SHO_C=["#2c3e50","#636e72","#d63031","#0984e3","#1e1e1e","#00b894"];
const SHOE_C=["#ffffff","#e74c3c","#2980b9","#2d3436","#fd79a8","#fdcb6e"];
const ACCS=["none","cap","bow","headband","glasses","star","crown"];
const DC={skin:0,hair:0,hc:1,shirt:1,shorts:0,shoes:0,acc:0};

const POSES={
  idle:{hY:0,aL:15,aR:-15,lL:5,lR:-5,rot:0,sy:1,sx:1},
  jump:{hY:-5,aL:-155,aR:155,lL:8,lR:-8,rot:0,sy:1.08,sx:0.95},
  tuck:{hY:10,aL:70,aR:-70,lL:-90,lR:90,rot:0,sy:0.72,sx:1.1},
  star:{hY:-3,aL:-140,aR:140,lL:-40,lR:40,rot:0,sy:0.95,sx:1.15},
  spin:{hY:0,aL:-90,aR:90,lL:0,lR:0,rot:360,sy:1,sx:1},
  flip:{hY:6,aL:40,aR:-40,lL:-50,lR:50,rot:-360,sy:1,sx:1},
  pike:{hY:8,aL:55,aR:-55,lL:-70,lR:70,rot:0,sy:0.75,sx:1.05},
  celebrate:{hY:-5,aL:-165,aR:165,lL:-15,lR:15,rot:0,sy:1.05,sx:1.05},
};

function Ch({c,pose="idle",bounce=false,sz=90}){
  const p=POSES[pose]||POSES.idle;
  const sk=SKIN[c.skin]||SKIN[0],hc=HCOLORS[c.hc]||HCOLORS[1],sh=SHIRTS[c.shirt]||SHIRTS[1],sho=SHO_C[c.shorts]||SHO_C[0],shoe=SHOE_C[c.shoes]||SHOE_C[0];
  const d=(pose==="spin"||pose==="flip")?"0.5s":"0.3s";
  const e=(pose==="spin"||pose==="flip")?"cubic-bezier(0.4,0,0.2,1)":"ease-out";
  const hair={
    short:<><ellipse cx="50" cy="16" rx="22" ry="12" fill={hc}/><rect x="28" y="12" width="44" height="14" rx="4" fill={hc}/></>,
    spiky:<><polygon points="30,22 35,2 42,18 50,0 58,18 65,2 70,22" fill={hc}/><rect x="29" y="16" width="42" height="10" rx="3" fill={hc}/></>,
    long:<><ellipse cx="50" cy="16" rx="23" ry="13" fill={hc}/><rect x="27" y="12" width="46" height="16" rx="4" fill={hc}/><rect x="27" y="22" width="10" height="28" rx="4" fill={hc}/><rect x="63" y="22" width="10" height="28" rx="4" fill={hc}/></>,
    curly:<><circle cx="34" cy="14" r="10" fill={hc}/><circle cx="50" cy="10" r="11" fill={hc}/><circle cx="66" cy="14" r="10" fill={hc}/><rect x="30" y="16" width="40" height="10" rx="3" fill={hc}/></>,
    ponytail:<><ellipse cx="50" cy="16" rx="22" ry="12" fill={hc}/><rect x="28" y="12" width="44" height="14" rx="4" fill={hc}/><circle cx="50" cy="0" r="7" fill={hc}/><rect x="47" y="2" width="6" height="14" rx="3" fill={hc}/></>,
    buns:<><ellipse cx="50" cy="16" rx="22" ry="12" fill={hc}/><rect x="28" y="12" width="44" height="14" rx="4" fill={hc}/><circle cx="30" cy="10" r="9" fill={hc}/><circle cx="70" cy="10" r="9" fill={hc}/></>,
  };
  const acc={none:null,cap:<><rect x="26" y="8" width="48" height="8" rx="3" fill="#e74c3c"/><rect x="22" y="14" width="30" height="5" rx="2" fill="#c0392b"/></>,bow:<><polygon points="50,10 40,4 40,16" fill="#e84393"/><polygon points="50,10 60,4 60,16" fill="#fd79a8"/><circle cx="50" cy="10" r="3" fill="#d63031"/></>,headband:<rect x="26" y="15" width="48" height="5" rx="2" fill="#fbbf24"/>,glasses:<><circle cx="40" cy="30" r="8" fill="none" stroke="#333" strokeWidth="2.5"/><circle cx="60" cy="30" r="8" fill="none" stroke="#333" strokeWidth="2.5"/><line x1="48" y1="30" x2="52" y2="30" stroke="#333" strokeWidth="2"/></>,star:<polygon points="50,2 53,12 63,12 55,18 58,28 50,22 42,28 45,18 37,12 47,12" fill="#fbbf24"/>,crown:<polygon points="30,14 35,4 42,12 50,0 58,12 65,4 70,14" fill="#fbbf24" stroke="#f39c12" strokeWidth="1"/>};
  return(
    <div style={{width:sz,height:sz*1.4,animation:bounce&&pose==="idle"?"bob 0.8s ease-in-out infinite":"none"}}>
      <div style={{width:"100%",height:"100%",transform:`scaleX(${p.sx}) scaleY(${p.sy}) rotate(${p.rot}deg)`,transition:`transform ${d} ${e}`,transformOrigin:"50% 50%"}}>
        <svg viewBox="-10 -5 120 150" width="100%" height="100%">
          <g transform={`rotate(${p.lL} 42 82)`} style={{transition:`transform ${d} ${e}`}}><rect x="37" y="82" width="11" height="30" rx="5" fill={sk}/><rect x="34" y="108" width="17" height="10" rx="5" fill={shoe}/></g>
          <g transform={`rotate(${p.lR} 58 82)`} style={{transition:`transform ${d} ${e}`}}><rect x="52" y="82" width="11" height="30" rx="5" fill={sk}/><rect x="49" y="108" width="17" height="10" rx="5" fill={shoe}/></g>
          <g transform={`rotate(${p.aL} 36 48)`} style={{transition:`transform ${d} ${e}`}}><rect x="18" y="43" width="20" height="11" rx="5" fill={sh}/><rect x="6" y="44" width="16" height="10" rx="5" fill={sk}/><circle cx="7" cy="49" r="6" fill={sk}/></g>
          <g transform={`rotate(${p.aR} 64 48)`} style={{transition:`transform ${d} ${e}`}}><rect x="62" y="43" width="20" height="11" rx="5" fill={sh}/><rect x="78" y="44" width="16" height="10" rx="5" fill={sk}/><circle cx="93" cy="49" r="6" fill={sk}/></g>
          <rect x="33" y="42" width="34" height="30" rx="8" fill={sh}/>
          <rect x="33" y="68" width="34" height="18" rx="6" fill={sho}/>
          <g style={{transform:`translateY(${p.hY}px)`,transition:`transform ${d} ${e}`}}>
            {hair[HSTYLES[c.hair]]||hair.short}
            <ellipse cx="50" cy="28" rx="21" ry="20" fill={sk}/>
            <ellipse cx="36" cy="33" rx="5" ry="3" fill="rgba(255,100,100,0.2)"/><ellipse cx="64" cy="33" rx="5" ry="3" fill="rgba(255,100,100,0.2)"/>
            <ellipse cx="41" cy="28" rx="4.5" ry="5" fill="white"/><ellipse cx="59" cy="28" rx="4.5" ry="5" fill="white"/>
            <circle cx="42" cy="29" r="3" fill="#333"/><circle cx="60" cy="29" r="3" fill="#333"/>
            <circle cx="43" cy="27.5" r="1.2" fill="white"/><circle cx="61" cy="27.5" r="1.2" fill="white"/>
            <path d="M44,36 Q50,42 56,36" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round"/>
            {acc[ACCS[c.acc]]||null}
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ══════ MOVES & TRICKS ══════ */
const MV=[
  {id:"jump",label:"Jump",emoji:"⬆️",color:"#22c55e"},
  {id:"tuck",label:"Tuck",emoji:"🔵",color:"#3b82f6"},
  {id:"star",label:"Star",emoji:"⭐",color:"#eab308"},
  {id:"spin",label:"Spin",emoji:"🔄",color:"#a855f7"},
  {id:"flip",label:"Flip",emoji:"🔃",color:"#ef4444"},
  {id:"pike",label:"Pike",emoji:"📐",color:"#06b6d4"},
];
const TR=[
  {name:"Basic Jump",m:["jump"],pts:10},{name:"Quick Tuck",m:["tuck"],pts:10},
  {name:"Star Jump",m:["jump","star"],pts:20},{name:"Tuck Jump",m:["jump","tuck"],pts:20},
  {name:"Front Flip",m:["jump","flip"],pts:25},{name:"Spin Jump",m:["jump","spin"],pts:25},
  {name:"Pike Jump",m:["jump","pike"],pts:22},{name:"Star Tuck",m:["star","tuck"],pts:28},
  {name:"Flip Spin",m:["flip","spin"],pts:30},{name:"Double Spin",m:["spin","spin"],pts:32},
  {name:"Super Star",m:["jump","star","spin"],pts:40},{name:"Mega Flip",m:["jump","flip","tuck"],pts:42},
  {name:"Corkscrew",m:["spin","flip","spin"],pts:48},{name:"Cannonball",m:["jump","tuck","tuck"],pts:38},
  {name:"Rocket",m:["jump","pike","star"],pts:42},{name:"Cyclone",m:["spin","pike","flip"],pts:48},
  {name:"Grand Slam",m:["jump","star","flip","tuck"],pts:58},{name:"Tornado",m:["jump","spin","flip","spin"],pts:62},
  {name:"Phoenix",m:["flip","pike","star","flip"],pts:70},{name:"Champion",m:["jump","flip","pike","spin"],pts:70},
];
const LV=[
  {lv:1,n:3,time:999,max:1,title:"First Bounce",bg:["#38bdf8","#bae6fd"],nt:true},
  {lv:2,n:4,time:999,max:1,title:"Getting Air",bg:["#4ade80","#bbf7d0"],nt:true},
  {lv:3,n:4,time:999,max:2,title:"Easy Combos",bg:["#fbbf24","#fef08a"],nt:true},
  {lv:4,n:5,time:40,max:2,title:"Trick Learner",bg:["#c084fc","#e9d5ff"]},
  {lv:5,n:5,time:36,max:2,title:"Rising Star",bg:["#fb923c","#fed7aa"]},
  {lv:6,n:6,time:36,max:2,title:"Flip Master",bg:["#38bdf8","#bae6fd"]},
  {lv:7,n:6,time:33,max:2,title:"Quick Feet",bg:["#4ade80","#bbf7d0"]},
  {lv:8,n:5,time:36,max:3,title:"Air Acrobat",bg:["#34d399","#a7f3d0"]},
  {lv:9,n:6,time:34,max:3,title:"Triple Threat",bg:["#d946ef","#f0abfc"]},
  {lv:10,n:7,time:34,max:3,title:"Sky Dancer",bg:["#f87171","#fecaca"]},
  {lv:11,n:7,time:31,max:3,title:"Speed Demon",bg:["#fbbf24","#fef08a"]},
  {lv:12,n:8,time:31,max:3,title:"Stunt Master",bg:["#22d3ee","#a5f3fc"]},
  {lv:13,n:8,time:29,max:3,title:"No Pressure",bg:["#e879f9","#f5d0fe"]},
  {lv:14,n:9,time:31,max:3,title:"Crowd Pleaser",bg:["#34d399","#6ee7b7"]},
  {lv:15,n:6,time:37,max:4,title:"Quad Squad",bg:["#60a5fa","#bfdbfe"]},
  {lv:16,n:7,time:35,max:4,title:"Show-Off",bg:["#fb923c","#fdba74"]},
  {lv:17,n:8,time:34,max:4,title:"Daredevil",bg:["#c084fc","#d8b4fe"]},
  {lv:18,n:9,time:33,max:4,title:"Fearless",bg:["#22d3ee","#67e8f9"]},
  {lv:19,n:10,time:33,max:4,title:"Legendary",bg:["#fbbf24","#fde68a"]},
  {lv:20,n:12,time:35,max:4,title:"Grand Champion",bg:["#f97316","#fbbf24"]},
];
const gM=id=>MV.find(m=>m.id===id);
function pT(max,last){const ok=TR.filter(t=>t.m.length<=max&&t.name!==last);return ok[Math.floor(Math.random()*ok.length)]||TR[0];}

/* ══════ GAME ══════ */
export default function Game(){
  const[screen,setScreen]=useState("menu");
  const[cfg,setCfg]=useState({...DC});
  const[tab,setTab]=useState(0);
  const[li,setLi]=useState(0);
  const[score,setScore]=useState(0);
  const[coins,setCoins]=useState(0);
  const[unlocked,setUnlocked]=useState([]);
  const[sts,setSts]=useState(Array(20).fill(0));
  const[totS,setTotS]=useState(0);
  const[trick,setTrick]=useState(null);
  const[left,setLeft]=useState(0);
  const[total,setTotal]=useState(0);
  const[timeLeft,setTimeLeft]=useState(0);
  const tR=useRef(0);
  const[prog,setProg]=useState([]);
  const[pose,setPose]=useState("idle");
  const[cY,setCY]=useState(0);
  const[fb,setFb]=useState(null);
  const[locked,setLocked]=useState(false);
  const[loaded,setLoaded]=useState(false);
  const lastR=useRef(null);const sR=useRef(0);const tiR=useRef(null);const fbR=useRef(null);
  const lv=LV[li];

  useEffect(()=>{try{const r=localStorage.getItem("tt-s");if(r){const d=JSON.parse(r);if(d.c)setCfg(p=>({...p,...d.c}));if(d.s)setSts(d.s);if(typeof d.co==="number")setCoins(d.co);if(typeof d.ts==="number")setTotS(d.ts);if(Array.isArray(d.u))setUnlocked(d.u);}}catch(e){}setLoaded(true);},[]);
  useEffect(()=>{if(!loaded)return;try{localStorage.setItem("tt-s",JSON.stringify({c:cfg,s:sts,co:coins,ts:totS,u:unlocked}));}catch(e){}},[cfg,sts,coins,totS,unlocked,loaded]);

  const startLv=useCallback((idx)=>{const l=LV[idx];setLi(idx);setScreen("play");setScore(0);sR.current=0;setLeft(l.n);setTotal(l.n);setTimeLeft(l.time);tR.current=l.time;setProg([]);setPose("idle");setCY(0);setFb(null);setLocked(false);lastR.current=null;const t=pT(l.max,null);setTrick(t);lastR.current=t.name;},[]);

  useEffect(()=>{if(screen!=="play")return;if(LV[li].nt)return;const did=setTimeout(()=>{tiR.current=setInterval(()=>{setTimeLeft(t=>{const n=t-1;tR.current=n;if(n<=0){clearInterval(tiR.current);setTimeout(()=>{setScreen("result");setPose("idle");},300);return 0;}return n;});},1000);},500);return()=>{clearTimeout(did);clearInterval(tiR.current);};},[screen,li]);

  const anim=useCallback((mid,cb)=>{setLocked(true);setCY(-40);setPose(mid);snd();setTimeout(()=>setCY(-55),150);setTimeout(()=>setCY(-15),350);setTimeout(()=>{setCY(0);setPose("idle");setLocked(false);if(cb)cb();},500);},[]);

  const handleTap=useCallback((mid)=>{
    if(screen!=="play"||!trick||fb||locked)return;
    if(!trick.m.includes(mid))return;
    const idx=prog.length;
    if(mid===trick.m[idx]){
      const np=[...prog,mid];setProg(np);
      anim(mid,()=>{
        if(np.length===trick.m.length){
          const pts=trick.pts;const ns=sR.current+pts;sR.current=ns;setScore(ns);
          setPose("celebrate");setCY(-20);snd("ok");
          setFb({ok:true,text:`${trick.name}!`,sub:`+${pts}`});
          const rem=left-1;setLeft(rem);
          fbR.current=setTimeout(()=>{
            setFb(null);setPose("idle");setCY(0);setProg([]);
            if(rem<=0){
              clearInterval(tiR.current);const t=tR.current;const l=LV[li];
              let s=l.nt?3:t>l.time*0.5?3:t>l.time*0.2?2:1;
              const cr=s*10+(li+1)*5;setCoins(p=>p+cr);
              setSts(p=>{const n=[...p];n[li]=Math.max(n[li],s);return n;});
              setPose("celebrate");snd("win");
              setTimeout(()=>{setTotS(ts=>ts+ns);setScreen("result");},800);
            }else{const nt=pT(LV[li].max,lastR.current);setTrick(nt);lastR.current=nt.name;}
          },500);
        }
      });
    }else{snd("no");setPose("idle");setFb({ok:false,text:"Wrong!",sub:"Try again"});setProg([]);setLocked(true);fbR.current=setTimeout(()=>{setFb(null);setPose("idle");setLocked(false);},700);}
  },[screen,trick,prog,fb,locked,left,li,anim]);

  useEffect(()=>()=>{clearInterval(tiR.current);clearTimeout(fbR.current);},[]);
  const won=left<=0&&screen==="result";
  const tp=lv?Math.max(0,(timeLeft/lv.time)*100):100;
  const bg=lv&&lv.bg?lv.bg:["#38bdf8","#bae6fd"];
  const F="'Lilita One','Baloo 2',cursive";const F2="'Baloo 2',cursive";

  return(
    <div style={{width:"100%",height:"100vh",overflow:"hidden",fontFamily:F,userSelect:"none",WebkitUserSelect:"none",touchAction:"manipulation",background:screen==="play"?`linear-gradient(180deg,${bg[0]},${bg[1]})`:"linear-gradient(170deg,#0a0a1a 0%,#111827 40%,#1e3a2e 100%)",display:"flex",flexDirection:"column"}}>
      <link href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@400;600;700;800&display=swap" rel="stylesheet"/>

      {/* ═══ MENU ═══ */}
      {screen==="menu"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 16px",gap:5,overflowY:"auto"}}>
          <Ch c={cfg} pose="pike" bounce sz={75}/>
          <h1 style={{fontSize:"clamp(22px,6vw,34px)",color:"#fff",margin:0,textShadow:"2px 2px 0 rgba(0,0,0,0.3)",textAlign:"center",lineHeight:1.1}}>Trampoline<br/><span style={{color:"#4ade80"}}>Trick Master!</span></h1>
          <div style={{color:"rgba(255,255,255,0.5)",fontSize:10,fontFamily:F2}}>by TrampolinesIreland.com</div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>setScreen("custom")} style={{background:"linear-gradient(135deg,#16a34a,#4ade80)",border:"none",borderRadius:50,padding:"7px 18px",fontSize:14,fontFamily:F,color:"#fff",cursor:"pointer"}}>Customize ✨</button>
            <div style={{background:"rgba(0,0,0,0.3)",borderRadius:50,padding:"5px 12px",display:"flex",alignItems:"center",gap:4,border:"2px solid rgba(251,191,36,0.3)"}}>
              <span style={{fontSize:14}}>🪙</span><span style={{color:"#fbbf24",fontSize:15,fontWeight:800}}>{coins}</span>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.1)",borderRadius:12,padding:"8px 12px",maxWidth:320,width:"100%",border:"1px solid rgba(255,255,255,0.1)"}}>
            <div style={{color:"#4ade80",fontWeight:800,fontSize:13,marginBottom:3,textAlign:"center"}}>🎯 How to Play</div>
            <div style={{color:"#fff",fontSize:11,lineHeight:1.6,fontFamily:F2}}>
              <div>1️⃣ A <b>trick</b> appears at the top</div>
              <div>2️⃣ Tap the <b>coloured buttons</b> in order</div>
              <div>3️⃣ Your character <b>does the trick!</b></div>
              <div>4️⃣ Finish all tricks <b>before time runs out</b></div>
            </div>
          </div>
          <div style={{background:"linear-gradient(135deg,#16a34a,#22c55e)",borderRadius:12,padding:"7px 14px",maxWidth:320,width:"100%",textAlign:"center",animation:"pulse 1.5s ease-in-out infinite"}}>
            <div style={{color:"#fff",fontSize:14,fontWeight:800}}>👇 Tap Level 1 to start!</div>
          </div>
          <div style={{maxWidth:320,width:"100%",display:"flex",flexDirection:"column",gap:4}}>
            {[{l:"🌱 Basics",r:[0,3]},{l:"🔥 Combos",r:[3,7]},{l:"⚡ Triples",r:[7,14]},{l:"👑 Quads",r:[14,20]}].map((z,zi)=>(
              <div key={zi}>
                <div style={{color:"rgba(255,255,255,0.4)",fontSize:9,fontFamily:F2,fontWeight:700,letterSpacing:1}}>{z.l}</div>
                <div style={{display:"grid",gridTemplateColumns:`repeat(${z.r[1]-z.r[0]},1fr)`,gap:3}}>
                  {LV.slice(z.r[0],z.r[1]).map((l,j)=>{const i=z.r[0]+j;const ok=i===0||sts[i-1]>0;const s=sts[i];
                    return(<button key={i} onClick={()=>ok&&startLv(i)} style={{background:ok?s>0?`linear-gradient(135deg,${l.bg[0]},${l.bg[1]})`:"#334155":"rgba(255,255,255,0.05)",border:ok?"2px solid rgba(255,255,255,0.2)":"2px solid transparent",borderRadius:8,padding:"4px 2px",color:ok?"#fff":"rgba(255,255,255,0.2)",cursor:ok?"pointer":"default",fontFamily:F,fontSize:14,display:"flex",flexDirection:"column",alignItems:"center"}}>{ok?l.lv:"🔒"}{s>0&&<div style={{fontSize:6}}>{"⭐".repeat(s)}</div>}</button>);
                  })}
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:"auto",paddingTop:6,textAlign:"center"}}>
            <a href="https://www.trampolinesireland.com" target="_blank" rel="noopener noreferrer" style={{color:"#4ade80",fontSize:12,fontWeight:800,fontFamily:F2,textDecoration:"none"}}>🛒 TrampolinesIreland.com</a>
            <div style={{color:"rgba(255,255,255,0.3)",fontSize:8,fontFamily:F2}}>Selling BERG trampolines since 2020</div>
          </div>
        </div>
      )}

      {/* ═══ CUSTOMIZE ═══ */}
      {screen==="custom"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px"}}>
            <button onClick={()=>setScreen("menu")} style={{background:"rgba(255,255,255,0.1)",border:"2px solid rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",cursor:"pointer",fontFamily:F2,fontWeight:700,fontSize:12}}>← Back</button>
            <div style={{color:"#fff",fontSize:17,fontWeight:800}}>Customize</div>
            <div style={{background:"rgba(0,0,0,0.3)",borderRadius:50,padding:"3px 8px",display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:11}}>🪙</span><span style={{color:"#fbbf24",fontSize:13,fontWeight:800}}>{coins}</span></div>
          </div>
          <div style={{display:"flex",justifyContent:"center",padding:"6px 0"}}><Ch c={cfg} pose="idle" bounce sz={85}/></div>
          <div style={{display:"flex",justifyContent:"center",gap:2,padding:"0 6px",flexWrap:"wrap"}}>
            {["Skin","Hair","Color","Shirt","Shorts","Shoes","Extra"].map((t,i)=>(
              <button key={i} onClick={()=>setTab(i)} style={{background:tab===i?"rgba(251,191,36,0.3)":"rgba(255,255,255,0.06)",border:tab===i?"2px solid #fbbf24":"2px solid transparent",borderRadius:8,padding:"3px 7px",color:tab===i?"#fbbf24":"rgba(255,255,255,0.5)",fontSize:10,fontFamily:F2,fontWeight:700,cursor:"pointer"}}>{t}</button>
            ))}
          </div>
          <div style={{flex:1,overflow:"auto",padding:"8px 16px",display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",alignContent:"flex-start"}}>
            {tab===0&&SKIN.map((col,i)=><button key={i} onClick={()=>setCfg(p=>({...p,skin:i}))} style={{width:40,height:40,borderRadius:10,background:col,border:cfg.skin===i?"3px solid #fff":"3px solid transparent",cursor:"pointer"}}/>)}
            {tab===1&&HSTYLES.map((h,i)=><button key={i} onClick={()=>setCfg(p=>({...p,hair:i}))} style={{minWidth:50,padding:"5px 8px",borderRadius:10,background:cfg.hair===i?"rgba(251,191,36,0.3)":"rgba(255,255,255,0.08)",border:cfg.hair===i?"2px solid #fbbf24":"2px solid transparent",color:"#fff",fontSize:10,fontFamily:F2,fontWeight:700,cursor:"pointer"}}>{h}</button>)}
            {tab===2&&HCOLORS.map((col,i)=><button key={i} onClick={()=>setCfg(p=>({...p,hc:i}))} style={{width:40,height:40,borderRadius:10,background:col,border:cfg.hc===i?"3px solid #fff":"3px solid transparent",cursor:"pointer"}}/>)}
            {tab===3&&SHIRTS.map((col,i)=><button key={i} onClick={()=>setCfg(p=>({...p,shirt:i}))} style={{width:40,height:40,borderRadius:10,background:col,border:cfg.shirt===i?"3px solid #fff":"3px solid transparent",cursor:"pointer"}}/>)}
            {tab===4&&SHO_C.map((col,i)=><button key={i} onClick={()=>setCfg(p=>({...p,shorts:i}))} style={{width:40,height:40,borderRadius:10,background:col,border:cfg.shorts===i?"3px solid #fff":"3px solid transparent",cursor:"pointer"}}/>)}
            {tab===5&&SHOE_C.map((col,i)=><button key={i} onClick={()=>setCfg(p=>({...p,shoes:i}))} style={{width:40,height:40,borderRadius:10,background:col,border:cfg.shoes===i?"3px solid #fff":"3px solid transparent",cursor:"pointer"}}/>)}
            {tab===6&&ACCS.map((a,i)=><button key={i} onClick={()=>setCfg(p=>({...p,acc:i}))} style={{minWidth:50,padding:"5px 8px",borderRadius:10,background:cfg.acc===i?"rgba(251,191,36,0.3)":"rgba(255,255,255,0.08)",border:cfg.acc===i?"2px solid #fbbf24":"2px solid transparent",color:"#fff",fontSize:10,fontFamily:F2,fontWeight:700,cursor:"pointer"}}>{a}</button>)}
          </div>
          <div style={{textAlign:"center",padding:"6px 0 10px"}}><button onClick={()=>setScreen("menu")} style={{background:"linear-gradient(135deg,#16a34a,#4ade80)",border:"none",borderRadius:50,padding:"9px 28px",fontSize:16,fontFamily:F,color:"#fff",cursor:"pointer"}}>Done ✅</button></div>
        </div>
      )}

      {/* ═══ PLAYING — CSS GRID LAYOUT ═══ */}
      {screen==="play"&&(
        <div style={{flex:1,display:"grid",gridTemplateRows:"auto auto 1fr auto",overflow:"hidden"}}>

          {/* ROW 1: Score + Timer — thin bar */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 12px 0",zIndex:2}}>
            <div style={{color:"#fff",fontSize:14,fontWeight:800,textShadow:"1px 1px 2px rgba(0,0,0,0.3)"}}>🪙 {score}</div>
            {!lv.nt?(<div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(0,0,0,0.2)",borderRadius:20,padding:"2px 10px"}}>
              <div style={{width:60,height:8,borderRadius:4,background:"rgba(0,0,0,0.2)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:4,width:`${tp}%`,background:timeLeft<=5?"#ef4444":"#fff",transition:"width 1s linear"}}/></div>
              <span style={{color:"#fff",fontSize:12,fontWeight:800}}>{timeLeft}s</span>
            </div>):(<div style={{color:"#fff",fontSize:11,fontWeight:700,background:"rgba(0,0,0,0.15)",borderRadius:20,padding:"2px 10px"}}>No rush! 🎉</div>)}
          </div>

          {/* ROW 2: Trick bubble */}
          {trick?(<div style={{textAlign:"center",padding:"2px 0",zIndex:2}}>
            <div style={{display:"inline-block",background:"rgba(255,255,255,0.95)",borderRadius:14,padding:"4px 16px",boxShadow:"0 2px 8px rgba(0,0,0,0.1)",position:"relative"}}>
              <div style={{color:"#333",fontSize:"clamp(13px,3.8vw,17px)",fontWeight:800,fontFamily:F2}}>{trick.name}</div>
              {trick.m.length>1&&(<div style={{display:"flex",justifyContent:"center",gap:3,marginTop:2}}>
                {trick.m.map((mid,i)=>{const m=gM(mid);const done=i<prog.length;const act=i===prog.length;
                  return(<div key={i} style={{display:"flex",alignItems:"center",gap:2}}>
                    <div style={{width:22,height:22,borderRadius:6,background:done?m.color:act?`${m.color}40`:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",border:act?`2px solid ${m.color}`:"none"}}><span style={{fontSize:10}}>{m.emoji}</span></div>
                    {i<trick.m.length-1&&<span style={{color:"#ccc",fontSize:9}}>›</span>}
                  </div>);
                })}
              </div>)}
              <div style={{position:"absolute",bottom:-5,left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"5px solid transparent",borderRight:"5px solid transparent",borderTop:"5px solid rgba(255,255,255,0.95)"}}/>
            </div>
          </div>):(<div/>)}

          {/* ROW 3: Character — fills remaining space */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",minHeight:0}}>
            {fb&&(<div style={{position:"absolute",top:4,left:"50%",transform:"translateX(-50%)",zIndex:10,background:fb.ok?"#22c55e":"#ef4444",borderRadius:16,padding:"4px 16px",boxShadow:"0 3px 12px rgba(0,0,0,0.2)",animation:"popIn 0.2s ease-out"}}>
              <div style={{color:"#fff",fontSize:"clamp(15px,4.5vw,22px)",fontWeight:800,textAlign:"center"}}>{fb.text}</div>
              <div style={{color:"rgba(255,255,255,0.9)",fontSize:11,fontFamily:F2,textAlign:"center"}}>{fb.sub}</div>
            </div>)}
            <div style={{transform:`translateY(${cY}px)`,transition:"transform 0.2s ease-out"}}><Ch c={cfg} pose={pose} bounce={pose==="idle"&&!locked} sz={85}/></div>
            <div style={{width:130,height:12,background:"linear-gradient(90deg,#3498db,#3498dbbb)",borderRadius:4,boxShadow:"0 4px 12px rgba(0,0,0,0.3)",marginTop:-2}}/>
            <div style={{display:"flex",justifyContent:"space-between",width:110}}>{["-7deg","0deg","7deg"].map((r,i)=><div key={i} style={{width:5,height:18,background:"#7f8c8d",borderRadius:3,transform:`rotate(${r})`}}/>)}</div>
          </div>

          {/* ROW 4: BUTTONS — always visible, grid auto row */}
          <div style={{padding:"2px 4px 20px",zIndex:2}}>
            <div style={{display:"flex",justifyContent:"center",gap:3}}>
              {MV.map((mv)=>{
                const inT=trick&&trick.m.includes(mv.id);
                const isN=trick&&prog.length<trick.m.length&&trick.m[prog.length]===mv.id;
                return(<button key={mv.id} onClick={()=>inT&&handleTap(mv.id)} disabled={!inT||locked} style={{
                  width:"clamp(48px,15vw,62px)",height:"clamp(48px,13vw,58px)",borderRadius:12,
                  background:isN?`linear-gradient(160deg,${mv.color},${mv.color}cc)`:inT?`${mv.color}88`:`${mv.color}33`,
                  border:isN?"3px solid #fff":"2px solid rgba(255,255,255,0.15)",color:"#fff",
                  cursor:inT&&!locked?"pointer":"default",
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,
                  boxShadow:isN?`0 0 16px ${mv.color}88`:"0 2px 6px rgba(0,0,0,0.15)",
                  transform:isN?"scale(1.08)":"scale(1)",
                  animation:isN?"btnG 0.8s ease-in-out infinite":"none",
                  transition:"all 0.15s",position:"relative",overflow:"hidden",
                }}>
                  {isN&&<div style={{position:"absolute",top:0,left:"-100%",width:"200%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)",animation:"shine 1.5s infinite"}}/>}
                  <span style={{fontSize:"clamp(18px,5vw,26px)",position:"relative"}}>{mv.emoji}</span>
                  <span style={{fontSize:"clamp(8px,2.2vw,11px)",fontWeight:800,fontFamily:F2,position:"relative"}}>{mv.label}</span>
                </button>);
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ RESULT ═══ */}
      {screen==="result"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:20,background:won?`linear-gradient(170deg,${bg[0]},${bg[1]})`:"linear-gradient(170deg,#1e1e2e,#7f1d1d,#ef4444)"}}>
          <Ch c={cfg} pose={won?"celebrate":"idle"} sz={75}/>
          <h2 style={{fontSize:"clamp(24px,7vw,36px)",color:"#fff",margin:0,textShadow:"2px 2px 0 rgba(0,0,0,0.3)"}}>{won?"Level Complete!":"Time's Up!"}</h2>
          {won&&<div style={{fontSize:"clamp(24px,7vw,36px)",letterSpacing:4}}>{"⭐".repeat(sts[li])}{"☆".repeat(3-sts[li])}</div>}
          <div style={{color:"rgba(255,255,255,0.85)",fontSize:15,textAlign:"center",lineHeight:1.8,fontFamily:F2}}>
            <div>Score: <b style={{color:"#fbbf24"}}>{score}</b></div>
            <div>Tricks: <b>{total-left}</b> / {total}</div>
            {won&&<div style={{color:"#fbbf24",marginTop:4}}>🪙 +{sts[li]*10+(li+1)*5} coins!</div>}
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
            {!won&&<button onClick={()=>startLv(li)} style={{background:"#ef4444",border:"none",borderRadius:50,padding:"10px 24px",fontSize:16,fontFamily:F,color:"#fff",cursor:"pointer"}}>Retry 🔄</button>}
            {won&&li<19&&<button onClick={()=>startLv(li+1)} style={{background:"#22c55e",border:"none",borderRadius:50,padding:"10px 24px",fontSize:16,fontFamily:F,color:"#fff",cursor:"pointer"}}>Next ➡️</button>}
            {won&&li===19&&<div style={{color:"#fbbf24",fontSize:20,fontWeight:800}}>🏆 ALL COMPLETE!</div>}
            <button onClick={()=>setScreen("menu")} style={{background:"rgba(255,255,255,0.15)",border:"2px solid rgba(255,255,255,0.25)",borderRadius:50,padding:"10px 20px",fontSize:14,fontFamily:F,color:"#fff",cursor:"pointer"}}>Menu</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes popIn{0%{transform:translateX(-50%) scale(0.7);opacity:0}100%{transform:translateX(-50%) scale(1);opacity:1}}
        @keyframes btnG{0%,100%{box-shadow:0 0 8px rgba(255,255,255,0.3)}50%{box-shadow:0 0 20px rgba(255,255,255,0.6)}}
        @keyframes shine{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}
      `}</style>
    </div>
  );
}
