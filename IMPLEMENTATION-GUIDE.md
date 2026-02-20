# Multi-Site Rectifier Monitoring - Local Development Guide

## 🎯 Overview

Implementasi multi-site monitoring dengan:
- Landing page dengan peta interaktif (Leaflet)
- List view dengan filter
- Detail dashboard per site
- SQLite untuk local development

## 📁 Structure Project

```
multisite-rectifier/
├── backend/                 # Django Backend
│   ├── rectifier_monitor/
│   ├── monitor/
│   ├── manage.py
│   ├── db.sqlite3          # Database local
│   └── requirements.txt
├── frontend/                # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    # Landing page (Map)
│   │   │   └── dashboard/[siteCode]/       # Detail per site
│   │   ├── components/
│   │   │   ├── site-monitoring/           # Map components
│   │   │   └── dashboard/                 # Dashboard components
│   │   └── services/
│   │       └── api.ts                     # API client
│   └── package.json
└── mqtt_publisher_multisite.py   # Test data multi-site
```

## 🚀 Setup Local Development

### 1. Backend Django

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Create migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed sample sites
python manage.py shell < seed_sites.py

# Run server
python manage.py runserver
```

Backend akan jalan di: **http://localhost:8000**

### 2. Frontend Next.js

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend akan jalan di: **http://localhost:3000**

### 3. MQTT Publisher Multi-Site

```bash
# Terminal terpisah
python mqtt_publisher_multisite.py
```

---

## 🗺️ Flow Multi-Site

### Landing Page Flow:

```
1. User buka http://localhost:3000
   ↓
2. Frontend fetch GET /api/sites/
   ↓
3. Tampil peta dengan markers
   ↓
4. Click marker atau list item
   ↓
5. Navigate ke /dashboard/{siteCode}
```

### API Endpoints:

```
GET /api/sites/
→ Return: List semua site + latest status

GET /api/sites/{siteCode}/
→ Return: Site detail + latest metrics

GET /api/sites/{siteCode}/dashboard/
→ Return: Full dashboard data (sama seperti sekarang)

GET /api/sites/{siteCode}/history/?limit=100
→ Return: Historical data untuk charting
```

---

## 📊 Database Schema

### Site Model:
```python
Site:
  - id
  - site_code (unique: NYK, BSD, JKT)
  - site_name (display: "NYK Workshop")
  - latitude, longitude
  - address, region
  - project_id, ladder, sla
  - is_active
```

### RectifierData Model:
```python
RectifierData:
  - site_id (FK to Site)
  - timestamp
  - [semua metrics seperti sekarang...]
```

---

## 🧪 Testing dengan Data Dummy

### Sample Sites:

```python
sites = [
    {
        'site_code': 'NYK',
        'site_name': 'NYK Workshop',
        'lat': -6.305489,
        'lng': 106.958651,
        'region': 'Jakarta Timur'
    },
    {
        'site_code': 'BSD',
        'site_name': 'BSD Office',
        'lat': -6.301934,
        'lng': 106.652817,
        'region': 'Tangerang Selatan'
    },
    {
        'site_code': 'JKT',
        'site_name': 'Jakarta Data Center',
        'lat': -6.211544,
        'lng': 106.845172,
        'region': 'Jakarta Pusat'
    }
]
```

### MQTT Topics:

```
rectifier/NYK/data  → Data untuk NYK
rectifier/BSD/data  → Data untuk BSD
rectifier/JKT/data  → Data untuk JKT

MQTT Listener subscribe: rectifier/+/data
```

---

## 🔄 Migration dari Single ke Multi-Site

### Step 1: Add Site model

```python
# monitor/models.py
class Site(models.Model):
    site_code = models.CharField(max_length=50, unique=True)
    site_name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    # ... fields lainnya
