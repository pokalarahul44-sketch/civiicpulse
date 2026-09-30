import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile);
let cachedToken;
async function accessToken(){
 if(cachedToken&&cachedToken.expires>Date.now()+60000)return cachedToken.value;
 if(process.env.K_SERVICE){
  const r=await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',{headers:{'Metadata-Flavor':'Google'},signal:AbortSignal.timeout(5000)});
  if(!r.ok)throw new Error('Unable to authenticate the Cloud Run service.');const data=await r.json();cachedToken={value:data.access_token,expires:Date.now()+data.expires_in*1000};
 }else{
  // Local developer authentication. No service-account keys are stored in this app.
  const {stdout}=process.platform==='win32'?await exec('powershell.exe',['-NoProfile','-Command','gcloud auth print-access-token'],{timeout:15000}):await exec('gcloud',['auth','print-access-token'],{timeout:15000});
  cachedToken={value:stdout.trim(),expires:Date.now()+300000};
 }
 return cachedToken.value;
}
export async function googleFetch(url,options={}){
 const r=await fetch(url,{...options,headers:{'Content-Type':'application/json',Authorization:`Bearer ${await accessToken()}`,...options.headers},signal:AbortSignal.timeout(60000)});
 if(!r.ok)throw new Error(`Google service returned ${r.status}. Check enabled APIs, project, model, region and IAM roles.`);
 return r.json();
}
