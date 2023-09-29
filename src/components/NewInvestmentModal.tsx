"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useContextSelector } from "use-context-selector";
import { Context } from "@/contexts/Context";
import toast, { Toaster } from "react-hot-toast";
import { priceFormatter } from "@/utils/formatter";
import { useSummary } from "@/Hooks/useSummary";
import { useEffect, useState } from "react";
import { BudgetState } from "./NewTransactionModal";

const newInvestmentFormSchema = z.object({
  description: z.string(),
  value: z.number(),
  period: z.number(),
});

type NewInvestmentFormInputs = z.infer<typeof newInvestmentFormSchema>;

export function NewInvestmentModal() {
  const [budgetEceeded, setBudgetEceeded] = useState<BudgetState>({} as BudgetState);
  const summary = useSummary();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewInvestmentFormInputs>({
    resolver: zodResolver(newInvestmentFormSchema),
  });

  const context = useContextSelector(Context, (context) => {
    return {
      budget: context.budget.value,
      createInvestment: context.createInvestment
    }
  });

  async function handleCreateNewInvestment(data: NewInvestmentFormInputs) {
    try {
      const { description, value, period } = data;
      await context.createInvestment({ value, period, description });
      toast.success(`Investimento realizado com sucesso, você investiu ${priceFormatter.format(value)}!`)
      reset();
    } catch {
      toast.error('Erro ao realizar investimento')
    }
  }

  useEffect(() => {
    const valueExceeded = priceFormatter.format(summary.total - context.budget)
    if(summary.total - context.budget <= 0){
      setBudgetEceeded({ valueExceeded, exceeded: true });
    }
  }, [])

  return (
    <Dialog.Portal>
      <Toaster position="top-right" reverseOrder={true} toastOptions={{
        duration: 5000,
        style: {
          padding: '12px 16px',
          borderRadius: '16px'
        },
        success: {
          style: {
            backgroundColor: '#323238',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '500'
          }
        },
        error: {
          style: {
            backgroundColor: '#323238',
            color: '#AB222E',
            fontSize: '16px',
            fontWeight: '500'
          }
        }
      }} />
      <div className="fixed w-full h-full inset-0 bg-black bg-opacity-75">
        <div className="w-[85%] md:w-[35%] mx-auto p-10 bg-gray-800 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md">
          <Dialog.Title className="text-white">Novo Investimento</Dialog.Title>
          <Dialog.Close className="absolute top-6 right-6 bg-transparent border-0 cursor-pointer text-gray-500">
            <X size={24} />
          </Dialog.Close>
          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={handleSubmit(handleCreateNewInvestment)}
          >
            <input
              type="text"
              placeholder="Descrição"
              required
              {...register("description")}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-300 placeholder-gray-500"
            />
            <input
              type="number"
              placeholder="Valor a investir"
              required
              {...register("value", { valueAsNumber: true })}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-300 placeholder-gray-500"
            />
            <input
              type="number"
              placeholder="Período em meses"
              required
              {...register("period", { valueAsNumber: true })}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-300 placeholder-gray-500"
            />
            {budgetEceeded.exceeded && <span className="text-base font-semibold text-red-500">Atenção seu saldo está abaixo do orçamento, ao realizar o investimento você ultrapassará ainda mais o orçamento estipulado!</span>}
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full mt-6 h-14 bg-green-500 text-white font-bold px-5 rounded-lg cursor-pointer hover:bg-green-700 transition duration-200"
            >
              Investir
            </button>
          </form>
        </div>
      </div>
    </Dialog.Portal>
  );
}
