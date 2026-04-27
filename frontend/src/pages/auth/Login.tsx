import Form from '../../components/Form.tsx'
import { useLocation, useNavigate } from 'react-router-dom'

function Login() {
    const location = useLocation()
    const navigate = useNavigate()

    const from = location.state?.from || '/'

    const handleSuccess = () => navigate(from)

    return (
        <div className='flex justify-center items-center w-full h-full' style={{ minHeight: '100vh' }}>
            <Form method='login' onSuccess={handleSuccess} />
        </div>
    )

}
export default Login