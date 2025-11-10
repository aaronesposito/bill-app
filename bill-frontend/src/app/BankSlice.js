import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'


export const BankApi = createApi({
    reducerPath: "BankApi",
    baseQuery: fetchBaseQuery({
        credentials: 'include',
        baseUrl: 'http://prometheus:5040'
    }),
    endpoints: (builder) => ({
        getAllBank: builder.query({
            query: ()=>({
                url: '/bank/all',
                method: "GET"
            })
        }),
        getOneBank: builder.query({
            query: (id)=>({
                url: `/bank/${id}`,
                method: 'GET'
            })
        }),
        deleteBank: builder.mutation({
            query: (id)=>({
                url: `/bank/${id}`,
                method: 'DELETE'
            })
        }),
        createBank: builder.mutation({
            query: (data)=>({
                url: '/bank/create',
                method: 'POST',
                body: {...data}
            })
        })
    })
})


export const {
    useGetAllBankQuery,
    useGetOneBankQuery,
    useDeleteBankMutation,
    useCreateBankMutation
} = BankApi