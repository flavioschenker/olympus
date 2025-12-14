"use server";

import { Suspense } from "react";
import getUsers from "@/lib/data/users";
import UserRow from "@/components/users/UserRow";

export default async () => {
  return (
    <div className="w-full text-sm text-text-primary rounded-sm overflow-hidden"> {/* Table */ }
      <div className="font-bold">
        <div className="w-full grid gap-2 grid-cols-[3fr_3fr_5fr_80px] bg-gray-200"> {/* Table Header */ }
          <div className="px-2 py-3">
            First Name
          </div>
          <div className="px-2 py-3">
            Last Name
          </div>
          <div className="px-2 py-3">
            Email
          </div>
          <div className="px-2 py-3">
            Actions
          </div>
        </div>
      </div>
      <Suspense fallback={<TableLoading />}>
        <TableBody />
      </Suspense>
    </div>
  );
};

const TableBody = async () => {
  const users = await getUsers();
  console.log(users);

  return (
    <div className="[&>*:nth-child(even)]:bg-searchfield divide-y divide-border">
      {users.map((user) => (
        <UserRow key={user.public_id} user={user} />
      ))}
    </div>
  );
};

const TableLoading = () => {
  return (
    <div className="p-6 text-center text-lg">Loading...</div>
  );
}