import { useState } from 'react'
import { storage, db } from '../lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function AdminUpload() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('video')
  const [progress, setProgress] = useState(0)

  async function handleUpload(e){
    e.preventDefault()
    if (!file) return alert('choose file')
    const id = Date.now().toString()
    const storageRef = ref(storage, `multimedia/${id}/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed', snapshot => {
      const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      setProgress(prog)
    }, err => {
      alert(err.message)
    }, async () => {
      const url = await getDownloadURL(uploadTask.snapshot.ref)
      await addDoc(collection(db, 'multimedia'), {
        title, type, storageUrl: url, thumbnailUrl: url, createdAt: serverTimestamp()
      })
      alert('uploaded')
      setTitle(''); setFile(null); setProgress(0)
    })
  }

  return (
    <form className="p-4 bg-white rounded-md shadow-sm" onSubmit={handleUpload}>
      <label className="block">Title
        <input className="border p-2 w-full mt-1" value={title} onChange={e => setTitle(e.target.value)} />
      </label>

      <label className="block mt-2">Type
        <select className="border p-2 w-full mt-1" value={type} onChange={e => setType(e.target.value)}>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="photo">Photo</option>
        </select>
      </label>

      <label className="block mt-2">File
        <input type="file" onChange={e => setFile(e.target.files[0])} />
      </label>

      <div className="mt-3">
        <button className="btn-primary">Upload</button>
        {progress > 0 && <div className="mt-2 text-sm">Progress: {progress}%</div>}
      </div>
    </form>
  )
    }
