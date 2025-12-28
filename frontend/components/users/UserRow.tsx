


'use client'
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { PiTrashLight, PiPencilLight, PiCheckLight, PiXLight } from "react-icons/pi";
import User from "@/lib/types/user";

// Assume this server action is defined elsewhere and handles the patch request
// Example signature: export async function patchUser(formData: FormData) { ... }
const patchUser = async (formData: FormData) => {
    // This is a placeholder for the actual server action call.
    // In a real application, you would import and call the server action here.
    console.log("Simulating server action call with data:", Object.fromEntries(formData.entries()));
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    console.log("Patch successful (simulated)");
    return { success: true };
};


// Component to handle the submit button state (useful for server actions)
function SubmitButton({ onClickCancel }: { onClickCancel: () => void }) {
    const { pending } = useFormStatus();

    return (
        <div className="flex justify-center items-center py-2 px-2">
            <button
                type="submit"
                className={`p-1 cursor-pointer h-full ${pending ? 'text-gray-500' : 'hover:text-green-600'}`}
                disabled={pending}
                title={pending ? "Saving..." : "Save changes"}
            >
                {/* Checkmark icon for saving */}
                <PiCheckLight className="h-full w-full" />
            </button>
            <button
                type="button" // Important: must be 'button' to prevent form submission
                onClick={onClickCancel}
                className="p-1 cursor-pointer h-full hover:text-red-900 ml-1"
                disabled={pending}
                title="Cancel editing"
            >
                {/* X icon for cancelling */}
                <PiXLight className="h-full w-full" />
            </button>
        </div>
    );
}

// Component for the Edit/Delete actions in display mode
function ActionButtons({ onEdit }: { onEdit: () => void }) {
    return (
        <div className="flex justify-center items-center py-2 px-2">
            <button
                onClick={onEdit}
                className="p-1 cursor-pointer h-full hover:text-blue-600"
                title="Edit user details"
            >
                {/* Pencil icon for editing */}
                <PiPencilLight className="h-full w-full" />
            </button>
            <button
                className="p-1 cursor-pointer h-full hover:text-red-900 ml-1"
                title="Delete user"
            >
                {/* Trash icon for deleting */}
                <PiTrashLight className="h-full w-full" />
            </button>
        </div>
    );
}

// Main User component
export default function UserRow({ user }: { user: User }) {
    const [isEditing, setIsEditing] = useState(false);

    const onEdit = () => setIsEditing(true);
    const onCancel = () => setIsEditing(false);

    const formAction = async (formData: FormData) => {
        // You might want to pass the user ID as a hidden field or via a closure if not in formData
        formData.append('id', user.id); // Assuming User has an 'id' field

        const result = await patchUser(formData);
        
        // Assuming patchUser returns a successful status, exit editing mode
        if (result && result.success) {
            setIsEditing(false);
            // Optional: Revalidate the data here if needed (e.g., revalidatePath('/users'))
        }
    };

    return (
        <form 
            action={formAction} // Use the server action as the form action
            className="w-full grid gap-2 grid-cols-[3fr_3fr_5fr_80px] border-b border-gray-200"
        >
            {isEditing ? (
                // --- EDIT MODE (Inline Form) ---
                <>
                    <div className="px-2 py-2">
                        <input
                            type="text"
                            name="first_name"
                            defaultValue={user.first_name}
                            className="w-full border rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="px-2 py-2">
                        <input
                            type="text"
                            name="last_name"
                            defaultValue={user.last_name}
                            className="w-full border rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="px-2 py-2">
                        <input
                            type="email"
                            name="email"
                            defaultValue={user.email}
                            className="w-full border rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <SubmitButton onClickCancel={onCancel} />
                </>
            ) : (
                // --- DISPLAY MODE ---
                <>
                    <div className="px-2 py-3">
                        {user.first_name}
                    </div>
                    <div className="px-2 py-3">
                        {user.last_name}
                    </div>
                    <div className="px-2 py-3">
                        {user.email}
                    </div>
                    <ActionButtons onEdit={onEdit} />
                </>
            )}
        </form>
    );
}