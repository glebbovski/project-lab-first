from xhtml2pdf import pisa
from django.http import HttpResponse
from django.template.loader import get_template
import os


def render_to_pdf(html_path, pdf_path,  context_dict):
    template = get_template(html_path)
    html_content = template.render(context_dict)

    with open(pdf_path, "wb") as pdf_file:
        pisa_status = pisa.CreatePDF(html_content, dest=pdf_file)

    if pisa_status.err:
        return HttpResponse('Error while creating PDF: %s' % html_content)
    return not pisa_status.err


def delete_pdf(pdf_path):
    try:
        os.remove(pdf_path)
        return True
    except FileNotFoundError:
        return False
