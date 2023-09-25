"use client";

import { useSummary } from "@/Hooks/useSummary";
import { priceFormatter } from "@/utils/formatter";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleDollarSign,
  DollarSign,
} from "lucide-react";

export function Summary() {
  const summary = useSummary();

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mt-[-5rem]">
      <div className="bg-gray-600 rounded-lg p-8">
        <header className="flex justify-between items-center">
          <span>Entradas</span>
          <ArrowUpCircle size={32} className="text-green-500" />
        </header>
        <strong className="block mt-4 text-2xl">
          {priceFormatter.format(summary.income)}
        </strong>
      </div>

      <div className="bg-gray-600 rounded-lg p-8">
        <header className="flex justify-between items-center">
          <span>Saídas</span>
          <ArrowDownCircle size={32} className="text-red-500" />
        </header>
        <strong className="block mt-4 text-2xl">
          {priceFormatter.format(summary.outcome)}
        </strong>
      </div>

      <div className="bg-green-700 rounded-lg p-8">
        <header className="flex justify-between items-center">
          <span className="text-white">Total</span>
          <CircleDollarSign size={32} color="#fff" />
        </header>
        <strong className="block mt-4 text-2xl">
          {priceFormatter.format(summary.total)}
        </strong>
      </div>
    </div>
  );
}
