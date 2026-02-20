# Complete Backend Setup Guide - Multi-Site Rectifier

## 📋 Files yang Sudah Ada

✅ `rectifier_monitor/settings.py` - Django settings  
✅ `rectifier_monitor/urls.py` - URL routing  
✅ `rectifier_monitor/wsgi.py` - WSGI config  
✅ `rectifier_monitor/asgi.py` - ASGI config  
✅ `monitor/models.py` - Site & RectifierData models  

## 📝 Files yang Perlu Dibuat (Copy-Paste Code di Bawah)

---

## 1️⃣ **manage.py** (Root backend folder)

```python
#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rectifier_monitor.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
```

**Save as:** `backend/manage.py`

---

## 2️⃣ **requirements.txt**

```txt
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
paho-mqtt==1.6.1
python-dotenv==1.0.0
```

**Save as:** `backend/requirements.txt`

---

## 3️⃣ **monitor/serializers.py**

```python
from rest_framework import serializers
from .models import Site, RectifierData


class SiteListSerializer(serializers.ModelSerializer):
    """Serializer untuk list site dengan latest data"""
    latest_vdc = serializers.SerializerMethodField()
    latest_load = serializers.SerializerMethodField()
    latest_temp = serializers.SerializerMethodField()
    latest_status = serializers.SerializerMethodField()
    last_update = serializers.SerializerMethodField()
    
    class Meta:
        model = Site
        fields = [
            'id', 'site_code', 'site_name', 
            'latitude', 'longitude', 'region', 'address',
            'project_id', 'ladder', 'sla',
            'latest_vdc', 'latest_load', 'latest_temp',
            'latest_status', 'last_update', 'is_active'
        ]
    
    def get_latest_vdc(self, obj):
        latest = obj.get_latest_data()
        return latest.vdc_output if latest else None
    
    def get_latest_load(self, obj):
        latest = obj.get_latest_data()
        return latest.load_current if latest else None
    
    def get_latest_temp(self, obj):
        latest = obj.get_latest_data()
        return latest.temperature if latest else None
    
    def get_latest_status(self, obj):
        return obj.get_status()
    
    def get_last_update(self, obj):
        latest = obj.get_latest_data()
        return latest.created_at.isoformat() if latest else None


class SiteDetailSerializer(serializers.ModelSerializer):
    """Serializer untuk detail site"""
    class Meta:
        model = Site
        fields = '__all__'


class RectifierDataSerializer(serializers.ModelSerializer):
    """Serializer untuk raw rectifier data"""
    site_code = serializers.CharField(source='site.site_code', read_only=True)
    site_name = serializers.CharField(source='site.site_name', read_only=True)
    
    class Meta:
        model = RectifierData
        fields = '__all__'


class DashboardDataSerializer(serializers.Serializer):
    """Serializer untuk format dashboard frontend (sama seperti single-site)"""
    siteInfo = serializers.SerializerMethodField()
    environment = serializers.SerializerMethodField()
    modules = serializers.SerializerMethodField()
    rectifier = serializers.SerializerMethodField()
    battery = serializers.SerializerMethodField()
    
    def get_siteInfo(self, obj):
        return {
            'siteName': obj.site_name,
            'siteCode': obj.site.site_code,
            'projectId': obj.project_id,
            'ladder': obj.ladder,
            'sla': obj.sla,
            'statusRealtime': obj.status_realtime,
            'statusLadder': obj.status_ladder,
            'lastData': obj.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'location': {
                'lat': obj.latitude or obj.site.latitude,
                'lng': obj.longitude or obj.site.longitude,
            }
        }
    
    def get_environment(self, obj):
        return {
            'doorCabinet': obj.door_cabinet,
            'batteryStolen': obj.battery_stolen,
            'temperature': obj.temperature,
            'humidity': obj.humidity,
        }
    
    def get_modules(self, obj):
        return obj.modules_status if obj.modules_status else []
    
    def get_rectifier(self, obj):
        return {
            'vacInputL1': obj.vac_input_l1,
            'vacInputL2': obj.vac_input_l2,
            'vacInputL3': obj.vac_input_l3,
            'vdcOutput': obj.vdc_output,
            'batteryCurrent': obj.battery_current,
            'iacInputL1': obj.iac_input_l1,
            'iacInputL2': obj.iac_input_l2,
            'iacInputL3': obj.iac_input_l3,
            'loadCurrent': obj.load_current,
            'loadPower': obj.load_power,
            'pacLoadL1': obj.pac_load_l1,
            'pacLoadL2': obj.pac_load_l2,
            'pacLoadL3': obj.pac_load_l3,
            'rectifierCurrent': obj.rectifier_current,
            'totalPower': obj.total_power,
        }
    
    def get_battery(self, obj):
        banks = []
        if obj.battery_bank_1_voltage > 0:
            banks.append({
                'id': 1,
                'voltage': obj.battery_bank_1_voltage,
                'current': obj.battery_bank_1_current,
                'soc': obj.battery_bank_1_soc,
                'soh': obj.battery_bank_1_soh,
            })
        if obj.battery_bank_2_voltage > 0:
            banks.append({
                'id': 2,
                'voltage': obj.battery_bank_2_voltage,
                'current': obj.battery_bank_2_current,
                'soc': obj.battery_bank_2_soc,
                'soh': obj.battery_bank_2_soh,
            })
        if obj.battery_bank_3_voltage > 0:
            banks.append({
                'id': 3,
                'voltage': obj.battery_bank_3_voltage,
                'current': obj.battery_bank_3_current,
                'soc': obj.battery_bank_3_soc,
                'soh': obj.battery_bank_3_soh,
            })
        
        return {
            'banks': banks,
            'backupDuration': obj.backup_duration,
            'timeRemaining': obj.time_remaining,
            'status': obj.battery_status,
            'startBackup': obj.start_backup,
            'socAvg': obj.soc_avg,
        }
```

