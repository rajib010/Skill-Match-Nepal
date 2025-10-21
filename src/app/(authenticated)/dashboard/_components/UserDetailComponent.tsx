import React from "react";
import UserImage from "./UserImage";

interface iAppProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customer: any;
}

function UserDetailComponent({ customer }: iAppProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex gap-6">
        {/* Large Circular Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-50 shadow-lg">
            <UserImage src={customer.user.image} className="w-full h-full" />
          </div>
        </div>

        {/* Customer Information */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-5">{customer.user.name}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex-1 min-w-0">
              <p className="profile-header">CONTACT</p>
              <p className="font-semibold text-gray-900">
                {customer.contactNumber}
              </p>
            </div>

            <div className="flex-1 min-w-0">
              <p className="profile-header">EMAIL</p>
              <p className="font-semibold text-gray-900 truncate">
                {customer.user.email || "N/A"}
              </p>
            </div>

            <div className="flex-1 min-w-0">
              <p className="profile-header">AGE</p>
              <p className="font-semibold text-gray-900">
                {customer.age} years
              </p>
            </div>

            <div className="flex-1 min-w-0">
              <p className="profile-header">ADDRESS</p>
              <p className="font-semibold text-gray-900">
                {customer.address || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailComponent;
