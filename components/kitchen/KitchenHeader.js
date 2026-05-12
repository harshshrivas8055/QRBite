"use client";

import { useEffect, useState } from "react";
import { ChefHat, Clock, Wifi } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function KitchenHeader({ orderCount }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
          <ChefHat className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-white">{APP_NAME} — Kitchen</h1>
          <div className="flex items-center gap-1 text-xs text-green-400">
            <Wifi className="h-3 w-3" />
            <span>Live</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{orderCount}</p>
          <p className="text-xs text-gray-400">Active Orders</p>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <Clock className="h-4 w-4" />
          <span className="font-mono text-sm">
            {time.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="border-white text-white hover:bg-white hover:text-black"
          asChild
        >
          <Link href="/dashboard">← Dashboard</Link>
        </Button>
      </div>
    </header>
  );
}
