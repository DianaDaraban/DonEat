"""
Populates the database with demo stores and products, and keeps them fresh.

    python manage.py seed_demo

Safe to run on every start: it creates what is missing and, for the demo products,
moves `expires_at` back into the future and makes them available again, so the
public feed is never empty. Data created by real users is left untouched.

Demo accounts (password from the DEMO_PASSWORD env var, default below):
    demo_buyer                              - buyer
    food_company, food_mania, mama_food     - vendors, one store each
"""
import json
import os
from datetime import timedelta
from decimal import Decimal
from pathlib import Path

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from accounts.models import Store, UserProfile
from api.models import Category, Product

DATA_FILE = Path(__file__).with_name("demo_data.json")
DEFAULT_PASSWORD = "DonEat-demo-2026"

# Long, varied expiry dates (in days). Every run pushes them forward again, and the start
# script runs this on each boot, so even a server that stays up for weeks keeps a full feed.
EXPIRY_DAYS = [7, 9, 12, 14, 18, 21, 30, 45, 60, 90]


class Command(BaseCommand):
    help = "Create demo stores/products and push demo expiry dates into the future."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset-passwords",
            action="store_true",
            help="Also reset the demo accounts' passwords to DEMO_PASSWORD.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
        password = os.getenv("DEMO_PASSWORD", DEFAULT_PASSWORD)
        now = timezone.now()

        categories = {
            name: Category.objects.get_or_create(name=name)[0] for name in data["categories"]
        }

        self._account("demo_buyer", "buyer", password, options["reset_passwords"])

        owners = {}
        for s in data["stores"]:
            user = self._account(s["username"], "vendor", password, options["reset_passwords"])
            Store.objects.get_or_create(
                owner=user,
                defaults={
                    "name": s["name"],
                    "logo": s["logo"],
                    "description": s["description"],
                    "latitude": Decimal(s["latitude"]),
                    "longitude": Decimal(s["longitude"]),
                },
            )
            owners[s["username"]] = user

        created = refreshed = 0
        for i, p in enumerate(data["products"]):
            expires_at = now + timedelta(days=EXPIRY_DAYS[i % len(EXPIRY_DAYS)])
            product, was_created = Product.objects.get_or_create(
                slug=p["slug"],
                defaults={
                    "owner": owners[p["store"]],
                    "title": p["title"],
                    "description": p["description"],
                    "category": categories[p["category"]],
                    "quantity": p["quantity"],
                    "unit": p["unit"],
                    "price": Decimal(p["price"]) if p["price"] is not None else None,
                    "original_price": Decimal(p["original_price"]) if p["original_price"] else None,
                    "is_donation": p["is_donation"],
                    "location": p["location"],
                    "image": p["image"],
                    "expires_at": expires_at,
                },
            )
            if was_created:
                created += 1
                continue
            # Refresh only products that still belong to the demo store. Uses update() so the
            # post_save signals (wishlist "expiring soon" notifications and emails) don't fire.
            refreshed += Product.objects.filter(pk=product.pk, owner=owners[p["store"]]).update(
                expires_at=expires_at,
                is_available=True,
                quantity=max(product.quantity, p["quantity"]),
            )

        self.stdout.write(self.style.SUCCESS(
            f"Demo data ready: {created} products created, {refreshed} refreshed, "
            f"{len(owners)} stores, {len(categories)} categories."
        ))

    def _account(self, username, role, password, reset_password):
        user, created = User.objects.get_or_create(username=username)
        if created or reset_password:
            user.set_password(password)
            user.save()
        UserProfile.objects.get_or_create(user=user, defaults={"role": role})
        return user
