import {readFile,mkdir,writeFile,rename} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {seedRequests} from '../logic.mjs';
import {readFirestore,writeFirestore} from './firestore.mjs';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const dataDir=process.env.DATA_DIR||path.join(root,'data');
const cloud=process.env.STORAGE_MODE==='firestore';
let mutation=Promise.resolve();
export async function rows(){if(cloud)return readFirestore();try{return JSON.parse(await readFile(path.join(dataDir,'requests.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;return seedRequests();}}
export async function store(row){if(cloud)return writeFirestore(row);const task=mutation.then(async()=>{const list=await rows();const index=list.findIndex(r=>r.id===row.id);if(index<0)list.push(row);else list[index]=row;await mkdir(dataDir,{recursive:true});const target=path.join(dataDir,'requests.json');await writeFile(target+'.tmp',JSON.stringify(list,null,2));await rename(target+'.tmp',target);});mutation=task.catch(()=>{});return task;}
