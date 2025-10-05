// src/components/booking/SeatLayout.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/services/api";

interface Seat {
  id: number;
  name: string;
  available: boolean;
}

interface SeatLayoutProps {
  cafetariaId: string;
  date: Date;
  timeSlotId: string;
  selectedSeat: string;
  onSeatSelect: (seatId: string) => void;
}

export default function SeatLayout({
  cafetariaId,
  date,
  timeSlotId,
  selectedSeat,
  onSeatSelect,
}: SeatLayoutProps) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data: allSeats } = await api.get<Seat[]>(
          `/seats/cafeteria/${cafetariaId}`
        );

        const { data: availableSeats } = await api.get<Seat[]>(
          `/seats/availableSeats`,
          {
            params: {
              date: date.toISOString().split("T")[0],
              slotId: timeSlotId,
              cafeteriaId: cafetariaId,
            },
          }
        );

        const availableSeatIds = new Set(availableSeats.map((s) => s.id));

        // Mark seats as available or not
        const updatedSeats = allSeats.map((seat) => ({
          ...seat,
          available: availableSeatIds.has(seat.id),
        }));

        setSeats(updatedSeats);
      } catch {
        setSeats([]);
      } finally {
        setLoading(false);
      }
    }
    if (cafetariaId && date && timeSlotId) load();
  }, [cafetariaId, date, timeSlotId]);

  if (loading) return <div className="py-8 text-center">Loading seats…</div>;

  // Sort alpha then number
  console.log("seats", seats);
  seats.sort((a, b) => {
    const ra = a.name[0],
      rb = b.name[0];
    if (ra !== rb) return ra.localeCompare(rb);
    return parseInt(a.name.slice(1), 10) - parseInt(b.name.slice(1), 10);
  });

  // Chunk into groups of 10
  const tables: Seat[][] = [];
  for (let i = 0; i < seats.length; i += 10) {
    tables.push(seats.slice(i, i + 10));
  }

  return (
    <div className="space-y-6">
      {/* Front indicator */}
      <div className="w-full bg-gray-200 text-gray-700 py-1 text-center rounded">
        Front of Cafeteria
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {tables.map((tbl, ti) => (
          <div
            key={ti}
            className="bg-white p-4 rounded-lg shadow flex-shrink-0 w-[280px]"
          >
            <div className="grid grid-cols-4 grid-rows-3 gap-2">
              {/* Top seats 0–3 */}
              {tbl.slice(0, 4).map((s) => (
                <SeatBtn
                  key={s.id}
                  s={s}
                  selected={selectedSeat}
                  onSelect={onSeatSelect}
                />
              ))}
              {/* Left middle */}
              {tbl[4] ? (
                <SeatBtn
                  s={tbl[4]}
                  selected={selectedSeat}
                  onSelect={onSeatSelect}
                />
              ) : (
                <div />
              )}
              {/* Table placeholder with number */}
              <div className="col-span-2 row-span-1 flex items-center justify-center border-2 border-gray-300 rounded">
                <span className="text-sm font-medium">Table {ti + 1}</span>
              </div>
              {/* Right middle */}
              {tbl[5] ? (
                <SeatBtn
                  s={tbl[5]}
                  selected={selectedSeat}
                  onSelect={onSeatSelect}
                />
              ) : (
                <div />
              )}
              {/* Bottom seats 6–9 */}
              {tbl.slice(6, 10).map((s) => (
                <SeatBtn
                  key={s.id}
                  s={s}
                  selected={selectedSeat}
                  onSelect={onSeatSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <Legend color="bg-green-100" label="Available" />
        <Legend color="bg-gray-300" label="Unavailable" />
        <Legend
          color="bg-bluedollar border-2 border-blue-800"
          label="Selected"
        />
      </div>

      {/* Selected info */}
      {selectedSeat && (
        <div className="text-center text-sm font-medium">
          Selected seat:{" "}
          {seats.find((s) => s.id.toString() === selectedSeat)?.name || ""}
        </div>
      )}
    </div>
  );
}

function SeatBtn({
  s,
  selected,
  onSelect,
}: {
  s: Seat;
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Button
      type="button"
      onClick={() => s.available && onSelect(s.id.toString())}
      disabled={!s.available}
      className={cn(
        "w-8 h-8 rounded flex items-center justify-center text-xs p-0",
        s.available && "bg-green-100 text-green-800 hover:bg-green-200",
        !s.available && "bg-gray-300 text-gray-500 cursor-not-allowed",
        s.id.toString() === selected &&
          "bg-bluedollar text-white border-2 border-blue-800"
      )}
    >
      {s.name}
    </Button>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center">
      <div className={cn("w-4 h-4 rounded-sm mr-2", color)} />
      <span>{label}</span>
    </div>
  );
}
