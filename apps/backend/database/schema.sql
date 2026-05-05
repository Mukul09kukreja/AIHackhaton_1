CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  extension TEXT,
  size_bytes INTEGER NOT NULL,
  sha256 TEXT,
  mime_type TEXT,
  created_at TEXT,
  modified_at TEXT,
  last_seen_at TEXT NOT NULL,
  category TEXT,
  ai_summary TEXT,
  ai_tags TEXT,
  embedding_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_files_path ON files(path);
CREATE INDEX IF NOT EXISTS idx_files_sha256 ON files(sha256);
CREATE INDEX IF NOT EXISTS idx_files_category ON files(category);

CREATE TABLE IF NOT EXISTS operations (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  committed_at TEXT,
  payload_json TEXT NOT NULL,
  rollback_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS monitoring_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  folder_path TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  rule_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
