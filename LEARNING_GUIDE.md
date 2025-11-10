# Django REST Framework Learning Guide

This comprehensive guide explains the Django REST Framework concepts used in this project, step-by-step implementation, and interview preparation notes.

## Table of Contents

1. [Introduction to DRF](#introduction-to-drf)
2. [Project Structure Explanation](#project-structure-explanation)
3. [Models and Django ORM](#models-and-django-orm)
4. [Serializers Deep Dive](#serializers-deep-dive)
5. [API Views Explained](#api-views-explained)
6. [Authentication and Permissions](#authentication-and-permissions)
7. [URL Routing](#url-routing)
8. [Step-by-Step Implementation](#step-by-step-implementation)
9. [Interview Talking Points](#interview-talking-points)
10. [Best Practices](#best-practices)

---

## Introduction to DRF

### What is Django REST Framework?

Django REST Framework (DRF) is a powerful toolkit for building Web APIs in Django. It provides:
- **Serializers** - Convert complex data types to/from Python native datatypes
- **Views** - Handle HTTP requests and return responses
- **Authentication** - Secure your API endpoints
- **Permissions** - Control who can access what
- **Routers** - Automatically generate URL patterns

### Why Use DRF?

1. **Rapid Development**: Build APIs quickly with minimal code
2. **Serialization**: Easy conversion between Python objects and JSON
3. **Authentication**: Built-in support for multiple authentication methods
4. **Browsable API**: Automatic API documentation
5. **Flexibility**: Works with function-based and class-based views

---

## Project Structure Explanation

```
backend/
├── expense_manager/          # Django project configuration
│   ├── settings.py          # Project settings, DRF config
│   ├── urls.py              # Main URL routing
│   └── wsgi.py              # WSGI configuration
├── expenses/                # Expenses app
│   ├── models.py            # Database models (Category, Expense, Budget)
│   ├── serializers.py       # DRF serializers
│   ├── views.py             # API views
│   ├── urls.py              # App-specific URLs
│   └── admin.py             # Admin interface configuration
└── accounts/                 # Accounts app
    ├── models.py            # Custom User model
    ├── serializers.py       # User serializers
    ├── views.py             # Authentication views
    └── urls.py              # Auth URLs
```

### Why Separate Apps?

- **Separation of Concerns**: Each app handles a specific domain
- **Reusability**: Apps can be reused in other projects
- **Maintainability**: Easier to find and modify code
- **Scalability**: Easy to add new features

---

## Models and Django ORM

### What are Models?

Models are Python classes that represent database tables. They define:
- **Fields**: Database columns
- **Relationships**: Foreign keys, many-to-many, one-to-one
- **Methods**: Business logic

### Our Models Explained

#### 1. User Model (Custom)

```python
class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = None
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
```

**Key Points:**
- Extends Django's `AbstractUser`
- Uses email instead of username for authentication
- `USERNAME_FIELD` tells Django which field to use for login
- `REQUIRED_FIELDS` are fields required when creating superuser

#### 2. Category Model

```python
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Key Points:**
- `unique=True`: Ensures no duplicate category names
- `auto_now_add=True`: Sets timestamp when created
- `auto_now=True`: Updates timestamp on save
- `blank=True, null=True`: Field is optional

#### 3. Expense Model

```python
class Expense(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    date = models.DateField()
```

**Key Points:**
- `ForeignKey`: Creates relationship to User and Category
- `on_delete=models.CASCADE`: If user/category is deleted, delete expenses
- `DecimalField`: Precise decimal storage for money
- `related_name='expenses'`: Access user's expenses via `user.expenses.all()`

#### 4. Budget Model

```python
class Budget(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES)
```

**Key Points:**
- `null=True, blank=True`: Category is optional (for overall budget)
- `choices`: Limits values to predefined options
- Can have budget per category or overall budget

### Django ORM Queries

```python
# Get all expenses for a user
expenses = Expense.objects.filter(user=request.user)

# Get expenses with related category
expenses = Expense.objects.select_related('category').filter(user=request.user)

# Aggregate queries (for future spending analysis)
from django.db.models import Sum
total = Expense.objects.filter(user=request.user).aggregate(Sum('amount'))
```

---

## Serializers Deep Dive

### What are Serializers?

Serializers convert complex data types (like Django models) to/from Python native datatypes that can be easily rendered into JSON, XML, etc.

### Types of Serializers

#### 1. ModelSerializer (Most Common)

```python
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
```

**Key Points:**
- Automatically generates fields based on model
- `fields`: Which fields to include
- `read_only_fields`: Fields that can't be modified via API

#### 2. Nested Serializers

```python
class ExpenseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
```

**Key Points:**
- `category`: Read-only nested representation
- `category_id`: Write-only field for creating/updating
- `source='category'`: Maps to the model's category field
- Allows sending just `category_id` in request, but getting full category in response

#### 3. Custom Fields

```python
user_email = serializers.EmailField(source='user.email', read_only=True)
```

**Key Points:**
- `source`: Where to get the data from
- `read_only=True`: Can't be set directly
- Useful for including related data without nested serializer

#### 4. Validation

```python
def validate(self, attrs):
    if attrs['password'] != attrs['password2']:
        raise serializers.ValidationError({
            "password": "Password fields didn't match."
        })
    return attrs
```

**Key Points:**
- `validate()`: Object-level validation
- `validate_<field>()`: Field-level validation
- Raises `ValidationError` if validation fails

### Serializer Methods

```python
def create(self, validated_data):
    # Custom creation logic
    validated_data['user'] = self.context['request'].user
    return super().create(validated_data)

def update(self, instance, validated_data):
    # Custom update logic
    return super().update(instance, validated_data)
```

**Key Points:**
- `create()`: Called when creating new object
- `update()`: Called when updating existing object
- `self.context`: Access to request, view, etc.
- Override to add custom logic

---

## API Views Explained

### DRF View Types

#### 1. Generic Views (What We Use)

**ListCreateAPIView:**
```python
class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)
```

**What it does:**
- `GET`: Returns list of objects
- `POST`: Creates new object
- `get_queryset()`: Filters data for current user

**RetrieveUpdateDestroyAPIView:**
```python
class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)
```

**What it does:**
- `GET`: Returns single object
- `PUT`: Full update
- `PATCH`: Partial update
- `DELETE`: Delete object

#### 2. APIView (More Control)

```python
from rest_framework.views import APIView
from rest_framework.response import Response

class CustomView(APIView):
    def get(self, request):
        # Custom logic
        return Response({'data': 'value'})
    
    def post(self, request):
        # Custom logic
        return Response({'message': 'created'})
```

**When to use:**
- Need custom logic
- Don't fit generic view patterns
- Complex business logic

#### 3. ViewSets (Advanced)

```python
from rest_framework import viewsets

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
```

**What it does:**
- Provides all CRUD operations automatically
- Works with routers for automatic URL generation
- More concise but less explicit

### View Methods

```python
def get_queryset(self):
    # Customize queryset
    return Expense.objects.filter(user=self.request.user)

def get_serializer_class(self):
    # Use different serializer for different actions
    if self.action == 'list':
        return ExpenseListSerializer
    return ExpenseSerializer

def perform_create(self, serializer):
    # Customize creation
    serializer.save(user=self.request.user)
```

---

## Authentication and Permissions

### Authentication Methods

#### Token Authentication (What We Use)

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}
```

**How it works:**
1. User registers/logs in
2. Token is created and returned
3. Client includes token in `Authorization` header
4. DRF validates token and sets `request.user`

**Request Header:**
```
Authorization: Token abc123def456...
```

#### Other Authentication Methods

- **Session Authentication**: For web apps with cookies
- **JWT Authentication**: Stateless, better for mobile apps
- **Basic Authentication**: Simple username/password (not recommended)

### Permissions

```python
permission_classes = [IsAuthenticated]
```

**Common Permissions:**
- `IsAuthenticated`: User must be logged in
- `AllowAny`: No authentication required
- `IsAdminUser`: Must be admin
- `IsOwner`: Custom permission (for future)

**Custom Permission Example:**
```python
class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
```

---

## URL Routing

### URL Patterns

```python
# expenses/urls.py
urlpatterns = [
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),
]
```

**Key Points:**
- `path()`: Defines URL pattern
- `<int:pk>`: Captures integer as `pk` parameter
- `name`: Used for reverse URL lookup
- `as_view()`: Converts class-based view to function

### URL Inclusion

```python
# expense_manager/urls.py
urlpatterns = [
    path('api/', include('expenses.urls')),
    path('api/', include('accounts.urls')),
]
```

**Key Points:**
- `include()`: Includes URLs from another app
- All URLs prefixed with `/api/`
- Keeps URLs organized by app

### URL Structure

```
/api/expenses/              # List/Create expenses
/api/expenses/1/            # Get/Update/Delete expense with id=1
/api/categories/            # List/Create categories
/api/categories/1/          # Get/Update/Delete category with id=1
/api/budgets/               # List/Create budgets
/api/budgets/1/             # Get/Update/Delete budget with id=1
/api/register/              # User registration
/api/login/                 # User login
/api/profile/               # Get user profile
```

---

## Step-by-Step Implementation

### Step 1: Project Setup

1. **Create Django Project:**
   ```bash
   django-admin startproject expense_manager .
   ```

2. **Create Apps:**
   ```bash
   python manage.py startapp expenses
   python manage.py startapp accounts
   ```

3. **Install DRF:**
   ```bash
   pip install djangorestframework
   ```

4. **Configure Settings:**
   - Add `rest_framework` to `INSTALLED_APPS`
   - Add `rest_framework.authtoken` to `INSTALLED_APPS`
   - Configure `REST_FRAMEWORK` settings
   - Set `AUTH_USER_MODEL`

### Step 2: Create Models

1. **Define Models:**
   - User model (custom)
   - Category model
   - Expense model
   - Budget model

2. **Create Migrations:**
   ```bash
   python manage.py makemigrations
   ```

3. **Apply Migrations:**
   ```bash
   python manage.py migrate
   ```

### Step 3: Create Serializers

1. **Create Serializers:**
   - `CategorySerializer`
   - `ExpenseSerializer` (with nested category)
   - `BudgetSerializer`
   - `UserRegistrationSerializer`
   - `UserLoginSerializer`
   - `UserSerializer`

2. **Add Validation:**
   - Password matching
   - Field validation
   - Custom create/update methods

### Step 4: Create Views

1. **Create Generic Views:**
   - `ListCreateAPIView` for list/create
   - `RetrieveUpdateDestroyAPIView` for detail/update/delete

2. **Add Authentication Views:**
   - Registration view
   - Login view
   - Profile view

3. **Add Permissions:**
   - `IsAuthenticated` for protected endpoints
   - `AllowAny` for registration/login

### Step 5: Create URLs

1. **Create App URLs:**
   - `expenses/urls.py`
   - `accounts/urls.py`

2. **Include in Main URLs:**
   - Add to `expense_manager/urls.py`

### Step 6: Test with Postman

1. **Register User:**
   - POST `/api/register/`
   - Save token

2. **Login:**
   - POST `/api/login/`
   - Save token

3. **Test Endpoints:**
   - Create category
   - Create expense
   - Create budget
   - List all
   - Update/Delete

---

## Interview Talking Points

### 1. Why Django REST Framework?

**Answer:**
- DRF provides powerful serialization that handles complex data types
- Built-in authentication and permissions save development time
- Generic views reduce boilerplate code
- Browsable API for easy testing and documentation
- Flexible - can use function-based or class-based views

### 2. Explain Serializers

**Answer:**
- Serializers convert complex data types to/from JSON
- `ModelSerializer` automatically generates fields from models
- Can nest serializers for related objects
- Support validation at field and object level
- Can customize create/update methods
- Example: We use nested `CategorySerializer` in `ExpenseSerializer` for read, but `category_id` for write

### 3. Generic Views vs APIView

**Answer:**
- **Generic Views**: Less code, follows conventions, good for standard CRUD
  - Example: `ListCreateAPIView` handles GET (list) and POST (create)
- **APIView**: More control, custom logic, better for complex requirements
  - Example: Our login view uses `@api_view` decorator for custom authentication logic
- **ViewSets**: Most concise, works with routers, good for full CRUD on single resource

### 4. Authentication Methods

**Answer:**
- **Token Authentication**: Simple, good for API testing, token stored in database
  - We use this for easy Postman testing
- **JWT**: Stateless, better for mobile apps, tokens contain user info
  - Better for production, planned for future
- **Session**: Good for web apps with cookies
- **OAuth**: For third-party authentication

### 5. Permissions

**Answer:**
- `IsAuthenticated`: User must be logged in (we use this for all endpoints)
- `AllowAny`: No authentication (registration/login)
- Custom permissions: Can check object ownership
  - Example: Users can only see their own expenses (implemented via `get_queryset()`)

### 6. Database Relationships

**Answer:**
- **ForeignKey**: Many-to-one relationship
  - Example: Many expenses belong to one user
- **ManyToMany**: Many-to-many relationship
- **OneToOne**: One-to-one relationship
- `on_delete=models.CASCADE`: Delete related objects when parent is deleted
- `related_name`: Access related objects from parent

### 7. Query Optimization

**Answer:**
- `select_related()`: For ForeignKey (JOIN in SQL)
- `prefetch_related()`: For ManyToMany (separate query)
- `filter()`: Filter queryset
- `get()`: Get single object (raises error if not found)
- `aggregate()`: Calculate sums, averages, etc.

### 8. API Design Principles

**Answer:**
- **RESTful**: Use HTTP methods correctly (GET, POST, PUT, PATCH, DELETE)
- **Consistent URLs**: `/api/expenses/` for list, `/api/expenses/1/` for detail
- **Status Codes**: 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found)
- **JSON Response**: Consistent format
- **Versioning**: Plan for API versioning (v1, v2)

### 9. Security Considerations

**Answer:**
- **Authentication**: All endpoints require token (except registration/login)
- **Permissions**: Users can only access their own data
- **Validation**: Serializers validate input data
- **HTTPS**: Use in production
- **CORS**: Configure for frontend access
- **Rate Limiting**: Throttling (planned for future)

### 10. Testing Strategy

**Answer:**
- **Unit Tests**: Test models, serializers, views
- **Integration Tests**: Test API endpoints
- **Postman**: Manual testing during development
- **Django Test Client**: Automated testing
- **Coverage**: Aim for high test coverage

---

## Best Practices

### 1. Code Organization

- **Separate Apps**: Each app handles specific domain
- **Serializers**: Keep in separate file
- **Views**: Group related views
- **URLs**: One file per app

### 2. Naming Conventions

- **Models**: Singular, PascalCase (`Expense`, `Category`)
- **Serializers**: Model name + "Serializer" (`ExpenseSerializer`)
- **Views**: Descriptive names (`ExpenseListCreateView`)
- **URLs**: RESTful patterns (`/api/expenses/`)

### 3. Error Handling

```python
try:
    expense = Expense.objects.get(id=id)
except Expense.DoesNotExist:
    return Response({'error': 'Not found'}, status=404)
```

### 4. Response Format

```python
# Success
return Response({'data': serializer.data}, status=200)

# Error
return Response({'error': 'message'}, status=400)
```

### 5. Documentation

- **Docstrings**: Document classes and methods
- **Comments**: Explain complex logic
- **README**: Setup and usage instructions
- **API Documentation**: Use DRF's browsable API or Swagger

### 6. Security

- **Never expose sensitive data**: Don't return passwords
- **Validate input**: Use serializer validation
- **Use HTTPS**: In production
- **Rate limiting**: Prevent abuse
- **CORS**: Configure properly

### 7. Performance

- **Query optimization**: Use `select_related()` and `prefetch_related()`
- **Pagination**: For large datasets (planned)
- **Caching**: For frequently accessed data
- **Database indexes**: On frequently queried fields

---

## Future Enhancements

### 1. Spending Analysis

```python
# Aggregate spending by category
from django.db.models import Sum
spending = Expense.objects.filter(user=request.user).values('category').annotate(total=Sum('amount'))
```

### 2. Pagination

```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}
```

### 3. Filtering

```python
from django_filters.rest_framework import DjangoFilterBackend

class ExpenseListCreateView(generics.ListCreateAPIView):
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'date']
```

### 4. Search

```python
from rest_framework.filters import SearchFilter

class ExpenseListCreateView(generics.ListCreateAPIView):
    filter_backends = [SearchFilter]
    search_fields = ['description', 'category__name']
```

### 5. JWT Authentication

```python
# Install: pip install djangorestframework-simplejwt
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
```

---

## Conclusion

This project demonstrates:
- ✅ Django REST Framework fundamentals
- ✅ Model design and relationships
- ✅ Serializer usage and validation
- ✅ Generic views for CRUD operations
- ✅ Token authentication
- ✅ RESTful API design
- ✅ Postman testing

**Next Steps:**
1. Add pagination and filtering
2. Implement spending analysis
3. Add JWT authentication
4. Write unit tests
5. Deploy to production

Happy Learning! 🚀



