from django.db import models

class ExpenseModel(models.Model):
    expense_id = models.AutoField(primary_key=True)
    expense_name = models.CharField(max_length=100)
    expense_amount = models.IntegerField()
    expense_category = models.CharField(max_length=100)
    expense_date = models.DateField()
    expense_image = models.ImageField(upload_to='expense_image/', blank=True, null=True)

    class Meta:
        db_table = 'expense'
