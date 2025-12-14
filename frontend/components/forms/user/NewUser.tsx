import {createUser} from '@/lib/actions/user';
import TextInput from '@/components/primitives/TextInput';
import Button from '@/components/primitives/Button';

export default async () => {
    return (
        <form
            action={createUser}
            className='w-full grid gap-2 grid-cols-[3fr_3fr_5fr_80px]'>
            <TextInput
                type='text'
                name='firstName'
                placeholder='First Name'
            />
            <TextInput
                type='text'
                name='lastName'
                placeholder='Last Name'
            />
            <TextInput
                type='email'
                name='email'
                placeholder='Email'
            />
            <Button
                type='submit'
                name='submit'
            >
                Add
            </Button>
        </form>
    );
};