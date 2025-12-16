import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api`,
  }),

  tagTypes: ["Transactions"],

  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: () => "transactions",
      providesTags: ["Transactions"],
      pollingInterval: 2000,
    }),

    addTransaction: builder.mutation({
      query: (data) => ({
        url: "transactions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transactions"],
    }),

    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transactions"],
    }),

    importTransactions: builder.mutation({
      query: (data) => ({
        url: "transactions/import",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transactions"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useDeleteTransactionMutation,
  useImportTransactionsMutation,
} = transactionsApi;
