import {configureStore} from '@reduxjs/toolkit'
import { AuthApi } from './AuthSlice'
import { BankApi } from './BankSlice'
import { BillApi } from './BillSlice'

export const store = configureStore({
    reducer: {
        [AuthApi.reducerPath]: AuthApi.reducer,
        [BillApi.reducerPath]: BillApi.reducer,
        [BankApi.reducerPath]: BankApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        AuthApi.middleware,
        BillApi.middleware,
        BankApi.middleware

    ),
})