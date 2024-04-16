import random
import string
import datetime
from celery.utils.log import get_task_logger
from .email import send_simple_email, send_email_with_attachment
from .pdf import render_to_pdf, delete_pdf
from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import OperationResult

logger = get_task_logger(__name__)
channel_layer = get_channel_layer()

@shared_task
def key_generation_task(to_email):
    tmp = ''
    for i in range(0, 256*40):
        tmp = tmp + (''.join(random.choices(string.ascii_letters + string.digits, k=(256 * 40))))[i]
    chunk_size = 256
    chunks = [tmp[i:i + chunk_size] for i in range(0, len(tmp), chunk_size)]
    result_string = ''
    for i in range(0, 4):
        random_number = random.randrange(40)
        result_string = result_string + chunks[random_number][:64]

    time_string = datetime.datetime.now().strftime('%Y-%m-%d   %H:%M:%S')
    async_to_sync(channel_layer.group_send)('joke', {'type': 'send_joke',
                                                     'email': to_email,
                                                     'text': result_string,
                                                     'name_of_operation': 'Key Generation Task',
                                                     'operation_end_datetime': time_string,
                                                     'status': 'Finished'})

    OperationResult.objects.create(key=result_string)

    return result_string


@shared_task
def delete_pdf_task(pdf_path):
    logger.info(f'Deleted pdf for path {pdf_path}')
    time_string = datetime.datetime.now().strftime('%Y-%m-%d   %H:%M:%S')
    async_to_sync(channel_layer.group_send)('joke', {'type': 'send_joke',
                                                     'text': pdf_path,
                                                     'name_of_operation': 'Delete PDF Task',
                                                     'operation_end_datetime': time_string,
                                                     'status': 'Finished'})
    return delete_pdf(pdf_path)


@shared_task
def generate_pdf_task(html_path, pdf_path, data):
    logger.info('Created pdf certificate')
    time_string = datetime.datetime.now().strftime('%Y-%m-%d   %H:%M:%S')
    async_to_sync(channel_layer.group_send)('joke', {'type': 'send_joke',
                                                     'text': pdf_path,
                                                     'name_of_operation': 'Generate PDF Task',
                                                     'operation_end_datetime': time_string,
                                                     'status': 'Finished'})
    return render_to_pdf(html_path, pdf_path, data)


@shared_task
def send_email_with_attachment_task(name, email, course, pdf_path, email_body_path):
    logger.info(f"Sent email with attachment - {course}")
    tmp = f"{name} - {email} - {course}"
    time_string = datetime.datetime.now().strftime('%Y-%m-%d   %H:%M:%S')
    async_to_sync(channel_layer.group_send)('joke', {'type': 'send_joke',
                                                     'text': tmp,
                                                     'name_of_operation': 'Send email with attachment Task',
                                                     'operation_end_datetime': time_string,
                                                     'status': 'Finished'})
    return send_email_with_attachment(name, email, course, pdf_path, email_body_path)


@shared_task
def send_email_task(name, email, course, email_body_path):
    logger.info(f"Sent simple email for course {course}")
    tmp = f"{name} - {email} - {course}"
    time_string = datetime.datetime.now().strftime('%Y-%m-%d   %H:%M:%S')
    async_to_sync(channel_layer.group_send)('joke', {'type': 'send_joke',
                                                     'text': tmp,
                                                     'name_of_operation': 'Send email Task',
                                                     'operation_end_datetime': time_string,
                                                     'status': 'Finished'})
    return send_simple_email(name, email, course, email_body_path)
