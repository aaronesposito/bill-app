INSERT INTO bank (id, bank_name) VALUES
  (1, 'First Federal Bank'),
  (2, 'Riverstone Credit Union'),
  (3, 'Atlas National'),
  (4, 'Metro Savings & Loan'),
  (5, 'Pioneer Trust');

INSERT INTO account (public_id, full_name, username, password) VALUES
  ('7c6f6b0f-9c18-4a9f-9a8b-0c2c0d0e1a11', 'Alice Johnson', 'alice', '$2b$12$alicehashplaceholder'),
  ('a2e8d0b3-1d44-49b5-9f18-42b5c9b03720', 'Bob Smith', 'bob', '$2b$12$bobhashplaceholder'),
  ('c9d5a1f0-3d1c-4cb0-8e77-9f0b2f1c2d33', 'Carol Nguyen', 'carol', '$2b$12$carolhashplaceholder'),
  ('d1e2f3a4-b5c6-4789-9abc-d0e1f2a3b4c5', 'Dave Patel', 'dave', '$2b$12$davehashplaceholder'),
  ('e7f8a9b0-c1d2-4e3f-8a7b-6c5d4e3f2a1b', 'Erin Garcia', 'erin', '$2b$12$erinhashplaceholder'),
  ('f0123abc-4567-8901-2345-67890abcde12', 'Frank Miller', 'frank', '$2b$12$frankhashplaceholder'),
  ('0123abcd-ef45-6789-0123-456789abcdef', 'Grace Kim', 'grace', '$2b$12$gracehashplaceholder'),
  ('89abcdef-0123-4567-89ab-cdef01234567', 'Heidi Brooks', 'heidi', '$2b$12$heidihashplaceholder');

INSERT INTO bill (bill_name, user_account, bank_id, amount, paid) VALUES
  ('Electric - September', 1, 1, 112.45, TRUE),
  ('Water - September', 1, 1, 48.22, TRUE),
  ('Internet - September', 1, 3, 69.99, TRUE),
  ('Rent - October', 1, 2, 1450.00, FALSE),

  ('Gym Membership - October', 2, 4, 39.99, FALSE),
  ('Credit Card - Statement 2025-09', 2, 5, 527.63, TRUE),
  ('Mobile - October', 2, 3, 84.50, FALSE),

  ('Car Insurance - Q4', 3, 2, 312.18, TRUE),
  ('Gas Utility - September', 3, 1, 63.40, TRUE),
  ('Streaming Bundle - October', 3, 3, 24.99, FALSE),

  ('Mortgage - October', 4, 5, 2187.00, FALSE),
  ('HOA Dues - October', 4, 5, 145.00, FALSE),
  ('Electric - October', 4, 1, 98.31, FALSE),

  ('Student Loan - Oct', 5, 2, 256.75, TRUE),
  ('Internet - October', 5, 3, 69.99, FALSE),
  ('Water - October', 5, 1, 44.10, FALSE),

  ('Rent - October', 6, 2, 1280.00, FALSE),
  ('Credit Card - Statement 2025-10', 6, 5, 391.27, FALSE),
  ('Mobile - September', 6, 3, 79.99, TRUE),

  ('Car Payment - October', 7, 4, 429.55, FALSE),
  ('Electric - September', 7, 1, 87.10, TRUE),
  ('Gas Utility - October', 7, 1, 59.88, FALSE),

  ('Mortgage - October', 8, 5, 1995.00, FALSE),
  ('Home Insurance - Annual', 8, 5, 1143.20, TRUE),
  ('Internet - September', 8, 3, 59.99, TRUE),
  ('Internet - October', 8, 3, 59.99, FALSE);