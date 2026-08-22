#!/bin/bash
echo "Importing MongoDB collections..."

# Collections that are JSON arrays
mongoimport --host localhost --db examo --collection quizzes --type json --file /init-data/examo.quizzes.json --jsonArray
mongoimport --host localhost --db examo --collection quiz_snapshots --type json --file /init-data/examo.quiz_snapshots.json --jsonArray
mongoimport --host localhost --db examo --collection test_submissions --type json --file /init-data/examo.test_submissions.json --jsonArray

# Collection that is a single JSON object
mongoimport --host localhost --db examo --collection test_sessions --type json --file /init-data/examo.test_sessions.json

echo "MongoDB initialization complete!"