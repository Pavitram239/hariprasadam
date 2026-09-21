import urllib.request
import urllib.parse
import urllib.error
import json
import http.cookiejar
import sys

BASE_URL = "http://localhost:3000"

# Setup cookie handler
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

passed = 0
failed = 0

def test(name, condition, details=""):
    global passed, failed
    if condition:
        print(f" PASS: {name}")
        passed += 1
    else:
        print(f" FAIL: {name} - {details}")
        failed += 1

def request(path, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    url = BASE_URL + path
    encoded_data = None
    if data is not None:
        if isinstance(data, dict):
            encoded_data = json.dumps(data).encode('utf-8')
            headers['Content-Type'] = 'application/json'
        elif isinstance(data, str):
            encoded_data = data.encode('utf-8')
    
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    try:
        resp = opener.open(req)
        body = resp.read().decode('utf-8')
        return resp.status, body, resp.headers
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        return e.code, body, e.headers
    except Exception as e:
        return 0, str(e), {}

print("==================================================")
print("  HARIPRASADAM E2E VERIFICATION TEST SUITE       ")
print("==================================================")

# 1. PUBLIC ROUTES
print("\n--- 1. Testing Public Routes ---")
for route in ["/", "/products", "/gifting", "/corporate", "/about", "/contact", "/sitemap.xml", "/robots.txt"]:
    status, body, _ = request(route)
    test(f"GET {route}", status == 200, f"Status: {status}")

# Test dynamic product page
status, body, _ = request("/products/almond-honey-rose")
test("GET /products/almond-honey-rose", status == 200 and "Honey Rose" in body, f"Status: {status}")

# 2. SECURITY & ROUTE PROTECTION
print("\n--- 2. Testing Route Protection & Middleware ---")
# Unauthenticated request to admin dashboard
# Note: opener will follow redirect if allowed, let's check redirect behavior
class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, hdrs, newurl):
        return None

no_redirect_opener = urllib.request.build_opener(NoRedirectHandler)
req = urllib.request.Request(f"{BASE_URL}/admin")
try:
    resp = no_redirect_opener.open(req)
    test("GET /admin redirects when unauthenticated", False, f"Expected redirect, got status {resp.status}")
except urllib.error.HTTPError as e:
    is_redirect = e.code in [302, 307, 308]
    location = e.headers.get('Location', '')
    test("GET /admin redirects unauthenticated user", is_redirect and "/admin/login" in location, f"Code: {e.code}, Location: {location}")

# Unauthenticated request to Admin Products API
status, body, _ = request("/api/admin/products")
test("GET /api/admin/products blocked (401)", status == 401, f"Status: {status}")

# 3. AUTHENTICATION FLOW
print("\n--- 3. Testing Authentication Flow ---")
# Invalid login
status, body, _ = request("/api/admin/auth/login", method="POST", data={"email": "admin@hariprasadam.com", "password": "wrongpassword"})
test("POST /api/admin/auth/login rejects wrong password", status == 401, f"Status: {status}")

# Valid login
status, body, headers = request("/api/admin/auth/login", method="POST", data={"email": "admin@hariprasadam.com", "password": "hari2026admin"})
test("POST /api/admin/auth/login succeeds with valid credentials", status == 200, f"Status: {status}")

# Verify session endpoint
status, body, _ = request("/api/admin/auth/me")
try:
    me_data = json.loads(body)
    test("GET /api/admin/auth/me validates session", status == 200 and me_data.get("authenticated") is True, f"Status: {status}, Body: {body}")
except Exception as e:
    test("GET /api/admin/auth/me validates session", False, str(e))

# 4. ADMIN CMS CRUD & DRAFT PROTECTION
print("\n--- 4. Testing Product CMS & Draft Protection ---")
# List products as admin
status, body, _ = request("/api/admin/products")
test("GET /api/admin/products succeeds as admin", status == 200, f"Status: {status}")

# Create new DRAFT product
new_product = {
    "name": "Test Imperial Saffron Pistachio",
    "slug": "test-imperial-saffron-pistachio",
    "category": "Almond",
    "flavour": "Kesar Pistachio",
    "tagline": "Rare royal saffron roasted pistachio",
    "description": "Exclusively crafted test product for automated verification.",
    "tasteProfile": ["Saffron", "Rich", "Earthy"],
    "packagingOptions": ["200g Luxury Glass Jar"],
    "features": ["100% Select Grade", "Artisanal Spice Blend"],
    "image": "/images/products/almond-honey-rose.jpg",
    "status": "draft",
    "isJain": True
}

status, body, _ = request("/api/admin/products", method="POST", data=new_product)
test("POST /api/admin/products creates product", status in [200, 201], f"Status: {status}, Body: {body}")
created_product = json.loads(body) if status in [200, 201] else {}
created_id = created_product.get("id")

# Verify Draft is 404 to public visitors
status, _, _ = request("/products/test-imperial-saffron-pistachio")
test("Public visitor gets 404 for DRAFT product", status == 404, f"Status: {status}")

