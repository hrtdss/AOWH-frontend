import { useNavigate } from 'react-router-dom'


const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <section className='flex items-center h-screen text-[#2c3e50] bg-[#f0f0f3] p-4'>
            <div className='flex flex-col items-center justify-center px-5 mx-auto my-8'>
                <div className='max-w-md text-center'>
                    <h2 className='font-extrabold text-9xl mb-8'>
                        404
                    </h2>

                    <p className='text-2xl font-semibold md:text-3xl'>
                        Sorry, we couldn't find this page.
                    </p>

                    <p className='mt-4 mb-8'>
                        But dont worry, you can find plenty of other things from homepage.
                    </p>
                    
                    <button className='font-semibold text-white px-8 py-3 rounded-md bg-orange-400 select-none' onClick={() => navigate('/AOWH-frontend/', {replace: true})}>
                        Вернуться на главную
                    </button>
                </div>
            </div>
        </section>
    ) 
}

export default ErrorPage