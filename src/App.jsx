
import { useState } from "react";

const QUESTIONS = [
{
id: "skills",
label: "What are you actually good at?",
subtitle: "Pick everything that applies — be honest.",
type: "multi",
options: ["Writing / copywriting","Design / Canva / visuals","Social media / content","Teaching / explaining things","Admin / organizing","Video / editing","Coding / tech","Sales / talking to people","Cooking / lifestyle","Other craft or skill"],
},
{
id: "time",
label: "How many hours per week can you realistically commit?",
subtitle: "Be honest — don't say 40 if you mean 4.",
type: "single",
options: ["1–3 hours","4–7 hours","8–15 hours","15+ hours"],
},
{
id: "budget",
label: "How much money can you invest to start?",
subtitle: "Your starting capital changes everything.",
type: "single",
options: ["$0 — nothing","$10–$50","$50–$200","$200+"],
},
{
id: "goal",
label: "What does success look like in 30 days?",
subtitle: "Pick the one that matters most right now.",
type: "single",
options: ["I just want proof it's possible — first $100","Replace my evening spending money (~$300–500)","Quit my job eventually","Build something that earns while I sleep"],
},
{
id: "speed",
label: "What's your style?",
subtitle: "There's no wrong answer — this shapes your plan.",
type: "single",
options: ["Fast cash now — I'll figure it out as I go","Slow and steady — I want to do this right","I need a clear system — no guessing","I'll try anything once"],
},
];

const Spinner = () => (
<div style={{width:48,height:48,border:"3px solid #1a1a1a",borderTop:"3px solid #e8c84a",borderRadius:"50%",animation:"spin 0.9s linear infinite",margin:"0 auto"}} />
);

