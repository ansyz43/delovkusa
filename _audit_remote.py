#!/usr/bin/env python3
"""Phase 5 audit: test admin endpoints, production health."""
import json, secrets, http.client, ssl

HOST = "delovkusa.site"
ctx = ssl.create_default_context()
results = []

def req(method, path, data=None, token=None):
    conn = http.client.HTTPSConnection(HOST, context=ctx, timeout=10)
    headers = {}
    body = None
    if data:
        body = json.dumps(data)
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    conn.request(method, path, body=body, headers=headers)
    resp = conn.getresponse()
    raw = resp.read().decode()
    try:
        jdata = json.loads(raw)
    except Exception:
        jdata = {}
    return resp.status, jdata

def check(name, expected_code, actual_code, detail=""):
    ok = expected_code == actual_code
    results.append((name, ok, actual_code, detail))

# 1. Health
code, body = req("GET", "/api/health")
check("Health check", 200, code, str(body))

# 2. Admin endpoints WITHOUT auth -> 403
for ep in ["users", "orders", "stats", "courses"]:
    code, body = req("GET", f"/api/admin/{ep}")
    check(f"Admin /{ep} no auth", 403, code)

# 3. Register test user
email = f"audit_{secrets.token_hex(4)}@test.dev"
code, body = req("POST", "/api/auth/register", {"email": email, "password": "AuditTest1!", "name": "Audit"})
check("Register user", 200, code)
token = body.get("access_token", "") if code == 200 else ""

if token:
    # 4. Profile
    code, body = req("GET", "/api/auth/me", token=token)
    check("Profile", 200, code, f"is_admin={body.get('is_admin')}")

    # 5. Admin endpoints with non-admin user -> 403
    for ep in ["users", "stats"]:
        code, body = req("GET", f"/api/admin/{ep}", token=token)
        check(f"Admin /{ep} non-admin", 403, code)

    # 6. Grant course non-admin -> 403
    code, body = req("POST", "/api/admin/users/1/grant-course?course_id=cream", token=token)
    check("Grant non-admin", 403, code)

# Output
passed = sum(1 for _, ok, _, _ in results if ok)
failed = sum(1 for _, ok, _, _ in results if not ok)
for name, ok, code, detail in results:
    print(f"{'PASS' if ok else 'FAIL'} | {name}: {code} {detail}")
print(f"\nTotal: {passed} passed, {failed} failed out of {len(results)}")
if failed:
    print("FAILED:")
    for name, ok, code, detail in results:
        if not ok:
            print(f"  - {name}: {code} {detail}")
