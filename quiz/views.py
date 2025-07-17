import httpx
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
import random


def quiz_page(request):
    return render(request, 'quiz/quiz.html')


class QuizAPIView(APIView):
    def get(self, request):
        category = request.GET.get('category', 'soccer')  # soccer as default
        session_key = f"used_questions_{category}"

        used_questions = set(request.session.get(session_key, []))

        # new questions from API
        url = f"https://the-trivia-api.com/v2/questions?limit=30&tags={category}"
        response = requests.get(url)
        all_questions = response.json()

        fresh_questions = [q for q in all_questions if q['question']['text'] not in used_questions]

        if not fresh_questions:
            used_questions = set()
            fresh_questions = all_questions

        # enforce exactly 10 questions, padding with additional fresh questions if needed
        selected = fresh_questions[:10]
        if len(selected) < 10 and fresh_questions:
            remaining_questions = [q for q in all_questions if q not in selected]
            remaining_questions.sort(key=lambda x: random.random())  # shuffle
            selected.extend(remaining_questions[:10 - len(selected)])

        used_questions.update(q['question']['text'] for q in selected)
        request.session[session_key] = list(used_questions)
        request.session.modified = True  # to save session

        return Response(selected)