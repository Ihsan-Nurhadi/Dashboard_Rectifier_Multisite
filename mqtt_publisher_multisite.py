"""
MQTT Publisher untuk Multi-Site Testing
Publish data ke 3 sites: NYK, BSD, JKT
"""

import json
import time
import random
import paho.mqtt.client as mqtt
from datetime import datetime

# MQTT Configuration
MQTT_BROKER = "broker.emqx.io"
MQTT_PORT = 1883
MQTT_CLIENT_ID = f"multisite_publisher_{random.randint(1000, 9999)}"

# Sites configuration - matching frontend map sites
# NOTE: NYK Workshop receives REAL device data via Node-RED -> MQTT topic 'rectifier/data'
#       Other sites are simulated by this publisher
SITES = [
    {
        'site_code': 'NYK',
        'site_name': 'NYK Workshop',
        'latitude': -6.305489,
        'longitude': 106.958651,
        'region': 'Jakarta Timur',
        'project_id': '23XL05C0027',
        'real_device': True,  # Real data from Node-RED -> rectifier/data topic
    },
    {
        'site_code': 'JKT',
        'site_name': 'Jakarta Data Center',
        'latitude': -6.2088,
        'longitude': 106.8456,
        'region': 'DKI Jakarta',
        'project_id': '23XL05C0001',
    },
    {
        'site_code': 'SBY',
        'site_name': 'Surabaya Rectifier Site',
        'latitude': -7.2575,
        'longitude': 112.7521,
        'region': 'East Java',
        'project_id': '23XL05C0002',
    },
    {
        'site_code': 'BDG',
        'site_name': 'Bandung Rectifier Site',
        'latitude': -6.9175,
        'longitude': 107.6191,
        'region': 'West Java',
        'project_id': '23XL05C0003',
    },
    {
        'site_code': 'SMG',
        'site_name': 'Semarang Rectifier Site',
        'latitude': -6.9667,
        'longitude': 110.4167,
        'region': 'Central Java',
        'project_id': '23XL05C0004',
    },
    {
        'site_code': 'MDN',
        'site_name': 'Medan Rectifier Site',
        'latitude': 3.5952,
        'longitude': 98.6722,
        'region': 'North Sumatra',
        'project_id': '23XL05C0005',
    },
    {
        'site_code': 'PLM',
        'site_name': 'Palembang Rectifier Site',
        'latitude': -2.9761,
        'longitude': 104.7754,
        'region': 'South Sumatra',
        'project_id': '23XL05C0006',
    },
    {
        'site_code': 'MKS',
        'site_name': 'Makassar Rectifier Site',
        'latitude': -5.1477,
        'longitude': 119.4327,
        'region': 'South Sulawesi',
        'project_id': '23XL05C0007',
    },
    {
        'site_code': 'BTM',
        'site_name': 'Batam Rectifier Site',
        'latitude': 1.1301,
        'longitude': 104.0529,
        'region': 'Riau Islands',
        'project_id': '23XL05C0008',
    },
    {
        'site_code': 'PKU',
        'site_name': 'Pekanbaru Rectifier Site',
        'latitude': 0.5333,
        'longitude': 101.4500,
        'region': 'Riau',
        'project_id': '23XL05C0009',
    },
    {
        'site_code': 'DPS',
        'site_name': 'Denpasar Rectifier Site',
        'latitude': -8.6705,
        'longitude': 115.2126,
        'region': 'Bali',
        'project_id': '23XL05C0010',
    },
]

# Only simulate sites that don't have real devices
SIMULATED_SITES = [s for s in SITES if not s.get('real_device')]


