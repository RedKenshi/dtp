import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { GetServerSideProps } from 'next'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'
import { UserContext, UserProvider } from '@/contexts/User'

function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
      <Toaster position='bottom-right'/>
    </UserProvider>
  )
}

export default App