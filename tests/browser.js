import {bmi,ratio,number,portion,parseBackup,backup,fresh} from '../js/core.js';
const checks=[['IMC: 80 kg / 2 m = 20',()=>bmi(80,200)===20],['Cintura / altura = 0,5',()=>ratio(80,160)===.5],['Coma decimal',()=>number('80,5',20,400)===80.5],['Dato ausente',()=>portion({fiber:null},150).fiber===null],['Respaldo reversible',()=>JSON.stringify(parseBackup(backup(fresh())))===JSON.stringify(fresh())],['Rechaza archivo inválido',()=>{try{parseBackup('{}');return false;}catch{return true;}}]];
document.querySelector('#results').textContent=checks.map(([n,fn])=>`${fn()?'✓':'✗'} ${n}`).join('\n');
