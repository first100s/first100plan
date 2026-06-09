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
const prompt = `You are a no-fluff income strategist. Based on this person's profile, create their personalized "First $100 Plan."

Profile:
- Skills: ${Array.isArray(data.skills) ? data.skills.join(", ") : data.skills}
- Available time per week: ${data.time}
- Starting budget: ${data.budget}
- 30-day goal: ${data.goal}
- Style: ${data.speed}

Return ONLY a JSON object (no markdown, no backticks) in this exact format:
{
"headline": "A punchy, specific one-liner describing their exact path to first $100 (max 12 words)",
"method": "The specific income method they should use (2-4 words)",
"preview": "2 sentences MAX. Tease the plan — specific enough to feel real, vague enough to want more.",
"step1": "First action to take TODAY — ultra specific, under 20 words",
"step2": "Second action within 48 hours — ultra specific, under 20 words",
"step3": "How to get first paying client — ultra specific, under 20 words",
"platform": "Best platform to use for this method",
"timeToFirstDollar": "Realistic estimate e.g. 3–7 days",
"weeklyEarningPotential": "Realistic range e.g. $80–$200/week",
"biggestMistake": "One sentence — the #1 mistake people make with this method",
"secretWeapon": "One sentence — one unfair advantage specific to this method"
}`;

try {
const response = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
model: "claude-sonnet-4-20250514",
max_tokens: 1000,
messages: [{ role: "user", content: prompt }],
}),
});
const raw = await response.json();
const text = raw.content.map(i => i.text || "").join("");
const clean = text.replace(/```json|```/g, "").trim();
const parsed = JSON.parse(clean);
setResult(parsed);
setStep("result");
} catch (err) {
setResult({
