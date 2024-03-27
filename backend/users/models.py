from django.db import models
from django.utils import timezone
from datetime import date
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from django.core.validators import MaxValueValidator, MinValueValidator
from datetime import datetime
# Create your models here.


class Course(models.Model):
    """ The Model to hold a list of Courses """
    title = models.CharField(max_length=64, null=False)
    description = models.TextField(null=True, verbose_name="Short description")
    short_href = models.TextField(max_length=20, null=False)
    url_for_image = models.TextField(max_length=128, null=False, verbose_name="Url for image source")
    long_description = models.TextField(null=True, verbose_name="Long description")
    # publisher = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     on_delete=models.CASCADE,
    #     verbose_name="Publisher",
    #     default=1,
    # )
    # publisher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, verbose_name="Publisher")
    created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Course "{self.title}".'
    

class Question(models.Model):
    question = models.CharField(max_length=128, null=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return f'Course "{self.course.title}" - Question "{self.question}".'


class Answer(models.Model):
    answer = models.CharField(max_length=128, null=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    isRight = models.BooleanField()

    def __str__(self):
        return f'Question "{self.question.question}" - Answer "{self.answer}".'


class CustomUser(AbstractUser):
    # STATUS = (
    #     ('regular', 'regular'),
    #     ('subscriber', 'subscriber'),
    #     ('moderator', 'moderator')
    # )

    SEX = (
        ('M', 'Male'),
        ('F', 'Female')
    )

    sex = models.CharField("sex", max_length=1, choices=SEX, default='F')
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField("date of birth", default=date.today)
    course = models.ManyToManyField(Course, through="Enrollment", blank=True)
    is_online = models.BooleanField(blank=False, default=False)
    # course = models.ManyToManyField(Course, blank=True)
    # status = models.CharField(max_length=100, choices=STATUS, default='regular')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith(('pbkdf2_sha256$', 'bcrypt$', 'argon2')):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)


class PreviousResult(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return (f'User: "{self.user.username}", Course: "{self.course.title}", Question "{self.question.question}" '
                f'- Answer "{self.answer.answer}".')


class Enrollment(models.Model):
    customUser = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='customuser_to_course')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_to_customuser')
    date = models.DateField(default=date.today)   # дата поступления
    mark = models.IntegerField(default=0,
        validators=[
            MaxValueValidator(100),
            MinValueValidator(0)
        ])  # полученный балл

    class Meta:
        unique_together = [['customUser', 'course']]

    def __str__(self):
        return "\"" + self.customUser.username + " – " + self.course.title + "\". Mark = " + str(self.mark)