**Save as:** `backend/monitor/serializers.py`

---

## 4️⃣ **monitor/views.py**

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Site, RectifierData
from .serializers import (
    SiteListSerializer, 
    SiteDetailSerializer,
    RectifierDataSerializer,
    DashboardDataSerializer
)


class SiteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet untuk Site
    
    Endpoints:
    - GET /api/sites/ - List semua site dengan latest data
    - GET /api/sites/{site_code}/ - Detail site
    - GET /api/sites/{site_code}/dashboard/ - Dashboard data
    - GET /api/sites/{site_code}/history/ - Historical data
    """
    queryset = Site.objects.filter(is_active=True)
    lookup_field = 'site_code'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SiteListSerializer
        return SiteDetailSerializer
    
    def get_queryset(self):
        """Filter by query params"""
        queryset = Site.objects.filter(is_active=True)
        
        # Filter by region
        region = self.request.query_params.get('region')
        if region:
            queryset = queryset.filter(region__icontains=region)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            # Will implement this with annotation
            pass
        
        return queryset.select_related().prefetch_related('rectifier_data')
    
    @action(detail=True, methods=['get'])
    def dashboard(self, request, site_code=None):
        """Get dashboard data untuk specific site"""
        site = self.get_object()
        latest_data = site.get_latest_data()
        
        if not latest_data:
            return Response(
                {'message': f'No data available for site {site_code}'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = DashboardDataSerializer(latest_data)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def history(self, request, site_code=None):
        """Get historical data untuk specific site"""
        site = self.get_object()
        
        # Get limit from query params
        limit = int(request.query_params.get('limit', 100))
        if limit > 1000:
            limit = 1000
        
        data = RectifierData.objects.filter(site=site)[:limit]
        serializer = RectifierDataSerializer(data, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def latest(self, request, site_code=None):
        """Get latest data untuk specific site"""
        site = self.get_object()
        latest_data = site.get_latest_data()
        
        if not latest_data:
            return Response(
                {'message': f'No data available for site {site_code}'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = RectifierDataSerializer(latest_data)
        return Response(serializer.data)


class RectifierDataViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet untuk RectifierData (untuk backward compatibility)
    """
    queryset = RectifierData.objects.all()
    serializer_class = RectifierDataSerializer
    
    def get_queryset(self):
        queryset = RectifierData.objects.all()
        
        # Filter by site_code
        site_code = self.request.query_params.get('site_code')
        if site_code:
            queryset = queryset.filter(site__site_code=site_code)
        
        # Limit
        limit = int(self.request.query_params.get('limit', 100))
        if limit > 1000:
            limit = 1000
        
        return queryset[:limit]
