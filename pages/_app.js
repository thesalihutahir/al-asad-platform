import '../styles/globals.css'
import { useEffect } from 'react'
import { auth } from '../lib/firebase'

function MyApp({ Component, pageProps }) {
  // optional: listen to auth state changes here if needed
  useEffect(() => {
    // no-op
  }, []);
  return <Component {...pageProps} />
}

export default MyApp
