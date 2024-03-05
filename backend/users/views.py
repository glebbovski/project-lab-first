import json
from rest_framework import viewsets, authentication
from rest_framework.request import Request
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from .serializers import MyTokenObtainPairSerializer, RegisterSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, Course, Question, Answer, Enrollment, PreviousResult
from .serializers import CustomUserSerializer, CourseSerializer, QuestionSerializer, AnswerSerializer, EnrollmentSerializer, PreviousResultSerializer


def get_info_by_token(request, refresh_token_str):
    refresh_token_obj = RefreshToken(refresh_token_str)
    user_id=refresh_token_obj['user_id']
    user=CustomUser.objects.get(id=user_id)
    content =  {'user_id': user_id, 
                'username': user.username, 
                'date_of_birth': user.date_of_birth, 
                'first_name': user.first_name, 
                'last_name': user.last_name,
                'sex': user.sex,
                'email': user.email,
                'is_active': user.is_active }
    return HttpResponse(json.dumps(content, indent=4, sort_keys=True, default=str), 
                        content_type="application/json", 
                        status=status.HTTP_200_OK)


@api_view(('POST',))
def logout_view(request):
    """Blacklist the refresh token: extract token from the header
      during logout request user and refresh token is provided"""
    Refresh_token = request.data["refresh"]
    token = RefreshToken(Refresh_token)
    token.blacklist()
    result_status = {'status': 'blacklisted'}
    # return Response("Successful Logout", status=status.HTTP_200_OK)
    return HttpResponse(json.dumps(result_status, indent=4, sort_keys=True, default=str), 
                        content_type="application/json", 
                        status=status.HTTP_200_OK)


#Login User
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


#Register User
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class CustomUserViewSet(viewsets.ModelViewSet):
# class CustomUserViewSet(viewsets.ViewSet):
    
    # # permission_classes = (AllowAny,)
    # def list(self, request:Request):
    #     queryset = CustomUser.objects.all()
    #     serializer=CustomUserSerializer(instance=queryset, many=True)
    #     return Response(data=serializer.data, status=status.HTTP_200_OK)

    # def retrieve(self, request:Request, pk=None):
    #     post=get_object_or_404(CustomUser, pk=pk)
    #     serializer=CustomUserSerializer(instance=post)

    #     return Response(data=serializer.data, status=status.HTTP_200_OK)

    # С таким подходом разрешается POST-метод для всех в базу, а это не очень хорошо
    queryset=CustomUser.objects.all()
    serializer_class=CustomUserSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):
    # queryset=Enrollment.objects.all()
    serializer_class=EnrollmentSerializer

    def get_queryset(self):
        customUserId = self.request.query_params.get('customUser')
        courseId = self.request.query_params.get('course')
        if customUserId is None and courseId is None:
            queryset = Enrollment.objects.all()
        elif customUserId is None and courseId is not None:
            queryset = Enrollment.objects.all().filter(course_id=courseId)
        elif customUserId is not None and courseId is None:
            queryset = Enrollment.objects.all().filter(customUser_id=customUserId)
        else:
            queryset = Enrollment.objects.all().filter(customUser_id=customUserId, course_id=courseId)
        return queryset


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class=QuestionSerializer

    def get_queryset(self):
        courseId = self.request.query_params.get('course')
        if courseId is None:
            queryset = Question.objects.all()
        else:
            queryset = Question.objects.all().filter(course_id=courseId)
        return queryset


class AnswerViewSet(viewsets.ModelViewSet):
    serializer_class=AnswerSerializer

    def get_queryset(self):
        questionId = self.request.query_params.get('question')
        if questionId is None:
            queryset = Answer.objects.all()
        else:
            queryset = Answer.objects.all().filter(question_id=questionId)
        return queryset


class PreviousResultViewSet(viewsets.ModelViewSet):
    serializer_class=PreviousResultSerializer

    def get_queryset(self):
        userId = self.request.query_params.get('user')
        courseId = self.request.query_params.get('course')
        # here can be questionId and answerId, but I do not want to add it right now
        if userId is None and courseId is None:
            queryset = PreviousResult.objects.all()
        elif userId is None and courseId is not None:
            queryset = PreviousResult.objects.all().filter(course_id=courseId)
        elif userId is not None and courseId is None:
            queryset = PreviousResult.objects.all().filter(user_id=userId)
        else:
            queryset = PreviousResult.objects.all().filter(user_id=userId, course_id=courseId)
        return queryset

# class AnswerViewSet(viewsets.ViewSet):
#     def list(self, request:Request):
#         queryset = Answer.objects.all()
#         serializer=AnswerSerializer(instance=queryset, many=True)
#         return Response(data=serializer.data, status=status.HTTP_200_OK)

#     def retrieve(self, request:Request, pk=None):
#         post=get_object_or_404(Answer, pk=pk)
#         serializer=AnswerSerializer(instance=post)

#         return Response(data=serializer.data, status=status.HTTP_200_OK)


# class QuestionViewSet(viewsets.ViewSet):
#     def list(self, request:Request):
#         queryset = Question.objects.all()
#         serializer=QuestionSerializer(instance=queryset, many=True)
#         return Response(data=serializer.data, status=status.HTTP_200_OK)

#     def retrieve(self, request:Request, pk=None):
#         post=get_object_or_404(Question, pk=pk)
#         serializer=QuestionSerializer(instance=post)

#         return Response(data=serializer.data, status=status.HTTP_200_OK)


class CourseViewSet(viewsets.ViewSet):
    def list(self, request:Request):
        queryset = Course.objects.all()
        serializer=CourseSerializer(instance=queryset, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request:Request, pk=None):
        post=get_object_or_404(Course, pk=pk)
        serializer=CourseSerializer(instance=post)

        return Response(data=serializer.data, status=status.HTTP_200_OK)


class AboutProjectView(APIView):

    def get(self, request):
        who_is_creator = "Hlib Chekmezov (KV-31mp)"
        about_project = "This is a project for laboratory works for my 5th grade of KPI learning"
        born_city_of_creator = "Krasnodon"
        info = {"creator": who_is_creator, 
                "about_project": about_project, 
                "born_city": born_city_of_creator}
        return Response(info)
