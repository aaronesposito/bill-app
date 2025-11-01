import {configureStore} from '@reduxjs/toolkit'
import { AuthApi } from './AuthSlice'

export const store = configureStore({
    reducer: {
        [AuthApi.reducerPath]: AuthApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        AuthApi.middleware,

    ),
})