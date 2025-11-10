from django.contrib import admin
from .models import ExpenseModel

@admin.register(ExpenseModel)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['expense_id', 'expense_name', 'expense_amount', 'expense_category', 'expense_date']
    list_filter = ['expense_category', 'expense_date']
    search_fields = ['expense_name', 'expense_category']
    date_hierarchy = 'expense_date'
