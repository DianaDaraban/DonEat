from backend.database import db
from sqlalchemy import Date

class Product(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    product_name = db.Column(db.String(200), unique=False, nullable=False)
    price=db.Column(db.String(80), unique=False, nullable=False)
    vendor_name = db.Column(db.String(500), unique=False, nullable=False)
    product_description = db.Column(db.String(500), unique=False, nullable=False)
    warranty_date = db.Column(db.String(80), nullable=True)

    def to_json(self):
        return {
            "id":self.id,
            "productName":self.product_name,
            "price":self.price,
            "vendorName":self.vendor_name,
            "productDescription":self.product_description,
            "warrantyDate": self.warranty_date
        }