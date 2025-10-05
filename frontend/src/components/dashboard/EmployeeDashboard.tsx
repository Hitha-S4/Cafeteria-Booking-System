import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingForm from "../booking/BookingForm";
import BookingCard from "../booking/BookingCard";
import { Booking } from "@/types";
import { toast } from "sonner";
import { useAuth } from "../auth/AuthContext";
import api, { checkIfEmployeeExists } from "@/services/api";

// Mock bookings for the employee
const mockEmployeeBookings: any[] = [
  {
    id: "booking1",
    employeeId: "1",
    managerId: "2",
    cafetariaId: "Main Cafetaria",
    locationId: "Main Building",
    seatId: "A1",
    date: "2025-05-03",
    timeSlotId: "12:00 - 12:30 PM",
    status: "approved",
    cost: 10,
    createdAt: "2025-05-02T10:30:00Z",
  },
  {
    id: "booking2",
    employeeId: "1",
    managerId: "2",
    cafetariaId: "Tech Lounge",
    locationId: "Tech Park",
    seatId: "B2",
    date: "2025-05-04",
    timeSlotId: "13:00 - 13:30 PM",
    status: "pending",
    cost: 10,
    createdAt: "2025-05-02T10:35:00Z",
  },
];

const EmployeeDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const email = user?.email || user?.username; // use whichever your backend expects

        if (!email) {
          toast.error("User email not found");
          return;
        }
        const response = await api.get(`/bookings/userBookings`, {
          params: { email },
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load your bookings");
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = (bookingId: string) => {
    // In a real app, this would be an API call
    const booking = bookings.find((b) => b.id === bookingId);

    if (!booking) return;

    // Check if cancellation is within 1 hour
    const bookingDate = new Date(
      booking.date + "T" + booking.slotId.split(" - ")[0].replace(" ", "")
    );
    const now = new Date();
    const timeDiff = bookingDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    const refundPercentage = hoursDiff > 1 ? 50 : 0;

    // // Update booking status - for heads, it's immediately cancelled, for others it needs approval
    // const newStatus =
    //   user?.role.toLocaleLowerCase() === "head" ||
    //   user?.role.toLocaleLowerCase() === "superadmin"
    //     ? "cancelled"
    //     : "pending_cancellation";

    // setBookings((prevBookings) =>
    //   prevBookings.map((b) =>
    //     b.id === bookingId ? { ...b, status: newStatus } : b
    //   )
    // );

    const message =
      user?.role.toLocaleLowerCase() === "head" ||
      user?.role.toLocaleLowerCase() === "superadmin"
        ? refundPercentage > 0
          ? `Booking cancelled. You'll receive a ${refundPercentage}% refund.`
          : "Booking cancelled. No refund will be provided as it's within 1 hour of the booking time."
        : refundPercentage > 0
        ? `Booking cancellation request sent. You'll receive a ${refundPercentage}% refund if approved.`
        : "Booking cancellation request sent. No refund will be provided as it's within 1 hour of the booking time.";

    toast.success(message);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Blue Reserve
        </h1>
        <p className="text-gray-500">Book and manage your cafetaria seats</p>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="new">New Booking</TabsTrigger>
        </TabsList>
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

export default EmployeeDashboard;
