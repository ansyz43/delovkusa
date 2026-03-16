import re
with open("/var/www/delovkusa/backend/app/seed.py", "r") as f:
    content = f.read()
content = re.sub(r'("price": )\d+, ("product_type": "techcard")', r'\g<1>1500, \2', content)
with open("/var/www/delovkusa/backend/app/seed.py", "w") as f:
    f.write(content)
print("seed.py updated")
