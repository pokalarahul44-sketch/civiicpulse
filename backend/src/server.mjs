import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {districts,examples,demoAnalysis,priorities,brief} from './logic.mjs';
import {analyzeWithGemini} from './services/vertex-ai.mjs';
import {rows,store} from './storage/requests.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const live=process.env.AI_MODE==='vertex';const cloud=process.env.STORAGE_MODE==='firestore';
async function body(req){let data='';for await(const chunk of req){data+=chunk;if(Buffer.byteLength(data)>8*1024*1024)throw Object.assign(new Error('Upload is too large. Use audio under 5 MB.'),{status:413});}try{return JSON.parse(data||'{}');}catch{throw Object.assign(new Error('Invalid JSON request'),{status:400});}}
function send(res,status,data,type='application/json'){res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'});res.end(type==='application/json'?JSON.stringify(data):data);}
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(req.method==='POST'&&req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return send(res,403,{error:'Cross-origin writes are not allowed.'});
  if(req.method==='GET'&&url.pathname==='/api/state'){const list=await rows();return send(res,200,{requests:list.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)),districts,priorities:priorities(list),examples,aiMode:live?'Gemini on Vertex AI':'Demo rules — no AI calls',storage:cloud?'Cloud Firestore':'Local demo file',audioEnabled:live});}
  if(req.method==='POST'&&url.pathname==='/api/requests'){
   const input=await body(req);const text=typeof input.text==='string'?input.text.trim():'';
   if(!districts.some(d=>d.id===input.district))return send(res,400,{error:'Choose a supported district.'});
   if((!text&&!input.audio)||text.length>5000)return send(res,400,{error:'Enter a request of 1–5,000 characters or upload audio.'});
   if(input.audio){if(!live)return send(res,400,{error:'Audio analysis requires the live Vertex AI connection. Use a text sample in demo mode.'});if(!['audio/webm','audio/wav','audio/mpeg','audio/mp4','audio/ogg'].includes(input.audio.mimeType)||typeof input.audio.data!=='string'||! /^[A-Za-z0-9+/]+={0,2}$/.test(input.audio.data)||input.audio.data.length>7000000)return send(res,400,{error:'Use a supported audio file under 5 MB.'});}
   const list=await rows();const duplicate=text&&list.find(r=>r.district===input.district&&r.text.trim().toLocaleLowerCase()===text.toLocaleLowerCase());
   if(duplicate)return send(res,409,{error:`This exact request is already recorded: ${duplicate.id}.`,id:duplicate.id});
   const analysis=live?await analyzeWithGemini(text,input.audio):demoAnalysis(text);
   const row={id:randomUUID(),district:input.district,text:text||analysis.transcript,...analysis,status:'New',createdAt:new Date().toISOString(),synthetic:false};await store(row);return send(res,201,row);
  }
  if(req.method==='POST'&&url.pathname==='/api/status'){const input=await body(req);if(!['New','Under review','Resolved'].includes(input.status))return send(res,400,{error:'Invalid status'});const row=(await rows()).find(r=>r.id===input.id);if(!row)return send(res,404,{error:'Request not found'});row.status=input.status;await store(row);return send(res,200,row);}
  if(req.method==='GET'&&url.pathname==='/api/brief'){if(!districts.some(d=>d.id===url.searchParams.get('district')))return send(res,400,{error:'Unknown district'});return send(res,200,brief(await rows(),url.searchParams.get('district')),'text/plain; charset=utf-8');}
  const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css'};
  if(req.method==='GET'&&files[url.pathname]){const file=files[url.pathname];return send(res,200,await readFile(path.join(root,'frontend','public',file)),file.endsWith('html')?'text/html; charset=utf-8':file.endsWith('css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8');}
  send(res,404,{error:'Not found'});
 }catch(error){console.error(error.message);send(res,error.status||500,{error:error.status?error.message:'The operation failed. Check the server log and Google configuration, then retry. No successful save was confirmed.'});}
});
server.listen(Number(process.env.PORT)||8080,process.env.K_SERVICE?'0.0.0.0':'127.0.0.1',()=>console.log(`CivicPulse ready on http://localhost:${Number(process.env.PORT)||8080} (${live?'Vertex AI':'demo'})`));
