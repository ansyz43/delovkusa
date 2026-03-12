"""End-to-end security tests for the Confectionery API."""
import httpx
import secrets

BASE = "http://127.0.0.1:8001"

def test_all():
    # 1. Health check + security headers
    r = httpx.get(f"{BASE}/api/health")
    print("=== Health Check ===")
    print(f"Status: {r.status_code}")
    assert r.status_code == 200
    assert r.headers.get("x-content-type-options") == "nosniff", "Missing X-Content-Type-Options"
    assert r.headers.get("x-frame-options") == "DENY", "Missing X-Frame-Options"
    assert r.headers.get("x-xss-protection") == "1; mode=block", "Missing X-XSS-Protection"
    assert r.headers.get("referrer-policy") == "strict-origin-when-cross-origin", "Missing Referrer-Policy"
    print("Security headers: ALL PRESENT")
    print()

    # 2. Register
    email = f"test_{secrets.token_hex(4)}@test.com"
    r = httpx.post(f"{BASE}/api/auth/register", json={"email": email, "password": "Test123!", "name": "Security Test"})
    print(f"=== Register === {r.status_code}")
    assert r.status_code == 200 or r.status_code == 201
    data = r.json()
    token = data.get("access_token", "")
    assert token, "No access token returned"
    cookies = r.cookies
    print(f"Got token: True")
    print()

    # 3. Login
    r = httpx.post(f"{BASE}/api/auth/login", json={"email": email, "password": "Test123!"})
    print(f"=== Login === {r.status_code}")
    assert r.status_code == 200
    data = r.json()
    token = data["access_token"]
    login_cookies = r.cookies
    print()

    # 4. Access /me with access token
    r = httpx.get(f"{BASE}/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    print(f"=== Profile === {r.status_code}")
    assert r.status_code == 200
    profile = r.json()
    print(f"User: {profile['name']} ({profile['email']})")
    print()

    # 5. Wrong password (should return 401)
    r = httpx.post(f"{BASE}/api/auth/login", json={"email": email, "password": "wrong!"})
    print(f"=== Wrong Password === {r.status_code}")
    assert r.status_code == 401
    print("Correctly rejected")
    print()

    # 6. Refresh with rotation
    r = httpx.post(f"{BASE}/api/auth/refresh", cookies=login_cookies)
    print(f"=== Refresh Token === {r.status_code}")
    assert r.status_code == 200
    new_data = r.json()
    assert new_data.get("access_token"), "No new access token"
    print("New access token issued")
    print()

    # 7. CRITICAL: Try using access token as refresh (must fail)
    fake_cookies = httpx.Cookies()
    fake_cookies.set("refresh_token", token, domain="127.0.0.1", path="/api/auth")
    r = httpx.post(f"{BASE}/api/auth/refresh", cookies=fake_cookies)
    print(f"=== Access-as-Refresh Attack === {r.status_code}")
    assert r.status_code == 401, f"VULNERABILITY: Access token accepted as refresh! Got {r.status_code}"
    print("BLOCKED - access token correctly rejected as refresh")
    print()

    # 8. Duplicate registration (same email)
    r = httpx.post(f"{BASE}/api/auth/register", json={"email": email, "password": "Other123!", "name": "Duplicate"})
    print(f"=== Duplicate Register === {r.status_code}")
    assert r.status_code == 400
    print("Correctly rejected duplicate email")
    print()

    # 9. Logout
    r = httpx.post(f"{BASE}/api/auth/logout")
    print(f"=== Logout === {r.status_code}")
    assert r.status_code == 200
    print()

    print("=" * 50)
    print("ALL SECURITY TESTS PASSED!")
    print("=" * 50)

if __name__ == "__main__":
    test_all()
