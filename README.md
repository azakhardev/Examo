# 📱 EXAMO

A full-stack, feature-rich mobile quiz application designed for both students and teachers. Built as a monorepo combining a cross-platform mobile frontend with a backend.

## 🛠️ Tech Stack & Architecture

- **Frontend:** React Native + Expo (TypeScript, TanStack Query, Expo Router, MMKV)
- **Backend:** Spring Boot (Java/Kotlin, Spring Security, JWT, OAuth2)
- **Databases:**
  - **PostgreSQL:** For structured data (user accounts, authentication, exam history, analytics).
  - **MongoDB:** For schema-less quiz layouts, flexible question types (multiple-choice, open questions), and offline-ready JSON templates.

### 📊 PostgreSQL Database Schema

```mermaid
erDiagram
    users ||--o{ quizzes : "authors"
    users ||--o{ test_submissions : "submits"
    users ||--o{ practice_history : "performs"
    
    quizzes ||--o{ online_tests : "instantiates"
    quizzes ||--o{ practice_history : "tracks"
    
    online_tests ||--o{ test_submissions : "contains"
    test_submissions ||--o{ student_answers : "has"

    users {
        int id PK
        string username
        string name
        string surname
        string email
        string password
        timestamp created_at
    }
    quizzes {
        uuid id PK
        string name
        string description
        int author_id FK
        timestamp created_at
    }
    online_tests {
        bigint id PK
        uuid quiz_id FK
        uuid snapshot_id
        string access_code
        timestamp start_at
        timestamp end_at
        int time_limit_minutes
    }
    test_submissions {
        bigint id PK
        bigint test_id FK
        int user_id FK
        timestamp submitted_at
        float total_gained_points
    }
    student_answers {
        bigint id PK
        bigint submission_id FK
        string question_id
        text student_answer_text
        float gained_points
    }
    practice_history {
        bigint id PK
        int user_id FK
        uuid quiz_id FK
        string mode
        timestamp completed_at
        int duration_seconds
        int total_questions
        int total_answers
        int correct_answers
    }
```

## ✨ Key Features

- **Smart Learning:** Flashcards, Practice mode, and a timed Race mode.
- **Teacher Tools:** Automated PDF test generator with custom page layout and unique test IDs.
- **Seamless Sharing:** Instant quiz sharing via generated QR codes or deep links.
- **Offline First:** Local JSON/XML export and import capabilities using `expo-file-system`.

