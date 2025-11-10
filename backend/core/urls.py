from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from expenses import api_views


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Expense API endpoints
    path('api/view', api_views.view_expense),
    path('api/one/<int:id>', api_views.one_expense),
    path('api/add', api_views.add_expense_api),
    path('api/update/<int:id>', api_views.update_expense_api),
    path('api/delete/<int:id>', api_views.delete_expense_api),
    path('api/search', api_views.search_expense_api),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

