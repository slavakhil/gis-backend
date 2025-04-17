CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  link TEXT NOT NULL
);

INSERT INTO modules (name, link)
SELECT * FROM (
  VALUES
    ('Обзорная карта', 'https://link1.ru'),
    ('Карты по проектам', 'https://link2.ru'),
    ('Модуль оптимизации трасс', 'https://link3.ru'),
    ('Ресурсы', 'https://link4.ru')
) AS v(name, link)
WHERE NOT EXISTS (
  SELECT 1 FROM modules
);

CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  photo TEXT
);

CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  position TEXT NOT NULL,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  patronymic TEXT,
  email TEXT NOT NULL,
  photo TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
