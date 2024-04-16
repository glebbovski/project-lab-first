from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.exceptions import PermissionDenied
from .tasks import send_email_with_attachment_task, send_email_task, generate_pdf_task, delete_pdf_task, key_generation_task
import json
import datetime
from django.http import QueryDict, HttpResponse
from .serializers import OperationResultSerializer
from .models import OperationResult


class CourseCompletedView(APIView):

    def post(self, request):
        try:
            json_repr = json.loads(request.body)
        except:
            json_repr = QueryDict(request.body)
        print(json_repr)
        name = json_repr['name']
        course = json_repr['course']
        to_email = json_repr['email']  # Replace with your email address

        html_path = 'certificate.html'
        pdf_path = 'tasks/templates/certificate.pdf'
        email_body_path = 'email_message.txt'
        cur_date = str(datetime.datetime.now().strftime("%Y.%m.%d"))
        data = {'data': {'name': name, 'subject': course, 'cur_date': cur_date}}

        key_generation_task.apply_async(args=[to_email], queue='moon')

        if generate_pdf_task.apply_async((html_path, pdf_path, data), queue='sunshine'):
            if send_email_with_attachment_task.apply_async((name, to_email, course, pdf_path, email_body_path), queue='sunshine'):
                if delete_pdf_task.apply_async(args=[pdf_path], queue='sunshine'):
                    info = {"status": 'OK'}
                    return Response(info, status=status.HTTP_200_OK)
                else:
                    info = {"status": 'Bad',
                            "what_is_wrong": "deleting pdf"}
                    return Response(info, status=status.HTTP_400_BAD_REQUEST)
            else:
                info = {"status": 'Bad',
                        "what_is_wrong": "message sending"}
                return Response(info, status=status.HTTP_400_BAD_REQUEST)
        else:
            info = {"status": 'Bad',
                    "what_is_wrong": "pdf generation"}
            return Response(info, status=status.HTTP_400_BAD_REQUEST)


class CourseNotCompletedView(APIView):

    def post(self, request):
        try:
            json_repr = json.loads(request.body)
        except:
            json_repr = QueryDict(request.body)
        name = json_repr['name']
        course = json_repr['course']
        to_email = json_repr['email']

        email_body_path = 'email_message_not_finished.txt'
        if send_email_task.delay(name, to_email, course, email_body_path):
            info = {"status": 'OK'}
            return Response(info, status=status.HTTP_200_OK)
        else:
            info = {"status": 'Bad',
                    "what_is_wrong": "message sending"}
            return Response(info, status=status.HTTP_400_BAD_REQUEST)


class OperationResultViewSet(viewsets.ModelViewSet):
    serializer_class = OperationResultSerializer

    def get_queryset(self):
        key = self.request.query_params.get('key')
        if key is None:
            raise PermissionDenied("Access restricted. You should put the key to query params!")
        else:
            queryset = OperationResult.objects.all().filter(key=key)
        return queryset
