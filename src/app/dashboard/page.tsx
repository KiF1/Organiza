"use client";

import Header from "@/components/Header";
import { SearchForm } from "@/components/SearchForm";
import { Summary } from "@/components/Summary";
import { Context } from "@/contexts/Context";
import { dateFormatter, priceFormatter } from "@/utils/formatter";
import { useContextSelector } from "use-context-selector";

export default function Dashboard() {
  const transactions = useContextSelector(Context, (context) => {
    return context.transactions;
  });

  return (
    <div>
      <Header />
      <Summary />
      <div className="w-full max-w-screen-xl mx-auto px-6 flex flex-col gap-4 md:gap-12 mt-16 mb-8">
        <SearchForm />

        {transactions.length >= 1 ? 
        <>
          <table className="w-full hidden md:table border-separate mt-6">
          <tbody>
            <tr className="mt-4 bg-gray-700">
              <td className="w-1/2 py-5 px-8 rounded-l-lg">Descrição da Transação</td>
              <td className="py-5 px-8">Valor da Transação</td>
              <td className="py-5 px-8">Categoria da Transação</td>
              <td className="py-5 px-8 rounded-r-lg">Data da Transação</td>
            </tr>
            {transactions.map((transaction) => (
              <tr className="mt-4 bg-gray-700" key={transaction.id}>
                <td className="w-1/2 py-5 px-8 rounded-l-lg">
                  {transaction.description}
                </td>
                <td className="py-5 px-8">
                  <span
                    data-type={transaction.type}
                    className="data-[type=income]:text-green-300 data-[type=outcome]:text-red-300"
                  >
                    {transaction.type === "outcome" && "- "}
                    {priceFormatter.format(transaction.price)}
                  </span>
                </td>
                <td className="py-5 px-8">{transaction.category}</td>
                <td className="py-5 px-8 rounded-r-lg">
                  {dateFormatter.format(new Date(transaction.createdAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="w-full grid grid-cols-1 md:hidden gap-4 md:gap-6">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="w-full flex flex-col gap-2 py-4 px-6 rounded-lg bg-gray-700"
            >
              <strong>Descrição: {transaction.description}</strong>
              <strong>
                Valor:{" "}
                <span
                  data-type={transaction.type}
                  className="data-[type=income]:text-green-300 data-[type=outcome]:text-red-300"
                >
                  {transaction.type === "outcome" && "- "}
                  {priceFormatter.format(transaction.price)}
                </span>
              </strong>
              <strong>Categoria: {transaction.category}</strong>
              <strong>
                Data: {dateFormatter.format(new Date(transaction.createdAt))}
              </strong>
            </div>
          ))}
        </div>
        </> : (
          <span className="text-green-500 text-xl font-semibold">Infelizmente não existe transações cadastradas!</span>
        )}
      </div>
    </div>
  );
}
