"""
ASGI config for rectifier_monitor project.
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rectifier_monitor.settings')

application = get_asgi_application()
