# خطة تنفيذ منصة "ياريتني" (Yareetni) — النسخة المحدثة مع التحسينات المعمارية

**ياريتني** هي منصة تواصل وتجارب حياتية لمشاركة الحكمة والنصائح التي كان يتمنى أصحابها معرفتها في عمر معين، ليستفيد منها من هم في نفس المرحلة العمرية الآن.

تم تحديث هذه الخطة لدمج جميع التحسينات التقنية والهندسية المقترحة لضمان قابلية التوسع، الأمان العالي، وأفضل تجربة للمستخدم ولمحركات البحث (SEO).

---

## أبرز التحسينات المعمارية المعتمدة

1. **روابط مهيئة لمحركات البحث (SEO-Friendly Slugs)**:
   - تحويل روابط النصائح من `/advices/15` إلى `/advice/15/:slug` (مثل: `/advice/15/yaretni-started-saving-money`).
2. **فصل هيكل النصيحة إلى 3 أركان جوهرية**:
   - `headline`: عنوان النصيحة وفكرتها المركزة.
   - `story`: القصة الواقعية والسياق الذي أدى لهذه النتيجة.
   - `lesson`: العبرة العملية المركزة ("لو رجع بيا الزمن هعمل...").
3. **حساب التفاعل ديناميكياً بدون تكرار بيانات (Impact & Views)**:
   - حساب عدد التفاعلات من جدول `advice_impacts` عبر Subqueries/Triggers لمنع تعارض البيانات.
   - إضافة عداد المشاهدات `view_count` لتتبع التفاعل وترتيب النصائح الصاعدة.
4. **جدول فئات مستقل (`categories`)**:
   - يتيح تحديد الأيقونة، واللون، وترتيب العرض، مع توفير نقطة نهاية `GET /api/categories`.
5. **معرفات المستخدمين المخصصة (`username`)**:
   - إضافة اسم مستخدم فريد لكل حساب لتمكين روابط الحسابات المباشرة مثل `/u/:username`.
6. **خوارزميات فرز متقدمة في الـ Feed**:
   - **الأحدث (Latest)**: حسب وقت النشر.
   - **الأكثر تأثيراً (Top Impact)**: حسب إجمالي مرات "أثرت فيّ".
   - **الصاعدة (Trending)**: خوارزمية ذكية تحسب التفاعل بالنسبة لحداثة المنشور `impact_count / (hours + 2)^1.2`.
7. **محرك بحث متطور وسريع (SQLite FTS5)**:
   - إنشاء جدول بحث افتراضي (Full-Text Search) للبحث الفوري وفائق السرعة في العناوين والقصص والدروس.
8. **نظام الإبلاغ وحماية المحتوى (`reports`)**:
   - جدول ونقاط نهاية للإبلاغ عن أي محتوى مخالف لمراجعة المنصة.
9. **بنية الإشعارات المستقبلية (`notifications`)**:
   - تجهيز جدول الإشعارات مسبقاً في قاعدة البيانات لدعم التوسعات المستقبلية بسلاسة.
10. **الأمان والتحقق المتين (Production-Grade Security)**:
    - اعتماد `helmet`، `cors`، `express-rate-limit`، `bcryptjs`، `jsonwebtoken`، ومخططات تحقق المدخلات بـ `zod`.
11. **نظام توجيه وتصفح كامل بالواجهة (React Router)**:
    - اعتماد `react-router-dom` لمسارات صفحات مستقلة وقابلة للمشاركة والحفظ في المتصفح.
12. **خارطة الطريق المستقبلية — ميزة "اسأل اللي أكبر منك"**:
    - تم توثيقها كمرحلة ثانية بعد إطلاق المنصة الأساسية.

---

## بنية المشروع (Project Structure)

المجلد الأساسي للمشروع:
`C:\Users\Abdo\.gemini\antigravity-ide\scratch\yareetni`

