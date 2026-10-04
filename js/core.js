export const HABITS = [
  {id:'verdura',title:'Sumar una verdura',detail:'En una comida que elijas.',icon:'🥬'},
  {id:'fruta',title:'Disfrutar una fruta',detail:'Una pausa con algo que te guste.',icon:'🍐'},
  {id:'casera',title:'Preparar algo en casa',detail:'Una preparación sencilla también cuenta.',icon:'🍲'},
  {id:'agua',title:'Elegir agua',detail:'Como bebida en una comida.',icon:'💧'},
  {id:'plan',title:'Planificar una comida',detail:'Pensar una opción para mañana.',icon:'📝'},
  {id:'legumbre',title:'Incluir legumbres',detail:'Probarlas en una preparación.',icon:'🫘'}
];
export const today = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export const fresh = () => ({profile:{height:null,theme:'system',hideMeasurements:false},habits:['verdura','fruta','casera'],entries:[],favorites:[]});
export function number(value,min,max,label='Valor') {
  if(value===null || value===undefined || String(value).trim()==='') return null;
  const s=String(value).trim().replace(',','.');
  if(!/^\d+(\.\d+)?$/.test(s)) throw Error(`${label}: escribí un número válido.`);
  const n=Number(s); if(!Number.isFinite(n)||n<min||n>max) throw Error(`${label}: usá un valor entre ${min} y ${max}.`); return n;
}
export const bmi=(kg,cm)=>kg>0&&cm>0?kg/(cm/100)**2:null;
export const ratio=(waist,cm)=>waist>0&&cm>0?waist/cm:null;
export const portion=(nutrients,g)=>Object.fromEntries(Object.entries(nutrients).map(([k,v])=>[k,v===null?null:v*g/100]));
export function recipeTotals(recipe,foods) {
  const totals={energy:0,protein:0,carbs:0,fat:0,fiber:0};
  for(const ingredient of recipe.ingredients){
    const food=foods.find(f=>f.id===ingredient.food); if(!food) throw Error('Ingrediente sin ficha.');
    for(const k of Object.keys(totals)) totals[k]=totals[k]===null||food.nutrients[k]===null?null:totals[k]+food.nutrients[k]*ingredient.grams/100/recipe.servings;
  } return totals;
}
export function validDate(s) { return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s&&s>='1900-01-01'&&s<=today(); }
function check(ok,message){if(!ok)throw Error(message);}
export function validateState(input,allowedFavorites=null) {
  check(input&&typeof input==='object','Respaldo vacío o inválido.');
  const p=input.profile;
  check(p&&['system','light','dark'].includes(p.theme)&&typeof p.hideMeasurements==='boolean','Preferencias inválidas.');
  const numeric=(v,min,max)=>v===null||(typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max);
  check(numeric(p.height,80,250),'Altura inválida.');
  check(Array.isArray(input.habits)&&input.habits.length<=3&&new Set(input.habits).size===input.habits.length&&input.habits.every(id=>HABITS.some(h=>h.id===id)),'Elegí hasta tres hábitos diferentes.');
  check(Array.isArray(input.entries)&&input.entries.length<=40000,'Demasiados registros o formato inválido.');
  const dates=new Set();
  const entries=input.entries.map(e=>{
    check(e&&validDate(e.date)&&!dates.has(e.date),'Fecha inválida, futura o repetida.');dates.add(e.date);
    check(numeric(e.weight,20,400)&&numeric(e.waist,30,250),'Medición inválida.');
    check(typeof e.note==='string'&&e.note.length<=2000,'Nota inválida (máximo 2000 caracteres).');
    check(Array.isArray(e.planned)&&e.planned.length<=3&&new Set(e.planned).size===e.planned.length&&e.planned.every(id=>HABITS.some(h=>h.id===id)),'Hábitos del día inválidos.');
    check(Array.isArray(e.done)&&new Set(e.done).size===e.done.length&&e.done.every(id=>e.planned.includes(id)),'Registro de hábitos inválido.');
    return {date:e.date,weight:e.weight,waist:e.waist,note:e.note,planned:[...e.planned],done:[...e.done]};
  });
  check(Array.isArray(input.favorites)&&input.favorites.length<=1000&&new Set(input.favorites).size===input.favorites.length&&input.favorites.every(s=>typeof s==='string'&&s.length<100&&/^(fdc-\d+|recipe-\d+|article-\d+)$/.test(s)&&(!allowedFavorites||allowedFavorites.has(s))),'Favoritos inválidos.');
  return {profile:{height:p.height,theme:p.theme,hideMeasurements:p.hideMeasurements},habits:[...input.habits],entries:entries.sort((a,b)=>a.date.localeCompare(b.date)),favorites:[...input.favorites]};
}
export function parseBackup(text,allowed){
  check(text.length<=5_000_000,'El archivo supera el límite de 5 MB.');
  let b;try{b=JSON.parse(text);}catch{throw Error('No es un archivo JSON válido.');}
  check(b.app==='mesa-serena'&&b.version===1,'Este respaldo no es compatible.');
  return validateState(b.data,allowed);
}
export const backup=(state)=>JSON.stringify({app:'mesa-serena',version:1,created:new Date().toISOString(),data:validateState(state)},null,2);
