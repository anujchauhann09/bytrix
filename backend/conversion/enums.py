from django.db import models


class ConversionTool(models.TextChoices):
    LIBREOFFICE = 'LIBREOFFICE', 'LibreOffice'
    PDF2DOCX = 'PDF2DOCX', 'PDF to DOCX'


class ConversionOperation(models.TextChoices):
    CONVERT = 'CONVERT', 'Convert'
