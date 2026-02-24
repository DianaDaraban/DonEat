export interface VendorOrder {
    order_id: number,
    order_date: Date,
    order_status: string,
    buyer: string,
    product_title: string,
    quantity: string,
    price: number,
    total: number,
}