#!/bin/bash
echo "=== PAGE ROUTES ==="
for url in / /courses /courses/roses /courses/cream /courses/vase /courses/ostrov /courses/plastic-chocolate /auth /dashboard /dashboard/courses; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://delovkusa.site${url}")
  echo "${code} ${url}"
done

echo ""
echo "=== API ENDPOINTS ==="
for ep in /api/health /api/auth/me; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://delovkusa.site${ep}")
  echo "${code} ${ep}"
done

echo ""
echo "=== COVER IMAGES ==="
for img in /roza2.jpg /cre1.jpg /vaza1.jpg /ostrov.jpg /plastic-chocolate.jpg /instructor.jpg /vaza.jpg /cre2.jpg /cre3.jpg /cre4.jpg /cre5.jpg /cre6.jpg; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://delovkusa.site${img}")
  echo "${code} ${img}"
done

echo ""
echo "=== ROSES GALLERY ==="
for img in "/courses/roses/rozaroza%20(1).jpg" "/courses/roses/rozaroza%20(3).jpg" "/courses/roses/rozaroza%20(4).jpg" "/courses/roses/rozaroza%20(5).jpg" "/courses/roses/rozaroza%20(6).jpg" "/courses/roses/rozaroza%20(7).jpg" "/roza%20roza%20%20(1).jpg" "/roza%20roza%20%20(2).jpg" "/roza%20roza%20%20(3).jpg"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://delovkusa.site${img}")
  echo "${code} ${img}"
done

echo ""
echo "=== TESTIMONIALS ROSES ==="
for i in 1 2 3 4 5 6 7 8; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://delovkusa.site/courses/roses/otziv%20roza%20%20(${i}).jpg")
  echo "${code} /courses/roses/otziv roza  (${i}).jpg"
done

echo ""
echo "=== TESTIMONIALS CREAM ==="
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://delovkusa.site/otziv%20crem%20(${i}).jpg")
  echo "${code} /otziv crem (${i}).jpg"
done

echo ""
echo "=== TESTIMONIALS VAZA ==="
for i in 1 2 4 5 6 7 8; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://delovkusa.site/otzivvaza%20(${i}).jpg")
  echo "${code} /otzivvaza (${i}).jpg"
done

echo ""
echo "=== TESTIMONIALS OSTROV ==="
for i in 1 2 3 4; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://delovkusa.site/otzivostrov%20(${i}).jpg")
  echo "${code} /otzivostrov (${i}).jpg"
done

echo ""
echo "=== VAZA PHOTOS ==="
for i in 1 3 5 6 7 8; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://delovkusa.site/vazaphoto%20(${i}).jpg")
  echo "${code} /vazaphoto (${i}).jpg"
done

echo ""
echo "=== CAKE SHOP IMAGES ==="
for img in /cakes/complex-cakes/1.jpg /cakes/3d/1.jpg /cakes/figurines/1.jpg /cakes/tea-cakes/1.jpg /cakes/tarts/1.jpg /cakes/bombs/1.jpg /cakes/cupcakes/1.jpg /cakes/cakepops/1.jpg /cakes/truffles/1.jpg /cakes/trifles/1.jpg /cakes/mousse/1.jpg /cakes/ptichye-moloko/1.jpg /cakes/sliced/1.jpg /cakes/minicheesecake/1.jpg /cakes/profiteroles/1.jpg /cakes/kartoshka/1.jpg /cakes/choco-teacups/1.jpg; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://delovkusa.site${img}")
  echo "${code} ${img}"
done

echo ""
echo "=== LESSON IMAGES ==="
for img in /courses/roses/cover.jpg /courses/roses/result.jpg /courses/roses/classic-rose.jpg /courses/roses/tools-0.jpg /courses/roses/beginners-0.jpg /courses/finishing-cream/course-photo.jpg /courses/finishing-cream/products.jpg /courses/finishing-cream/result-1.jpg /courses/ostrov/result-1.jpg /courses/ostrov/bonus-kartoshka.jpg; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://delovkusa.site${img}")
  echo "${code} ${img}"
done

echo ""
echo "=== VIDEO ==="
code=$(curl -s -o /dev/null -w "%{http_code}" "https://delovkusa.site/video%20ostrov.mp4")
echo "${code} /video ostrov.mp4"

echo ""
echo "=== DONE ==="
