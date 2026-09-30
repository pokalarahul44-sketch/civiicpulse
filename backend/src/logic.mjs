export const districts = [
  {id:'raichur',name:'Raichur',state:'Karnataka',population:1800000,deficit:84,vulnerability:79,alignment:90,lat:16.21,lng:77.35},
  {id:'kalaburagi',name:'Kalaburagi',state:'Karnataka',population:2600000,deficit:72,vulnerability:74,alignment:80,lat:17.33,lng:76.83},
  {id:'mysuru',name:'Mysuru',state:'Karnataka',population:3000000,deficit:41,vulnerability:43,alignment:65,lat:12.30,lng:76.65},
  {id:'bengaluru',name:'Bengaluru Urban',state:'Karnataka',population:9600000,deficit:32,vulnerability:35,alignment:75,lat:12.97,lng:77.59}
];
export const categories=['Water','Roads','Healthcare','Education','Sanitation','Other'];
export const examples={
  English:'Our village water pump is broken. Families walk three kilometres to collect drinking water. Please repair the pump.',
  Hindi:'हमारे गाँव में पीने का पानी नहीं आ रहा है। कृपया पानी की व्यवस्था करें।',
  Kannada:'ನಮ್ಮ ಗ್ರಾಮದ ರಸ್ತೆ ಹಾಳಾಗಿದೆ. ಶಾಲೆಗೆ ಹೋಗಲು ಕಷ್ಟವಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ರಸ್ತೆ ಸರಿಪಡಿಸಿ.'
};
export function demoAnalysis(text){
  const category=/water|पानी|ನೀರು/i.test(text)?'Water':/road|सड़क|ರಸ್ತೆ/i.test(text)?'Roads':/hospital|clinic|health|अस्पताल|ಆಸ್ಪತ್ರೆ/i.test(text)?'Healthcare':/school|education|स्कूल|ಶಾಲೆ/i.test(text)?'Education':/sewage|waste|drain|कचरा/i.test(text)?'Sanitation':'Other';
  const language=/[\u0900-\u097f]/.test(text)?'Hindi':/[\u0c80-\u0cff]/.test(text)?'Kannada':'English';
  const known=Object.entries(examples).find(([,value])=>value===text);
  const summary=known?.[0]==='Hindi'?'The village has no drinking water supply; residents request restoration.':known?.[0]==='Kannada'?'A damaged village road makes travelling to school difficult; residents request repairs.':text.slice(0,350);
  return {category,language,summary,urgency:'Needs assessment',reason:'Keyword-based demo classification. An officer must verify the request.',source:'Demo rules',transcript:text};
}
export function validateAnalysis(value){
  if(!value||!categories.includes(value.category)||typeof value.summary!=='string'||typeof value.language!=='string'||typeof value.transcript!=='string') throw new Error('The model returned an incomplete analysis. Please retry.');
  return {category:value.category,summary:value.summary.slice(0,1000),language:value.language.slice(0,40),urgency:'Needs assessment',reason:String(value.reason||'Officer verification required.').slice(0,1000),transcript:value.transcript.slice(0,5000),source:'Gemini on Vertex AI'};
}
export function seedRequests(){
  return Array.from({length:24},(_,i)=>{const district=districts[i<10?0:i<17?1:i<21?2:3]; const text=Object.values(examples)[i%3];return {id:`sample-${i+1}`,district:district.id,text:`${text} [Sample report ${i+1}]`,...demoAnalysis(text),status:i%7===0?'Under review':'New',createdAt:new Date(Date.UTC(2026,8,20+i%10,9,i)).toISOString(),synthetic:true};});
}
export function priorities(requests){
  return districts.map(d=>{
    const rows=requests.filter(r=>r.district===d.id);const count=rows.length;
    // Explicit illustrative saturation: 1 request per 100,000 residents = full demand component.
    const demand=Math.min(100,count/(d.population/100000)*100);
    const score=Math.round(.30*demand+.35*d.deficit+.20*d.vulnerability+.15*d.alignment);
    const counts=Object.fromEntries(categories.map(c=>[c,rows.filter(r=>r.category===c).length]));
    const category=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0];
    return {...d,count,demand:Math.round(demand),score,category:count?category:'Other',counts};
  }).sort((a,b)=>b.score-a.score);
}
export function brief(requests,districtId){
 const d=priorities(requests).find(d=>d.id===districtId);if(!d)throw new Error('Unknown district');
 return `CIVICPULSE — DISTRICT REVIEW BRIEF\n${d.name}, ${d.state}\n\nHACKATHON DEMO: All baseline statistics and initial requests are synthetic. This is an illustrative decision aid, not an approved investment plan.\n\nPriority score: ${d.score}/100\nRequests: ${d.count}\nLeading request category: ${d.category}\n\nScore components (0–100):\nDemand per population: ${d.demand} (30%)\nInfrastructure deficit: ${d.deficit} (35%)\nVulnerability: ${d.vulnerability} (20%)\nPlan alignment: ${d.alignment} (15%)\n\nRecommended next step: Conduct a ${d.category.toLowerCase()} needs assessment, verify locations and existing works, and obtain a costed proposal before selecting a project.\n\nEvidence to review:\n${requests.filter(r=>r.district===districtId).slice(0,8).map(r=>`- [${r.id}] ${r.summary}`).join('\n')}\n\nLimitations: Synthetic population and indices; small, self-selected request sample; no verified budget, cost or impact estimates. Score weights and demand saturation are illustrative and need stakeholder validation. Complaint volume is not a measure of total unmet need.\n\nHuman approval required. No funds are allocated by this system.\n`;
}
