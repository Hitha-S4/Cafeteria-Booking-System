import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types";
import BookingCard from "../booking/BookingCard";
import { toast } from "sonner";
import { fetchAllBookings } from "@/services/api";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Stats calculation
  const totalSeats = 800;
  const bookedSeats = bookings.filter(
    (b) => b.status.toLocaleLowerCase() === "approved"
  ).length;
  const pendingBookings = bookings.filter(
    (b) => b.status.toLocaleLowerCase() === "pending"
  ).length;
  const utilization = Math.round((bookedSeats / totalSeats) * 100);

  // Fetch bookings data from API
  useEffect(() => {
    fetchAllBookings()
      .then((data) => {
        setBookings(data);
      })
      .catch((error) => {
        toast.error("Failed to load bookings");
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500">
          Monitor and manage all cafetaria bookings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Seats</CardTitle>
            <CardDescription>Across all cafetarias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSeats}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Booked Seats</CardTitle>
            <CardDescription>Currently reserved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-bluedollar">
              {bookedSeats}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Bookings</CardTitle>
            <CardDescription>Awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">
              {pendingBookings}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Utilization</CardTitle>
            <CardDescription>Seat usage percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {utilization}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Bookings</CardTitle>
            <Button
              onClick={() => toast.success("Report exported successfully")}
              variant="outline"
            >
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="p-1 mt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    showActions={false}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="approved" className="p-1 mt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookings
                  .filter((b) => b.status.toLocaleLowerCase() === "approved")
                  .map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      showActions={false}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="pending" className="p-1 mt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookings
                  .filter((b) => b.status.toLocaleLowerCase() === "pending")
                  .map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      showActions={false}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="cancelled" className="p-1 mt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookings
                  .filter((b) => b.status.toLocaleLowerCase() === "cancelled")
                  .map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      showActions={false}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
