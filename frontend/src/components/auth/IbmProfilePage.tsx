import { useAuth } from "@/components/auth/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const getInitials = (name: string) => {
  const names = name.trim().split(" ");
  return names.length >= 2
    ? names[0][0] + names[names.length - 1][0]
    : names[0][0] + (names[0][1] || "");
};

const IbmProfilePage = () => {
  const { user } = useAuth();
  const [ibmUser, setIbmUser] = useState<any>(null);
  const [localUser, setLocalUser] = useState<any>(user);
  const navigate = useNavigate();

  useEffect(() => {
    const storedIbmUser = localStorage.getItem("ibm_user");
    if (storedIbmUser) {
      setIbmUser(JSON.parse(storedIbmUser));
    }

    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setLocalUser(JSON.parse(storedUser));
      }
    }
  }, [user]);

  const finalUser = user || localUser;

  if (!ibmUser || !finalUser) {
    return <p className="p-4">No user logged in.</p>;
  }

  const fullName =
    ibmUser.content?.name?.first + " " + ibmUser.content?.name?.last;
  const initials = getInitials(fullName).toUpperCase();
  const email = ibmUser.content?.preferredIdentity;
  const mobile = ibmUser.content?.telephone?.mobile;
  const location = ibmUser.content?.address?.business?.location;
  const workLocation = ibmUser.content?.workLocation?.building;
  const employeeId = ibmUser.content?.uid;
  const manager = ibmUser.content?.functionalManager?.nameDisplay;
  const department = ibmUser.content?.org?.unit;
  const costCenter = ibmUser.content?.costCenter;
  const startDate = ibmUser.content?.startDate;
  const title = ibmUser.content?.employeeType?.title;
  const managerName = ibmUser.content?.functionalManager?.nameDisplay;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg">
        <div className="w-24 h-24 rounded-full bg-white text-bluedollar text-3xl font-bold flex items-center justify-center shadow-inner">
          {initials}
        </div>
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-bold">{fullName}</h1>
          <p className="text-sm text-blue-100">{email}</p>
          <span className="inline-block mt-2 px-3 py-1 text-sm bg-white text-bluedollar font-medium rounded-full">
            {finalUser.role}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm">Blue Dollars</p>
          <p className="text-3xl font-bold">{finalUser.blueDollars}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCard label="Employee ID" value={employeeId} />
        <ProfileCard label="Mobile" value={mobile} />
        <ProfileCard label="Location" value={location} />
        <ProfileCard label="Work Location" value={workLocation} />
        <ProfileCard label="Start Date" value={startDate} />
        <ProfileCard label="Title" value={title} />
        <ProfileCard label="Department" value={department} />
        <ProfileCard label="Cost Center" value={costCenter} />
        {finalUser.managerId && (
          <ProfileCard label="Reports To" value={managerName || manager} />
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-bluedollar text-white px-4 py-2 rounded-lg hover:bg-bluedollar-dark transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

const ProfileCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
    <p className="text-sm text-gray-500 font-medium">{label}</p>
    <p className="text-lg font-semibold text-gray-800">{value || "—"}</p>
  </div>
);

export default IbmProfilePage;
