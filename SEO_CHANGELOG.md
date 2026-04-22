# SEO Оптимизация — Дело Вкуса

## Выполнено

### ✅ Критичные исправления (блокировали индексацию)
1. **robots.txt** — создан с директивами Host, Sitemap, Clean-param для Яндекса
2. **sitemap.xml** — 9 URL (главная, курсы, юр.документы)
3. **react-helmet-async** — установлен для мета-тегов per-route
4. **SEO компонент** — универсальный компонент с OG, Twitter Cards, JSON-LD
5. **Уникальные мета для каждой страницы**:
   - Главная (`/`) — "Торты на заказ во Владивостоке"
   - Каталог курсов (`/courses`) — "Кондитерские курсы онлайн от Ирины Гордеевой"
   - 5 страниц курсов (roses, cream, vase, ostrov, plastic-chocolate)

### ✅ Структурированные данные (Schema.org JSON-LD)
- **LocalBusiness** для главной (торты Владивосток) + адрес, телефон, Instagram
- **EducationalOrganization** для каталога курсов
- **Course** для каждой страницы курса (цена, уровень, провайдер)

### ✅ Social Media
- Open Graph теги (title, description, image 1200×630, url, type)
- Twitter Cards
- Canonical URL для каждой страницы

### ✅ Техническое
- Apple touch icon 180×180
- Яндекс.Метрика (закомментирован плейсхолдер в index.html)

---

## Следующие шаги

### 1. Регистрация в Яндекс.Вебмастер
1. Перейти: https://webmaster.yandex.ru/
2. Добавить сайт `https://delovkusa.site`
3. Подтвердить через HTML-файл или DNS TXT-запись
4. После подтверждения — отправить sitemap.xml

### 2. Яндекс.Метрика
1. Создать счетчик: https://metrika.yandex.ru/
2. Получить ID счетчика
3. Раскомментировать код в `index.html` (строки 12-27), заменить `ВАШ_ID_МЕТРИКИ`
4. ⚠️ **ВАЖНО**: Убедиться, что `/privacy` упоминает Яндекс.Метрику + Вебвизор (уже упомянуто)

### 3. Google Search Console
1. Добавить сайт: https://search.google.com/search-console
2. Подтвердить через DNS TXT или HTML-файл
3. Отправить sitemap.xml

### 4. SPA Prerendering (КРИТИЧНО для Яндекса)
Vanilla Vite-SPA плохо индексируется Яндексом. Варианты:
```bash
# Вариант 1: vite-plugin-prerender (рекомендую)
npm install -D vite-plugin-prerender

# Вариант 2: vite-ssg (SSG)
npm install -D vite-ssg

# Вариант 3: react-snap (post-build)
npm install -D react-snap
```

### 5. Оптимизация контента
- **Главная**: добавить блок "Доставка тортов во Владивостоке" + карта (LSI: район, адрес)
- **Курсы**: расширить описания до 300-500 слов (FAQ, отзывы, программа модулей)
- **Внутренние ссылки**: связать курсы с техкартами, галереи с главной

### 6. Проверка после деплоя
```bash
# Проверить raw HTML (должны быть мета-теги):
curl -s https://delovkusa.site/ | grep -i '<meta\|<title'
curl -s https://delovkusa.site/courses | grep -i '<meta\|<title'

# Проверить robots.txt:
curl https://delovkusa.site/robots.txt

# Проверить sitemap.xml:
curl https://delovkusa.site/sitemap.xml

# Lighthouse SEO:
npx lighthouse https://delovkusa.site --only-categories=seo,performance --view
```

### 7. Мониторинг
- Яндекс.Вебмастер: индексация, поисковые запросы, ошибки сканирования
- Google Search Console: покрытие, запросы, Core Web Vitals
- Яндекс.Метрика: поведенческие факторы, карта кликов

---

## Ключевики (для контента)

### Торты Владивосток
- торты на заказ владивосток
- заказать торт владивосток
- кондитерская владивосток
- свадебный торт владивосток
- детский торт владивосток
- торты владивосток цены
- торты с доставкой владивосток

### Кондитерские курсы
- кондитерские курсы онлайн
- курсы кондитера
- пластичный шоколад курс
- шоколадные цветы курс
- финишный крем курс
- обучение кондитера онлайн
- курсы для кондитеров

---

## Файлы изменены
- ✅ `public/robots.txt` (создан)
- ✅ `public/sitemap.xml` (создан)
- ✅ `package.json` (установлен react-helmet-async, исправлены скрипты)
- ✅ `src/components/SEO.tsx` (создан)
- ✅ `src/main.tsx` (добавлен HelmetProvider)
- ✅ `src/components/CakeShop.tsx` (SEO для главной)
- ✅ `src/components/home.tsx` (SEO для каталога курсов)
- ✅ `src/components/CoursePageLayout.tsx` (SEO для страниц курсов)
- ✅ `index.html` (apple-touch-icon, плейсхолдер Яндекс.Метрики)
