import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Context } from "@/contexts/Context";
import { useContextSelector } from "use-context-selector";

const searchFormSchema = z.object({
  query: z.string(),
});

type SearchFormInputs = z.infer<typeof searchFormSchema>;

export function SearchFormInvestiment() {
  const fetchInvestiments = useContextSelector(Context, (context) => {
    return context.fetchInvestments;
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema),
  });

  async function handleSearchInvestiments(data: SearchFormInputs) {
    await fetchInvestiments(data.query);
  }

  return (
    <form
      className="flex flex-col md:flex-row gap-4 md:gap-6"
      onSubmit={handleSubmit(handleSearchInvestiments)}
    >
      <input
        type="text"
        placeholder="Busque por Investimentos"
        {...register("query")}
        className="flex-1 rounded-lg border border-gray-900 bg-gray-900 text-gray-300 p-4"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-3 border border-green-300 text-green-300 p-4 font-bold rounded-lg cursor-pointer transition duration-200 hover:border-green-500 hover:text-white hover:bg-green-500"
      >
        <Search size={20} />
        Buscar
      </button>
    </form>
  );
}
