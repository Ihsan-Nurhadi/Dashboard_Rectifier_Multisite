"""
Seed sample sites untuk testing
Run: python manage.py shell < seed_sites.py
"""

from monitor.models import Site

# All 11 sites matching the frontend map (NYK = real device, rest = simulated)
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
        'site_code': 'JKT',
        'site_name': 'Jakarta Data Center',
        'latitude': -6.2088,
        'longitude': 106.8456,
        'address': 'Jl. Gatot Subroto, Jakarta Pusat',
        'region': 'DKI Jakarta',
        'project_id': '23XL05C0001',
        'ladder': 'Ladder-2',
        'sla': '1 Hour',
    },
    {
        'site_code': 'SBY',
        'site_name': 'Surabaya Rectifier Site',
        'latitude': -7.2575,
        'longitude': 112.7521,
        'address': 'Jl. Pemuda, Surabaya',
        'region': 'East Java',
        'project_id': '23XL05C0002',
        'ladder': 'Ladder-1',
        'sla': '2 Hour',
    },
    {
        'site_code': 'BDG',
        'site_name': 'Bandung Rectifier Site',
        'latitude': -6.9175,
        'longitude': 107.6191,
        'address': 'Jl. Asia Afrika, Bandung',
        'region': 'West Java',
        'project_id': '23XL05C0003',
        'ladder': 'Ladder-1',
        'sla': '2 Hour',
    },
    {
        'site_code': 'SMG',
        'site_name': 'Semarang Rectifier Site',
        'latitude': -6.9667,
        'longitude': 110.4167,
        'address': 'Jl. Pandanaran, Semarang',
        'region': 'Central Java',
        'project_id': '23XL05C0004',
        'ladder': 'Ladder-1',
        'sla': '2 Hour',
    },
    {
        'site_code': 'MDN',
        'site_name': 'Medan Rectifier Site',
        'latitude': 3.5952,
        'longitude': 98.6722,
        'address': 'Jl. Sisingamangaraja, Medan',
        'region': 'North Sumatra',
        'project_id': '23XL05C0005',
        'ladder': 'Ladder-2',
        'sla': '4 Hour',
    },
    {
        'site_code': 'PLM',
        'site_name': 'Palembang Rectifier Site',
        'latitude': -2.9761,
        'longitude': 104.7754,
        'address': 'Jl. Jend. Sudirman, Palembang',
        'region': 'South Sumatra',
        'project_id': '23XL05C0006',
        'ladder': 'Ladder-1',
        'sla': '4 Hour',
    },
    {
        'site_code': 'MKS',
        'site_name': 'Makassar Rectifier Site',
        'latitude': -5.1477,
        'longitude': 119.4327,
        'address': 'Jl. Pettarani, Makassar',
        'region': 'South Sulawesi',
        'project_id': '23XL05C0007',
        'ladder': 'Ladder-1',
        'sla': '4 Hour',
    },
    {
        'site_code': 'BTM',
        'site_name': 'Batam Rectifier Site',
        'latitude': 1.1301,
        'longitude': 104.0529,
        'address': 'Batam Center, Batam',
        'region': 'Riau Islands',
        'project_id': '23XL05C0008',
        'ladder': 'Ladder-2',
        'sla': '4 Hour',
    },
    {
        'site_code': 'PKU',
        'site_name': 'Pekanbaru Rectifier Site',
        'latitude': 0.5333,
        'longitude': 101.4500,
        'address': 'Jl. Jend. Sudirman, Pekanbaru',
        'region': 'Riau',
        'project_id': '23XL05C0009',
        'ladder': 'Ladder-1',
        'sla': '4 Hour',
    },
    {
        'site_code': 'DPS',
        'site_name': 'Denpasar Rectifier Site',
        'latitude': -8.6705,
        'longitude': 115.2126,
        'address': 'Jl. Teuku Umar, Denpasar',
        'region': 'Bali',
        'project_id': '23XL05C0010',
        'ladder': 'Ladder-1',
        'sla': '2 Hour',
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