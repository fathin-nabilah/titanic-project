# titanic-project

This project visualizes Titanic passenger data using a frontend built with Angular and a backend built with Node.js and MySQL.

--- 

## Access Points
- **Frontend (Angular Web Application):** [http://localhost:4200]
- **Backend (API):** [http://localhost:3000/api/passengers]

--
## Setup

### Prerequisites
Ensure you have the following installed on your machine:
- **Docker** and **Docker Compose**
- Optional: **Node.js** and **npm** (if running without Docker)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/fathin-nabilah/titanic-project.git
   cd titanic-project
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your database credentials, if needed.

3. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```

4. Access the web application at `http://localhost:4200`.

5. Test the API at `http://localhost:3000/api/passengers`.