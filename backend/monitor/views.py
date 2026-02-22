from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Site, RectifierData
from .serializers import (
    SiteListSerializer,
    SiteDetailSerializer,
    RectifierDataSerializer,
    DashboardDataSerializer,
)


class SiteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet untuk Site

    Endpoints:
    - GET /api/sites/                         - List semua site dengan latest data
    - GET /api/sites/{site_code}/             - Detail site
    - GET /api/sites/{site_code}/dashboard/   - Dashboard data
    - GET /api/sites/{site_code}/history/     - Historical data
    - GET /api/sites/{site_code}/latest/      - Data terbaru saja
    """
    queryset = Site.objects.filter(is_active=True)
    lookup_field = 'site_code'

    def get_serializer_class(self):
        if self.action == 'list':
            return SiteListSerializer
        return SiteDetailSerializer

    def get_queryset(self):
        """
        PERBAIKAN KRITIS:
        Sebelumnya menggunakan prefetch_related('rectifier_data') yang memuat
        SELURUH histori data ke memory → menyebabkan OOM dan WORKER TIMEOUT.

        Sekarang: hanya filter site yang aktif, tanpa prefetch apapun.
        SiteListSerializer akan fetch 1 row terbaru per site secara efisien
        menggunakan _latest_data_cache.
        """
        queryset = Site.objects.filter(is_active=True)

        # Filter by region
        region = self.request.query_params.get('region')
        if region:
            queryset = queryset.filter(region__icontains=region)

        return queryset

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
        """Get historical data untuk specific site (max 1000 row)"""
        site = self.get_object()

        limit = int(request.query_params.get('limit', 100))
        if limit > 1000:
            limit = 1000

        data = RectifierData.objects.filter(site=site).order_by('-timestamp')[:limit]
        serializer = RectifierDataSerializer(data, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def latest(self, request, site_code=None):
        """Get latest data saja untuk specific site"""
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
    ViewSet untuk RectifierData (backward compatibility)
    """
    queryset = RectifierData.objects.all()
    serializer_class = RectifierDataSerializer

    def get_queryset(self):
        queryset = RectifierData.objects.all()

        site_code = self.request.query_params.get('site_code')
        if site_code:
            queryset = queryset.filter(site__site_code=site_code)

        limit = int(self.request.query_params.get('limit', 100))
        if limit > 1000:
            limit = 1000

        return queryset.order_by('-timestamp')[:limit]