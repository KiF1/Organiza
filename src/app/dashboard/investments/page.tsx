"use client";

import Header from "@/components/Header";
import { SearchFormInvestiment } from "@/components/SearchInvestiment";
import { Summary } from "@/components/Summary";
import { Context } from "@/contexts/Context";
import { dateFormatter, priceFormatter } from "@/utils/formatter";
import { useContextSelector } from "use-context-selector";

export default function Investments() {
  const withdrawInvestment = useContextSelector(Context, (context) => {
    return context.withdrawInvestment;
  });

  function disableWithdraw(dateInvestment: Date, periodInvestment: number) {
    const actualDate = new Date();
    const MonthsDifference =
      (actualDate.getFullYear() - dateInvestment.getFullYear()) * 12 +
      (actualDate.getMonth() - dateInvestment.getMonth());
    if (MonthsDifference >= periodInvestment) {
      return false;
    }

    return true;
  }

  const investments = useContextSelector(Context, (context) => {
    return context.investments.map((investment) => {
      return {
        id: investment.id,
        description: investment.description,
        value: investment.value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        period: investment.period,
        withdraw: investment.withdraw,
        createdAt: dateFormatter.format(new Date(investment.createdAt)),
        disableWithdraw: disableWithdraw(
          new Date(investment.createdAt),
          investment.period
        ),
      };
    });
  });

  return (
    <div>
      <Header />
      <Summary />
      <div className="w-full flex flex-col gap-10 max-w-[1280px] mx-auto mt-16 px-6">
        <SearchFormInvestiment />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="w-full flex flex-col gap-2 rounded-lg py-5 px-8 bg-gray-700"
            >
              <h1 className="text-1.35rem font-bold mb-1rem">
                {investment.description}
              </h1>
              <strong className="text-1rem font-normal">
                Valor Investido:{" "}
                <span className="text-green-300">{investment.value}</span>
              </strong>
              <strong className="text-1rem font-normal">
                Possível Saque:{" "}
                <span>{priceFormatter.format(investment.withdraw)}</span>
              </strong>
              <strong className="text-1rem font-normal">
                Período de Investimento: {investment.period} meses
              </strong>
              <strong className="text-1rem">{investment.createdAt}</strong>
              <button
                onClick={() => withdrawInvestment(investment.id)}
                disabled={investment.disableWithdraw}
                type="button"
                className={`h-14 border-0 bg-green-500 text-white mt-4 font-bold px-5 rounded-lg mt-1.5rem ${
                  investment.disableWithdraw
                    ? "bg-green-700 cursor-not-allowed"
                    : "hover:bg-green-700 transition-background"
                }`}
              >
                Sacar Investimento
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
