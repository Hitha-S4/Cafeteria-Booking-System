import { useAuth } from "@/components/auth/AuthContext";

const getInitials = (name: string) => {
  const names = name.trim().split(" ");
  return names.length >= 2
    ? names[0][0] + names[names.length - 1][0]
    : names[0][0] + names[0][1];
};

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <p className="p-4">No user logged in.</p>;
  }

  return (
    <div className="w-full px-6 md:px-16 py-10 space-y-8">
      {/* Header section */}
      <div className="bg-bluedollar text-white rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-white text-bluedollar text-3xl font-bold flex items-center justify-center shadow-md">
          {getInitials(user.name).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <p className="text-white/90">{user.email}</p>
          <span className="inline-block mt-2 px-3 py-1 text-sm bg-white text-bluedollar font-medium rounded-full">
            {user.role}
          </span>
        </div>
      </div>

      {/* Details section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blue Dollars */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-blue-600 font-medium">Blue Dollars</p>
          <p className="text-3xl font-bold text-bluedollar">
            {user.blueDollars}
          </p>
        </div>

        {/* Manager Info */}
        {user.managerId && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Reports To</p>
            <p className="text-lg font-semibold text-gray-800">
              {user.managerName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
