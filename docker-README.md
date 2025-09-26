# Docker Setup

This application can be run using Docker and Docker Compose.

## Quick Start

1. Clone the repository
2. (Optional) Copy the environment file and add your OpenAI API key:
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```
3. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Access the application at `http://localhost:3000`

## Environment Variables

- `OPENAI_API_KEY` (optional): Required for AI-powered quiz generation feature
  - Get your API key from: https://platform.openai.com/api-keys
  - The app will work without this key, but quiz generation won't be available

## Docker Commands

```bash
# Build and start the application
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d --build

# Stop the application
docker-compose down

# View logs
docker-compose logs

# Build only (without running)
docker-compose build
```

## Volume Persistence

Quiz data is stored in a Docker volume named `quiz-data` which persists between container restarts. To reset all quiz data:

```bash
docker-compose down
docker volume rm mathequiz_quiz-data
```

## Troubleshooting

If you encounter build issues:

1. Make sure Docker and Docker Compose are installed
2. Try rebuilding without cache: `docker-compose build --no-cache`
3. Check that no other services are running on port 3000