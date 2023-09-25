"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useContextSelector } from "use-context-selector";
import { Context } from "@/contexts/Context";

const newInvestmentFormSchema = z.object({
  description: z.string(),
  value: z.number(),
  period: z.number(),
});

type NewInvestmentFormInputs = z.infer<typeof newInvestmentFormSchema>;

export function NewInvestmentModal() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewInvestmentFormInputs>({
    resolver: zodResolver(newInvestmentFormSchema),
  });

  const createInvestment = useContextSelector(Context, (context) => {
    return context.createInvestment;
  });

  async function handleCreateNewInvestment(data: NewInvestmentFormInputs) {
    const { description, value, period } = data;
    await createInvestment({ value, period, description });
    reset();
  }

  return (
    <Dialog.Portal>
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
              placeholder="Preço"
              required
              {...register("value", { valueAsNumber: true })}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-300 placeholder-gray-500"
            />
            <input
              type="number"
              placeholder="Período"
              required
              {...register("period", { valueAsNumber: true })}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-300 placeholder-gray-500"
            />
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full mt-6 h-14 bg-green-500 text-white font-bold px-5 rounded-lg cursor-pointer hover:bg-green-700 transition duration-200"
            >
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </Dialog.Portal>
  );
}
