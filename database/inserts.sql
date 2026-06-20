-- =================================================================================
-- INITIAL DUMMY DATA FOR EXAMO POSTGRESQL DATABASE
-- All passwords are encrypted using BCrypt.
-- The plain text password for all accounts is: '123456'
-- =================================================================================

-- 1. USERS (1 Teacher, 1 Developer/Author, 8 Students)
-- Using auto-generated serial IDs.
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
INSERT INTO quizzes (id, name, description, author_id, visibility) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Database Fundamentals', 'Preparation for the final exam.', (SELECT id FROM users WHERE username = 'teacher_jane'), 'PUBLIC'),
('111e8400-e29b-41d4-a716-446655441111', 'Software Architecture Patterns', 'Advanced microservices quiz.', (SELECT id FROM users WHERE username = 'teacher_jane'), 'PRIVATE'),
('222e8400-e29b-41d4-a716-446655442222', 'React Native & Expo Basics', 'My personal React Native testing deck.', (SELECT id FROM users WHERE username = 'azakhardev'), 'RESTRICTED');

-- 3. ACCESS CONTROL (Sharing and Blocking for azakhardev's quiz)
-- Sharing the restricted quiz with John and Emma
INSERT INTO quiz_shares (quiz_id, user_id, access_level) VALUES
('222e8400-e29b-41d4-a716-446655442222', (SELECT id FROM users WHERE username = 'john_smith'), 'READ'),
('222e8400-e29b-41d4-a716-446655442222', (SELECT id FROM users WHERE username = 'emma_watson'), 'EDIT');

-- Blocking Michael and Sarah from accessing the quiz
INSERT INTO quiz_blocks (quiz_id, user_id) VALUES
('222e8400-e29b-41d4-a716-446655442222', (SELECT id FROM users WHERE username = 'michael_b')),
('222e8400-e29b-41d4-a716-446655442222', (SELECT id FROM users WHERE username = 'sarah_connor'));

-- 4. ONLINE TESTS (Live test instances launched by teachers)
-- Teacher Jane launches the Architecture test
INSERT INTO online_tests (quiz_id, snapshot_id, access_code, start_at, end_at, time_limit_minutes) VALUES
('111e8400-e29b-41d4-a716-446655441111', '333e8400-e29b-41d4-a716-446655443333', 'ARCH2026', '2026-06-20 10:00:00', '2026-06-20 12:00:00', 30);

-- Artem launches his React Native test for friends
INSERT INTO online_tests (quiz_id, snapshot_id, access_code, start_at, end_at, time_limit_minutes) VALUES
('222e8400-e29b-41d4-a716-446655442222', '444e8400-e29b-41d4-a716-446655444444', 'REACT123', '2026-06-20 12:00:00', '2026-06-21 12:00:00', 15);

-- 5. TEST SUBMISSIONS (Records of users who submitted the test)
INSERT INTO test_submissions (test_id, user_id, submitted_at, total_gained_points) VALUES
((SELECT id FROM online_tests WHERE access_code = 'ARCH2026'), (SELECT id FROM users WHERE username = 'azakhardev'), '2026-06-20 10:45:00', 7.0),
((SELECT id FROM online_tests WHERE access_code = 'ARCH2026'), (SELECT id FROM users WHERE username = 'john_smith'), '2026-06-20 10:50:00', 2.5),
((SELECT id FROM online_tests WHERE access_code = 'REACT123'), (SELECT id FROM users WHERE username = 'emma_watson'), '2026-06-20 13:10:00', 5.0);

-- 6. STUDENT ANSWERS (Detailed audit trail for azakhardev's submission in ARCH2026 test)
-- The question_id must map to the inner IDs inside the MongoDB test snapshot document
INSERT INTO student_answers (submission_id, question_id, student_answer_text, gained_points) VALUES
((SELECT id FROM test_submissions WHERE user_id = (SELECT id FROM users WHERE username = 'azakhardev') AND test_id = (SELECT id FROM online_tests WHERE access_code = 'ARCH2026')), 'q1', 'Controller', 1.0),
((SELECT id FROM test_submissions WHERE user_id = (SELECT id FROM users WHERE username = 'azakhardev') AND test_id = (SELECT id FROM online_tests WHERE access_code = 'ARCH2026')), 'q2', 'Independently deployable, Organized around business capabilities', 4.0),
((SELECT id FROM test_submissions WHERE user_id = (SELECT id FROM users WHERE username = 'azakhardev') AND test_id = (SELECT id FROM online_tests WHERE access_code = 'ARCH2026')), 'q3', 'YES', -1.0),
((SELECT id FROM test_submissions WHERE user_id = (SELECT id FROM users WHERE username = 'azakhardev') AND test_id = (SELECT id FROM online_tests WHERE access_code = 'ARCH2026')), 'q4', 'Consistency, Availability, Partition tolerance', 3.0);

-- 7. PRACTICE HISTORY (Offline/Solo learning statistics)
INSERT INTO practice_history (user_id, quiz_id, mode, duration_seconds, total_questions, total_answers, correct_answers) VALUES
((SELECT id FROM users WHERE username = 'azakhardev'), '111e8400-e29b-41d4-a716-446655441111', 'PRACTICE', 320, 4, 4, 3),
((SELECT id FROM users WHERE username = 'azakhardev'), '550e8400-e29b-41d4-a716-446655440000', 'FLASHCARDS', 120, 2, 2, 2);