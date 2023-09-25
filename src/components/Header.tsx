"use client";
import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import logo from "../assets/logo.svg";
import {
  BarChart3,
  Bell,
  Bitcoin,
  CircleDollarSign,
  Receipt,
  Wallet,
} from "lucide-react";
import { NewInvestmentModal } from "@/components/NewInvestmentModal";
import { NewTransactionModal } from "@/components/NewTransactionModal";
import { Context } from "@/contexts/Context";
import { useContextSelector } from "use-context-selector";
import { usePathname } from "next/navigation";
import { Notifications } from "./Notifications";
import { NewBudgetModal } from "./NewBudget";

export default function Header() {
  const currentRoute = usePathname();
  const dashboardRouteActive: boolean =
    currentRoute === "/dashboard" || currentRoute === "/dashboard/statistics";

  const transactions = useContextSelector(Context, (context) => {
    return context.transactions;
  });

  const investments = useContextSelector(Context, (context) => {
    return context.investments;
  });

  return (
    <header className="bg-gray-900 py-10 pb-32 px-10 md:px-28">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6 justify-between">
        <Link href="/dashboard">
          <Image
            src={logo}
            width={24}
            height={24}
            alt="logo"
            className="w-8 object-contain h-8"
          />
        </Link>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 mt-8 md:mt-0 md:w-fit md:flex items-center gap-6">
          {transactions.length >= 1 && (
            <Link
              href="/dashboard/statistics"
              className="w-full md:w-fit h-14 border-0 bg-green-500 text-base text-white font-bold md:px-5 rounded-lg cursor-pointer flex justify-center items-center gap-2 text-decoration-none hover:bg-green-700"
            >
              <BarChart3 className="w-5 h-5" size={20} />
              Estatísticas
            </Link>
          )}
          {investments.length >= 1 && (
            <Link
              href="/dashboard/investments"
              className="h-14 border-0 bg-green-500 text-base text-white font-bold md:px-5 rounded-lg cursor-pointer flex justify-center items-center gap-2 text-decoration-none hover:bg-green-700"
            >
              <Bitcoin className="w-5 h-5" size={20} />
              Investimentos
            </Link>
          )}
          {dashboardRouteActive && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="h-14 border-0 bg-green-500 text-base text-white font-bold md:px-5 rounded-lg cursor-pointer flex justify-center items-center gap-2 text-decoration-none hover:bg-green-700">
                  <Receipt className="w-5 h-5" size={20} />
                  Nova Transação
                </button>
              </Dialog.Trigger>
              <NewTransactionModal />
            </Dialog.Root>
          )}
          {!dashboardRouteActive && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="h-14 border-0 bg-green-500 text-base text-white font-bold md:px-5 rounded-lg cursor-pointer flex justify-center items-center gap-2 text-decoration-none hover:bg-green-700">
                  <CircleDollarSign className="w-5 h-5" size={20} />
                  Novo Investimento
                </button>
              </Dialog.Trigger>
              <NewInvestmentModal />
            </Dialog.Root>
          )}
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="h-14 border-0 bg-green-500 text-base text-white font-bold md:px-5 rounded-lg cursor-pointer flex justify-center items-center gap-2 text-decoration-none hover:bg-green-700">
                <Bell className="w-5 h-5" size={20} />
                Notificações
              </button>
            </Dialog.Trigger>
            <Notifications />
          </Dialog.Root>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="h-14 border-0 bg-green-500 text-base text-white font-bold md:px-5 rounded-lg cursor-pointer flex justify-center items-center gap-2 text-decoration-none hover:bg-green-700">
                <Wallet className="w-5 h-5" size={20} />
                Orçamento
              </button>
            </Dialog.Trigger>
            <NewBudgetModal />
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
