import { useSuspenseQuery } from '@tanstack/react-query'
import { Component, ErrorInfo, ReactNode, Suspense } from 'react'
import { ClipLoader } from 'react-spinners'
import { client } from 'src/lib/client'
import { AppError, AppNetworkError, AppRequestError } from 'src/lib/errors'
import { cn } from 'src/lib/utils'
import { Button } from '../ui/button'

export const Hero = () => {
  return (
    <div className="flex min-h-screen p-5">
      <section className="w-full py-32 md:py-48 gap-5 flex flex-col">
        <FeatureBoundary>
          <SimpleGet endpoint="/ok" />
        </FeatureBoundary>
        <FeatureBoundary className="border-2 h-40">
          <SimpleGet endpoint="/network" />
        </FeatureBoundary>
        <FeatureBoundary className="border-2 h-40">
          <SimpleGet endpoint="/forbidden" />
        </FeatureBoundary>
        <FeatureBoundary className="border-2 h-40">
          <SimpleGet endpoint="/unauthorized" />
        </FeatureBoundary>
        <FeatureBoundary className="border-2 h-40">
          <SimpleGet endpoint="/server" />
        </FeatureBoundary>
        <FeatureBoundary className="border-2 h-40">
          <Faulty />
        </FeatureBoundary>
      </section>
    </div>
  )
}

function Faulty() {
  throw new AppError('This component is broken')
  return <></>
}

function SimpleGet({ endpoint }: { endpoint: string }) {
  const query = useSuspenseQuery({
    queryKey: ['simple', endpoint],
    queryFn: async () => {
      const res = await client.get<{
        id: string
        firstName: string
        lastName: string
      }>(endpoint)
      return res.data
    },
    retry: 1,
  })
  return (
    <div className="py-5">
      <p>Name: {query.data?.firstName}</p>
      <p>Surname: {query.data?.lastName}</p>
      {query.error?.message}
    </div>
  )
}

function Loading() {
  return <ClipLoader size={50} aria-label="Loading Spinner" data-testid="loader" />
}

interface Props {
  children?: ReactNode
}

interface State {
  error: AppError | undefined
}

function FeatureBoundary({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <AppErrorBoundary>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </AppErrorBoundary>
    </div>
  )
}

class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: undefined,
  }

  public static getDerivedStateFromError(error: Error): State {
    if (error instanceof AppError) {
      return { error }
    }
    throw error
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.error) {
      if (this.state.error instanceof AppRequestError) {
        if (this.state.error instanceof AppNetworkError) {
          return <h1>Sorry.. there was a network error</h1>
        }
        if (this.state.error.axiosError.status === 403) {
          return <h1>This content is not available to you</h1>
        }
        if (this.state.error.axiosError.status === 401) {
          return <Button>Go to login</Button>
        }
        if (this.state.error) {
          return <h1>There has been an error. Report it here</h1>
        }
      } else {
        return <h1>{this.state.error.message}</h1>
      }
    }

    return this.props.children
  }
}