```text
yareetni/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── config.js
│   │   ├── db/
│   │   │   ├── index.js          # اتصال SQLite وتهيئة FTS5 والجداول
│   │   │   ├── schema.sql        # مخطط الجداول والفهارس
│   │   │   └── seed.js           # نصائح ومستخدمين وتصنيفات واقعية
│   │   ├── middleware/
│   │   │   ├── auth.js           # التحقق من JWT
│   │   │   ├── validate.js       # فحص المدخلات بـ Zod
│   │   │   └── rateLimiter.js    # حماية الطلبات المتكررة
│   │   ├── routes/
│   │   │   ├── auth.routes.js    # تسجيل، دخول، me
│   │   │   ├── advice.routes.js  # تصفح، إضافة، تفاعل، مشاهدات، تقارير
│   │   │   ├── categories.routes.js # قائمة التصنيفات وأيقوناتها
│   │   │   ├── comments.routes.js
│   │   │   └── users.routes.js   # الملفات الشخصية بـ @username والمحفوظات
│   │   ├── utils/
│   │   │   └── slugify.js        # توليد السلاج العربي والإنجليزي
│   │   └── index.js
│   └── package.json
│
└── client/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── SidebarFilters.jsx
    │   │   ├── AdviceCard.jsx
    │   │   ├── AdviceFeed.jsx
    │   │   ├── BadgesList.jsx
    │   │   └── ReportModal.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx          # / (الخلاصة والفلاتر)
    │   │   ├── AdviceDetailPage.jsx  # /advice/:id/:slug (صفحة النصيحة المستقلة)
    │   │   ├── NewAdvicePage.jsx     # /new (نموذج إضافة نصيحة بتصميم ممتع)
    │   │   ├── ProfilePage.jsx       # /u/:username (الملف الشخصي والأوسمة)
    │   │   ├── SavedAdvicesPage.jsx  # /saved (المحفوظات الخاصة)
    │   │   ├── LoginPage.jsx         # /login
    │   │   └── RegisterPage.jsx      # /register
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css                 # تصميم عصري حيوي RTL وخطوط حديثة
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## المخطط البياني المحسّن لقاعدة البيانات (Database Schema)

```sql
-- 1. جدول التصنيفات
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  description TEXT
);

-- 2. جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  current_age INTEGER NOT NULL,
  bio TEXT,
  avatar_color TEXT DEFAULT '#4F46E5',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. جدول النصائح والتجارب
CREATE TABLE IF NOT EXISTS advices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  target_age INTEGER NOT NULL,
  author_age_at_post INTEGER NOT NULL,
  slug TEXT NOT NULL,
  headline TEXT NOT NULL,
  story TEXT NOT NULL,
  lesson TEXT NOT NULL,
  is_anonymous INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 4. جدول البحث الشامل FTS5
CREATE VIRTUAL TABLE IF NOT EXISTS advices_fts USING fts5(
  headline,
  story,
  lesson,
  content='advices',
  content_rowid='id'
);

-- مشغلات التزامن الآلي لـ FTS5
CREATE TRIGGER IF NOT EXISTS advices_ai AFTER INSERT ON advices BEGIN
  INSERT INTO advices_fts(rowid, headline, story, lesson) VALUES (new.id, new.headline, new.story, new.lesson);
END;
CREATE TRIGGER IF NOT EXISTS advices_ad AFTER DELETE ON advices BEGIN
  INSERT INTO advices_fts(advices_fts, rowid, headline, story, lesson) VALUES('delete', old.id, old.headline, old.story, old.lesson);
END;
CREATE TRIGGER IF NOT EXISTS advices_au AFTER UPDATE ON advices BEGIN
  INSERT INTO advices_fts(advices_fts, rowid, headline, story, lesson) VALUES('delete', old.id, old.headline, old.story, old.lesson);
  INSERT INTO advices_fts(rowid, headline, story, lesson) VALUES (new.id, new.headline, new.story, new.lesson);
END;

