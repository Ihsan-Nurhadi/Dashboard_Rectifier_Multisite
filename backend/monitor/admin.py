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