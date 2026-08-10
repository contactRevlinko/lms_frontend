import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const followupApi = createApi({
  reducerPath: "followupApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["followup"],

  endpoints: (builder) => ({
    getFollowup: builder.query({
      query: () => ({
        url: "/followups/get-followups",
        method: "POST",
      }),
      providesTags: ["followup"],
    }),

    createFollowups: builder.mutation({
      query: (data) => ({
        url: "/followups/create-followups",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["followup"],
    }),

    deleteFollowups: builder.mutation({
      query: (id) => ({
        url: `/followups/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["followup"],
    }),
  }),
});

export const {
  useGetFollowupQuery,
  useCreateFollowupsMutation,
  useDeleteFollowupsMutation,
} = followupApi;