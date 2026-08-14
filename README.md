# 📱 EXAMO

> ![INFO] Project Status: Abandoned
> This project is currently abandoned due to a lack of motivation and highly complex logic. I could have used more AI, but then this project would have lacked any meaning for me as a learning experience.At the very least, I was able to try mobile development in React Native and successfully work with a NoSQL database in combination with a standard SQL database. Unfortunately, I didn't get my hands on OAuth, PDF creation, QR Code creation, File manipulation, offline mode and WebSockets. Maybe I'll come back to this later (equipped with AI agents). The final roadblock I encountered was with the test creation and submission logic, which required complex algorithms and dealing with messy database data.

A full-stack, feature-rich mobile quiz application designed for both students and teachers. Built as a monorepo combining a cross-platform mobile frontend with a backend.

## 🛠️ Tech Stack & Architecture

- **Frontend:** React Native + Expo (TypeScript, TanStack Query, Expo Router, MMKV)
- **Backend:** Spring Boot (Java, Spring Security, JWT, OAuth2)
- **Databases:**
  - **PostgreSQL:** For structured data (user accounts, authentication, exam history, analytics).
  - **MongoDB:** For schema-less quiz layouts, flexible question types (multiple-choice, open questions), and offline-ready JSON templates.

### 📊 PostgreSQL Database Schema

This database handles users, access management (sharing and blocking), test sessions, practice history and aggregated statistics.

```mermaid

```

### 🍃 MongoDB Collections (NoSQL Document Structure)

Since MongoDB stores schema-flexible BSON documents, we use it to handle the actual quiz content. This allows for rich question formats, dynamic answer options, and immutable test snapshots without duplicating massive amounts of text in PostgreSQL.

#### 1. The `quizzes` Collection

Stores the live, editable quiz definitions. The `_id` matches the `id` of the quiz in the PostgreSQL `quizzes` table.

```json
{
  "id": "UUID (Matches quizzes.id in Postgres)",
  "title": "Database Fundamentals",
  "link": "https://asdfasfd",
  "description": "Preparation for the final exam.",
  "categories": ["IT", "SQL", "Databases"],
  "authorId": 42,
  "author": "Artem Dev",
  "updatedAt": "2026-06-19T18:15:00Z",
  "questions": [
    {
      "id": "q1",
      "type": "SINGLE_CHOICE",
      "questionText": "Which database is purely relational?",
      "options": [
        { "id": "1", "text": "MongoDB", "isCorrect": false },
        { "id": "2", "text": "PostgreSQL", "isCorrect": true },
        { "id": "3", "text": "Redis", "isCorrect": false }
      ],
      "maxPoints": 1.0,
      "negativePoints": 0.5
    },
    {
      "id": "q4",
      "type": "OPEN",
      "questionText": "Which SQL command is used to delete a table?",
      "options": [{ "id": "1", "text": "DROP TABLE", "isCorrect": true }],
      "maxPoints": 2.0,
      "negativePoints": 0.0,
      "imageUrl": "/images/test_UUID/q4.jpg"
    }
  ]
}
```

_Note on Scoring: If a question has negativePoints > 0, the frontend automatically appends a "Skip / Do not answer" option. Skipping a question yields exactly 0 points, overriding negative point deductions._

#### 2. The quiz_snapshots Collection

Immutable snapshots generated the moment a teacher launches a live online_test or generates a PDF. This ensures historical test records remain perfectly intact even if the author modifies the original quiz later.

```json
{
  "id": "UUID (Matches online_tests.snapshot_id in Postgres)",
  "originalQuizId": "UUID",
  "snapshotDate": "2026-06-20T10:00:00",
  "questions": [
    {
      "id": "q1",
      "type": "SINGLE_CHOICE",
      "questionText": "Which database is purely relational?",
      "options": [
        { "id": "1", "text": "MongoDB", "isCorrect": false },
        { "id": "2", "text": "PostgreSQL", "isCorrect": true },
        { "id": "3", "text": "Redis", "isCorrect": false }
      ],
      "maxPoints": 1.0,
      "negativePoints": 0.5
    }
  ]
}
```

_In PostgreSQL, the student_answers.question_id column maps directly to the inner id (e.g., "q1", "q2") of the questions inside this specific snapshot document._

## ✨ Key Features

- **Smart Learning:** Flashcards, Practice mode, and a timed Race mode.
- **Teacher Tools:** Automated PDF test generator with custom page layout and unique test IDs.
- **Seamless Sharing:** Instant quiz sharing via generated QR codes or deep links.
- **Offline First:** Local JSON/XML export and import capabilities using `expo-file-system`.

## Links

- Figma: [Examo](https://www.figma.com/design/IvHsNmpnB761eMDljY8AZ6/Untitled?node-id=0-1&p=f&t=jtLGXAnMlPA03DBp-0)

## Possible Improvements

- Adding pagination
- Autograder based on points criteria
- Cleaner components & use of orval with openapi

## ⏱️ Development Log

**Total Time Invested: ~66.25 hours**

<details>
<summary>Click to view the day-by-day progress</summary>

| Date      | Time Spent | Focus / Milestone                                         |
| :-------- | :--------- | :-------------------------------------------------------- |
| **19.6.** | 3h         | Project initialization & DB schema                        |
| **20.6.** | 2.5h       | Error handling & Login                                    |
| **21.6.** | 3h         | Figma prototyping & MongoDB setup                         |
| **22.6.** | 2h         | Figma prototyping & library research                      |
| **23.6.** | 3.5h       | Figma prototyping & basic layout implementation           |
| **25.6.** | 1h         | Detail page                                               |
| **26.6.** | 2h         | Figma prototyping & Profile Page                          |
| **27.6.** | 3h         | Figma prototyping & Quiz Detail Page                      |
| **28.6.** | 45m        | Figma - Access management                                 |
| **30.6.** | 1.25h      | Figma - Quiz test                                         |
| **1.7.**  | 5h         | Manage Access Screen, Figma, Edit Screen & Layout         |
| **2.7.**  | 3.5h       | Edit Quiz (React Hook Form)                               |
| **3.7.**  | 2h         | Quiz test screen & live test screen                       |
| **5.7.**  | 2.25h      | Practice screen, Test Results & Create test               |
| **7.7.**  | 1.5h       | Join Test & Participate During Test                       |
| **8.7.**  | 2.5h       | Authentication provider, review screen & edit test screen |
| **10.7.** | 1.5h       | Practice Screen (WIP)                                     |
| **11.7.** | 1h         | Practice Screen (Finished)                                |
| **12.7.** | 2h         | Login page & fetch setup                                  |
| **17.7.** | 2.5h       | Quizzes API endpoints                                     |
| **18.7.** | 2h         | Frontend/Backend Filtering, datafix ("no AI" day)         |
| **19.7.** | 2h         | Profile endpoints & Quiz Detail                           |
| **21.7.** | 3.5h       | Data Access management & Favorite toggle                  |
| **23.7.** | 3h         | Foreign tests listing & Detail page                       |
| **24.7.** | 1.75h      | Foreign tests data fetch + Join endpoint                  |
| **25.7.** | 1.75h      | Test Sessions implementation                              |
| **31.7.** | 1.5h       | Generate Test endpoint                                    |
| **14.8.** | 5h         | Submit Test endpoint & Create Unique Test Entity          |

</details>
