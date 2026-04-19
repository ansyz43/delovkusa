"""Phase 5 audit: test admin endpoints, production health."""
import json, secrets, urllib.request, urllib.error, ssl, traceback

outf = open("_audit_results.txt", "w", encoding="utf-8")
BASE = "https://delovkusa.site"
ctx = ssl.create_default_context()
results = []

def req(method, path, data=None, token=None):
    url = f"{BASE}{path}"
    body = json.dumps(data).encode() if data else None
    headers = {"Content-Type": "application/json"} if data else {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    r = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(r, context=ctx, timeout=10)
        return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        try:
            ebody = json.loads(e.read().decode())
        except Exception:
            ebody = {}
        return e.code, ebody

def check(name, expected_code, actual_code, detail=""):
    ok = expected_code == actual_code
    results.append((name, ok, actual_code, detail))
    outf.write(f"{'PASS' if ok else 'FAIL'} | {name}: expected {expected_code}, got {actual_code} {detail}\n")
    outf.flush()

try:
    # 1. Health
    code, body = req("GET", "/api/health")
    check("Health check", 200, code, str(body))

    # 2. Admin endpoints WITHOUT auth -> expect 403
    for ep in ["/api/admin/users", "/api/admin/orders", "/api/admin/stats", "/api/admin/courses"]:
        code, body = req("GET", ep)
        check(f"Admin {ep} no auth", 403, code)

    # 3. Register a test user
    email = f"audit_{secrets.token_hex(4)}@test.dev"
    code, body = req("POST", "/api/auth/register", {"email": email, "password": "AuditTest1!", "name": "Audit"})
    check("Register test user", 200, code)
    token = body.get("access_token", "") if code == 200 else ""

    if token:
        # 4. Profile
        code, body = req("GET", "/api/auth/me", token=token)
        check("Profile check", 200, code, f"is_admin={body.get('is_admin')}")

        # 5. Admin endpoints WITH auth but NOT admin -> 403
        for ep in ["/api/admin/users", "/api/admin/stats"]:
            code, body = req("GET", ep, token=token)
            check(f"Admin {ep} non-admin user", 403, code)

        # 6. Grant course without admin -> 403
        code, body = req("POST", "/api/admin/users/1/grant-course?course_id=cream", token=token)
        check("Grant course non-admin", 403, code)

    passed = sum(1 for _, ok, _, _ in results if ok)
    failed = sum(1 for _, ok, _, _ in results if not ok)
    outf.write(f"\nResults: {passed} passed, {failed} failed out of {len(results)} tests\n")
    if failed:
        outf.write("FAILED TESTS:\n")
        for name, ok, code, detail in results:
            if not ok:
                outf.write(f"  - {name}: got {code} {detail}\n")

except Exception:
    traceback.print_exc(file=outf)

outf.close()
