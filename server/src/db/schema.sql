-- 1. جدول التصنيفات (Categories)
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  description TEXT
);

-- 2. جدول المستخدمين (Users)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  current_age INTEGER NOT NULL,
  bio TEXT,
  avatar_color TEXT DEFAULT '#3B82F6',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. جدول النصائح والتجارب (Advices)
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

-- الفهارس لتحسين الأداء وسرعة التصفية
CREATE INDEX IF NOT EXISTS idx_advices_target_age ON advices(target_age);
CREATE INDEX IF NOT EXISTS idx_advices_category_id ON advices(category_id);
CREATE INDEX IF NOT EXISTS idx_advices_created_at ON advices(created_at);
CREATE INDEX IF NOT EXISTS idx_advices_user_id ON advices(user_id);

-- 4. جدول البحث الشامل FTS5
CREATE VIRTUAL TABLE IF NOT EXISTS advices_fts USING fts5(
  headline,
  story,
  lesson,
  content='advices',
  content_rowid='id'
);

-- مشغلات التزامن التلقائي لـ FTS5
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

-- 5. جدول التأييد / أثرت فيّ (Advice Impacts)
CREATE TABLE IF NOT EXISTS advice_impacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advice_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(advice_id, user_id),
  FOREIGN KEY (advice_id) REFERENCES advices(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_impacts_advice ON advice_impacts(advice_id);
CREATE INDEX IF NOT EXISTS idx_impacts_user ON advice_impacts(user_id);

-- 6. جدول المفضلة والمحفوظات (Bookmarks)
CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advice_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(advice_id, user_id),
  FOREIGN KEY (advice_id) REFERENCES advices(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);

-- 7. جدول التعليقات والمناقشات (Comments)
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advice_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (advice_id) REFERENCES advices(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_comments_advice ON comments(advice_id);

-- 8. جدول الإبلاغات وحماية المحتوى (Reports)
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advice_id INTEGER NOT NULL,
  user_id INTEGER,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (advice_id) REFERENCES advices(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. جدول الإشعارات (Notifications)
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  actor_id INTEGER,
  advice_id INTEGER,
  type TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (advice_id) REFERENCES advices(id) ON DELETE CASCADE
);