```

**Save as:** `backend/monitor/views.py`

---

## 5️⃣ **monitor/urls.py**

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteViewSet, RectifierDataViewSet

router = DefaultRouter()
router.register(r'sites', SiteViewSet, basename='site')
router.register(r'rectifier', RectifierDataViewSet, basename='rectifier')

urlpatterns = [
    path('', include(router.urls)),
]
```

**Save as:** `backend/monitor/urls.py`

---

## 6️⃣ **monitor/admin.py**

```python
from django.contrib import admin
from .models import Site, RectifierData


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ['site_code', 'site_name', 'region', 'is_active', 'created_at']
    list_filter = ['is_active', 'region']
    search_fields = ['site_code', 'site_name', 'address']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('site_code', 'site_name', 'is_active')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude', 'address', 'region')
        }),
        ('Project Info', {
            'fields': ('project_id', 'ladder', 'sla')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(RectifierData)
class RectifierDataAdmin(admin.ModelAdmin):
    list_display = ['site', 'timestamp', 'vdc_output', 'load_current', 
                    'temperature', 'status_realtime', 'created_at']
    list_filter = ['status_realtime', 'site', 'created_at']
    search_fields = ['site__site_code', 'site__site_name']
    readonly_fields = ['created_at']
    
    def has_add_permission(self, request):
        # Data dari MQTT saja
        return False
    
    def has_change_permission(self, request, obj=None):
        # Read-only
        return False
```

**Save as:** `backend/monitor/admin.py`

---

## 7️⃣ **monitor/apps.py**

```python
from django.apps import AppConfig


class MonitorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'monitor'
    verbose_name = 'Rectifier Monitoring'
```

**Save as:** `backend/monitor/apps.py`

---

## 8️⃣ **monitor/migrations/__init__.py**

```python
# Migrations package
```

**Save as:** `backend/monitor/migrations/__init__.py`

---

## 9️⃣ **mqtt_listener_multisite.py** (Root backend folder)

