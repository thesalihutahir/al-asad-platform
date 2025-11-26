import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AdminUpload from '../../components/AdminUpload'

export default function Admin() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (!u) {
        router.push('/admin/login')
      } else {
        setUser(u)
      }
    })
    return () => unsub()
  },[])

  if (!user) return null

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-heading">Admin Dashboard</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-heading">Upload Multimedia</h3>
            <AdminUpload />
          </div>
          <div>
            <h3 className="font-heading">Quick actions</h3>
            <div className="bg-white p-4 rounded-md">
              <p>Manage programs, news, events from future CRUD UIs</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