-- 5. جدول التأييد (أثرت فيّ)
CREATE TABLE IF NOT EXISTS advice_impacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advice_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(advice_id, user_id),
  FOREIGN KEY (advice_id) REFERENCES advices(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. جدول المفضلة والمحفوظات
CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advice_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(advice_id, user_id),
  FOREIGN KEY (advice_id) REFERENCES advices(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. جدول التعليقات والمناقشات
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advice_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (advice_id) REFERENCES advices(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. جدول الإبلاغات وحماية المحتوى
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advice_id INTEGER NOT NULL,
  user_id INTEGER,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, reviewed, dismissed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (advice_id) REFERENCES advices(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. جدول الإشعارات (تأسيسي للتوسعات)
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  actor_id INTEGER,
  advice_id INTEGER,
  type TEXT NOT NULL, -- impact, comment
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (advice_id) REFERENCES advices(id) ON DELETE CASCADE
);
```

---

## مسارات الـ API (REST Endpoints)

| المسار | الطريقة | الوصف | الحماية / الصلاحية |
| :--- | :--- | :--- | :--- |
| `/api/categories` | `GET` | قائمة التصنيفات والألوان والأيقونات وعدد النصائح في كل فئة | عام |
| `/api/ages` | `GET` | قائمة المراحل العمرية المتوفرة وعدد النصائح لكل سن | عام |
| `/api/auth/register` | `POST` | تسجيل حساب جديد (username, name, email, password, age) | فحص Zod + Rate Limit |
| `/api/auth/login` | `POST` | تسجيل الدخول واستلام JWT | فحص Zod + Rate Limit |
| `/api/auth/me` | `GET` | بيانات المستخدم الحالي | مصادقة JWT |
| `/api/advices` | `GET` | استعلام الخلاصة (فلاتر: age, category, sort=[latest, top, trending], q=[بحث FTS5], page) | عام |
| `/api/advices/:id` | `GET` | جلب تفاصيل النصيحة وزيادة عداد المشاهدات `view_count` | عام |
| `/api/advices` | `POST` | نشر نصيحة جديدة (headline, story, lesson, target_age, category_id, is_anonymous) | مصادقة JWT + Zod |
| `/api/advices/:id/impact` | `POST` | تبديل "أثرت فيّ" (Toggle Impact) | مصادقة JWT |
| `/api/advices/:id/bookmark` | `POST` | تبديل الحفظ في المفضلة (Toggle Bookmark) | مصادقة JWT |
| `/api/advices/:id/report` | `POST` | إرسال إبلاغ عن محتوى غير لائق | عام / مسجل |
| `/api/advices/:id/comments` | `GET` | جلب تعليقات النصيحة | عام |
| `/api/advices/:id/comments` | `POST` | إضافة تعليق جديد | مصادقة JWT + Zod |
| `/api/users/@:username` | `GET` | الملف الشخصي للمستخدم، الأوسمة، وإجمالي نقاط الأثر والنصائح العامة | عام |
| `/api/users/me/bookmarks` | `GET` | قائمة النصائح المحفوظة الخاصة بالمستخدم | مصادقة JWT |
| `/api/users/me/profile` | `PUT` | تحديث بيانات الملف الشخصي (الاسم، النبذة، السن) | مصادقة JWT |

---

## تفاصيل تجربة الواجهة (React Frontend Pages)

1. **الصفحة الرئيسية (`/`)**:
   - شريط ملاحة علوي (Navbar) يحوي الشعار، البحث السريع، زر "أضف نصيحة"، وحالة الدخول.
   - قسم فلترة أنيق ومبتكر:
     - شريط الأعمار السريعة (جميع الأعمار، 18، 20، 22، 25، 30، 35، 40+).
     - تصنيفات ملونة بأيقونات جذابة.
     - خيارات الترتيب: "الأحدث"، "الأكثر تأثيراً"، "الصاعدة 🔥".
   - بطاقات النصائح (AdviceCard):
     - شارة فارق الخبرة الواضحة (مثل: 💡 "لو رجع بيا الزمن لسن 20 وأنا الآن 35").
     - عنوان النصيحة، ملخص القصة، وبطاقة الدرس البارزة ("لو رجع بيا الزمن هعمل...").
     - أزرار تفاعل سريعة ("أثرت فيّ"، تعليق، حفظ، مشاركة الرابط).
2. **صفحة تفاصيل النصيحة (`/advice/:id/:slug`)**:
   - عرض النصيحة الكاملة بأسلوب تحريري أنيق ومريح للقراءة.
   - زر نسخ الرابط المباشر للمشاركة في واتساب وتويتر/إكس.
   - قسم التعليقات التفاعلي ومناقشات القراء مع إمكانية إضافة تعليق فوري.
3. **صفحة إضافة نصيحة (`/new`)**:
   - نموذج تفاعلي ذكي يطلب: السن المستهدف، العنوان، القصة، والدرس ("لو رجع بيا الزمن...").
   - اختيار التصنيف بالأيقونات.
   - مفتاح التبديل لنشر النصيحة باسمك أو كـ "مجهول" مع توضيح أن عمرك سيظهر لضمان مصداقية الخبرة.
4. **صفحة الملف الشخصي (`/u/:username`)**:
   - عرض صورة الكاتب، عمره، إجمالي عدد "أثرت فيّ" لكل نصائحه.
   - قائمة الشارات والأوسمة المحققة (حكيم العشرينات، مساهم نشط، أثر ذهبي).
   - عرض النصائح العامة للكاتب.
5. **صفحة المحفوظات (`/saved`)**:
   - وصول سريع للنصائح التي حفظها المستخدم للرجوع إليها في أي وقت.

---

## خطة التحقق والتشغيل (Verification Plan)

1. **التحقق الآلي من البنية وتثبيت الحزم**:
   - فحص تثبيت حزم الخادم (`express`, `better-sqlite3`, `cors`, `helmet`, `express-rate-limit`, `bcryptjs`, `jsonwebtoken`, `zod`, `morgan`).
   - فحص تثبيت حزم العميل (`vite`, `react`, `react-dom`, `react-router-dom`, `lucide-react`).
2. **التحقق من قاعدة البيانات والتغذية (Seed Verification)**:
   - تشغيل سكريبت إنشاء الجداول وتغذية البيانات `seed.js`.
   - التأكد من ملء التصنيفات الـ 7، وحسابات المستخدمين، وأكثر من 15 نصيحة واقعية تغطي الأعمار 18 إلى 45 سنة.
   - التحقق من عمل محرك البحث FTS5 عبر استعلام تجريبي.
3. **اختبار خادم الـ API**:
   - تشغيل الخادم والتحقق من الاستجابة السليمة لنقاط النهاية: التصنيفات، النصائح بالفرز والفلترة، تفاصيل النصيحة عبر الـ Slug.
4. **التحقق من الواجهة في المتصفح**:
   - تشغيل خادم التطوير Vite واستعراض الموقع بالكامل للتأكد من جمالية التصميم، تجاوب الهواتف، دعم العربية RTL، ودقة التنقل عبر React Router.
