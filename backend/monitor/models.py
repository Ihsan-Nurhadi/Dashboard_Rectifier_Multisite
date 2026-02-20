from django.db import models
from django.utils import timezone
from django.db.models import OuterRef, Subquery

class Site(models.Model):
    """Master data untuk setiap site/lokasi"""
    site_code = models.CharField(max_length=50, unique=True, db_index=True)
    site_name = models.CharField(max_length=255)
    
    # Location
    latitude = models.FloatField()
    longitude = models.FloatField()
    address = models.TextField(blank=True)
    region = models.CharField(max_length=100, blank=True)
    
    # Contact & Info
    project_id = models.CharField(max_length=100, blank=True)
    ladder = models.CharField(max_length=50, blank=True)
    sla = models.CharField(max_length=50, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['site_name']
        indexes = [
            models.Index(fields=['site_code']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.site_name} ({self.site_code})"
    
    def get_latest_data(self):
        """Get latest rectifier data for this site"""
        return self.rectifier_data.first()
    
    def get_status(self):
        """Get current status based on latest data"""
        latest = self.get_latest_data()
        if not latest:
            return 'Unknown'
        return latest.status_realtime


class RectifierData(models.Model):
    """Data rectifier per site"""
    site = models.ForeignKey(
        Site, 
        on_delete=models.CASCADE, 
        related_name='rectifier_data'
    )
    timestamp = models.BigIntegerField(db_index=True)
    
    # Site Info (denormalized untuk query cepat)
    site_name = models.CharField(max_length=255, default='')
    project_id = models.CharField(max_length=255, default='')
    ladder = models.CharField(max_length=100, default='')
    sla = models.CharField(max_length=100, default='')
    status_realtime = models.CharField(max_length=50, default='Normal', db_index=True)
    status_ladder = models.CharField(max_length=50, default='Normal')
    
    # Location (denormalized)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    
    # Environment Status
    door_cabinet = models.CharField(max_length=20, default='Close')
    battery_stolen = models.CharField(max_length=20, default='Close')
    temperature = models.FloatField(null=True, blank=True, default=0)
    humidity = models.FloatField(null=True, blank=True, default=0)
    
    # Rectifier Status
    vac_input_l1 = models.FloatField(default=0)
    vac_input_l2 = models.FloatField(default=0)
    vac_input_l3 = models.FloatField(null=True, blank=True)
    vdc_output = models.FloatField(default=0)
    battery_current = models.FloatField(null=True, blank=True, default=0)
    iac_input_l1 = models.FloatField(null=True, blank=True)
    iac_input_l2 = models.FloatField(null=True, blank=True)
    iac_input_l3 = models.FloatField(null=True, blank=True)
    load_current = models.FloatField(null=True, blank=True, default=0)
    load_power = models.FloatField(null=True, blank=True, default=0)
    pac_load_l1 = models.FloatField(null=True, blank=True, default=0)
    pac_load_l2 = models.FloatField(null=True, blank=True, default=0)
    pac_load_l3 = models.FloatField(null=True, blank=True, default=0)
    rectifier_current = models.FloatField(null=True, blank=True, default=0)
    total_power = models.FloatField(null=True, blank=True, default=0)
    
    # Battery Banks
    battery_bank_1_voltage = models.FloatField(null=True, blank=True, default=0)
    battery_bank_1_current = models.FloatField(null=True, blank=True, default=0)
    battery_bank_1_soc = models.FloatField(null=True, blank=True, default=100)
    battery_bank_1_soh = models.FloatField(null=True, blank=True, default=100)
    
    battery_bank_2_voltage = models.FloatField(null=True, blank=True, default=0)
    battery_bank_2_current = models.FloatField(null=True, blank=True, default=0)
    battery_bank_2_soc = models.FloatField(null=True, blank=True, default=100)
    battery_bank_2_soh = models.FloatField(null=True, blank=True, default=100)
    
    battery_bank_3_voltage = models.FloatField(null=True, blank=True, default=0)
    battery_bank_3_current = models.FloatField(null=True, blank=True, default=0)
    battery_bank_3_soc = models.FloatField(null=True, blank=True, default=100)
    battery_bank_3_soh = models.FloatField(null=True, blank=True, default=100)
    
    # Battery Status
    backup_duration = models.IntegerField(null=True, blank=True)
    time_remaining = models.IntegerField(null=True, blank=True)
    battery_status = models.CharField(max_length=50, default='Standby')
    start_backup = models.CharField(max_length=100, default='No data')
    soc_avg = models.FloatField(null=True, blank=True, default=100)
    
    # Module Status
    modules_status = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['site', '-timestamp']),
            models.Index(fields=['-timestamp']),
            models.Index(fields=['status_realtime']),
        ]
    
    def __str__(self):
        return f"{self.site.site_code} - {self.timestamp}"
