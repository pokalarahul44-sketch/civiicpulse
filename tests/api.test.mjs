import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import net from 'node:net';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {once} from 'node:events';

test('organized app serves frontend and preserves the request API and persistence',async()=>{
 const root=fileURLToPath(new URL('../',import.meta.url));
 const tempRoot=path.resolve(tmpdir());
 const directory=await mkdtemp(path.join(tempRoot,'civicpulse-test-'));
 const socket=net.createServer();socket.listen(0,'127.0.0.1');await once(socket,'listening');
 const port=socket.address().port;await new Promise(resolve=>socket.close(resolve));
 const env={...process.env,PORT:String(port),DATA_DIR:directory,AI_MODE:'demo',STORAGE_MODE:'local'};
 delete env.K_SERVICE;
 let child;
 async function start(){
  child=spawn(process.execPath,['backend/src/server.mjs'],{cwd:root,env,stdio:['ignore','pipe','pipe']});
  await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(new Error('Server startup timed out')),10000);
   child.once('error',e=>{clearTimeout(timer);reject(e);});
   child.once('exit',code=>{clearTimeout(timer);reject(new Error(`Server exited ${code}`));});
   child.stdout.on('data',data=>{if(String(data).includes('CivicPulse ready')){clearTimeout(timer);resolve();}});
  });
 }
 async function stop(){if(child&&child.exitCode===null){const ended=once(child,'exit');child.kill();await ended;}}
 const base=`http://127.0.0.1:${port}`;
 const post=(url,body)=>fetch(base+url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 try{
  await start();
  for(const [url,file] of [['/','index.html'],['/app.js','app.js'],['/style.css','style.css']]){
   const response=await fetch(base+url);assert.equal(response.status,200);
   assert.equal(await response.text(),await readFile(path.join(root,'frontend/public',file),'utf8'));
  }
  let state=await (await fetch(base+'/api/state')).json();assert.equal(state.requests.length,24);
  const input={district:'mysuru',text:'Integration test: repair the village water supply.'};
  const response=await post('/api/requests',input);assert.equal(response.status,201);
  const row=await response.json();assert.equal(row.category,'Water');
  assert.equal((await post('/api/requests',input)).status,409);
  assert.equal((await post('/api/requests',{district:'invalid',text:'water'})).status,400);
  assert.equal((await post('/api/requests',{district:'mysuru',text:''})).status,400);
  assert.equal((await post('/api/status',{id:row.id,status:'Under review'})).status,200);
  assert.equal((await post('/api/status',{id:row.id,status:'invalid'})).status,400);
  assert.equal((await fetch(base+'/.env')).status,404);
  assert.equal((await fetch(base+'/backend/src/server.mjs')).status,404);
  await stop();await start();
  state=await (await fetch(base+'/api/state')).json();assert.equal(state.requests.length,25);
  assert.equal(state.requests.find(r=>r.id===row.id).status,'Under review');
  const district=state.priorities.find(r=>r.id==='mysuru');
  const brief=await (await fetch(base+'/api/brief?district=mysuru')).text();
  assert(brief.includes(`Requests: ${district.count}`));assert(brief.includes(`Priority score: ${district.score}/100`));
 }finally{
  await stop();
  const resolved=path.resolve(directory);
  if(path.dirname(resolved)!==tempRoot||!path.basename(resolved).startsWith('civicpulse-test-'))throw new Error('Unsafe temporary cleanup path');
  await rm(resolved,{recursive:true,force:true});
 }
});