```python
#!/usr/bin/env python3
"""
MQTT Listener untuk Multi-Site
Subscribe ke: rectifier/+/data
Parse site_code dari topic
"""

import os
import sys
import json
import django
import logging
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rectifier_monitor.settings')
django.setup()

import paho.mqtt.client as mqtt
from django.conf import settings
from monitor.models import Site, RectifierData

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logger.info(f"✓ Connected to MQTT Broker: {settings.MQTT_BROKER}")
        client.subscribe(settings.MQTT_TOPIC_PATTERN)
        logger.info(f"✓ Subscribed to: {settings.MQTT_TOPIC_PATTERN}")
    else:
        logger.error(f"✗ Connection failed, rc: {rc}")


def on_message(client, userdata, msg):
    try:
        # Parse site_code dari topic
        # Format: rectifier/{site_code}/data
        topic_parts = msg.topic.split('/')
        if len(topic_parts) < 2:
            logger.error(f"Invalid topic format: {msg.topic}")
            return
        
        site_code = topic_parts[1]
        
        # Parse payload
        payload = json.loads(msg.payload.decode())
        logger.info(f"Received data for site: {site_code}")
        
        # Get or create site
        site, created = Site.objects.get_or_create(
            site_code=site_code,
            defaults={
                'site_name': payload.get('site_name', site_code),
                'latitude': payload.get('latitude', 0),
                'longitude': payload.get('longitude', 0),
                'region': payload.get('region', ''),
                'project_id': payload.get('project_id', ''),
                'ladder': payload.get('ladder', ''),
                'sla': payload.get('sla', ''),
            }
        )
        
        if created:
            logger.info(f"✓ New site created: {site_code}")
        
        # Save data
        ts = payload.get('ts', 0)
        
        RectifierData.objects.create(
            site=site,
            timestamp=ts,
            site_name=payload.get('site_name', site_code),
            project_id=payload.get('project_id', ''),
            ladder=payload.get('ladder', ''),
            sla=payload.get('sla', ''),
            status_realtime=payload.get('status_realtime', 'Normal'),
            status_ladder=payload.get('status_ladder', 'Normal'),
            latitude=payload.get('latitude'),
            longitude=payload.get('longitude'),
            door_cabinet=payload.get('door_cabinet', 'Close'),
            battery_stolen=payload.get('battery_stolen', 'Close'),
            temperature=payload.get('temperature', 0),
            humidity=payload.get('humidity', 0),
            vac_input_l1=payload.get('vac_input_l1', 0),
            vac_input_l2=payload.get('vac_input_l2', 0),
            vac_input_l3=payload.get('vac_input_l3'),
            vdc_output=payload.get('vdc_output', 0),
            battery_current=payload.get('battery_current', 0),
            iac_input_l1=payload.get('iac_input_l1'),
            iac_input_l2=payload.get('iac_input_l2'),
            iac_input_l3=payload.get('iac_input_l3'),
            load_current=payload.get('load_current', 0),
            load_power=payload.get('load_power', 0),
            pac_load_l1=payload.get('pac_load_l1', 0),
            pac_load_l2=payload.get('pac_load_l2', 0),
            pac_load_l3=payload.get('pac_load_l3', 0),
            rectifier_current=payload.get('rectifier_current', 0),
            total_power=payload.get('total_power', 0),
            battery_bank_1_voltage=payload.get('battery_bank_1_voltage', 0),
            battery_bank_1_current=payload.get('battery_bank_1_current', 0),
            battery_bank_1_soc=payload.get('battery_bank_1_soc', 100),
            battery_bank_1_soh=payload.get('battery_bank_1_soh', 100),
            battery_bank_2_voltage=payload.get('battery_bank_2_voltage', 0),
            battery_bank_2_current=payload.get('battery_bank_2_current', 0),
            battery_bank_2_soc=payload.get('battery_bank_2_soc', 100),
            battery_bank_2_soh=payload.get('battery_bank_2_soh', 100),
            battery_bank_3_voltage=payload.get('battery_bank_3_voltage', 0),
            battery_bank_3_current=payload.get('battery_bank_3_current', 0),
            battery_bank_3_soc=payload.get('battery_bank_3_soc', 100),
            battery_bank_3_soh=payload.get('battery_bank_3_soh', 100),
            backup_duration=payload.get('backup_duration'),
            time_remaining=payload.get('time_remaining'),
            battery_status=payload.get('battery_status', 'Standby'),
            start_backup=payload.get('start_backup', 'No data'),
            soc_avg=payload.get('soc_avg', 100),
            modules_status=payload.get('modules_status', []),
        )
        
        logger.info(f"✓ Data saved - {site_code}: VDC={payload.get('vdc_output')}V")
        
    except json.JSONDecodeError as e:
        logger.error(f"✗ JSON decode error: {e}")
    except Exception as e:
        logger.error(f"✗ Error: {e}")


def main():
    logger.info("=" * 50)
    logger.info("MQTT Listener Multi-Site Starting...")
    logger.info("=" * 50)
    
    client_id = f"{settings.MQTT_CLIENT_ID}_{random.randint(1000,9999)}"
    client = mqtt.Client(client_id=client_id)
    
    if settings.MQTT_USERNAME:
        client.username_pw_set(settings.MQTT_USERNAME, settings.MQTT_PASSWORD)
    
    client.on_connect = on_connect
    client.on_message = on_message
    
    try:
        logger.info(f"Connecting to {settings.MQTT_BROKER}:{settings.MQTT_PORT}...")
        client.connect(settings.MQTT_BROKER, settings.MQTT_PORT, 60)
        client.loop_forever()
    except KeyboardInterrupt:
        logger.info("Stopping listener...")
        client.disconnect()
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
```

