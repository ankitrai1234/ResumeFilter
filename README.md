# Resume Filter for HRs

## Overview

Resume Filter for HRs is a tool that helps recruiters automatically analyze and rank resumes based on job requirements.
It reduces the time spent manually reviewing resumes by using intelligent filtering and similarity matching.

## Features

* Upload and analyze resumes
* Extract important information from resumes
* Match resumes with job descriptions
* Rank candidates based on relevance
* User-friendly interface for HR teams

## Tech Stack

* **Frontend:** React.js
* **Backend:** FastAPI (Python)
* **Machine Learning / NLP:** Python-based models for resume analysis
* **Database:** (Add your database here if used)

## Project Structure

```
ResumeFilter/
│
├── backend-fastapi/     # FastAPI backend for processing resumes
├── frontend/            # React frontend for the user interface
├── docker-compose.yml   # Docker configuration
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ResumeFilter.git
cd ResumeFilter
```

### 2. Backend Setup

```bash
cd backend-fastapi
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Usage

1. Start the backend server.
2. Start the frontend application.
3. Upload resumes and a job description.
4. The system will analyze and rank candidates based on similarity.

## Future Improvements

* Better resume parsing
* More accurate ranking models
* Integration with ATS systems
* Dashboard analytics for HR teams

## Contributors

* Ankit Rai
 
