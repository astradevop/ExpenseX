# Django Expense Manager Backend

A complete expense manager backend built with Django and Django REST Framework. This project demonstrates DRF expertise with basic CRUD operations for managing expenses, categories, and budgets.

## Project Overview

This is a RESTful API backend for an expense management system. It provides endpoints for:
- User authentication (registration and login)
- Category management
- Expense tracking
- Budget management

All endpoints are designed for Postman testing and use Token authentication.

## Technology Stack

- **Django 5.2.8** - Web framework
- **Django REST Framework 3.16.1** - REST API framework
- **SQLite** - Database (for simplicity)
- **Token Authentication** - Simple authentication for API testing

## Project Structure

```
expense-rest/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── expense_manager/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── expenses/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── migrations/
│   └── accounts/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       └── migrations/
├── frontend/
│   └── (empty - for future use)
└── .venv/
```

## Setup Instructions

### Prerequisites

- Python 3.12+
- Virtual environment (already exists in `.venv/`)

### Installation

1. **Activate the existing virtual environment:**
   ```bash
   # Windows PowerShell
   .venv\Scripts\Activate.ps1
   
   # Windows CMD
   .venv\Scripts\activate.bat
   
   # Linux/Mac
   source .venv/bin/activate
   ```

2. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

3. **Install dependencies (if not already installed):**
   ```bash
   pip install django djangorestframework
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser (optional, for admin access):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://127.0.0.1:8000/`

## API Endpoints

### Authentication Endpoints

#### 1. User Registration
- **URL:** `POST /api/register/`
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword123",
    "password2": "securepassword123"
  }
  ```
- **Response:**
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "date_joined": "2025-01-07T10:00:00Z",
      "last_login": null
    },
    "token": "abc123def456...",
    "message": "User registered successfully"
  }
  ```

#### 2. User Login
- **URL:** `POST /api/login/`
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response:**
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "date_joined": "2025-01-07T10:00:00Z",
      "last_login": "2025-01-07T10:00:00Z"
    },
    "token": "abc123def456...",
    "message": "Login successful"
  }
  ```

#### 3. User Profile
- **URL:** `GET /api/profile/`
- **Authentication:** Required (Token)
- **Headers:** `Authorization: Token <your_token>`
- **Response:**
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "date_joined": "2025-01-07T10:00:00Z",
    "last_login": "2025-01-07T10:00:00Z"
  }
  ```

### Category Endpoints