**Save as:** `backend/mqtt_listener_multisite.py`

---

## 🔟 **seed_sites.py** (Root backend folder)

```python
"""
Seed sample sites untuk testing
Run: python manage.py shell < seed_sites.py
"""

from monitor.models import Site

# Sample sites di area Jakarta
sites_data = [
    {
        'site_code': 'NYK',
        'site_name': 'NYK Workshop',
        'latitude': -6.305489,
        'longitude': 106.958651,
        'address': 'Jl. Pulau Pinang, Pulo Gadung, Jakarta Timur',
        'region': 'Jakarta Timur',
        'project_id': '23XL05C0027',
        'ladder': 'Ladder-1',
        'sla': '2 Hour',
    },
    {
        'site_code': 'BSD',
        'site_name': 'BSD Office',
        'latitude': -6.301934,
        'longitude': 106.652817,
        'address': 'BSD City, Tangerang Selatan, Banten',
        'region': 'Tangerang Selatan',
        'project_id': '23XL05C0028',
        'ladder': 'Ladder-1',
        'sla': '4 Hour',
    },
    {
        'site_code': 'JKT',
        'site_name': 'Jakarta Data Center',
        'latitude': -6.211544,
        'longitude': 106.845172,
        'address': 'Jl. Gatot Subroto, Jakarta Pusat',
        'region': 'Jakarta Pusat',
        'project_id': '23XL05C0029',
        'ladder': 'Ladder-2',
        'sla': '1 Hour',
    },
]

print("\n" + "="*50)
print("Seeding Sample Sites...")
print("="*50 + "\n")

for site_data in sites_data:
    site, created = Site.objects.get_or_create(
        site_code=site_data['site_code'],
        defaults=site_data
    )
    
    if created:
        print(f"✓ Created: {site.site_name} ({site.site_code})")
    else:
        print(f"- Exists: {site.site_name} ({site.site_code})")

print("\n" + "="*50)
print("✅ Seeding Complete!")
print("="*50)
print(f"\nTotal sites: {Site.objects.count()}")
```

**Save as:** `backend/seed_sites.py`

---

## 1️⃣1️⃣ **.env.example** (Root backend folder)

```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# MQTT
MQTT_BROKER=broker.emqx.io
MQTT_PORT=1883
MQTT_TOPIC_PATTERN=rectifier/+/data
MQTT_CLIENT_ID=django_multisite_local
MQTT_USERNAME=
MQTT_PASSWORD=
```

**Save as:** `backend/.env.example`

---

## ✅ Setup Steps Setelah Semua File Dibuat

```bash
# 1. Create virtual environment
cd backend
python -m venv venv

# 2. Activate
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run migrations
python manage.py makemigrations
python manage.py migrate

# 5. Seed sample sites
python manage.py shell < seed_sites.py

# 6. Create superuser
python manage.py createsuperuser

# 7. Run server
python manage.py runserver
```

Backend siap di: **http://localhost:8000** 🎉

---

## 🧪 Test API Endpoints

```bash
# List all sites
curl http://localhost:8000/api/sites/

# Get site detail
curl http://localhost:8000/api/sites/NYK/

# Get dashboard for site
curl http://localhost:8000/api/sites/NYK/dashboard/

# Get history
curl http://localhost:8000/api/sites/NYK/history/?limit=50
```

---

Semua code sudah **copy-paste ready**! Tinggal buat file sesuai nama dan paste code-nya. 🚀
