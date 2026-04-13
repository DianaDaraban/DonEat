from backend.database import app, db
from flask import request, jsonify
from backend.models import Product
from flask_cors import CORS

CORS(app)  # activează CORS pentru toate originile

@app.route('/products', methods=['GET'])
def get_products_list():
    products = Product.query.all()
    json_products = [p.to_json() for p in products]
    return jsonify(json_products)

@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    print(data)  # pentru debugging

    product_name = data.get("productName")
    price = data.get("price")
    vendor_name = data.get("vendorName")
    product_description = data.get("productDescription")
    warranty_date = data.get("warrantyDate")  # poate fi None

    if not product_name or not price or not vendor_name:
        return jsonify({"error": "You must include a product name, price and vendor name!"}), 400

    new_product = Product(
        product_name=product_name,
        price=price,
        vendor_name=vendor_name,
        product_description=product_description,
        warranty_date=warranty_date
    )

    try:
        db.session.add(new_product)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "A new product has been added!"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # creează doneatdatabase.db cu noile coloane
    app.run(host='0.0.0.0', debug=True)
