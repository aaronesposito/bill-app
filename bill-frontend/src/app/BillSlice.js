import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '../Config/apiConfig'

export const BillApi = createApi({
    reducerPath: "BillApi",
    baseQuery: fetchBaseQuery({
        credentials: 'include',
        baseUrl: API_BASE_URL
    }),
    endpoints: (builder) => ({
        getAllBill: builder.query({
            query: ()=>({
                url: '/bill/all',
                method: "GET"
            })
        }),
        getOneBill: builder.query({
            query: (id)=>({
                url: `/bill/${id}`,
                method: 'GET'
            })
        }),
        deleteBill: builder.mutation({
            query: (id)=>({
                url: `/bill/${id}`,
                method: 'DELETE'
            })
        }),
        createBill: builder.mutation({
            query: (data)=>({
                url: '/bill/create',
                method: 'POST',
                body: {...data}
            })
        }),
        updateBill: builder.mutation({
            query: ({id, data})=>({
                url: `/bill/${id}`,
                method: 'PATCH',
                body: {...data}
            })
        })
    })
})


export const {
    useGetAllBillQuery,
    useGetOneBillQuery,
    useDeleteBillMutation,
    useCreateBillMutation,
    useUpdateBillMutation,
} = BillApi