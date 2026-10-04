const DB='mesa-serena-v1';
let connection;
export function openDB(){return new Promise((resolve,reject)=>{
 const request=indexedDB.open(DB,1);
 request.onupgradeneeded=()=>request.result.createObjectStore('state');
 request.onerror=()=>reject(Error('No se pudo abrir el almacenamiento local. Revisá los permisos del navegador.'));
 request.onblocked=()=>reject(Error('Cerrá otras pestañas de Mesa Serena y volvé a intentar.'));
 request.onsuccess=()=>{connection=request.result;connection.onversionchange=()=>connection.close();resolve();};
});}
export function read(){return new Promise((resolve,reject)=>{const r=connection.transaction('state').objectStore('state').get('personal');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export function write(data){return new Promise((resolve,reject)=>{
 const t=connection.transaction('state','readwrite');t.objectStore('state').put(data,'personal');
 t.oncomplete=()=>resolve();t.onerror=()=>reject(Error('No se guardó el cambio. Revisá el espacio y los permisos del navegador.'));t.onabort=()=>reject(Error('La operación se canceló; tus datos anteriores se conservan.'));
});}
