from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteViewSet, RectifierDataViewSet

router = DefaultRouter()
router.register(r'sites', SiteViewSet, basename='site')
router.register(r'rectifier', RectifierDataViewSet, basename='rectifier')

urlpatterns = [
    path('', include(router.urls)),
]