```

### Step 2: Add FK to RectifierData

```python
class RectifierData(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    # ... fields lainnya tetap sama
```

### Step 3: Migrate

```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 4: Seed initial sites

```bash
python manage.py shell < seed_sites.py
```

### Step 5: Update MQTT Listener

```python
# Parse site_code dari topic
topic_parts = msg.topic.split('/')
site_code = topic_parts[1]  # rectifier/NYK/data → NYK

# Get or create site
site, created = Site.objects.get_or_create(
    site_code=site_code,
    defaults={'site_name': payload.get('site_name', site_code)}
)

# Save data dengan site FK
RectifierData.objects.create(
    site=site,
    timestamp=payload['ts'],
    # ... rest of fields
)
```

---

## 🗺️ Landing Page Features

### Map Features:
- ✅ Interactive Leaflet map
- ✅ Custom markers per status (Normal=green, Warning=yellow, Alarm=red)
- ✅ Click marker → Preview popup
- ✅ Double click → Navigate to detail dashboard
- ✅ Zoom controls
- ✅ Search location

### Sidebar Features:
- ✅ List semua site
- ✅ Search/filter by name
- ✅ Filter by status
- ✅ Filter by region
- ✅ Sort by name, status, last update
- ✅ Click item → Highlight on map

### Site Preview Card:
- Site name & code
- Latest status & metrics
- Last update time
- Quick action button

---

## 🎨 UI Components

### Already Included:
- `SiteMap.tsx` - Leaflet map dengan markers
- `SiteMapHeader.tsx` - Header dengan logo & controls
- `SiteSidebar.tsx` - Sidebar dengan site list
- `SitePreviewCard.tsx` - Preview card per site
- All dashboard components (unchanged)

---

## 📱 Routing Structure

```
/                           → Landing page (map view)
/dashboard/{siteCode}       → Detail dashboard per site

Examples:
/dashboard/NYK              → NYK Workshop dashboard
/dashboard/BSD              → BSD Office dashboard
/dashboard/JKT              → JKT Data Center dashboard
```

---

## 🔧 Configuration

### Backend (.env):
```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (SQLite for local)
# No config needed - using db.sqlite3

# MQTT
MQTT_BROKER=broker.emqx.io
MQTT_PORT=1883
MQTT_TOPIC_PATTERN=rectifier/+/data
```

### Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_MAP_CENTER_LAT=-6.2
NEXT_PUBLIC_MAP_CENTER_LNG=106.8
NEXT_PUBLIC_MAP_ZOOM=11
```

---

## 📊 Performance Tips

### Backend:
```python
# Use select_related untuk avoid N+1 queries
sites = Site.objects.select_related().annotate(
    latest_vdc=Subquery(
        RectifierData.objects.filter(site=OuterRef('pk'))
        .order_by('-timestamp')
        .values('vdc_output')[:1]
    )
)

# Cache latest data per site (5 minutes)
@cache_page(60 * 5)
def sites_list(request):
    ...
```

### Frontend:
```typescript
// SWR untuk auto-refresh data
const { data, error } = useSWR(
  '/api/sites/',
  fetcher,
  { refreshInterval: 5000 } // Refresh tiap 5 detik
)
```

---

## 🧪 Testing Checklist

- [ ] Backend API `/api/sites/` return list sites
- [ ] Map menampilkan markers di lokasi yang benar
- [ ] Click marker show preview popup
- [ ] Click site di sidebar navigate ke dashboard
- [ ] Dashboard detail show data per site
- [ ] MQTT listener terima data multi-site
- [ ] Data masuk ke database dengan site FK yang benar
- [ ] Filter & search di sidebar berfungsi
- [ ] Map auto-center ke markers

---

## 🚀 Next Steps

Setelah local development OK:

1. **Testing dengan data real** dari rectifier
2. **Performance optimization** (caching, indexing)
3. **Add user authentication** (optional)
4. **Deploy ke VPS** dengan PostgreSQL
5. **Setup SSL** untuk production
6. **Add alerting system** (email/SMS untuk alarm)

---

## 📞 Troubleshooting

### Map tidak muncul:
```bash
# Install leaflet dependencies
cd frontend
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

### MQTT tidak terima data:
```bash
# Cek topic pattern
# Listener subscribe: rectifier/+/data
# Publisher publish: rectifier/{site_code}/data
```

### Database error:
```bash
# Reset database
rm db.sqlite3
python manage.py migrate
python manage.py shell < seed_sites.py
```

---

Ready untuk implementation! 🎉
