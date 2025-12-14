import NewUserForm from '@/components/forms/user/NewUser';

export default () => {
    return (
        <div className='flex w-full h-screen bg-gray-100 items-center justify-center'>
            <div className='flex w-[900px] h-[600px] bg-white p-4 rounded-md items-center justify-center'>        
                <NewUserForm />
            </div>
        </div>
    );
}