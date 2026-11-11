# Real map (Natural Earth 10m) of France and neighbours for the "Interactive wine maps" card -> landing/realmap.svgfrag
import json, math
from shapely.geometry import shape, box, mapping
from shapely.ops import unary_union
LON0, LON1, LAT0, LAT1 = -7.5, 13.0, 41.2, 51.6
K = math.cos(math.radians(46.4))
W = 400; H = round(W * (LAT1 - LAT0) / ((LON1 - LON0) * K))
def P(lon, lat): return ((lon - LON0) / (LON1 - LON0) * W, (LAT1 - lat) / (LAT1 - LAT0) * H)
clip = box(-18, 35.5, 26, 58)
def path(g):
    out = []
    polys = [g] if g.geom_type == 'Polygon' else list(getattr(g, 'geoms', []))
    for pg in polys:
        if pg.geom_type != 'Polygon': continue
        for ring in [pg.exterior]:
            pts = [P(x, y) for x, y in ring.coords]
            if len(pts) < 4: continue
            out.append('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + 'Z')
    return ''.join(out)
def line(g):
    ls = [g] if g.geom_type == 'LineString' else list(getattr(g, 'geoms', []))
    out = []
    for l in ls:
        if l.geom_type != 'LineString': continue
        pts = [P(x, y) for x, y in l.coords]
        out.append('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts))
    return ''.join(out)
C = json.load(open('geo/ne_10m_admin_0_countries.geojson'))
land = []; fr = None
for f in C['features']:
    g = shape(f['geometry'])
    if not g.intersects(clip): continue
    g = g.intersection(clip).simplify(0.035, preserve_topology=True)
    if g.is_empty: continue
    if f['properties'].get('ADM0_A3') == 'FRA': fr = g
    else: land.append(g)
others = path(unary_union(land))
france = path(fr)
# borders: outline of every country (thin)
R = json.load(open('geo/ne_10m_rivers_lake_centerlines.geojson'))
want = ('Duero', 'Rhin', 'Rhne', 'Po', 'Main', 'Maas', 'Loire', 'Garonne', 'Rhône', 'Rhone', 'Seine', 'Rhine', 'Rhein', 'Mosel', 'Moselle', 'Ebro', 'Dordogne', 'Saône', 'Saone', 'Douro', 'Danube', 'Donau', 'Marne')
rivs = []
for f in R['features']:
    n = (f['properties'].get('name') or '') + ' ' + (f['properties'].get('name_en') or '')
    if not any(w in n for w in want): continue
    g = shape(f['geometry'])
    if not g.intersects(clip): continue
    rivs.append(g.intersection(clip).simplify(0.02))
rv = ''.join(line(g) for g in rivs)
PINS = [('Bordeaux', -0.58, 44.84), ('Champagne', 4.03, 49.25), ('Bourgogne', 4.84, 47.02), ('Rioja', -2.45, 42.47), ('Mosel', 7.07, 49.92)]
pins = [(n, *P(lo, la)) for n, lo, la in PINS]
json.dump({'W': W, 'H': H, 'others': others, 'france': france, 'rivers': rv, 'pins': pins}, open('landing/realmap.json', 'w'))
print(W, H, len(others), len(france), len(rv), [(n, round(x), round(y)) for n, x, y in pins])
