"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# from rest_framework_jwt.views import obtain_jwt_token

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from users import views
from chat import views as chatviews
from tasks import views as tasksviews

router = DefaultRouter()
router.register(r"api/users", views.CustomUserViewSet, basename="users")
router.register(r"api/courses", views.CourseViewSet, basename="courses")
router.register(r"api/answers", views.AnswerViewSet, basename="answers")
router.register(r"api/questions", views.QuestionViewSet, basename="question")
router.register(r"api/enrollment", views.EnrollmentViewSet, basename="enrollment")
router.register(r"api/previousresult", views.PreviousResultViewSet, basename="previousresult")
router.register(r"api/chatmessages", chatviews.MessageViewSet, basename="chatmessages")
router.register(r"api/online_users", chatviews.OnlineUsersViewSet, basename="onlineusers")
router.register(r'api/coursekeys', tasksviews.OperationResultViewSet, basename='check_course_key'),

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', views.RegisterView.as_view(), name='auth_register'),
    path('api/get_info_by_token/<refresh_token_str>', views.get_info_by_token, name="info_by_token"),
    # path('api/get_online_users/<refresh_token>', chatviews.get_online_users, name="online_users"),
    path('api/logout/', views.logout_view, name='auth_logout'),
    path('api/about/', views.AboutProjectView.as_view(), name='about_info'),
    path('api/generatepdf/', tasksviews.CourseCompletedView.as_view(), name='generate_pdf'),
    path('api/coursenotfinished/', tasksviews.CourseNotCompletedView.as_view(), name='course_not_completed'),
    # path('chat/', include('chat.urls')),
    path("", include(router.urls)),
]
