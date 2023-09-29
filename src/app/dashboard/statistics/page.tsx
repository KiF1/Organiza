"use client";
import Header from "@/components/Header";
import { Summary } from "@/components/Summary";
import { Context } from "@/contexts/Context";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useContextSelector } from "use-context-selector";
export default function Statistics() {
  const transactionsIncome = useContextSelector(Context, (context) => {
    return context.transactions
      .filter((transaction) => transaction.type === "income")
      .map((transaction) => {
        return {
          atividade: transaction.description,
          total: transaction.price,
        };
      });
  });

  const transactionsOutcome = useContextSelector(Context, (context) => {
    return context.transactions
      .filter((transaction) => transaction.type === "outcome")
      .map((transaction) => {
        return {
          atividade: transaction.description,
          total: transaction.price,
        };
      });
  });

  return (
    <div>
      <Header />
      <Summary />
     {transactionsIncome.length >= 3 || transactionsOutcome.length >= 3 ? (
       <div className="w-[85%] mx-auto flex flex-col gap-10 mt-16">
        {transactionsIncome.length >= 2 && (
          <div className="w-full min-h-[300px] flex flex-col gap-8 rounded-lg bg-gray-700 p-6">
            <h1 className="text-xl font-bold">Valores em Caixa</h1>
            <ResponsiveContainer
              width="100%"
              height="100%"
              className="min-h-[300px]"
            >
              <AreaChart
                width={500}
                height={400}
                data={transactionsIncome}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="atividade" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#00875F"
                  fill="#00875F"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        {transactionsOutcome.length >= 2 && (
          <div className="w-full min-h-[300px] flex flex-col gap-8 rounded-lg p-5 bg-gray-700">
            <h1 className="text-xl font-bold">Valores em Caixa</h1>
            <ResponsiveContainer
              width="100%"
              height="100%"
              className="min-h-[300px]"
            >
              <AreaChart
                width={500}
                height={400}
                data={transactionsOutcome}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="atividade" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#AB222E"
                  fill="#AB222E"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
     ): (
      <span className="text-green-500 text-xl font-semibold w-full flex max-w-[1280px] mx-auto mt-16 px-6 mb-8">Cadastre pelo menos 3 transações para que possa vizualizar os gráficos!</span>
     )}
    </div>
  );
}
