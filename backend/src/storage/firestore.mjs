import {googleFetch} from '../services/google-auth.mjs';
function base(){const project=process.env.GOOGLE_CLOUD_PROJECT;if(!project)throw new Error('Google project is missing');return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents/civicpulse_requests`;}
export async function readFirestore(){
 const rows=[];let pageToken;
 do{const data=await googleFetch(base()+`?pageSize=300${pageToken?'&pageToken='+encodeURIComponent(pageToken):''}`);for(const doc of data.documents||[])rows.push(JSON.parse(doc.fields.payload.stringValue));pageToken=data.nextPageToken;}while(pageToken);
 return rows;
}
export async function writeFirestore(row){
 await googleFetch(base()+'/'+encodeURIComponent(row.id),{method:'PATCH',body:JSON.stringify({fields:{payload:{stringValue:JSON.stringify(row)}}})});
}
