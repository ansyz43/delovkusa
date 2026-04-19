"""Phase 5 audit: run on the SERVER via SSH."""
import json, secrets, subprocess

# Run test on the remote server using curl commands
tests = []
def ssh(cmd):
    r = subprocess.run(["ssh", "root@5.42.100.152", cmd], capture_output=True, text=True, timeout=15)
    return r.stdout.strip()

# 1. Health
result = ssh("curl -sS -o /dev/null -w '%{http_code}' https://delovkusa.site/api/health")
tests.append(("Health check", result == "200", result))

# 2. Admin endpoints without auth -> 403
for ep in ["users", "orders", "stats", "courses"]:
    result = ssh(f"curl -sS -o /dev/null -w '%{{http_code}}' https://delovkusa.site/api/admin/{ep}")
    tests.append((f"Admin /{ep} no auth", result == "403", result))

# 3. Register test user and get token
email = f"audit_{secrets.token_hex(4)}@test.dev"
body_json = json.dumps({"email": email, "password": "AuditTest1!", "name": "Audit"})
result = ssh(f"curl -sS -X POST https://delovkusa.site/api/auth/register -H 'Content-Type: application/json' -d '{body_json}'")
try:
    reg_data = json.loads(result)
    token = reg_data.get("access_token", "")
    tests.append(("Register user", bool(token), f"token={'yes' if token else 'no'}"))
except Exception:
    token = ""
    tests.append(("Register user", False, result[:80]))

if token:
    # 4. Profile
    result = ssh(f"curl -sS https://delovkusa.site/api/auth/me -H 'Authorization: Bearer {token}'")
    try:
        profile = json.loads(result)
        tests.append(("Profile", profile.get("email") == email, f"is_admin={profile.get('is_admin')}"))
    except Exception:
        tests.append(("Profile", False, result[:80]))

    # 5. Admin with non-admin user -> 403
    for ep in ["users", "stats"]:
        result = ssh(f"curl -sS -o /dev/null -w '%{{http_code}}' https://delovkusa.site/api/admin/{ep} -H 'Authorization: Bearer {token}'")
        tests.append((f"Admin /{ep} non-admin", result == "403", result))

    # 6. Grant course non-admin -> 403
    result = ssh(f"curl -sS -o /dev/null -w '%{{http_code}}' -X POST 'https://delovkusa.site/api/admin/users/1/grant-course?course_id=cream' -H 'Authorization: Bearer {token}'")
    tests.append(("Grant non-admin", result == "403", result))

# 7. Service status
result = ssh("systemctl is-active delovkusa || echo inactive")
tests.append(("Service active", result == "active", result))

# 8. Backend errors in log
result = ssh("journalctl -u delovkusa --no-pager -n 20 --since='5 minutes ago' | grep -ci 'error\\|traceback\\|exception' || echo 0")
tests.append(("No recent errors in logs", result.strip() == "0", f"errors_found={result.strip()}"))

# Write results
with open("_audit_results.txt", "w", encoding="utf-8") as f:
    for name, ok, detail in tests:
        f.write(f"{'PASS' if ok else 'FAIL'} | {name}: {detail}\n")
    passed = sum(1 for _, ok, _ in tests if ok)
    failed = sum(1 for _, ok, _ in tests if not ok)
    f.write(f"\nTotal: {passed} passed, {failed} failed out of {len(tests)} tests\n")
    if failed:
        f.write("FAILED:\n")
        for name, ok, detail in tests:
            if not ok:
                f.write(f"  - {name}: {detail}\n")
