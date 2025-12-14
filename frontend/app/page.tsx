import NewUserForm from "@/components/forms/user/NewUser";
import UsersList from "@/components/users/UsersList";

export default async () => {
    return (
        <div className='flex flex-col w-full h-screen justify-start items-center'>
            <div className="h-24 w-full border-b border-border pl-7 flex items-center">
                <p className="text-xl">Hello, Flavio!</p>
            </div>
            <div className="p-5 w-full flex flex-row gap-5">
                <div className='flex flex-col p-5 gap-7 flex-1 border border-border rounded-3xl items-center justify-center '>        
                    <h1 className='text-2xl'>User Management</h1>
                    <NewUserForm />
                    <UsersList />
                </div>
                <div className='flex flex-col p-5 gap-7 flex-1 border border-border rounded-3xl items-center justify-center '>        
                    <h1 className='text-2xl'>Space Management</h1>
                    <NewUserForm />
                    <UsersList />
                </div>
            </div>
        </div>
    )
}