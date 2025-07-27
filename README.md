# Full-Stack File Processing Platform

A scalable, modular full-stack platform built with **Django (backend)** and **Next.js (frontend)** for file compression, conversion, and AI-powered summarization. Includes user authentication, multi-tool workflows, and support for system storage.

---

## Table of Contents

- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Code Structure](#code-structure)
- [Features](#features)
- [Testing](#testing)
- [Services](#services)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## System Requirements

### Backend
- **Python**: 3.10+
- **Django**: 4.x
- **PostgreSQL**: 13+
- **Redis**: for caching & task queue
- **Pillow / ffmpeg / GhostScript**: for image/file processing and PDF manipulation

### Frontend
- **Node.js**: 18+
- **Next.js**: 14+
- **Tailwind CSS**: for styling

---

## Installation

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd <project-directory>
```

---

### 2. Backend Setup (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp apps/.env.example apps/.env
```

Update your `.env` and `apps/settings.py` with your database, Redis, and AWS credentials.

---

### 3. Frontend Setup (Next.js)

```bash
cd frontend
npm install
```

---

## Configuration

### Django Environment Variables (`backend/.env`)

```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
REDIS_URL=redis://localhost:6379
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## Database Setup

```bash
cd backend
source venv/bin/activate

# Create and migrate
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

---

## Running the Application

### Development

#### Backend

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

#### Frontend

```bash
cd frontend
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## Code Structure

### Backend (`/backend`)

```
backend/
├── ai_engine/         # AI summarization services
├── authentication/    # Auth views and models
├── compression/       # File compression logic
├── conversion/        # File conversion logic
├── common/            # Shared logic/utilities
├── files/             # File upload and metadata
├── users/             # User profile management
├── middlewares/       # Custom exception handlers, API responses
├── apps/              # Django project settings
├── media/             # Uploaded / processed files
├── manage.py
```

### Frontend (`/frontend`)

```
frontend/
├── public/            # Static icons
├── src/
│   ├── app/           # Pages (Next.js routing)
│   ├── components/    # Reusable UI components
│   ├── context/       # Auth and Dark Mode context
│   └── globals.css    # Tailwind styles
|   ├── lib
```

---

## Features

### Core

- User authentication (signup, login)
- File upload & preview
- File compression (e.g., zip, gzip, tar)
- File conversion (e.g., pdf → docx, image formats)
- AI text summarization (using APIs)
- Downloadable processed files

### Technical

- REST API with Django REST Framework
- Task queue support with Celery + Redis
- JWT-based authentication
- Modular service layers
- Scalable multi-tool architecture

---

## Testing

### Backend

```bash
cd backend
source venv/bin/activate
python manage.py test
```

### Frontend

```bash
cd frontend
npm run test
```

---

## Services

- **Redis**: for caching and task broker
- **Pillow / ffmpeg**: for image/audio/video manipulation

---

## Troubleshooting

| Problem | Solution |
|--------|----------|
| Redis not running | `redis-server` or check Docker service |
| DB connection errors | Verify `.env` and PostgreSQL is running |
| 500 errors | Check logs in `logs/app.log` |
| Upload fails | Check `media/` permissions or AWS config |

---

## Contributing

1. Fork this repository
2. Create a new feature branch (`git checkout -b feature-name`)
3. Commit your changes
4. Submit a pull request

---

## License

[MIT License](LICENSE) — feel free to modify and use commercially.