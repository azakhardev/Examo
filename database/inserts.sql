-- =================================================================================
-- INITIAL DUMMY DATA FOR EXAMO POSTGRESQL DATABASE
-- All passwords are encrypted using BCrypt.
-- The plain text password for all accounts is: '123456'
-- =================================================================================

-- 1. USERS (1 Teacher, 1 Developer/Author, 8 Students)
INSERT INTO users (username, name, surname, email, password) VALUES
('teacher_jane', 'Jane', 'Doe', 'jane.doe@university.edu', '$2a$10$ydtRmX4hMww/Lfha18VgFepJYdRBKoqm4mwXGTctkQMzoG6eQdPSS'),
('azakhardev', 'Artem', 'Zakharchenko', 'azakhardev@gmail.com', '$2a$10$ydtRmX4hMww/Lfha18VgFepJYdRBKoqm4mwXGTctkQMzoG6eQdPSS'),
('john_smith', 'John', 'Smith', 'john.smith@student.edu', '$2a$10$ydtRmX4hMww/Lfha18VgFepJYdRBKoqm4mwXGTctkQMzoG6eQdPSS'),
('emma_watson', 'Emma', 'Watson', 'emma.watson@student.edu', '$2a$10$ydtRmX4hMww/Lfha18VgFepJYdRBKoqm4mwXGTctkQMzoG6eQdPSS'),
('michael_b', 'Michael', 'Brown', 'michael.b@student.edu', '$2a$10$ydtRmX4hMww/Lfha18VgFepJYdRBKoqm4mwXGTctkQMzoG6eQdPSS'),
('sarah_connor', 'Sarah', 'Connor', 'sarah.c@student.edu', '$2a$10$ydtRmX4hMww/Lfha18VgFepJYdRBKoqm4mwXGTctkQMzoG6eQdPSS'),
('david_miller', 'David', 'Miller', 'david.m@student.edu', '$2a$10$ydtRmX4hMww/Lfha18VgFepJYdRBKoqm4mwXGTctkQMzoG6eQdPSS'),
('olivia_jones', 'Olivia', 'Jones', 'olivia.j@student.edu', '$2a$10$ydtRmX4hMww/Lfha18VgFepJYdRBKoqm4mwXGTctkQMzoG6eQdPSS'),
('james_taylor', 'James', 'Taylor', 'james.t@student.edu', '$2a$10$ydtRmX4hMww/Lfha18VgFepJYdRBKoqm4mwXGTctkQMzoG6eQdPSS'),
('sophia_martin', 'Sophia', 'Martin', 'sophia.m@student.edu', '$2a$10$ydtRmX4hMww/Lfha18VgFepJYdRBKoqm4mwXGTctkQMzoG6eQdPSS');

-- 2. QUIZZES (These UUIDs must match the _id of documents in MongoDB)
INSERT INTO quizzes (id, name, author_id, visibility) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Database Fundamentals', (SELECT id FROM users WHERE username = 'azakhardev'), 'PUBLIC'),
('111e8400-e29b-41d4-a716-446655441111', 'Software Architecture Patterns', (SELECT id FROM users WHERE username = 'azakhardev'), 'PRIVATE'),
('222e8400-e29b-41d4-a716-446655442222', 'React Native Basics', (SELECT id FROM users WHERE username = 'azakhardev'), 'PUBLIC'),
('a1111111-1111-4111-8111-111111111111', 'Advanced React Patterns', (SELECT id FROM users WHERE username = 'teacher_jane'), 'PUBLIC'),
('c3333333-3333-4333-8333-333333333333', 'History of the Roman Empire', (SELECT id FROM users WHERE username = 'teacher_jane'), 'PUBLIC'),
('e5555555-5555-4555-8555-555555555555', 'Space Exploration & Astronomy', (SELECT id FROM users WHERE username = 'teacher_jane'), 'PRIVATE'),
('b2222222-2222-4222-8222-222222222222', 'World Geography Basics', (SELECT id FROM users WHERE username = 'azakhardev'), 'PUBLIC'),
('d4444444-4444-4444-8444-444444444444', 'Biology and Human Anatomy', (SELECT id FROM users WHERE username = 'azakhardev'), 'RESTRICTED'),
('f6666666-6666-4666-8666-666666666666', 'Modern Java and Spring Boot', (SELECT id FROM users WHERE username = 'azakhardev'), 'PRIVATE');

-- 3.1 AUTO-SHARE FOR AUTHORS
INSERT INTO quiz_shares (quiz_id, user_id, access_level, favorite)
SELECT id, author_id, 'EDIT', false FROM quizzes;

