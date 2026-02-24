import { useAuth } from "../../../context/useAuth.ts"
import OrdersPage from "../../../pages/orders/OrdersPage.tsx"
import VendorOrdersPage from "../../../pages/orders/VendorOrdersPage.tsx"

function OrdersTab() {
    const { user } = useAuth()



    return (
        <>
            {user?.role === 'vendor' ? (<VendorOrdersPage />) : (<OrdersPage />)}
        </>

    )
}

export default OrdersTab
