"""
Management command: cleanup_old_data
-------------------------------------
Menghapus semua baris RectifierData yang usianya lebih dari RETAIN_DAYS hari.
Default: simpan hanya data 1 hari terakhir.

Cara pakai:
    python manage.py cleanup_old_data              # hapus > 1 hari
    python manage.py cleanup_old_data --days 3     # hapus > 3 hari
    python manage.py cleanup_old_data --dry-run    # preview tanpa hapus
"""

import logging
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from monitor.models import RectifierData

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Hapus RectifierData yang lebih lama dari N hari (default: 1 hari)"

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=1,
            help='Simpan data berapa hari terakhir (default: 1)',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Hanya tampilkan jumlah yang akan dihapus, tanpa benar-benar menghapus',
        )

    def handle(self, *args, **options):
        retain_days = options['days']
        dry_run = options['dry_run']

        cutoff_time = timezone.now() - timedelta(days=retain_days)

        self.stdout.write(
            f"[cleanup_old_data] Cutoff: {cutoff_time.strftime('%Y-%m-%d %H:%M:%S')} UTC\n"
            f"                   Retain : data {retain_days} hari terakhir\n"
        )

        # Hitung berapa banyak yang akan dihapus
        qs = RectifierData.objects.filter(created_at__lt=cutoff_time)
        count = qs.count()

        if count == 0:
            self.stdout.write(self.style.SUCCESS("Tidak ada data lama. Database sudah bersih."))
            return

        self.stdout.write(f"Ditemukan {count:,} baris data lama yang akan dihapus.")

        if dry_run:
            self.stdout.write(self.style.WARNING(
                f"[DRY RUN] {count:,} baris TIDAK dihapus karena mode --dry-run aktif."
            ))
            return

        # Hapus dalam batch agar tidak lock tabel terlalu lama
        BATCH_SIZE = 5000
        total_deleted = 0

        while True:
            # Ambil ID batch pertama lalu hapus berdasarkan ID
            batch_ids = list(
                RectifierData.objects.filter(created_at__lt=cutoff_time)
                .values_list('id', flat=True)[:BATCH_SIZE]
            )
            if not batch_ids:
                break

            deleted, _ = RectifierData.objects.filter(id__in=batch_ids).delete()
            total_deleted += deleted
            self.stdout.write(f"  ... terhapus {total_deleted:,} / {count:,} baris")

        self.stdout.write(self.style.SUCCESS(
            f"[SELESAI] Total {total_deleted:,} baris data lama berhasil dihapus."
        ))
        logger.info("cleanup_old_data: deleted %d rows older than %d day(s)", total_deleted, retain_days)
