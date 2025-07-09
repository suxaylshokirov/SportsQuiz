from django.urls import path
from .views import quiz_page, QuizAPIView

urlpatterns = [
    path('', quiz_page, name='quiz_page'),
    path('api/', QuizAPIView.as_view(), name="quiz_api")
]