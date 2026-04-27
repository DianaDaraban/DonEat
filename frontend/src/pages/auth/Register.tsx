import Form from '../../components/Form.tsx'

function Register() {
    return (
        <div className='flex justify-center items-center' style={{ minHeight: '100vh', paddingTop: '4rem' }}>
            <Form method='register' />
        </div>
    )
}
export default Register