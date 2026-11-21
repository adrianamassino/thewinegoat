#!/usr/bin/env bash
# Every check that must pass before the site is pushed to main (GitHub Pages publishes main immediately, so a failing
# GitHub Action cannot stop a bad deploy: this script is the gate). Run it from anywhere in the repository:
#     bash tools/seo_tech/check_site.sh
# Optional, once per clone: make git run it before every push that touches the site (skip with git push --no-verify):
#     bash tools/seo_tech/check_site.sh --install-hook
# Exit 1 when anything fails:
#  - an internal link (href/src/canonical/hreflang/og:url, sitemap entry) points to a URL that does not exist   (linkcheck.py)
#  - hreflang not reciprocal, not self-listed, pointing to a missing/noindex page or to a page in another language (linkcheck.py, audit.py)
#  - a page links to another language's version of a page that exists in its own language                    (internal_links.py --check)
#  - an indexable page is not reachable from the home of its language, or is more than 3 clicks away          (audit.py)
#  - a sitemap is invalid, stale, lists a non-canonical / noindex / missing URL or misses an indexable page    (sitemaps.py --check, audit.py)
#  - a guide misses its conversion buttons or has outdated ones (run python3 tools/seo_tech/cta.py)             (cta.py --check)
#  - a page has noindex without being in EXPECTED_NOINDEX (audit.py), canonical not self, duplicate title…  (audit.py)
# External links are never checked; intentional exceptions are documented in audit.py (EXPECTED_NOINDEX).
cd "$(git rev-parse --show-toplevel)" || exit 1
if [ "$1" = "--install-hook" ]; then
  h="$(git rev-parse --git-path hooks)/pre-push"
  printf '#!/usr/bin/env bash\n# installed by tools/seo_tech/check_site.sh --install-hook\nif git diff --quiet @{push} HEAD -- "*.html" "*.xml" robots.txt "tools/seo*" "tools/site_i18n" "tools/geo" 2>/dev/null; then exit 0; fi\nexec bash tools/seo_tech/check_site.sh\n' > "$h" && chmod +x "$h" && echo "pre-push hook installed: $h"
  exit 0
fi
rc=0
step() { echo "== $1"; shift; "$@" > /tmp/twg_check.out 2>&1; r=$?; tail -n 25 /tmp/twg_check.out; [ $r -eq 0 ] && echo "   OK" || { echo "   FAILED"; rc=1; }; }
step "links stay in the page's language, every home lists its guides" python3 tools/seo_tech/internal_links.py --check
step "conversion buttons present and up to date in every guide" python3 tools/seo_tech/cta.py --check
step "sitemaps up to date and valid" python3 tools/seo_tech/sitemaps.py --check
step "internal links and hreflang" python3 tools/site_i18n/linkcheck.py
step "technical SEO audit (canonical, noindex, sitemaps, reachability, hreflang languages)" python3 tools/seo_tech/audit.py
[ $rc -eq 0 ] && echo "ALL CHECKS PASSED" || echo "CHECKS FAILED: fix the problems above (or run python3 tools/site_i18n/build.py --sync) before pushing"
exit $rc