# Verify Draft is accessible with preview=true
status, body, _ = request("/products/test-imperial-saffron-pistachio?preview=true")
test("Draft is visible with ?preview=true", status == 200 and "Test Imperial Saffron Pistachio" in body, f"Status: {status}")

# Now publish the product
if created_id:
    update_data = {
        **new_product,
        "status": "published"
    }
    status, body, _ = request(f"/api/admin/products/{created_id}", method="PUT", data=update_data)
    test("PUT /api/admin/products/[id] publishes product", status == 200, f"Status: {status}")

    # Verify Published product is now 200 to public visitors
    status, body, _ = request("/products/test-imperial-saffron-pistachio")
    test("Public visitor can view PUBLISHED product (200)", status == 200 and "Test Imperial Saffron Pistachio" in body, f"Status: {status}")

    # Clean up test product
    status, _, _ = request(f"/api/admin/products/{created_id}", method="DELETE")
    test("DELETE /api/admin/products/[id] removes/archives test product", status == 200, f"Status: {status}")

# 5. CMS CATEGORIES, GIFTING, COMBOS
print("\n--- 5. Testing CMS Content Management APIs ---")
status, body, _ = request("/api/admin/categories")
test("GET /api/admin/categories succeeds", status == 200, f"Status: {status}")

status, body, _ = request("/api/admin/gifting")
test("GET /api/admin/gifting succeeds", status == 200, f"Status: {status}")

status, body, _ = request("/api/admin/combos")
test("GET /api/admin/combos succeeds", status == 200, f"Status: {status}")

# 6. WHATSAPP CONVERSION & MULTI-IMAGE GALLERY PERSISTENCE
print("\n--- 6. Testing WhatsApp Primary Conversion & Gallery CMS ---")
# Verify WhatsApp link on homepage, product page, contact page
status, hp_body, _ = request("/")
test("Homepage contains WhatsApp conversion CTA (919909799369)", status == 200 and "919909799369" in hp_body, f"Status: {status}")

status, prod_body, _ = request("/products/almond-honey-rose")
test("Product page contains context-aware WhatsApp CTA", status == 200 and "919909799369" in prod_body and "Honey%20Rose" in prod_body, f"Status: {status}")

status, contact_body, _ = request("/contact")
test("Contact page contains WhatsApp links and NO enquiry form", status == 200 and "919909799369" in contact_body and '<form' not in contact_body, f"Status: {status}")

# Test Multi-Image Gallery persistence via Admin API
gallery_product = {
    "name": "Test Multi-Image Pistachio",
    "slug": "test-multi-image-pistachio",
    "category": "Almond",
    "flavour": "Royal Pistachio",
    "tagline": "Multi-Image Testing",
    "description": "Product testing multi-image gallery persistence and pairing suggestions.",
    "tasteProfile": ["Crunchy", "Nutty"],
    "packagingOptions": ["Luxury Tin 250g"],
    "features": ["Hand-picked"],
    "pairingSuggestions": ["Kashmiri Kahwa", "High Tea"],
    "idealFor": ["Festive hampers", "VIP gifting"],
    "image": "/images/products/almond-honey-rose.jpg",
    "additionalImages": [
        "/images/products/almond-plain.jpg",
        "/images/products/cashew-peri-peri.jpg"
    ],
    "status": "published",
    "isJain": True
}

status, body, _ = request("/api/admin/products", method="POST", data=gallery_product)
test("POST /api/admin/products creates product with gallery & pairings", status in [200, 201], f"Status: {status}")
if status in [200, 201]:
    resp_obj = json.loads(body)
    gallery_prod_data = resp_obj.get("data", resp_obj) if isinstance(resp_obj, dict) else resp_obj
    g_id = gallery_prod_data.get("id")
    has_gallery = len(gallery_prod_data.get("additionalImages", [])) == 2
    has_pairings = len(gallery_prod_data.get("pairingSuggestions", [])) == 2
    test("Gallery images & pairings persisted correctly", has_gallery and has_pairings, f"Body: {body}")
    
    # Clean up
    if g_id:
        request(f"/api/admin/products/{g_id}", method="DELETE")

# 7. LOGOUT
print("\n--- 7. Testing Logout ---")
status, _, _ = request("/api/admin/auth/logout", method="POST")
test("POST /api/admin/auth/logout succeeds", status == 200, f"Status: {status}")

status, body, _ = request("/api/admin/auth/me")
try:
    me_after = json.loads(body)
    is_logged_out = status == 401 or me_after.get("authenticated") is False
except Exception:
    is_logged_out = status == 401
test("Session cleared after logout", is_logged_out, f"Status: {status}, Body: {body}")

print("\n==================================================")
print(f"RESULTS: {passed} PASSED, {failed} FAILED")
print("==================================================")

if failed > 0:
    sys.exit(1)
sys.exit(0)
