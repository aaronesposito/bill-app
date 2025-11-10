import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'


export const AuthApi = createApi({
    reducerPath: 'AuthApi',
    tagTypes: ['Auth'],
    baseQuery: fetchBaseQuery({
        credentials: 'include',
        baseUrl: 'http://prometheus:5040',
    }),
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (data)=>{
                return({
                    url: "/auth/signup",
                    method: 'POST',
                    body: {...data}
                })
            }
        }),
        login: builder.mutation({
            query: (data) => {
                return({
                    url: "/auth/login",
                    method: 'POST',
                    body: {...data}
                })
            },
            providesTags: ['login']
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            invalidatesTags: ['login', 'authenticated']
        }),
        me: builder.query({
            query: ()=>({
                url: '/auth/me',
            }),
            providesTags: ['authenticated']
        }),
        async onQueryStarted(_arg, {dispatch, queryFulfilled}) {
            try {
                const {data} = await queryFulfilled
                if (data?.user) {
                    dispatch(
                        AuthApi.util.updateQueryData('me', undefined, ()=>({loggedIn: true, user: data.user}))

                    )
                }
            } finally {
                dispatch(AuthApi.util.invalidateTags(['Auth']))
            }
        }
    })
})


export const {
    useSignupMutation,
    useLoginMutation,
    useLogoutMutation,
    useMeQuery,
} = AuthApi