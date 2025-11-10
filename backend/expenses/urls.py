from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    ExpenseListCreateView,
    ExpenseDetailView,
    BudgetListCreateView,
    BudgetDetailView,
)

app_name = 'expenses'

urlpatterns = [
    # Category endpoints
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    
    # Expense endpoints
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),
    
    # Budget endpoints
    path('budgets/', BudgetListCreateView.as_view(), name='budget-list-create'),
    path('budgets/<int:pk>/', BudgetDetailView.as_view(), name='budget-detail'),
]