-- 3.2. ACCESS CONTROL
INSERT INTO quiz_shares (quiz_id, user_id, access_level, favorite) VALUES
('222e8400-e29b-41d4-a716-446655442222', (SELECT id FROM users WHERE username = 'john_smith'), 'READ', false),
('222e8400-e29b-41d4-a716-446655442222', (SELECT id FROM users WHERE username = 'emma_watson'), 'EDIT', true),
('a1111111-1111-4111-8111-111111111111', (SELECT id FROM users WHERE username = 'azakhardev'), 'READ', true),
('c3333333-3333-4333-8333-333333333333', (SELECT id FROM users WHERE username = 'azakhardev'), 'EDIT', false),
('b2222222-2222-4222-8222-222222222222', (SELECT id FROM users WHERE username = 'teacher_jane'), 'READ', true);

-- Blocking Michael and Sarah from accessing the quiz
INSERT INTO quiz_blocks (quiz_id, user_id) VALUES
('222e8400-e29b-41d4-a716-446655442222', (SELECT id FROM users WHERE username = 'michael_b')),
('222e8400-e29b-41d4-a716-446655442222', (SELECT id FROM users WHERE username = 'sarah_connor'));

-- 4. ONLINE TESTS
-- 4.1 Historical test for azakhardev (Authored by teacher_jane)
INSERT INTO online_tests (quiz_id, snapshot_id, description, access_code, start_at, end_at, time_limit_minutes, max_points) VALUES
('a1111111-1111-4111-8111-111111111111', '888e8400-e29b-41d4-a716-446655448888', 'Past test on React Hooks.', 'REACTADV', '2026-06-10 10:00:00', '2026-06-10 12:00:00', 30, 1);

-- 4.2 Historical test hosted by azakhardev (Taken by john_smith)
INSERT INTO online_tests (quiz_id, snapshot_id, description, access_code, start_at, end_at, time_limit_minutes, max_points) VALUES
('111e8400-e29b-41d4-a716-446655441111', '333e8400-e29b-41d4-a716-446655443333', 'Test about modern architecture.', 'ARCH2026', '2026-06-20 10:00:00', '2026-06-20 12:00:00', 30, 9);

-- 4.3 Upcoming test for azakhardev (Authored by teacher_jane, scheduled for August 2026)
INSERT INTO online_tests (quiz_id, snapshot_id, description, access_code, start_at, end_at, time_limit_minutes, max_points) VALUES
('c3333333-3333-4333-8333-333333333333', '777e8400-e29b-41d4-a716-446655447777', 'Upcoming final exam on the Roman Empire.', 'ROME2026', '2026-08-15 08:00:00', '2026-08-15 10:00:00', 60, 1);

-- 4.4 Ongoing test hosted by azakhardev (Ends tomorrow, emma_watson took it early)
INSERT INTO online_tests (quiz_id, snapshot_id, description, access_code, start_at, end_at, time_limit_minutes, max_points) VALUES
('222e8400-e29b-41d4-a716-446655442222', '444e8400-e29b-41d4-a716-446655444444', 'Welcome to my test about React Native.', 'REACT123', '2026-07-23 08:00:00', '2026-07-24 12:00:00', 15, 3);


-- 5. TEST SUBMISSIONS 
-- azakhardev takes REACTADV (Historical)
INSERT INTO test_submissions (test_id, user_id, submission_id, submitted_at, total_gained_points) VALUES
((SELECT id FROM online_tests WHERE access_code = 'REACTADV'), (SELECT id FROM users WHERE username = 'azakhardev'), 'aaa14a2e-4b47-41ab-9b34-8c8511671aaa', '2026-06-10 10:45:00', 1.0);

-- john_smith takes ARCH2026 (Historical - Hosted by azakhardev)
INSERT INTO test_submissions (test_id, user_id, submission_id, submitted_at, total_gained_points) VALUES
((SELECT id FROM online_tests WHERE access_code = 'ARCH2026'), (SELECT id FROM users WHERE username = 'john_smith'), 'f5b21c4d-9e68-45fc-a128-3c4d5e6f7a8b', '2026-06-20 10:50:00', 2.5);

-- emma_watson takes REACT123 (Ongoing - Hosted by azakhardev)
INSERT INTO test_submissions (test_id, user_id, submission_id, submitted_at, total_gained_points) VALUES
((SELECT id FROM online_tests WHERE access_code = 'REACT123'), (SELECT id FROM users WHERE username = 'emma_watson'), 'e7c32d5e-0f79-46fd-b239-4d5e6f7a8b9c', '2026-07-23 09:10:00', 3.0);


-- 6. PRACTICE HISTORY
INSERT INTO practice_history (user_id, quiz_id, mode, started_at ,completed_at, duration_minutes, total_questions, total_answers, correct_answers) VALUES
((SELECT id FROM users WHERE username = 'azakhardev'), '111e8400-e29b-41d4-a716-446655441111', 'PRACTICE',NOW() - INTERVAL '1 hour', NOW() ,320, 4, 4, 3),
((SELECT id FROM users WHERE username = 'azakhardev'), '550e8400-e29b-41d4-a716-446655440000', 'FLASHCARDS',NOW() - INTERVAL '30 minute', NOW() ,120, 2, 2, 2);