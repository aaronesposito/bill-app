import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'


export const BillApi = createApi({
    reducerPath: "BillApi",
    baseQuery: fetchBaseQuery({
        credentials: 'include',
        baseUrl: 'http://localhost:8081'
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
            query: (data)=>({
                url: `/bill/${data.id}`,
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