"use client";
import * as Dialog from "@radix-ui/react-dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowDownCircle, ArrowUpCircle, X } from "lucide-react";
import { useState } from "react";
import { useContextSelector } from "use-context-selector";
import { Context } from "@/contexts/Context";
const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
});

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>;

export function NewTransactionModal() {
  const [incomeActive, setIncomeActive] = useState(false);
  const [outcomeActive, setOutcomeActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewTransactionFormInputs>({
    resolver: zodResolver(newTransactionFormSchema),
  });

  function activeTypeTransaction(typeButton: string) {
    if (typeButton === "income") {
      setIncomeActive(true);
      setOutcomeActive(false);
    } else {
      setOutcomeActive(true);
      setIncomeActive(false);
    }
  }

  const createTransaction = useContextSelector(Context, (context) => {
    return context.createTransaction;
  });

  async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
    await createTransaction({
      description: data.description,
      price: data.price,
      category: data.category,
      type: incomeActive ? "income" : "outcome",
    });
    reset();
  }

  return (
    <Dialog.Portal>
      <div className="fixed w-full h-full inset-0 bg-black bg-opacity-75">
        <div className="w-[85%] md:w-[35%] mx-auto p-10 bg-gray-800 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md">
          <Dialog.Title className="text-white">Nova Transação</Dialog.Title>
          <Dialog.Close className="absolute top-6 right-6 bg-transparent border-0 cursor-pointer text-gray-500">
            <X size={24} />
          </Dialog.Close>
          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={handleSubmit(handleCreateNewTransaction)}
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
              {...register("price", { valueAsNumber: true })}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-300 placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Categorias"
              required
              {...register("category")}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-300 placeholder-gray-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <button
                type="button"
                data-active={incomeActive}
                onClick={() => activeTypeTransaction("income")}
                className="bg-gray-700 p-4 flex items-center justify-center gap-2 border-0 rounded-lg cursor-pointer text-gray-300 hover:bg-green-700 data-[active=true]:bg-green-700"
              >
                <ArrowUpCircle color="#00B37E" size={24} />
                Entrada
              </button>
              <button
                type="button"
                data-active={outcomeActive}
                onClick={() => activeTypeTransaction("outcome")}
                className="bg-gray-700 p-4 flex items-center justify-center gap-2 border-0 rounded-lg cursor-pointer text-gray-300 hover:bg-red-700 data-[active=true]:bg-red-700"
              >
                <ArrowDownCircle color="#F75A68" size={24} />
                Saída
              </button>
            </div>
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
