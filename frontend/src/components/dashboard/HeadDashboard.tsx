// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import BookingForm from "../booking/BookingForm";
// import BookingCard from "../booking/BookingCard";
// import { Booking } from "@/types";
// import { toast } from "sonner";
// import { useAuth } from "../auth/AuthContext";

// // Mock data for the head
// const mockHeadBookings: Booking[] = [
//   {
//     id: "booking3",
//     employeeId: "2", // Head's own booking
//     managerId: "2",
//     cafetariaId: "Main Cafetaria",
//     locationId: "Main Building",
//     seatId: "C3",
//     date: "2025-05-03",
//     timeSlotId: "11:00 - 11:30 AM",
//     status: "approved",
//     cost: 10,
//     createdAt: "2025-05-02T09:15:00Z",
//   },
// ];

// const mockPendingApprovals: Booking[] = [
//   {
//     id: "booking2", // From employee
//     employeeId: "1",
//     managerId: "2",
//     cafetariaId: "Tech Lounge",
//     locationId: "Tech Park",
//     seatId: "B2",
//     date: "2025-05-04",
//     timeSlotId: "13:00 - 13:30 PM",
//     status: "pending",
//     cost: 10,
//     createdAt: "2025-05-02T10:35:00Z",
//   },
//   {
//     id: "booking4", // Another employee
//     employeeId: "4",
//     managerId: "2",
//     cafetariaId: "Main Cafetaria",
//     locationId: "Main Building",
//     seatId: "A4",
//     date: "2025-05-05",
//     timeSlotId: "10:00 - 10:30 AM",
//     status: "pending",
//     cost: 10,
//     createdAt: "2025-05-02T11:20:00Z",
//   },
//   {
//     id: "booking5", // Cancellation request
//     employeeId: "5",
//     managerId: "2",
//     cafetariaId: "Tech Lounge",
//     locationId: "Tech Park",
//     seatId: "A2",
//     date: "2025-05-06",
//     timeSlotId: "14:00 - 14:30 PM",
//     status: "pending_cancellation",
//     cost: 10,
//     createdAt: "2025-05-02T12:15:00Z",
//   },
// ];

// const HeadDashboard = () => {
//   const [bookings, setBookings] = useState<Booking[]>(mockHeadBookings);
//   const [pendingApprovals, setPendingApprovals] =
//     useState<Booking[]>(mockPendingApprovals);
//   const [blueDollars, setBlueDollars] = useState(1000); // Mock blue dollars balance
//   const { user } = useAuth();

//   const handleApproveBooking = (bookingId: string) => {
//     // In a real app, this would be an API call
//     const booking = pendingApprovals.find((b) => b.id === bookingId);

//     if (!booking) return;

//     if (booking.status.toLocaleLowerCase() === "pending") {
//       // Approve new booking
//       setPendingApprovals((prevApprovals) =>
//         prevApprovals.filter((b) => b.id !== bookingId)
//       );

//       // Update blue dollars for new bookings
//       setBlueDollars((prev) => prev - booking.cost);

//       toast.success("Booking approved successfully");
//     } else if (booking.status.toLocaleLowerCase() === "pending_cancellation") {
//       // Approve cancellation
//       setPendingApprovals((prevApprovals) =>
//         prevApprovals.filter((b) => b.id !== bookingId)
//       );

//       // Calculate refund
//       const bookingDate = new Date(
//         booking.date + "T" + booking.timeSlotId.split(" - ")[0].replace(" ", "")
//       );
//       const now = new Date();
//       const timeDiff = bookingDate.getTime() - now.getTime();
//       const hoursDiff = timeDiff / (1000 * 60 * 60);

//       const refundAmount = hoursDiff > 1 ? booking.cost * 0.5 : 0;

//       // Refund blue dollars for cancellations if applicable
//       if (refundAmount > 0) {
//         setBlueDollars((prev) => prev + refundAmount);
//       }

//       toast.success(
//         `Cancellation approved. ${
//           refundAmount > 0
//             ? `${refundAmount} Blue$ has been refunded.`
//             : "No refund issued."
//         }`
//       );
//     }
//   };