export default function App() {
const [step, setStep] = useState("intro");
const [current, setCurrent] = useState(0);
const [answers, setAnswers] = useState({});
const [result, setResult] = useState(null);
const [unlocked, setUnlocked] = useState(false);
const [selected, setSelected] = useState([]);
const q = QUESTIONS[current];

const handleSelect = (option) => {
if (q.type === "multi") {
setSelected(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
} else {
setSelected([option]);
}
};

const handleNext = async () => {
const newAnswers = { ...answers, [q.id]: q.type === "multi" ? selected : selected[0] };
setAnswers(newAnswers);
setSelected([]);
if (current < QUESTIONS.length - 1) {
setCurrent(current + 1);
} else {
setStep("loading");
await generatePlan(newAnswers);
}
};

const generatePlan = async (data) => {
const prompt = `You are a no-fluff income strategist. Create a personalized First $100 Plan.
Profile:
- Skills: ${Array.isArray(data.skills) ? data.skills.join(", ") : data.skills}
- Time: ${data.time}
- Budget: ${data.budget}
- Goal: ${data.goal}
- Style: ${data.speed}
Return ONLY JSON, no markdown:
{"headline":"punchy one-liner max 12 words","method":"2-4 words","preview":"2 sentences tease","step1":"action TODAY under 20 words","step2":"action 48h under 20 words","step3":"get first client under 20 words","platform":"best platform","timeToFirstDollar":"e.g. 3-7 days","weeklyEarningPotential":"e.g. $80-200/week","biggestMistake":"one sentence","secretWeapon":"one sentence"}`;
try {
const res = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: {"Content-Type":"application/json"},
body: JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]}),
});
const raw = await res.json();
const text = raw.content.map(i => i.text||"").join("");
setResult(JSON.parse(text.replace(/```json|```/g,"").trim()));
setStep("result");
} catch {
setResult({headline:"Your path to first $100 is ready",method:"Freelance Services",preview:"There's a clear path based on your profile. Unlock to see your exact steps.",step1:"Create a Fiverr profile with your top skill today",step2:"Message 10 potential clients with a specific offer",step3:"Offer first job at discount to get a review",platform:"Fiverr",timeToFirstDollar:"5-10 days",weeklyEarningPotential:"$100-300/week",biggestMistake:"Waiting until everything is perfect before starting.",secretWeapon:"A money-back guarantee doubles cold outreach conversion."});
setStep("result");
}
};
const S = {
page:{minHeight:"100vh",background:"#0e0e0e",color:"#f0ede6",fontFamily:"'DM Serif Display',Georgia,serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 16px"},
card:{background:"#161616",border:"1px solid #2a2a2a",borderRadius:16,padding:"40px 36px",maxWidth:540,width:"100%"},
accent:{color:"#e8c84a"},
label:{fontSize:22,fontWeight:400,lineHeight:1.3,marginBottom:8},
sub:{fontSize:13,color:"#666",marginBottom:28,fontFamily:"'DM Sans',sans-serif"},
opt:(a)=>({display:"block",width:"100%",textAlign:"left",padding:"12px 16px",marginBottom:8,borderRadius:10,border:a?"1.5px solid #e8c84a":"1.5px solid #2a2a2a",background:a?"rgba(232,200,74,0.08)":"transparent",color:a?"#e8c84a":"#c0bbb0",fontFamily:"'DM Sans',sans-serif",fontSize:14,cursor:"pointer"}),
btn:(d)=>({display:"block",width:"100%",padding:"14px 0",background:d?"#2a2a2a":"#e8c84a",color:d?"#555":"#0e0e0e",border:"none",borderRadius:10,marginTop:24,fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:700,cursor:d?"not-allowed":"pointer"}),
prog:{display:"flex",gap:6,marginBottom:28},
dot:(d)=>({height:3,flex:1,borderRadius:2,background:d?"#e8c84a":"#2a2a2a"}),
tag:{display:"inline-block",background:"rgba(232,200,74,0.12)",color:"#e8c84a",borderRadius:6,padding:"3px 10px",fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginBottom:16},
row:{display:"flex",gap:12,marginTop:20},
stat:{flex:1,background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:10,padding:"14px",textAlign:"center"},
val:{fontSize:18,color:"#e8c84a",fontWeight:700,fontFamily:"'DM Sans',sans-serif"},
lbl:{fontSize:11,color:"#555",fontFamily:"'DM Sans',sans-serif",marginTop:2},
};
const CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box;margin:0;padding:0}button:hover{opacity:0.88}`;

if(step==="intro") return(
<div style={S.page}><style>{CSS}</style>
<div style={S.card}>
<div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#555",letterSpacing:"2px",textTransform:"uppercase",marginBottom:20}}>AI Income Planner</div>
<h1 style={{fontSize:34,lineHeight:1.15,marginBottom:16}}>Your first <span style={S.accent}>$100</span> online.<br/>5 questions away.</h1>
<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#888",lineHeight:1.6,marginBottom:32}}>Not generic ideas. A specific plan built around your skills, time, and situation.</p>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#555",marginBottom:28}}>
{["Takes 2 minutes","No email required","Unlock full plan for $9"].map((t,i)=>(
<div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={S.accent}>✓</span>{t}</div>
))}
</div>
<button style={S.btn(false)} onClick={()=>setStep("quiz")}>Build My Plan →</button>
</div></div>
);

if(step==="quiz") return(
<div style={S.page}><style>{CSS}</style>
<div style={S.card}>
<div style={S.prog}>{QUESTIONS.map((_,i)=><div key={i} style={S.dot(i<=current)}/>)}</div>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#555",marginBottom:20}}>Question {current+1} of {QUESTIONS.length}</div>
<div style={S.label}>{q.label}</div>
<div style={S.sub}>{q.subtitle}</div>
{q.options.map(opt=>(
<button key={opt} style={S.opt(selected.includes(opt))} onClick={()=>handleSelect(opt)}>
{selected.includes(opt)?"✓ ":""}{opt}
</button>
))}
<button style={S.btn(selected.length===0)} disabled={selected.length===0} onClick={handleNext}>
{current<QUESTIONS.length-1?"Next →":"Build My Plan →"}
</button>
</div></div>
);

if(step==="loading") return(
<div style={S.page}><style>{CSS}</style>
<div style={{...S.card,textAlign:"center"}}>
<Spinner/>
<div style={{marginTop:28,fontSize:22}}>Building your plan...</div>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#555",marginTop:10}}>Analyzing skills → matching methods → writing your steps</div>
</div></div>
);

if(step==="result"&&result) return(
<div style={S.page}><style>{CSS}</style>
<div style={S.card}>
<div style={S.tag}>Your Plan is Ready</div>
<h2 style={{fontSize:26,lineHeight:1.2,marginBottom:6}}>{result.headline}</h2>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#e8c84a",marginBottom:20,fontWeight:600}}>Method: {result.method}</div>
<div style={S.row}>
<div style={S.stat}><div style={S.val}>{result.timeToFirstDollar}</div><div style={S.lbl}>Time to first $</div></div>
<div style={S.stat}><div style={S.val}>{result.weeklyEarningPotential}</div><div style={S.lbl}>Weekly potential</div></div>
<div style={S.stat}><div style={S.val}>{result.platform}</div><div style={S.lbl}>Top platform</div></div>
</div>
<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#999",lineHeight:1.65,marginTop:20}}>{result.preview}</p>
{!unlocked?(
<>
<div style={{position:"relative",marginTop:16}}>
<div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:10,padding:"20px",filter:"blur(4px)",userSelect:"none",opacity:0.6}}>
<div>Step 1: ████████████████████████</div>
<div style={{marginTop:8}}>Step 2: ████████████████████████████</div>
<div style={{marginTop:8}}>Step 3: ████████████████████████████████</div>
<div style={{marginTop:16}}>⚠ Biggest Mistake: ████████████████</div>
<div style={{marginTop:8}}>🔑 Secret Weapon: ████████████████████</div>
</div>
<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(14,14,14,0.7)",borderRadius:10}}>
<div style={{fontSize:28}}>🔒</div>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#f0ede6",marginTop:8,fontWeight:600}}>Full plan locked</div>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#888",marginTop:4}}>Unlock for a one-time $9</div>
</div>
</div>
<button style={S.btn(false)} onClick={()=>setUnlocked(true)}>Unlock My Full Plan — $9</button>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#444",textAlign:"center",marginTop:10}}>One-time payment · No subscription · Instant access</div>
</>
):(
<>
<div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:10,padding:"20px",marginTop:16}}>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#e8c84a",fontWeight:700,letterSpacing:"1px",marginBottom:16}}>YOUR 3-STEP ACTION PLAN</div>
{[result.step1,result.step2,result.step3].map((s,i)=>(
<div key={i} style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
<div style={{minWidth:24,height:24,borderRadius:"50%",background:"#e8c84a",color:"#0e0e0e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>{i+1}</div>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#c0bbb0",lineHeight:1.5}}>{s}</div>
</div>
))}
</div>
<div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:10,padding:"16px 20px",marginTop:12}}>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,marginBottom:10}}>
<span style={{color:"#e8c84a",fontWeight:700}}>⚠ Biggest Mistake: </span>
<span style={{color:"#888"}}>{result.biggestMistake}</span>
</div>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13}}>
<span style={{color:"#e8c84a",fontWeight:700}}>🔑 Secret Weapon: </span>
<span style={{color:"#888"}}>{result.secretWeapon}</span>
</div>
</div>
<button style={S.btn(false)} onClick={()=>{setStep("intro");setCurrent(0);setAnswers({});setResult(null);setUnlocked(false);setSelected([]);}}>Start Over</button>
</>
)}
</div></div>
);

return null;
}
