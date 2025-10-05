import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingForm from "../booking/BookingForm";
import BookingCard from "../booking/BookingCard";
import { Booking } from "@/types";
import { toast } from "sonner";
import { useAuth } from "../auth/AuthContext";
import api, { fetchPendingApprovals } from "@/services/api";
import { Switch } from "../ui/switch";

const ManagerDashboard = () => {
  const { user: user_local } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<Booking[]>([]);
  const [blueDollars, setBlueDollars] = useState(user_local?.blueDollars || 0);
  const [user, setUser] = useState(user_local);

  useEffect(() => {
    const fetchManagerBookings = async () => {
      if (!user?.id) return;

      try {
        const [approvedRes, pendingRes] = await Promise.all([
          api.get(`/bookings/manager/${user.id}/approved`),
          api.get(`/bookings/manager/${user.id}/pending`),
        ]);

        setBookings(approvedRes.data);
        setPendingApprovals(pendingRes.data);
      } catch (error) {
        console.error("Error fetching manager bookings:", error);
        toast.error("Failed to load bookings");
      }
    };

    fetchManagerBookings();
  }, [user]);

  const handleApproveBooking = async (bookingId: string) => {
    const booking = pendingApprovals.find((b) => b.id === bookingId);

    if (!booking) return;

    try {
      // API call to approve booking
      await api.patch(`/bookings/${bookingId}/approve`);

      // Update local state for UI
      setPendingApprovals((prevApprovals) =>
        prevApprovals.filter((b) => b.id !== bookingId)
      );

      setBlueDollars((prev) => prev - booking.cost);

      toast.success("Booking approved successfully");
    } catch (error) {
      toast.error("Failed to approve booking");
      console.error("Approval error:", error);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    const booking = pendingApprovals.find((b) => b.id === bookingId);

    if (!booking) return;

    try {
      if (booking.status.toLocaleLowerCase() === "pending") {
        // Reject new booking
        // API call to reject booking (if integrated with backend)
        await api.patch(`/bookings/${bookingId}/reject`);

        // Remove the rejected booking from pending approvals
        setPendingApprovals((prevApprovals) =>
          prevApprovals.filter((b) => b.id !== bookingId)
        );

        toast.success("Booking rejected");
      } else if (
        booking.status.toLocaleLowerCase() === "pending_cancellation"
      ) {
        // Reject cancellation request
        // API call to reject cancellation (if integrated with backend)
        await api.patch(`/bookings/${bookingId}/reject-cancellation`);

        // Remove the rejected cancellation request from pending approvals
        setPendingApprovals((prevApprovals) =>
          prevApprovals.filter((b) => b.id !== bookingId)
        );

        toast.success("Cancellation request rejected. Booking remains active.");
      }
    } catch (error) {
      toast.error("Failed to reject booking or cancellation");
      console.error("Rejection error:", error);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    //   // In a real app, this would be an API call
    //   const booking = bookings.find((b) => b.id === bookingId);
    //   if (!booking) return;
    //   // For managers and above, cancellations are immediately processed
    //   setBookings((prevBookings) =>
    //     prevBookings.map((b) =>
    //       b.id === bookingId ? { ...b, status: "cancelled" } : b
    //     )
    //   );
    //   // Calculate refund
    //   const bookingDate = new Date(
    //     booking.date + "T" + booking.slotId.split(" - ")[0].replace(" ", "")
    //   );
    //   const now = new Date();
    //   const timeDiff = bookingDate.getTime() - now.getTime();
    //   const hoursDiff = timeDiff / (1000 * 60 * 60);
    //   const refundAmount = hoursDiff > 1 ? booking.cost * 0.5 : 0;
    //   // Refund blue dollars if applicable
    //   if (refundAmount > 0) {
    //     setBlueDollars((prev) => prev + refundAmount);
    //   }
    //   toast.success(
    //     `Booking cancelled. ${
    //       refundAmount > 0
    //         ? `${refundAmount} Blue$ has been refunded.`
    //         : "No refund issued."
    //     }`
    //   );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
        <p className="text-gray-500">
          Manage bookings and approvals for your team
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Blue Dollars</CardTitle>
            <CardDescription>Available budget for bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-bluedollar">
              {blueDollars} Blue$
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              Bookings waiting for your approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">
              {pendingApprovals.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>Your active seat reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {
                bookings.filter(
                  (b) => b.status.toLocaleLowerCase() === "approved"
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Approval Settings</CardTitle>
            <CardDescription>
              Toggle auto-approval for reportees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Auto-approve bookings</span>
              <Switch
                checked={user?.autoApprove}
                onCheckedChange={async (checked) => {
                  try {
                    await api.patch(
                      `/users/managers/${user.id}/auto-approve?autoApprove=${checked}`
                    );
                    toast.success(
                      `Auto-approval ${
                        checked ? "enabled" : "disabled"
                      } successfully`
                    );
                    user.autoApprove = checked; // Update local user state
                    setUser((prevUser) => ({
                      ...prevUser,
                      autoApprove: checked,
                    }));
                  } catch (error) {
                    toast.error("Failed to update approval setting");
                    console.error("Auto-approve toggle error:", error);
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="approvals" className="w-full">
        <TabsList>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="bookings">Booking History</TabsTrigger>
          <TabsTrigger value="new">New Booking</TabsTrigger>
        </TabsList>
        <TabsContent value="approvals" className="p-1">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingApprovals.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">
                    No pending approvals
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingApprovals.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  showActions={true}
                  onApprove={handleApproveBooking}
                  onReject={handleRejectBooking}
                />
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="bookings" className="p-1">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No bookings found</p>
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  showActions={true}
                  onCancel={handleCancelBooking}
                />
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="new" className="p-1">
          <BookingForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerDashboard;
