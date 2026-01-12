-- Demo data for manual testing (idempotent)

INSERT IGNORE INTO course_types (name)
VALUES
  ('Laurea Triennale'),
  ('Laurea Magistrale'),
  ('Master');

INSERT IGNORE INTO universities (name)
VALUES
  ('Politecnico di Milano'),
  ('Universita di Bologna'),
  ('Universita di Roma La Sapienza');

INSERT IGNORE INTO courses (name, course_type_id)
SELECT 'Ingegneria Informatica', ct.id
FROM course_types ct
WHERE ct.name = 'Laurea Triennale'
UNION ALL
SELECT 'Data Science', ct.id
FROM course_types ct
WHERE ct.name = 'Master'
UNION ALL
SELECT 'Economia', ct.id
FROM course_types ct
WHERE ct.name = 'Laurea Magistrale';

INSERT IGNORE INTO course_universities (course_id, university_id)
SELECT c.id, u.id
FROM courses c
JOIN universities u ON u.name = 'Politecnico di Milano'
WHERE c.name = 'Ingegneria Informatica'
UNION ALL
SELECT c.id, u.id
FROM courses c
JOIN universities u ON u.name = 'Universita di Bologna'
WHERE c.name = 'Ingegneria Informatica'
UNION ALL
SELECT c.id, u.id
FROM courses c
JOIN universities u ON u.name = 'Universita di Bologna'
WHERE c.name = 'Data Science'
UNION ALL
SELECT c.id, u.id
FROM courses c
JOIN universities u ON u.name = 'Universita di Roma La Sapienza'
WHERE c.name = 'Data Science'
UNION ALL
SELECT c.id, u.id
FROM courses c
JOIN universities u ON u.name = 'Universita di Roma La Sapienza'
WHERE c.name = 'Economia';
