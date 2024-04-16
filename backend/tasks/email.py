from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.conf import settings
import os
import magic


def send_simple_email(name, email, course, email_body_path):

    context = {
        'name': name,
        'email': email,
        'course': course,
    }

    email_subject = 'Thank you for your time'
    email_body = render_to_string(email_body_path, context)

    email = EmailMessage(
        email_subject, email_body,
        settings.DEFAULT_FROM_EMAIL, [email, ],
    )
    return email.send(fail_silently=False)


def send_email_with_attachment(name, email, course, attachment_path, email_body_path):
    with open(attachment_path, 'rb') as file:
        file_content = file.read()
    file_name = os.path.basename(attachment_path)
    mime_type = magic.from_buffer(file_content, mime=True)

    context = {
        'name': name,
        'email': email,
        'course': course,
    }

    email_subject = 'Thank you for passing a course'
    email_body = render_to_string(email_body_path, context)

    email = EmailMessage(
        email_subject, email_body,
        settings.DEFAULT_FROM_EMAIL, [email, ],
    )
    email.attach(file_name, file_content, mime_type)
    return email.send(fail_silently=False)
