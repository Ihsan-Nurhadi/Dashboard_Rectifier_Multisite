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