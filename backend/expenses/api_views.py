from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ExpenseModel
from .serializers import ExpenseSerializer


@api_view(['GET'])
def view_expense(request):
    expense_obj = ExpenseModel.objects.all()
    expense_serializer = ExpenseSerializer(expense_obj, many=True)
    return Response(expense_serializer.data)


@api_view(['GET'])
def one_expense(request, id):
    try:
        expense_obj = ExpenseModel.objects.get(expense_id=id)
        expense_serializer = ExpenseSerializer(expense_obj)
        return Response(expense_serializer.data)
    except ExpenseModel.DoesNotExist:
        return Response(
            {'error': 'Expense not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
def add_expense_api(request):
    expense_serializer = ExpenseSerializer(data=request.data)
    if expense_serializer.is_valid():
        expense_serializer.save()
        return Response(
            {'message': 'Expense added successfully'}, 
            status=status.HTTP_201_CREATED
        )
    return Response(expense_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_expense_api(request, id):
    try:
        expense_obj = ExpenseModel.objects.get(expense_id=id)
        expense_serializer = ExpenseSerializer(expense_obj, data=request.data, partial=True)
        if expense_serializer.is_valid():
            expense_serializer.save()
            return Response({'message': 'Expense updated successfully'})
        return Response(expense_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except ExpenseModel.DoesNotExist:
        return Response(
            {'error': 'Expense not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['DELETE'])
def delete_expense_api(request, id):
    try:
        expense_obj = ExpenseModel.objects.get(expense_id=id)
        expense_obj.delete()
        return Response({'message': 'Expense deleted successfully'})
    except ExpenseModel.DoesNotExist:
        return Response(
            {'error': 'Expense not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
def search_expense_api(request):
    query = request.GET.get('q', '')
    
    if query:
        expenses = ExpenseModel.objects.filter(
            expense_name__icontains=query
        ) | ExpenseModel.objects.filter(
            expense_category__icontains=query
        )
        expense_serializer = ExpenseSerializer(expenses, many=True)
        return Response(expense_serializer.data)
    else:
        expense_obj = ExpenseModel.objects.all()
        expense_serializer = ExpenseSerializer(expense_obj, many=True)
        return Response(expense_serializer.data)

