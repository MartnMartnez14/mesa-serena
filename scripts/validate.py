from pathlib import Path
import hashlib,json,re
r=Path(__file__).resolve().parents[1]
foods=json.loads((r/'data/foods.json').read_text());recipes=json.loads((r/'data/recipes.json').read_text());articles=json.loads((r/'data/articles.json').read_text());sources=json.loads((r/'data/sources.json').read_text())
assert (len(foods),len(recipes),len(articles))==(50,10,8)
ids={f['id'] for f in foods};sids={s['id'] for s in sources}
assert len(ids)==50
for f in foods:assert f['source'] in sids and f['state'] and f['sourceId'] and set(f['nutrients'])=={'energy','protein','carbs','fat','fiber'}
for a in articles:assert a['source'] in sids
for rec in recipes:
 for i in rec['ingredients']:assert i['food'] in ids and i['grams']>0
sw=(r/'sw.js').read_text();paths=json.loads(re.search(r'const FILES = (\[.*?\]);',sw,re.S).group(1));assert './' in paths
for p in paths:
 if p!='./':assert (r/p).is_file(),p
version=hashlib.sha256(b''.join((r/p).read_bytes() for p in paths if p!='./')).hexdigest()[:12]
assert 'const VERSION = "'+version+'"' in sw,'Run python3 scripts/update_cache.py'
for p in ['js/app.js','js/core.js','js/db.js']:assert 'innerHTML' not in (r/p).read_text()
print('PASS: counts, source IDs, ingredients, cache completeness and version, safe DOM')
print('Offline resources:',sum((r/p).stat().st_size for p in paths if p!='./'),'bytes')
