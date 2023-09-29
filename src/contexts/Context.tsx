"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";
import { createContext } from "use-context-selector";
import { api } from "../lib/axios";
import { priceFormatter } from "@/utils/formatter";

interface Transaction {
  id: number;
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
  createdAt: string;
}

interface CreateTransactionInput {
  description: string;
  price: number;
  category: string;
  type: "income" | "outcome";
}

interface Investment {
  id: number;
  description: string;
  value: number;
  period: number;
  withdraw: number;
  createdAt: string;
}

interface CreateInvestmentInput {
  description: string;
  value: number;
  period: number;
}

interface Notification {
  title: string;
  content: string;
  createdAt: string;
}

interface CreateNotificationInput {
  title: string;
  content: string;
}

interface Budget {
  value: number;
  createdAt: string;
}

interface CreateBudgetInput {
  value: number;
}

interface ContextType {
  transactions: Transaction[];
  investments: Investment[];
  notifications: Notification[];
  budget: Budget;
  fetchTransactions: (query?: string) => Promise<void>;
  fetchInvestments: (query?: string) => Promise<void>;
  createTransaction: (data: CreateTransactionInput) => Promise<void>;
  createInvestment: (data: CreateInvestmentInput) => Promise<void>;
  createBudget: (data: CreateBudgetInput) => Promise<void>;
  withdrawInvestment: (id: number) => Promise<void>;
}

interface ContextProviderProps {
  children: ReactNode;
}

export const Context = createContext({} as ContextType);

export function ContextProvider({ children }: ContextProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [budget, setBudge] = useState<Budget>({} as Budget);

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get("transactions", {
      params: {
        _sort: "createdAt",
        _order: "desc",
        q: query,
      },
    });

    const responseBudget = await api.get("budget");

    const responseNotifications = await api.get("notifications", {
      params: {
        _sort: "createdAt",
        _order: "desc",
      },
    });

    setBudge(responseBudget.data);
    setNotifications(responseNotifications.data);

    setTransactions(response.data);
  }, []);

  const fetchInvestments = useCallback(async (query?: string) => {
    const response = await api.get("investments", {
      params: {
        _sort: "createdAt",
        _order: "desc",
        q: query,
      },
    });

    const responseBudget = await api.get("budget");

    const responseNotifications = await api.get("notifications", {
      params: {
        _sort: "createdAt",
        _order: "desc",
      },
    });

    setBudge(responseBudget.data);
    setNotifications(responseNotifications.data);

    setInvestments(response.data);
  }, []);

  const createNotification = useCallback(
    async (data: CreateNotificationInput) => {
      const { title, content } = data;
      const responseGet = await api.get("notifications", {
        params: {
          _sort: "createdAt",
          _order: "desc",
        },
      });

      const response = await api.post("notifications", {
        title,
        content,
        createdAt: new Date(),
      });
      setNotifications(() => [response.data, ...responseGet.data]);
    },
    []
  );

  const createBudget = useCallback(async (data: CreateBudgetInput) => {
    const { value } = data;
    const response = await api.post("budget", { value, createdAt: new Date() });
    setBudge(response.data);
  }, []);

  const withdrawInvestment = useCallback(async (id: number) => {
    const responseGetInvestiment = await api.get(`investments/${id}`);
    const responseTransaction = await api.get("transactions", {
      params: {
        q: responseGetInvestiment.data.description,
      },
    });
    await api.put(`transactions/${responseTransaction.data[0].id}`, {
      description: responseGetInvestiment.data.description,
      category: `Saque - Investimento`,
      price: responseGetInvestiment.data.withdraw,
      type: "income",
      createdAt: new Date(),
    });
    await api.delete(`investments/${id}`);

    const contentNotification = `Você Sacou ${priceFormatter.format(
      responseGetInvestiment.data.withdraw
    )}, do investimento: ${responseGetInvestiment.data.description}!`;
    createNotification({
      title: "Saque - Investimento",
      content: contentNotification,
    });

    const responseInvestments = await api.get("investments", {
      params: {
        _sort: "createdAt",
        _order: "desc",
      },
    });
    const responseTransactions = await api.get("transactions", {
      params: {
        _sort: "createdAt",
        _order: "desc",
      },
    });

    setInvestments(responseInvestments.data);
    setTransactions(responseTransactions.data);
  }, []);

  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const { category, description, price, type } = data;
      const response = await api.post("transactions", {
        description,
        category,
        price,
        type,
        createdAt: new Date(),
      });
      const titleNotification =
        type === "income" ? "Transferência Recebida" : "Transferência Enviada";
      const contentNotification =
        type === "income"
          ? `Você recebeu ${priceFormatter.format(
              price
            )} em sua conta, aproveite!`
          : `Você enviou ${priceFormatter.format(
              price
            )}, a transferência foi finalizada com sucesso!`;
      createNotification({
        title: titleNotification,
        content: contentNotification,
      });
      setTransactions((state) => [response.data, ...state]);
    },
    []
  );

  function calcInvestmentReturn(value: number, period: number) {
    const rateInterestPeriod = 0.05 / 12;

    const withdraw = value * Math.pow(1 + rateInterestPeriod, period);

    return parseFloat(withdraw.toFixed(2));
  }

  const createInvestment = useCallback(async (data: CreateInvestmentInput) => {
    const { value, period, description } = data;
    const responseInvestment = await api.post("Investments", {
      description,
      value,
      period,
      withdraw: calcInvestmentReturn(value, period),
      createdAt: new Date(),
    });
    const responseTransaction = await api.post("transactions", {
      description,
      category: "Investimento",
      price: value,
      type: "outcome",
      createdAt: new Date(),
    });

    const contentNotification = `Você Investiu ${priceFormatter.format(
      value
    )}, o investimento: ${description} foi realizado com sucesso!`;
    createNotification({
      title: "Investimento Realizado",
      content: contentNotification,
    });
    setInvestments((state) => [responseInvestment.data, ...state]);
    setTransactions((state) => [responseTransaction.data, ...state]);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    fetchInvestments();
  }, []);

  return (
    <Context.Provider
      value={{
        transactions,
        investments,
        notifications,
        budget,
        fetchTransactions,
        fetchInvestments,
        createTransaction,
        createInvestment,
        createBudget,
        withdrawInvestment,
      }}
    >
      {children}
    </Context.Provider>
  );
}
