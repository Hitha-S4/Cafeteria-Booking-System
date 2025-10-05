import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "../auth/AuthContext";
import { toast } from "sonner";
import SeatLayout from "./SeatLayout";
import api from "@/services/api";

const BookingForm = () => {
  const { user } = useAuth();

  const [locations, setLocations] = useState([]);
  const [cafetarias, setCafetarias] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const [locationId, setLocationId] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");

  const [cafetariaId, setCafetariaId] = useState<string>("");
  const [cafetariaName, setCafetariaName] = useState<string>("");

  const [date, setDate] = useState<Date | undefined>(undefined);

  const [timeSlotId, setTimeSlotId] = useState<string>("");
  const [timeSlotRange, setTimeSlotRange] = useState<string>("");

  const [seatId, setSeatId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/locations");
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchCafetarias = async () => {
      if (!locationId) return;
      try {
        const response = await api.get(`/cafeterias`);
        setCafetarias(response.data);
      } catch (error) {
        console.error("Error fetching cafetarias", error);
        toast.error("Failed to load cafetarias.");
      }
    };

    fetchCafetarias();
  }, [locationId]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!cafetariaId || !date) return;

      try {
        const response = await api.get("/slots");
        setTimeSlots(response.data);
      } catch (error) {
        console.error("Error fetching time slots", error);
      }
    };

    fetchTimeSlots();
  }, [cafetariaId, date]);

  const filteredCafetarias = cafetarias.filter(
    (c) => c.location.id === locationId
  );

  const canShowSeatLayout = locationId && cafetariaId && date && timeSlotId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!locationId || !cafetariaId || !date || !timeSlotId || !seatId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const needsApproval =
        !user.autoApprove &&
        user.role.toLowerCase() !== "head" &&
        user.role.toLowerCase() !== "superadmin";
      const status = needsApproval ? "PENDING" : "APPROVED";

      const payload = {
        userId: user.id,
        managerId: user.managerId,
        locationId,
        cafeteriaId: cafetariaId,
        date,
        slotId: timeSlotId,
        seatId,
        status,
      };

      const response = await api.post("/bookings", payload);

      if (response.status !== 200) {
        throw new Error("Failed to create booking");
      }

      toast.success(
        needsApproval
          ? "Booking request submitted for approval!"
          : "Booking confirmed successfully!"
      );

      setLocationId("");
      setCafetariaId("");
      setDate(undefined);
      setTimeSlotId("");
      setSeatId("");
    } catch (error) {
      toast.error("Failed to submit booking request");
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (newDate: Date | null) => {
    if (newDate) {
      const utcDate = new Date(
        Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
      );

      setDate(utcDate);
      setSeatId("");
    }
  };

  return (
    <Card className="w-full max-w-full mx-auto bg-white border border-gray-200 shadow-xl rounded-3xl text-black">
      <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-300 p-6 rounded-t-3xl">
        <CardTitle className="text-3xl font-semibold text-black">
          Book your Seat
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 p-8">
          {/* Side-by-Side Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Location Select */}
            <div className="space-y-1">
              <Label
                className="text-black text-sm font-medium"
                htmlFor="location"
              >
                📍 Location
              </Label>
              <Select
                value={locationName}
                onValueChange={(value) => {
                  const selectedLocation = locations.find(
                    (location) => location.name === value
                  );
                  if (selectedLocation) {
                    setLocationName(selectedLocation.name);
                    setLocationId(selectedLocation.id);
                    setCafetariaId("");
                    setSeatId("");
                  }
                }}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cafeteria Select */}
            <div className="space-y-1">
              <Label
                className="text-black text-sm font-medium"
                htmlFor="cafetaria"
              >
                🏛️ Cafeteria
              </Label>
              <Select
                value={cafetariaName}
                onValueChange={(value) => {
                  const selectedCafetariaName = cafetarias.find(
                    (cafe) => cafe.name === value
                  );
                  if (selectedCafetariaName) {
                    setCafetariaName(selectedCafetariaName.name);
                    setCafetariaId(selectedCafetariaName.id);
                    setSeatId("");
                  }
                }}
                disabled={!locationId}
              >
                <SelectTrigger id="cafetaria">
                  <SelectValue placeholder="Select a cafetaria" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCafetarias.map((cafetaria) => (
                    <SelectItem key={cafetaria.id} value={cafetaria.name}>
                      {cafetaria.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="space-y-1">
              <Label className="text-black text-sm font-medium">📅 Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    // disabled={(date) => date < startOfDay(new Date())}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Slot */}
            <div className="space-y-1">
              <Label className="text-black text-sm font-medium">
                ⏰ Time Slot
              </Label>
              <Select
                value={timeSlotRange}
                onValueChange={(value) => {
                  const selectedTimeSlotRange = timeSlots.find(
                    (slot) => slot.timeRange === value
                  );
                  if (selectedTimeSlotRange) {
                    setTimeSlotRange(selectedTimeSlotRange.timeRange);
                    setTimeSlotId(selectedTimeSlotRange.id);
                    setSeatId("");
                  }
                }}
                disabled={!date}
              >
                <SelectTrigger id="timeSlot">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.timeRange}>
                      {slot.timeRange}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Seat Layout */}
          {canShowSeatLayout && (
            <div className="space-y-1 pt-4">
              <Label className="text-black font-medium">
                💺 Select a Seat - <span className="text-green-500">$10</span>
              </Label>
              <div className="overflow-x-auto rounded-xl border border-gray-300 p-3">
                <SeatLayout
                  cafetariaId={cafetariaId}
                  date={date}
                  timeSlotId={timeSlotId}
                  onSeatSelect={setSeatId}
                  selectedSeat={seatId}
                />
              </div>
            </div>
          )}
        </CardContent>{" "}
        <CardFooter className="flex justify-end p-6">
          <Button
            type="submit"
            className="px-6 py-2 bg-black text-white hover:bg-gray-800 text-lg rounded-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BookingForm;
