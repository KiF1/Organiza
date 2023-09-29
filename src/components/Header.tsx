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
  FileCheck2,
  LogOut,
  Receipt,
  Wallet,
} from "lucide-react";
import { NewInvestmentModal } from "@/components/NewInvestmentModal";
import { NewTransactionModal } from "@/components/NewTransactionModal";
import { Context } from "@/contexts/Context";
import { useContextSelector } from "use-context-selector";
import { usePathname, useRouter } from "next/navigation";
import { Notifications } from "./Notifications";
import { NewBudgetModal } from "./NewBudget";
import Cookies from "js-cookie";

export default function Header() {
  const currentRoute = usePathname();
  const router = useRouter();
  const dashboardRouteActive: boolean =
    currentRoute === "/dashboard" || currentRoute === "/dashboard/statistics";

  const transactions = useContextSelector(Context, (context) => {
    return context.transactions;
  });

  async function handleSignout() {
      await Cookies.remove("user-logged");
      await router.push("/user/login");
  }

  return (
    <header className="bg-gray-900 py-10 pb-32 px-6 xl:px-28">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6 justify-between">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex  md:mt-0 lg:w-fit items-center gap-6">
          <Link href="/dashboard" className="h-14 border-0 bg-green-500 text-base text-white font-bold md:px-5 rounded-lg cursor-pointer flex justify-center items-center gap-2 text-decoration-none hover:bg-green-700">
            <FileCheck2 className="w-5 h-5" size={20} />
              Transações
          </Link>
          {transactions.length >= 1 && (
            <Link
              href="/dashboard/statistics"
              className="h-14 border-0 bg-green-500 text-base text-white font-bold md:px-5 rounded-lg cursor-pointer flex justify-center items-center gap-2 text-decoration-none hover:bg-green-700"
            >
              <BarChart3 className="w-5 h-5" size={20} />
              Estatísticas
            </Link>
          )}
          {transactions.length >= 1 && (
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
          <button onClick={handleSignout}  className="h-14 border-0 bg-red-500 text-base text-white font-bold md:px-5 rounded-lg cursor-pointer flex justify-center items-center gap-2 text-decoration-none hover:bg-red-700">
            <LogOut className="w-5 h-5" size={20} />
              Sair
          </button>
        </div>
      </div>
    </header>
  );
}
