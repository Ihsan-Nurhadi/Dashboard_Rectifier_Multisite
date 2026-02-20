"""
MQTT Listener untuk Multi-Site
Subscribe ke:
  - rectifier/+/data   (simulated sites)
  - rectifier/data      (real device -> mapped to JKT)
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

# Real device topic mapping
# Topic 'rectifier/data' (real device from Node-RED) -> mapped to NYK Workshop
REAL_DEVICE_TOPIC = 'rectifier/data'
REAL_DEVICE_SITE_CODE = 'NYK'


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logger.info(f"✓ Connected to MQTT Broker: {settings.MQTT_BROKER}")
        # Subscribe to simulated multi-site topics
        client.subscribe(settings.MQTT_TOPIC_PATTERN)
        logger.info(f"✓ Subscribed to: {settings.MQTT_TOPIC_PATTERN}")
        # Subscribe to real device topic
        client.subscribe(REAL_DEVICE_TOPIC)
        logger.info(f"✓ Subscribed to real device: {REAL_DEVICE_TOPIC} -> site {REAL_DEVICE_SITE_CODE}")
    else:
        logger.error(f"✗ Connection failed, rc: {rc}")


def on_message(client, userdata, msg):
    try:
        # Determine site_code based on topic
        topic_parts = msg.topic.split('/')
        
        if msg.topic == REAL_DEVICE_TOPIC:
            # Real device: rectifier/data -> map to JKT
            site_code = REAL_DEVICE_SITE_CODE
            logger.info(f"📡 REAL DEVICE data received -> mapped to site: {site_code}")
        elif len(topic_parts) == 3:
            # Simulated: rectifier/{site_code}/data
            site_code = topic_parts[1]
            logger.info(f"Received simulated data for site: {site_code}")
        else:
            logger.error(f"Invalid topic format: {msg.topic}")
            return
        
        # Parse payload
        payload = json.loads(msg.payload.decode())
        
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