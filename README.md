# AI Resume Analyzer

AI Resume Analyzer is a full-stack resume analysis platform that helps users evaluate resumes for ATS readiness, job-role matching, missing skills, improvement suggestions, and interview preparation.

The project includes a secure Node.js/Express/MongoDB backend and a modern React/Vite frontend with a premium dark SaaS dashboard UI.

## Features

- User registration and login
- JWT-based authentication
- Secure password hashing using bcrypt
- PDF and DOCX resume upload
- Resume text extraction
- ATS score calculation
- Job match score calculation
- Role-based required skill matching
- Missing skills and keyword detection
- Section-wise resume scoring
- Score justification with improvement guidance
- AI-style resume suggestions
- Interview preparation questions
- Analysis history
- Delete saved analysis history
- Delete saved resume files
- PDF report download
- Privacy-focused upload flow
- Premium responsive dark dashboard UI

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Recharts
- Framer Motion
- React Icons
- jsPDF

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- pdf-parse
- Mammoth
- dotenv
- cors
- helmet
- express-rate-limit
- nodemon

## Project Structure

```text
AI-Resume-Analyzer/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── src/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── data/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/resume_analyzer
JWT_SECRET=replace_this_with_a_long_random_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://127.0.0.1:5173
MAX_FILE_SIZE_MB=5
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

## Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://127.0.0.1:5173
```

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Resume Analysis

```http
POST /api/analyze-resume
```

### Analysis History

```http
GET /api/analysis-history
DELETE /api/analysis-history
GET /api/analysis/:id
DELETE /api/analysis/:id
```

### Interview Questions

```http
POST /api/generate-interview-questions
```

### Privacy Actions

```http
DELETE /api/resume-files
```

## Usage Flow

1. Register or login.
2. Upload a PDF or DOCX resume.
3. Enter candidate name.
4. Enter target role, such as `Full Stack Developer`.
5. Paste a job description.
6. Choose whether to save the analysis to history.
7. Analyze the resume.
8. View ATS score, job match score, required skills, missing skills, suggestions, and interview questions.

## Privacy

Uploaded resumes are used only for analysis. Files are deleted after analysis unless the user chooses to save the analysis to history.

The save-to-history option is unchecked by default.

## Author

Developed by Shri-raksha04.
