import urllib.request
import urllib.parse
import json
import http.cookiejar
import sys

BASE_URL = 'http://localhost:3000'
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def get(path):
    req = urllib.request.Request(BASE_URL + path)
    resp = opener.open(req)
    return resp.status, resp.read().decode('utf-8')

def post(path, data):
    encoded = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(BASE_URL + path, data=encoded, headers={'Content-Type': 'application/json'}, method='POST')
    resp = opener.open(req)
    return resp.status, resp.read().decode('utf-8')

passed = 0
failed = 0

def check(name, cond, details=''):
    global passed, failed
    if cond:
        print(f' PASS: {name}')
        passed += 1
    else:
        print(f' FAIL: {name} - {details}')
        failed += 1

print('=== 1. VERIFYING PUBLIC PAGES STILL HAVE PUBLIC HEADER, FOOTER, WHATSAPP ===')
for route in ['/', '/products', '/gifting', '/corporate', '/about', '/contact']:
    status, html = get(route)
    has_announcement = 'Bulk Orders' in html and 'Corporate Gifting Available' in html
    has_footer = 'All Rights Reserved' in html or 'Surat' in html
    has_whatsapp = '919909799369' in html
    check(f'Public {route} has announcement bar', has_announcement, f'Status: {status}')
    check(f'Public {route} has footer', has_footer, f'Status: {status}')
    check(f'Public {route} has WhatsApp', has_whatsapp, f'Status: {status}')

print('\n=== 2. VERIFYING /admin/login IS CLEAN WITHOUT PUBLIC ELEMENTS ===')
status, login_html = get('/admin/login')
check('Login has NO public announcement bar', 'Bulk Orders & Corporate Gifting Available' not in login_html)
check('Login has NO public navigation', 'href="/gifting"' not in login_html and 'href="/corporate"' not in login_html)
check('Login has NO public footer', 'All Rights Reserved' not in login_html)
check('Login has NO floating WhatsApp button', 'api.whatsapp.com' not in login_html and 'wa.me' not in login_html)
check('Login has CMS portal card', 'HariPrasadam CMS' in login_html and 'Admin Email' in login_html)

print('\n=== 3. AUTHENTICATING AS ADMIN ===')
status, auth_resp = post('/api/admin/auth/login', {'email': 'admin@hariprasadam.com', 'password': 'hari2026admin'})
check('Admin authentication', status == 200)

print('\n=== 4. VERIFYING ALL ADMIN PAGES HAVE DEDICATED LAYOUT & ZERO PUBLIC ELEMENTS ===')
admin_routes = [
    '/admin',
    '/admin/products',
    '/admin/categories',
    '/admin/gifting',
    '/admin/combos',
    '/admin/media',
    '/admin/settings'
]

for route in admin_routes:
    status, html = get(route)
    check(f'{route} status 200', status == 200)
    
    # Check absence of public elements
    check(f'{route} NO public announcement bar', 'Bulk Orders & Corporate Gifting Available' not in html)
    check(f'{route} NO public navigation (href="/products")', 'href="/products"' not in html)
    check(f'{route} NO public footer', 'All Rights Reserved' not in html)
    check(f'{route} NO WhatsApp button/links', 'api.whatsapp.com' not in html and 'wa.me' not in html and '919909799369' not in html)
    
    # Check presence of Admin layout elements
    check(f'{route} has Admin Management CMS branding', 'Management CMS' in html or 'MANAGEMENT CMS' in html)
    check(f'{route} has Dashboard link', 'href="/admin"' in html)
    check(f'{route} has Products link', 'href="/admin/products"' in html)
    check(f'{route} has Categories link', 'href="/admin/categories"' in html)
    check(f'{route} has Gift Collections link', 'href="/admin/gifting"' in html)
    check(f'{route} has Signature Combos link', 'href="/admin/combos"' in html)
    check(f'{route} has Media Library link', 'href="/admin/media"' in html)
    check(f'{route} has Settings link', 'href="/admin/settings"' in html)
    check(f'{route} has View Public Website action', 'View Public Website' in html)
    check(f'{route} has Sign Out action', 'Sign Out' in html)
    check(f'{route} has Admin Top Bar context', 'HariPrasadam CMS' in html and 'Admin' in html)

print(f'\n==================================================')
print(f'TOTAL CHECKS: {passed} PASSED, {failed} FAILED')
print(f'==================================================')
if failed > 0:
    sys.exit(1)
