# 🚀 Quick Start - Multi-Site Rectifier Monitoring (Local Dev)

## 📦 Apa Yang Ada di Package Ini?

```
multisite-rectifier/
├── backend/                 # Django Backend (LENGKAP!)
│   ├── rectifier_monitor/   # Settings & config
│   ├── monitor/             # Main app dengan models, views, serializers
│   ├── manage.py
│   ├── requirements.txt
│   └── seed_sites.py        # Data dummy 3 site
├── frontend/                # Next.js Frontend dengan Map
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                  # Landing page (Leaflet Map)
│   │   │   └── dashboard/[siteCode]/     # Detail per site
│   │   ├── components/
│   │   │   ├── site-monitoring/          # Map components
│   │   │   └── dashboard/                # Dashboard components
│   │   └── services/api.ts               # API client
│   └── package.json
├── mqtt_listener_multisite.py    # MQTT listener standalone
└── mqtt_publisher_multisite.py   # Test data generator (3 sites)
```

---

## ⚡ Super Quick Start (5 Menit)

### Terminal 1 - Backend:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py loaddata seed_sites.json

python manage.py runserver
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Terminal 3 - MQTT Listener:
```bash
python mqtt_listener_multisite.py
```

### Terminal 4 - Test Data:
```bash
python mqtt_publisher_multisite.py
```

### Buka Browser:
```
http://localhost:3000  → Landing page dengan map
```

---

## 🗺️ What You'll See:

**Landing Page:**
- Interactive map (Leaflet)
- 3 markers: NYK (Jakarta Timur), BSD (Tangerang), JKT (Jakarta Pusat)
- Sidebar dengan list sites
- Real-time status (Normal/Warning/Alarm)

**Click Site:**
- Preview card dengan latest metrics
- Button "View Detail" → Navigate ke dashboard

**Dashboard Detail:**
- Full monitoring sama seperti single-site
- Semua metrics real-time
- Data per site terpisah

---

## 📊 Sample Sites:

| Code | Name | Location | Region |
|------|------|----------|--------|
| NYK | NYK Workshop | -6.305489, 106.958651 | Jakarta Timur |
| BSD | BSD Office | -6.301934, 106.652817 | Tangerang Selatan |
| JKT | Jakarta Data Center | -6.211544, 106.845172 | Jakarta Pusat |

---

## 🧪 Testing:

1. **Map markers muncul?** ✅
2. **Click marker → preview card?** ✅
3. **Click "View Detail" → dashboard?** ✅
4. **Data update real-time?** ✅
5. **Filter di sidebar work?** ✅

---

## 🔧 Configuration:

### Backend (.env - optional):
```env
MQTT_BROKER=broker.emqx.io
MQTT_PORT=1883
MQTT_TOPIC_PATTERN=rectifier/+/data
```

### Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 📡 MQTT Topics:

```
rectifier/NYK/data   → NYK Workshop data
rectifier/BSD/data   → BSD Office data
rectifier/JKT/data   → Jakarta DC data
```

Listener subscribe: `rectifier/+/data` (all sites)

---

## 🆘 Troubleshooting:

**Map tidak muncul:**
```bash
cd frontend
npm install leaflet react-leaflet
```

**No data di map:**
```bash
# Jalankan publisher
python mqtt_publisher_multisite.py

# Check API
curl http://localhost:8000/api/sites/
```

**Database error:**
```bash
cd backend
rm db.sqlite3
python manage.py migrate
python manage.py loaddata seed_sites.json
```

---

## 🎯 Next: Deploy ke VPS

Setelah local dev OK, siap deploy ke VPS dengan:
- PostgreSQL (replace SQLite)
- Docker Compose
- Nginx reverse proxy
- SSL dengan Let's Encrypt

Tapi testing di local dulu! 🚀
