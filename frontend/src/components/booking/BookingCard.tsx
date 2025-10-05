import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const BookingCard = ({
  booking,
  showActions = false,
  onApprove,
  onReject,
  onCancel,
}: BookingCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-emerald-100 text-emerald-800";
      case "rejected":
        return "bg-rose-100 text-rose-800";
      case "cancelled":
        return "bg-gray-100 text-gray-700";
      case "pending_cancellation":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusLabel = (status: string) => {
    return status === "pending_cancellation"
      ? "Cancellation Pending"
      : status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formattedDate = booking.date
    ? format(new Date(booking.date), "PPP")
    : "Date not available";

  return (
    <Card
      className={cn(
        "w-full shadow-xl rounded-2xl border-0 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md",
        "ring-1 ring-gray-200"
      )}
    >
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Seat <span className="text-bluedollar">#{booking.seatName}</span>
          </CardTitle>
          <Badge
            className={cn(
              "text-sm font-semibold",
              getStatusColor(booking.status)
            )}
          >
            {getStatusLabel(booking.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="py-4">
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-bluedollar" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-bluedollar" />
            <span>{booking.slotTime}</span>
          </div>
          <div>
            Cafeteria: <strong>{booking.cafeteriaName}</strong>
          </div>
          <div>
            Location: <strong>{booking.locationName}</strong>
          </div>
          <div>
            Requested by: <span className="italic">{booking.name}</span>
          </div>
          <div>
            Created on: <span className="italic">{booking.createdAt}</span>
          </div>
          <div className="text-lg font-bold text-bluedollar">
            Cost: 10 Blue$
          </div>

          {(booking.status.toLocaleLowerCase() === "pending" ||
            booking.status.toLocaleLowerCase() === "pending_cancellation") && (
            <div className="mt-4 border-t pt-2 text-amber-700 text-xs flex items-center space-x-2">
              <User size={14} />
              <span>
                {booking.status.toLocaleLowerCase() === "pending"
                  ? "Awaiting manager approval"
                  : "Awaiting cancellation approval"}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="pt-4 flex justify-end space-x-2">
          {booking.status.toLocaleLowerCase() === "pending" &&
            onApprove &&
            onReject && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(booking.id)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => onApprove(booking.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Approve
                </Button>
              </>
            )}

          {["approved", "pending"].includes(booking.status) && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(booking.id)}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
          )}

          {booking.status.toLocaleLowerCase() === "pending_cancellation" &&
            onApprove &&
            onReject && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(booking.id)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Deny Cancellation
                </Button>
                <Button
                  size="sm"
                  onClick={() => onApprove(booking.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Approve Cancellation
                </Button>
              </>
            )}
        </CardFooter>
      )}
    </Card>
  );
};

export default BookingCard;
