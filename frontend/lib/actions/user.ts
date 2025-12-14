'use server';
import { updateTag } from 'next/cache';

const BASE_URL = process.env.API_BASE_URL || 'http://backend:8000';

export async function createUser(formData: FormData): Promise<void> {
    const newUser = {
        first_name: formData.get('firstName'),
        last_name: formData.get('lastName'),
        email: formData.get('email'),
    }

    const res = await fetch(`${BASE_URL}/users`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser)
        }
    )
    
    if (!res.ok) {
        throw new Error(`Failed to create user: ${res.statusText}`);
    }

    updateTag('users');
}

export async function deleteUser(userId: string) {
    await fetch(`${BASE_URL}/users/${userId}`, 
        {
            method: 'DELETE',
        }
    );
    updateTag('users');
}