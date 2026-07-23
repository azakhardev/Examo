-- =================================================================================
-- DROP AND RESET SCRIPT FOR EXAMO POSTGRESQL DATABASE
-- This script safely removes all data and resets all auto-incrementing IDs (serial)
-- back to 1, ensuring that user_id references remain stable for fresh inserts.
-- =================================================================================

-- Using TRUNCATE with RESTART IDENTITY and CASCADE.
-- CASCADE forces the truncation of any tables that have foreign key references
-- to the targeted tables. RESTART IDENTITY resets the sequences (e.g., serial/bigserial).

TRUNCATE TABLE 
    users, 
    quizzes, 
    online_tests, 
    test_submissions, 
    practice_history, 
    quiz_shares, 
    quiz_blocks 
RESTART IDENTITY CASCADE;

-- Note: We do not need to explicitly DROP the tables unless you are altering the schema.
-- TRUNCATE is much faster and cleaner for resetting the database state during development
-- while preserving the table structures and foreign key relationships.

-- If you absolutely MUST drop the tables entirely (e.g., to rebuild the schema from scratch),
-- uncomment the block below. Note that dropping tables means you will have to run your 
-- CREATE TABLE script again before inserting data.

/*
DROP TABLE IF EXISTS test_submissions CASCADE;
DROP TABLE IF EXISTS practice_history CASCADE;
DROP TABLE IF EXISTS quiz_shares CASCADE;
DROP TABLE IF EXISTS quiz_blocks CASCADE;
DROP TABLE IF EXISTS online_tests CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
*/