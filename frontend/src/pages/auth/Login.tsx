import Form from '../../components/Form.tsx'
import { useLocation, useNavigate } from 'react-router-dom'

function Login() {
    const location = useLocation()
    const navigate = useNavigate()

    const from = location.state?.from || '/'

    const handleSuccess = () => navigate(from)

    return <Form method='login' onSuccess={handleSuccess} />
}
export default Login