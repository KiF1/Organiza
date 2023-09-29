"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useContextSelector } from "use-context-selector";
import { Context } from "@/contexts/Context";
import { api } from "@/lib/axios";
import { priceFormatter } from "@/utils/formatter";
import toast, { Toaster } from "react-hot-toast";

const newBudgetFormSchema = z.object({
  value: z.number(),
});

type NewBudgetFormInputs = z.infer<typeof newBudgetFormSchema>;

export function NewBudgetModal() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewBudgetFormInputs>({
    resolver: zodResolver(newBudgetFormSchema),
  });

  const createBudget = useContextSelector(Context, (context) => {
    return {
      value: context.budget.value,
      createBudget: context.createBudget,
    };
  });

  async function handleCreateNewBudget(data: NewBudgetFormInputs) {
    try {
      const { value } = data;
      await createBudget.createBudget({ value });
      toast.success(`Orçamento salvo com sucesso, o novo orçamento definido é de ${priceFormatter.format(value)}!`)
      reset();
    } catch {
      toast.error('Erro ao salvar orçamento')
    }
  }

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
          <Dialog.Title className="text-white">Novo Orçamento</Dialog.Title>
          <Dialog.Close className="absolute top-6 right-6 bg-transparent border-0 cursor-pointer text-gray-500">
            <X size={24} />
          </Dialog.Close>
          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={handleSubmit(handleCreateNewBudget)}
          >
            {createBudget.value !== undefined && (
              <strong className="text-lg text-white">
                Orçamento atual: {priceFormatter.format(createBudget.value)}
              </strong>
            )}
            <input
              type="number"
              placeholder="Novo Orçamento"
              required
              {...register("value", { valueAsNumber: true })}
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