//   const handleRejectBooking = (bookingId: string) => {
//     // In a real app, this would be an API call
//     const booking = pendingApprovals.find((b) => b.id === bookingId);

//     if (!booking) return;

//     if (booking.status.toLocaleLowerCase() === "pending") {
//       // Reject new booking
//       setPendingApprovals((prevApprovals) =>
//         prevApprovals.filter((b) => b.id !== bookingId)
//       );

//       toast.success("Booking rejected");
//     } else if (booking.status.toLocaleLowerCase() === "pending_cancellation") {
//       // Reject cancellation - keep the booking active
//       setPendingApprovals((prevApprovals) =>
//         prevApprovals.filter((b) => b.id !== bookingId)
//       );

//       toast.success("Cancellation request rejected. Booking remains active.");
//     }
//   };

//   const handleCancelBooking = (bookingId: string) => {
//     // In a real app, this would be an API call
//     const booking = bookings.find((b) => b.id === bookingId);

//     if (!booking) return;

//     // For heads and above, cancellations are immediately processed
//     setBookings((prevBookings) =>
//       prevBookings.map((b) =>
//         b.id === bookingId ? { ...b, status: "cancelled" } : b
//       )
//     );

//     // Calculate refund
//     const bookingDate = new Date(
//       booking.date + "T" + booking.timeSlotId.split(" - ")[0].replace(" ", "")
//     );
//     const now = new Date();
//     const timeDiff = bookingDate.getTime() - now.getTime();
//     const hoursDiff = timeDiff / (1000 * 60 * 60);

//     const refundAmount = hoursDiff > 1 ? booking.cost * 0.5 : 0;

//     // Refund blue dollars if applicable
//     if (refundAmount > 0) {
//       setBlueDollars((prev) => prev + refundAmount);
//     }

//     toast.success(
//       `Booking cancelled. ${
//         refundAmount > 0
//           ? `${refundAmount} Blue$ has been refunded.`
//           : "No refund issued."
//       }`
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Head Dashboard</h1>
//         <p className="text-gray-500">
//           Manage bookings and approvals for your team
//         </p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle>Blue Dollars</CardTitle>
//             <CardDescription>Available budget for bookings</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-bluedollar">
//               {blueDollars} Blue$
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle>Pending Approvals</CardTitle>
//             <CardDescription>
//               Bookings waiting for your approval
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-yellow-500">
//               {pendingApprovals.length}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle>My Bookings</CardTitle>
//             <CardDescription>Your active seat reservations</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-green-500">
//               {bookings.filter((b) => b.status.toLocaleLowerCase() ==="approved").length}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="approvals" className="w-full">
//         <TabsList>
//           <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
//           <TabsTrigger value="bookings">My Bookings</TabsTrigger>
//           <TabsTrigger value="new">New Booking</TabsTrigger>
//         </TabsList>
//         <TabsContent value="approvals" className="p-1">
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {pendingApprovals.length === 0 ? (
//               <Card>
//                 <CardContent className="pt-6">
//                   <p className="text-center text-gray-500">
//                     No pending approvals
//                   </p>
//                 </CardContent>
//               </Card>
//             ) : (
//               pendingApprovals.map((booking) => (
//                 <BookingCard
//                   key={booking.id}
//                   booking={booking}
//                   showActions={true}
//                   onApprove={handleApproveBooking}
//                   onReject={handleRejectBooking}
//                 />
//               ))
//             )}
//           </div>
//         </TabsContent>
//         <TabsContent value="bookings" className="p-1">
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {bookings.length === 0 ? (
//               <Card>
//                 <CardContent className="pt-6">
//                   <p className="text-center text-gray-500">No bookings found</p>
//                 </CardContent>
//               </Card>
//             ) : (
//               bookings.map((booking) => (
//                 <BookingCard
//                   key={booking.id}
//                   booking={booking}
//                   showActions={true}
//                   onCancel={handleCancelBooking}
//                 />
//               ))
//             )}
//           </div>
//         </TabsContent>
//         <TabsContent value="new" className="p-1">
//           <BookingForm />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default HeadDashboard;
