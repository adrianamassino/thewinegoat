#!/usr/bin/env bash
# Full live test of the public site thewinegoat.com, run from a GitHub-hosted runner by
# .github/workflows/pages-https.yml. Every line of the output comes from a real request made during the run.
D=thewinegoat.com
UA="Mozilla/5.0 (TWG live check)"
one() { curl -s -o /dev/null -A "$UA" -m 25 --max-redirs 0 -w '%{http_code}|%{redirect_url}' "$1"; }
trace() {  # hop by hop (max 6); sets FINAL and HOPS
  local u="$1" n=0 out=""; FINAL=""; HOPS=0
  while :; do
    local r; r=$(one "$u"); local c=${r%%|*} l=${r#*|}
    out="$out$c ${l:-–}"
    if [ "${c:0:1}" = "3" ] && [ -n "$l" ] && [ $n -lt 6 ]; then out="$out ; "; u="$l"; n=$((n+1)); else FINAL="$u ($c)"; HOPS=$n; break; fi
  done
  TRACE="$out"
}
echo "## A. HTTPS certificate presented by the server (openssl s_client, live)"
echo '```'
for h in $D www.$D; do
  echo "--- connecting to $h:443 (SNI $h)"
  echo | openssl s_client -connect $h:443 -servername $h 2>/dev/null | openssl x509 -noout -subject -issuer -dates -ext subjectAltName 2>/dev/null | sed 's/^/  /'
  echo "  verify: $(echo | openssl s_client -connect $h:443 -servername $h -verify_return_error 2>&1 | grep -m1 -o 'Verify return code: .*')"
done
echo '```'
echo "## B. DNS (dig, live)"
echo '```'
for h in $D www.$D; do for t in A AAAA CNAME; do echo "$h $t: $(dig +short $t $h | tr '\n' ' ')"; done; done
echo '```'
echo "## C. Redirect matrix (live): scheme × host × page"
echo
echo "Expected: every http:// or www request → exactly ONE 301 straight to https://$D + same path + same query; https://$D/… → 200 with no redirect."
echo
echo "| request | hops (status → Location) | final URL (status) | hops | verdict |"
echo "|---|---|---|---|---|"
PASS=0; FAIL=0
for p in "/" "/wset-level-1/" "/wset-level-2/" "/wset-level-3-practice-questions/" "/wset-level-3-mock-exam/" "/wset-systematic-approach-to-tasting/" "/it/" "/de/wset-level-2/" "/wset-level-2/?utm_source=test&x=1"; do
  for base in "http://$D" "https://$D" "http://www.$D" "https://www.$D"; do
    u="$base$p"; trace "$u"; h="$TRACE"; want="https://$D$p"
    if [ "$base" = "https://$D" ]; then [ "$FINAL" = "$want (200)" ] && [ $HOPS -eq 0 ] && ok=PASS || ok=FAIL
    else [ "$FINAL" = "$want (200)" ] && [ $HOPS -eq 1 ] && ok=PASS || ok=FAIL; fi
    [ $ok = PASS ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
    echo "| \`$u\` | ${h//|/\\|} | $FINAL | $HOPS | $ok |"
  done
done
echo
echo "**REDIRECT MATRIX: $PASS PASS, $FAIL FAIL**"
echo
trace "https://$D/wset-level-2"; echo "Extra: \`https://$D/wset-level-2\` (no trailing slash) → $TRACE → final $FINAL"
echo
echo "## D. Sitemap vs published canonical pages (live, every URL fetched)"
curl -s -m 60 "https://$D/sitemap.xml" -o /tmp/sm.xml -w "GET /sitemap.xml → %{http_code} %{content_type} %{size_download} bytes\n\n"
python3 - <<'PY'
import re, concurrent.futures as cf, urllib.request, urllib.error, xml.dom.minidom
raw = open('/tmp/sm.xml', 'rb').read()
try: xml.dom.minidom.parseString(raw); print('- XML well-formed: yes')
except Exception as e: print('- XML well-formed: NO', e)
xmls = raw.decode('utf8'); locs = re.findall(r'<loc>([^<]+)</loc>', xmls); alts = re.findall(r'<xhtml:link[^>]+href="([^"]+)"', xmls)
class NoRedir(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k): return None
op = urllib.request.build_opener(NoRedir)
def get(u):
    try:
        r = op.open(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (TWG live check)'}), timeout=40)
        body = r.read().decode('utf8', 'replace'); code = r.status
    except urllib.error.HTTPError as e: return u, e.code, None, None
    except Exception as e: return u, 'ERR ' + type(e).__name__, None, None
    return u, code, re.findall(r'<link rel="canonical" href="([^"]+)"', body), re.findall(r'<meta name="robots" content="([^"]+)"', body)
with cf.ThreadPoolExecutor(16) as ex: res = list(ex.map(get, locs))
bad = [x for x in res if x[1] != 200 or x[2] != [x[0]] or (x[3] and 'noindex' in x[3][0])]
print(f'- <loc> URLs: {len(locs)} (unique {len(set(locs))}); http:// {sum(l.startswith("http://") for l in locs)}; www {sum("://www." in l for l in locs)}')
print(f'- hreflang alternates: {len(alts)}; not https://thewinegoat.com/: {sum(not a.startswith("https://thewinegoat.com/") for a in alts)}')
print(f'- fetched live: {len(res)}; returned 200 without redirect, exactly one canonical equal to the sitemap URL, no noindex: {len(res) - len(bad)}; problems: {len(bad)}')
for b in bad[:50]: print(f'  - {b[0]} → status {b[1]}, canonical {b[2]}, robots {b[3]}')
for extra in ['https://thewinegoat.com/en/', 'https://thewinegoat.com/it/capre/']:
    u, c, can, rob = get(extra); print(f'- not in sitemap, checked live: {u} → status {c}, canonical {can}, robots {rob}')
PY
echo
echo "## E. Favicon (live download + image decode)"
echo '```'
curl -s -m 30 -A "$UA" -o /tmp/favicon.ico -w 'GET /favicon.ico → %{http_code} %{content_type} %{size_download} bytes\n' "https://$D/favicon.ico"
curl -s -m 30 -A "Googlebot-Image/1.0" -o /dev/null -w 'GET /favicon.ico as Googlebot-Image → %{http_code}\n' "https://$D/favicon.ico"
curl -s -m 30 -o /dev/null -w 'GET http://thewinegoat.com/favicon.ico → %{http_code} Location: %{redirect_url}\n' "http://$D/favicon.ico"
for f in /img/favicon-48.png /img/favicon-96.png /img/favicon-192.png /img/apple-touch-icon.png; do
  curl -s -m 30 -A "Googlebot-Image/1.0" -o /tmp/$(basename $f) -w "GET $f as Googlebot-Image → %{http_code} %{content_type} %{size_download} bytes\n" "https://$D$f"
done
python3 -m pip install -q pillow >/dev/null 2>&1
python3 - <<'PY'
from PIL import Image
im = Image.open('/tmp/favicon.ico'); sz = sorted(im.ico.sizes())
print('favicon.ico: format', im.format, '| images inside', sz, '| all square', all(w == h for w, h in sz))
for s in sz:
    x = im.ico.getimage(s).convert('RGBA'); print(f'  {s}: decoded OK, size {x.size}, visible pixels {sum(1 for p in x.getdata() if p[3] > 0)} of {x.size[0]*x.size[1]}')
for f in ['favicon-48.png', 'favicon-96.png', 'favicon-192.png', 'apple-touch-icon.png']:
    i = Image.open('/tmp/' + f); i.load(); print(f'{f}: {i.size}, square {i.size[0] == i.size[1]}, mode {i.mode}')
PY
echo "Homepage icon declarations (live HTML):"
curl -s -m 30 "https://$D/" | grep -o '<link rel="\(icon\|shortcut icon\|apple-touch-icon\)"[^>]*>'
echo '```'
echo "## F. robots.txt (live)"
echo '```'
curl -s -m 30 -o /tmp/robots.txt -w 'GET /robots.txt → %{http_code} %{content_type}\n' "https://$D/robots.txt"
echo "Disallow lines: $(grep -ci '^disallow' /tmp/robots.txt)"; grep -i '^sitemap' /tmp/robots.txt
echo '```'
