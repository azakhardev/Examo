CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "username" varchar(256) UNIQUE NOT NULL,
  "name" varchar(256),
  "surname" varchar(256),
  "email" varchar(512) UNIQUE NOT NULL,
  "password" varchar(512) NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "quizzes" (
  "id" uuid PRIMARY KEY,
  "name" varchar(256) NOT NULL,
  "description" text,
  "author_id" integer NOT NULL,
  "visibility" varchar(50) DEFAULT 'PRIVATE',
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "online_tests" (
  "id" bigserial PRIMARY KEY,
  "quiz_id" uuid NOT NULL,
  "snapshot_id" uuid NOT NULL,
  "access_code" varchar(10) UNIQUE NOT NULL,
  "title" varchar(256) NOT NULL DEFAULT "Missing title",
  "description" text default null,
  "start_at" timestamp NOT NULL,
  "end_at" timestamp NOT NULL,
  "time_limit_minutes" integer NOT NUL
  "allow_review" boolean DEFAULT true
);

CREATE TABLE "test_submissions" (
  "id" bigserial PRIMARY KEY,
  "test_id" bigint NOT NULL,
  "user_id" integer NOT NULL,
  "submitted_at" timestamp NOT NULL DEFAULT (now()),
  "total_gained_points" float DEFAULT 0
);

CREATE TABLE "student_answers" (
  "id" bigserial PRIMARY KEY,
  "submission_id" bigint NOT NULL,
  "question_id" varchar(64) NOT NULL,
  "student_answer_text" text,
  "gained_points" float DEFAULT 0
);

CREATE TABLE "practice_history" (
  "id" bigserial PRIMARY KEY,
  "user_id" integer NOT NULL,
  "quiz_id" uuid NOT NULL,
  "mode" varchar(50) NOT NULL,
  "started_at" timestamp NOT NULL DEFAULT (now())
  "completed_at" timestamp,
  "duration_minutes" integer,
  "total_questions" integer NOT NULL,
  "total_answers" integer,
  "correct_answers" integer
);

CREATE TABLE "quiz_shares" (
  "id" bigserial PRIMARY KEY,
  "quiz_id" uuid NOT NULL,
  "user_id" integer NOT NULL,
  "access_level" varchar(50) DEFAULT 'READ'
  "favorite" boolean DEFAULT false
);

CREATE TABLE "quiz_blocks" (
  "id" bigserial PRIMARY KEY,
  "quiz_id" uuid NOT NULL,
  "user_id" integer NOT NULL,
  "blocked_at" timestamp DEFAULT (now())
);

ALTER TABLE "quizzes" ADD FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "online_tests" ADD FOREIGN KEY ("quiz_id") REFERENCES "quizzes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "test_submissions" ADD FOREIGN KEY ("test_id") REFERENCES "online_tests" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "test_submissions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "student_answers" ADD FOREIGN KEY ("submission_id") REFERENCES "test_submissions" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "practice_history" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "practice_history" ADD FOREIGN KEY ("quiz_id") REFERENCES "quizzes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "quiz_shares" ADD FOREIGN KEY ("quiz_id") REFERENCES "quizzes" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "quiz_shares" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "quiz_blocks" ADD FOREIGN KEY ("quiz_id") REFERENCES "quizzes" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "quiz_blocks" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;
