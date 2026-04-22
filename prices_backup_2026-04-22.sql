-- Backup цен на 2026-04-22 перед тестовым снижением до 1₽
-- Восстановить: psql -d delovkusa -f prices_backup_2026-04-22.sql

UPDATE courses SET price = 19900 WHERE id = 'bundle-all';
UPDATE courses SET price = 10900 WHERE id = 'bundle-mid';
UPDATE courses SET price = 6900  WHERE id = 'bundle-novice';
UPDATE courses SET price = 4500  WHERE id = 'cream';
UPDATE courses SET price = 5500  WHERE id = 'ostrov';
UPDATE courses SET price = 3500  WHERE id = 'plastic-chocolate';
UPDATE courses SET price = 6900  WHERE id = 'roses';
UPDATE courses SET price = 5900  WHERE id = 'vase';
UPDATE courses SET price = 1500  WHERE id = 'tc-chereshnevye-tryufeli-mk';
UPDATE courses SET price = 2000  WHERE id = 'tc-chereshnevyj-tryufel';
UPDATE courses SET price = 2000  WHERE id = 'tc-chernichnye-nochi';
UPDATE courses SET price = 1500  WHERE id = 'tc-plastichnyj-shokolad';
UPDATE courses SET price = 2000  WHERE id = 'tc-shifonovyj-biskvit';
UPDATE courses SET price = 2000  WHERE id = 'tc-tart-yagoda';
UPDATE courses SET price = 2000  WHERE id = 'tc-tayozhnyj-roman';
UPDATE courses SET price = 2000  WHERE id = 'tc-tryufel-chernosliv';
UPDATE courses SET price = 2000  WHERE id = 'tc-tryufel-malinovyj';
UPDATE courses SET price = 2000  WHERE id = 'tc-vishnya-v-shokolade';
