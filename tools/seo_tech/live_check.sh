#!/usr/bin/env bash
# Live checks of thewinegoat.com from outside (run by .github/workflows/pages-https.yml). Prints Markdown.
D=thewinegoat.com
hop() { # url -> every hop: status + location
  curl -s -o /dev/null -D - -m 20 --max-redirs 0 "$1" | awk 'NR==1{printf "%s", $2} tolower($1)=="location:"{printf " → %s", $2}' | tr -d '\r'
}
chain() { # follow redirects, print each hop
  local u="$1" n=0 out=""
  while [ $n -lt 6 ]; do
    local h; h=$(curl -s -o /dev/null -D - -m 20 --max-redirs 0 "$u" | tr -d '\r')
    local code; code=$(echo "$h" | awk 'NR==1{print $2}')
    local loc; loc=$(echo "$h" | awk 'tolower($1)=="location:"{print $2}')
    out="$out $code"
    if [ -n "$loc" ] && [ "${code:0:1}" = "3" ]; then case "$loc" in /*) loc="https://$D$loc";; esac; out="$out → $loc"; u="$loc"; n=$((n+1)); else break; fi
  done
  echo "$out"
}
echo "## DNS"
echo '```'
for h in $D www.$D; do for t in A AAAA CNAME; do echo "$h $t: $(dig +short $t $h | tr '\n' ' ')"; done; done
echo '```'
echo "## Redirects (each hop: status → location)"
echo "| URL | result |"; echo "|---|---|"
for u in "http://$D/" "https://$D/" "http://www.$D/" "https://www.$D/" "http://$D/wset-level-2/?utm_source=test" "http://www.$D/wset-level-3-mock-exam/" "https://$D/wset-level-2"; do
  echo "| $u | $(chain "$u") |"
done
echo
echo "## Important pages (status, canonical, robots meta)"
echo "| page | status | canonical | robots |"; echo "|---|---|---|---|"
for p in / /wset-level-1/ /wset-level-2/ /wset-level-3-practice-questions/ /wset-level-3-mock-exam/ /wset-systematic-approach-to-tasting/ /it/ /fr/ /es/ /de/ /schools/; do
  body=$(curl -s -m 20 "https://$D$p"); st=$(curl -s -o /dev/null -w '%{http_code}' -m 20 "https://$D$p")
  can=$(echo "$body" | grep -o '<link rel="canonical" href="[^"]*"' | sed 's/.*href="//;s/"$//' | tr '\n' ' ')
  rob=$(echo "$body" | grep -io '<meta name="robots" content="[^"]*"' | sed 's/.*content="//;s/"$//')
  echo "| $p | $st | $can | ${rob:-–} |"
done
echo
echo "## robots.txt, sitemap, favicon"
echo '```'
for u in /robots.txt /sitemap.xml /favicon.ico /favicon-48.png /favicon-96.png /favicon-192.png /apple-touch-icon.png /site.webmanifest; do
  echo "$u: $(curl -s -o /dev/null -w '%{http_code} %{content_type} %{size_download}B' -m 20 "https://$D$u")"
done
echo "Googlebot-Image UA /favicon-96.png: $(curl -s -o /dev/null -w '%{http_code}' -A 'Googlebot-Image/1.0' -m 20 "https://$D/favicon-96.png")"
n=$(curl -s -m 30 "https://$D/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | wc -l); nh=$(curl -s -m 30 "https://$D/sitemap.xml" | grep -o '<loc>http://[^<]*' | wc -l); nw=$(curl -s -m 30 "https://$D/sitemap.xml" | grep -o '<loc>https://www\.[^<]*' | wc -l)
echo "sitemap: $n URLs, $nh http, $nw www"
echo '```'