#### 1. List Categories
- **URL:** `GET /api/categories/`
- **Authentication:** Required (Token)
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "Food",
      "description": "Food and dining expenses",
      "created_at": "2025-01-07T10:00:00Z",
      "updated_at": "2025-01-07T10:00:00Z"
    }
  ]
  ```

#### 2. Create Category
- **URL:** `POST /api/categories/`
- **Authentication:** Required (Token)
- **Request Body:**
  ```json
  {
    "name": "Transportation",
    "description": "Transportation expenses"
  }
  ```

#### 3. Get Category Detail
- **URL:** `GET /api/categories/<id>/`
- **Authentication:** Required (Token)

#### 4. Update Category
- **URL:** `PUT /api/categories/<id>/` or `PATCH /api/categories/<id>/`
- **Authentication:** Required (Token)

#### 5. Delete Category
- **URL:** `DELETE /api/categories/<id>/`
- **Authentication:** Required (Token)

### Expense Endpoints

#### 1. List Expenses
- **URL:** `GET /api/expenses/`
- **Authentication:** Required (Token)
- **Response:** Returns only expenses for the authenticated user
  ```json
  [
    {
      "id": 1,
      "user": 1,
      "user_email": "user@example.com",
      "category": {
        "id": 1,
        "name": "Food",
        "description": "Food and dining expenses",
        "created_at": "2025-01-07T10:00:00Z",
        "updated_at": "2025-01-07T10:00:00Z"
      },
      "amount": "50.00",
      "description": "Lunch at restaurant",
      "date": "2025-01-07",
      "created_at": "2025-01-07T10:00:00Z",
      "updated_at": "2025-01-07T10:00:00Z"
    }
  ]
  ```

#### 2. Create Expense
- **URL:** `POST /api/expenses/`
- **Authentication:** Required (Token)
- **Request Body:**
  ```json
  {
    "category_id": 1,
    "amount": "50.00",
    "description": "Lunch at restaurant",
    "date": "2025-01-07"
  }
  ```
- **Note:** The `user` field is automatically set to the authenticated user

#### 3. Get Expense Detail
- **URL:** `GET /api/expenses/<id>/`
- **Authentication:** Required (Token)

#### 4. Update Expense
- **URL:** `PUT /api/expenses/<id>/` or `PATCH /api/expenses/<id>/`
- **Authentication:** Required (Token)

#### 5. Delete Expense
- **URL:** `DELETE /api/expenses/<id>/`
- **Authentication:** Required (Token)

### Budget Endpoints

#### 1. List Budgets
- **URL:** `GET /api/budgets/`
- **Authentication:** Required (Token)
- **Response:** Returns only budgets for the authenticated user

#### 2. Create Budget
- **URL:** `POST /api/budgets/`
- **Authentication:** Required (Token)
- **Request Body:**
  ```json
  {
    "category_id": 1,
    "amount": "500.00",
    "period": "monthly",
    "start_date": "2025-01-01",
    "end_date": "2025-01-31"
  }
  ```
- **Note:** `category_id` is optional (null for overall budget)

#### 3. Get Budget Detail
- **URL:** `GET /api/budgets/<id>/`
- **Authentication:** Required (Token)

#### 4. Update Budget
- **URL:** `PUT /api/budgets/<id>/` or `PATCH /api/budgets/<id>/`
- **Authentication:** Required (Token)

#### 5. Delete Budget
- **URL:** `DELETE /api/budgets/<id>/`
- **Authentication:** Required (Token)

## Postman Testing Guide

### Setting Up Postman

1. **Create a new Collection** named "Expense Manager API"

2. **Set Collection Variables:**
   - `base_url`: `http://127.0.0.1:8000`
   - `token`: (will be set after login)

3. **Create Environment Variables:**
   - `token`: (will be set after login)

### Testing Flow

1. **Register a User:**
   - Method: POST
   - URL: `{{base_url}}/api/register/`
   - Body: JSON with user details
   - Save the `token` from response

2. **Login (Alternative):**
   - Method: POST
   - URL: `{{base_url}}/api/login/`
   - Body: JSON with email and password
   - Save the `token` from response

3. **Set Authorization Header:**
   - For all authenticated endpoints, add header:
     - Key: `Authorization`
     - Value: `Token {{token}}`

4. **Test CRUD Operations:**
   - Create a category
   - Create an expense
   - Create a budget
   - List all items
   - Update items
   - Delete items

### Example Postman Request

**Create Expense:**
```
POST http://127.0.0.1:8000/api/expenses/
Headers:
  Authorization: Token abc123def456...
  Content-Type: application/json
Body:
{
  "category_id": 1,
  "amount": "50.00",
  "description": "Lunch at restaurant",
  "date": "2025-01-07"
}
```

## Models

### User Model
- Custom user model with email as username
- Fields: email, first_name, last_name, password, etc.

### Category Model
- Fields: name (unique), description, created_at, updated_at

### Expense Model
- Fields: user (FK), category (FK), amount, description, date, timestamps
- Each user can only see their own expenses

### Budget Model
- Fields: user (FK), category (FK, optional), amount, period, start_date, end_date, timestamps
- Category can be null for overall budget

## Authentication

The API uses **Token Authentication** from Django REST Framework. 

- Tokens are created automatically when a user registers
- Include the token in the `Authorization` header for all authenticated requests
- Format: `Authorization: Token <your_token>`

## Permissions

- All endpoints (except registration and login) require authentication
- Users can only access their own expenses and budgets
- Categories are shared across all users

## Future Enhancements

