from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Course, Enrollment, Question, Answer, PreviousResult

# Register your models here.

# class CustomUserAdmin(UserAdmin):
#     fieldsets = [
#         ("Header", {"fields": ['username', 'password', 'first_name', 'last_name', 'is_staff', 'is_active', 'sex', 'email', 'status']}),
#         ("Date", {"fields": ['date_of_birth']}),
#     ]


# class CustomUserAdmin(UserAdmin):
#     pass

# admin.site.register(CustomUser, CustomUserAdmin)

admin.site.register(Course)
admin.site.register(Enrollment)
admin.site.register(CustomUser)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(PreviousResult)