def generate_data_for_site(site):
    """Generate realistic data untuk site"""
    timestamp = int(time.time() * 1000)
    
    # Randomize status untuk testing
    statuses = ['Normal', 'Normal', 'Normal', 'Warning', 'Alarm']
    status = random.choice(statuses)
    
    data = {
        "ts": timestamp,
        "site_code": site['site_code'],
        "site_name": site['site_name'],
        "project_id": site['project_id'],
        "ladder": "Ladder-1",
        "sla": "2 Hour",
        "status_realtime": status,
        "status_ladder": random.choice(["Normal", "Over", "Under"]),
        "latitude": site['latitude'],
        "longitude": site['longitude'],
        "region": site['region'],
        
        # Environment
        "door_cabinet": random.choice(["Close", "Close", "Close", "Open"]),
        "battery_stolen": "Close",
        "temperature": round(random.uniform(28.0, 38.0), 1),
        "humidity": round(random.uniform(50.0, 75.0), 1),
        
        # Rectifier - vary by status
        "vac_input_l1": round(random.uniform(200.0, 230.0), 2),
        "vac_input_l2": round(random.uniform(200.0, 230.0), 2),
        "vac_input_l3": None,
        
        "vdc_output": round(random.uniform(48.0 if status == 'Alarm' else 52.0, 55.0), 2),
        "battery_current": round(random.uniform(-2.0, 2.0), 2),
        
        "iac_input_l1": None,
        "iac_input_l2": None,
        "iac_input_l3": None,
        
        "load_current": round(random.uniform(45.0, 75.0), 1),
        "load_power": round(random.uniform(2.0, 4.5), 2),
        
        "pac_load_l1": round(random.uniform(0.5, 2.0), 2),
        "pac_load_l2": round(random.uniform(0.5, 2.0), 2),
        "pac_load_l3": round(random.uniform(0.5, 2.0), 2),
        
        "rectifier_current": round(random.uniform(45.0, 75.0), 1),
        "total_power": round(random.uniform(2.0, 4.5), 2),
        
        # Battery Banks
        "battery_bank_1_voltage": round(random.uniform(51.5, 54.5), 2),
        "battery_bank_1_current": round(random.uniform(-0.5, 0.5), 2),
        "battery_bank_1_soc": round(random.uniform(90.0, 100.0), 1),
        "battery_bank_1_soh": round(random.uniform(95.0, 100.0), 1),
        
        "battery_bank_2_voltage": round(random.uniform(51.5, 54.5), 2),
        "battery_bank_2_current": round(random.uniform(-0.5, 0.5), 2),
        "battery_bank_2_soc": round(random.uniform(90.0, 100.0), 1),
        "battery_bank_2_soh": round(random.uniform(95.0, 100.0), 1),
        
        "battery_bank_3_voltage": round(random.uniform(51.5, 54.5), 2),
        "battery_bank_3_current": round(random.uniform(-0.5, 0.5), 2),
        "battery_bank_3_soc": round(random.uniform(90.0, 100.0), 1),
        "battery_bank_3_soh": round(random.uniform(95.0, 100.0), 1),
        
        "backup_duration": None,
        "time_remaining": None,
        "battery_status": random.choice(["Standby", "Standby", "Charging"]),
        "start_backup": "No data",
        "soc_avg": round(random.uniform(90.0, 100.0), 1),
        
        # Modules
        "modules_status": [
            {"id": 1, "status": random.choice(["Normal", "Fault", "Protect"]), "value": "LK23290..."},
            {"id": 2, "status": random.choice(["Normal", "Fault"]), "value": "LK23140..."},
            {"id": 3, "status": "Normal", "value": "LK23140..."},
            {"id": 4, "status": "Normal", "value": "LK23290..."},
            {"id": 5, "status": random.choice(["Normal", "AC Off"]), "value": "-"},
            {"id": 6, "status": "AC Off", "value": "-"},
        ]
    }
    
    return data


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("=" * 70)
        print("✓ Connected to MQTT Broker")
        print(f"  Broker: {MQTT_BROKER}:{MQTT_PORT}")
        print(f"  Simulating {len(SIMULATED_SITES)} sites (NYK uses real device data)")
        print("=" * 70)
        print("\n📊 Publishing multi-site data...")
        print("Press Ctrl+C to stop\n")
    else:
        print(f"✗ Connection failed, rc: {rc}")


def main():
    print("\n" + "=" * 70)
    print("Multi-Site MQTT Publisher")
    print("=" * 70)
    print(f"\n📡 Connecting to {MQTT_BROKER}:{MQTT_PORT}...")
    
    client = mqtt.Client(client_id=MQTT_CLIENT_ID)
    client.on_connect = on_connect
    
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
        time.sleep(2)
        
        count = 0
        while True:
            count += 1
            timestamp = datetime.now().strftime("%H:%M:%S")
            
            # Publish data untuk setiap simulated site (excludes JKT - real device)
            for site in SIMULATED_SITES:
                data = generate_data_for_site(site)
                topic = f"rectifier/{site['site_code']}/data"
                payload = json.dumps(data)
                
                result = client.publish(topic, payload, qos=1)
                
                if result.rc == mqtt.MQTT_ERR_SUCCESS:
                    status_icon = "🟢" if data['status_realtime'] == 'Normal' else "🟡" if data['status_realtime'] == 'Warning' else "🔴"
                    print(f"[{timestamp}] #{count} {status_icon} {site['site_code']}: VDC={data['vdc_output']}V Load={data['load_current']}A Temp={data['temperature']}°C Status={data['status_realtime']}")
                else:
                    print(f"[{timestamp}] #{count} ✗ Failed to publish to {site['site_code']}")
            
            print()  # Empty line between rounds
            time.sleep(3)  # Publish every 3 seconds
            
    except KeyboardInterrupt:
        print("\n\n" + "=" * 70)
        print("Stopping publisher...")
        print(f"Total rounds published: {count}")
        print("=" * 70)
    except Exception as e:
        print(f"\n✗ Error: {e}")
    finally:
        client.loop_stop()
        client.disconnect()
        print("Disconnected from MQTT broker\n")


if __name__ == "__main__":
    main()