See `LEARNING_GUIDE.md` for planned features:
- Spending Analysis endpoint
- Pagination
- Filtering and Search
- Advanced Permissions
- Throttling
- JWT Authentication

## Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
```

### Applying Migrations
```bash
python manage.py migrate
```

### Accessing Admin Panel
1. Create superuser: `python manage.py createsuperuser`
2. Visit: `http://127.0.0.1:8000/admin/`

## Deployment to Render

This project is configured for deployment on Render. Both the backend (Django) and frontend (React) can be deployed using the provided `render.yaml` configuration file.

### Prerequisites

- A Render account (sign up at [render.com](https://render.com))
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Quick Deploy with render.yaml

1. **Push your code to Git:**
   ```bash
   git add .
   git commit -m "Configure for Render deployment"
   git push origin main
   ```

2. **Connect to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Blueprint"
   - Connect your Git repository
   - Render will automatically detect the `render.yaml` file

3. **Deploy:**
   - Render will create all services defined in `render.yaml`:
     - Backend Web Service (Django)
     - Frontend Static Site (React)
     - PostgreSQL Database
   - The deployment will start automatically

### Manual Setup (Alternative)

If you prefer to set up services manually:

#### Backend Setup

1. **Create a new Web Service:**
   - Go to Render Dashboard → "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name:** `expense-backend`
     - **Environment:** `Python 3`
     - **Build Command:** `cd backend && pip install -r requirements.txt && chmod +x build.sh && ./build.sh`
     - **Start Command:** `cd backend && gunicorn core.wsgi:application --bind 0.0.0.0:$PORT`

2. **Create PostgreSQL Database:**
   - Go to "New +" → "PostgreSQL"
   - Name it `expense-db`
   - Note the connection string

3. **Set Environment Variables:**
   - `SECRET_KEY`: Generate a secure Django secret key
   - `DEBUG`: `False`
   - `DATABASE_URL`: Use the PostgreSQL connection string from step 2
   - `ALLOWED_HOSTS`: Your Render backend URL (e.g., `expense-backend.onrender.com`)
   - `CORS_ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://expense-frontend.onrender.com`)

#### Frontend Setup

1. **Create a new Static Site:**
   - Go to "New +" → "Static Site"
   - Connect your repository
   - Configure:
     - **Name:** `expense-frontend`
     - **Build Command:** `cd frontend && npm install && npm run build`
     - **Publish Directory:** `frontend/dist`

2. **Set Environment Variables:**
   - `VITE_API_BASE_URL`: Your backend URL (e.g., `https://expense-backend.onrender.com`)

### Environment Variables Reference

#### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key (auto-generated in render.yaml) | `django-insecure-...` |
| `DEBUG` | Debug mode (set to `False` in production) | `False` |
| `DATABASE_URL` | PostgreSQL connection string (auto-set from database) | `postgresql://...` |
| `ALLOWED_HOSTS` | Comma-separated list of allowed hosts | `expense-backend.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `https://expense-frontend.onrender.com` |

#### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://expense-backend.onrender.com` |

### Post-Deployment

1. **Create a superuser (if needed):**
   - Use Render's Shell feature to run:
     ```bash
     cd backend
     python manage.py createsuperuser
     ```

2. **Access your application:**
   - Frontend: `https://expense-frontend.onrender.com`
   - Backend API: `https://expense-backend.onrender.com/api/`
   - Admin Panel: `https://expense-backend.onrender.com/admin/`

### Troubleshooting

- **Build fails:** Check build logs in Render dashboard
- **Database connection errors:** Verify `DATABASE_URL` is set correctly
- **CORS errors:** Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
- **Static files not loading:** Verify WhiteNoise is configured and static files are collected

### Notes

- The free tier on Render spins down after 15 minutes of inactivity
- First request after spin-down may take longer
- Consider upgrading to a paid plan for production use
- Media files (uploaded images) are stored on the server filesystem and will be lost on redeploy
- For production, consider using cloud storage (AWS S3, Cloudinary) for media files

## License

This project is for educational purposes.



