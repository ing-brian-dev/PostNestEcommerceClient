'use client'

import {
    environmentManager,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // above 0 to avoid refetching immediately on the client
                staleTime: 60 * 1000,
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
    if (environmentManager.isServer()) {
        // Servidor: siempre generar un Query Client
        return makeQueryClient()
    } else {
        // Cliente: Solo genera el QueryClient si no tenemos uno
        if (!browserQueryClient) browserQueryClient = makeQueryClient()
        return browserQueryClient
    }
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient()
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}