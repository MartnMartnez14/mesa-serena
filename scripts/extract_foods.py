"""Extract only the selected USDA SR Legacy records; no third-party dependencies.
Usage: python3 scripts/extract_foods.py /path/to/official.zip
Official archive URL and SHA256 are recorded in data/provenance.json.
"""
import csv, io, json, zipfile, sys, hashlib
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
SELECTION = '''171688|Manzana|Frutas|Cruda, con piel|150
173944|Banana|Frutas|Cruda, sin cáscara|120
169097|Naranja|Frutas|Cruda, pulpa|150
169118|Pera|Frutas|Cruda|150
167762|Frutilla|Frutas|Cruda|150
169928|Durazno|Frutas|Amarillo, crudo|150
174683|Uva|Frutas|Roja o verde, cruda|100
167765|Sandía|Frutas|Pulpa cruda|200
168153|Kiwi|Frutas|Verde, crudo|100
171705|Palta|Frutas|Pulpa cruda|70
170457|Tomate|Verduras|Rojo, maduro, crudo|150
170393|Zanahoria|Verduras|Cruda|80
169967|Brócoli|Verduras|Hervido, escurrido, sin sal|150
168462|Espinaca|Verduras|Cruda|60
169247|Lechuga romana|Verduras|Cruda|60
170000|Cebolla|Verduras|Cruda|80
168409|Pepino|Verduras|Crudo, con piel|100
170108|Morrón rojo|Verduras|Crudo|100
169291|Zucchini|Verduras|Crudo, con piel|150
168449|Calabaza|Verduras|Hervida, escurrida, sin sal|150
172421|Lentejas|Legumbres|Hervidas, sin sal|150
173757|Garbanzos|Legumbres|Hervidos, sin sal|150
173735|Porotos negros|Legumbres|Hervidos, sin sal|150
170420|Arvejas|Legumbres|Hervidas, escurridas, sin sal|100
169704|Arroz integral|Cereales|Grano largo, cocido|150
168878|Arroz blanco|Cereales|Grano largo, enriquecido, cocido|150
169705|Avena|Cereales|Grano seco; cocinar antes de consumir|40
172688|Pan integral|Cereales|Comercial, listo para consumir|40
170285|Cebada perlada|Cereales|Cocida|150
168917|Quinoa|Cereales|Cocida|150
170440|Papa|Tubérculos|Hervida, sin piel ni sal|150
168484|Boniato|Tubérculos|Hervido, sin piel|150
170567|Almendras|Frutos secos y semillas|Sin preparación adicional|25
170187|Nueces|Frutos secos y semillas|Sin cáscara|25
170554|Chía|Frutos secos y semillas|Semillas secas|10
169414|Lino|Frutos secos y semillas|Semillas|10
171413|Aceite de oliva|Aceites|Para ensalada o cocina|10
173424|Huevo|Proteínas|Entero, duro|50
171477|Pechuga de pollo|Proteínas|Asada, sin piel|120
175168|Salmón|Proteínas|Atlántico, de cultivo, cocido con calor seco|120
171986|Atún|Proteínas|En agua, sin sal, escurrido|100
171284|Yogur natural|Lácteos|Entero, sin sabor|150
172205|Leche semidescremada|Lácteos|2 % grasa, sin vitaminas añadidas|200
172179|Queso cottage|Lácteos|Cremoso|100
172475|Tofu firme|Proteínas|Preparado con sulfato de calcio|100
173647|Agua|Bebidas|Potable, de red|200
175215|Bebida de soja|Bebidas|Sin azúcar, fortificada; sabores variados|200
172684|Pan de centeno|Cereales|Listo para consumir|40
169251|Champiñón|Verduras|Blanco, crudo|100
167746|Limón|Frutas|Crudo, sin cáscara|30'''

def main(path):
    z=zipfile.ZipFile(path)
    def rows(name):
        p=next(p for p in z.namelist() if p.endswith('/'+name))
        return csv.DictReader(io.TextIOWrapper(z.open(p),encoding='utf-8-sig'))
    selected={r.split('|')[0]:r.split('|')[1:] for r in SELECTION.splitlines()}
    foods={r['fdc_id']:r for r in rows('food.csv') if r['fdc_id'] in selected}
    ids={'1008':'energy','1003':'protein','1005':'carbs','1004':'fat','1079':'fiber'}
    nutrients={key:{v:None for v in ids.values()} for key in selected}
    for r in rows('food_nutrient.csv'):
        if r['fdc_id'] in selected and r['nutrient_id'] in ids and r['amount']!='':
            nutrients[r['fdc_id']][ids[r['nutrient_id']]]=float(r['amount'])
    result=[]
    for fid,(name,group,state,serving) in selected.items():
        f=foods[fid]
        result.append(dict(id='fdc-'+fid,name=name,group=group,state=state,serving=int(serving),nutrients=nutrients[fid],source='usda',sourceId=fid,sourceDescription=f['description'],sourceUrl=f'https://fdc.nal.usda.gov/food-details/{fid}/nutrients',reviewed='2026-10-04'))
    (ROOT/'data/foods.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    (ROOT/'data/provenance.json').write_text(json.dumps(dict(dataset='USDA FoodData Central SR Legacy, April 2018',publication='2019-04-01',retrieved='2026-10-04',url='https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip',sha256=hashlib.sha256(Path(path).read_bytes()).hexdigest(),license='Public domain / CC0; USDA attribution retained',basis='Per 100 g edible portion; energy kcal, remaining nutrients g',portionPolicy='Editorial examples in grams, not USDA household measures or dietary prescriptions',records=len(result)),ensure_ascii=False,indent=2)+'\n')
    print('Extracted',len(result),'foods')
if __name__=='__main__':main(sys.argv[1])
