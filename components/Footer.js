// components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-asad-dark-brown text-white mt-12">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <div className="font-heading text-lg">Al-Asad Education Foundation</div>
            <p className="mt-2 text-sm">Serving communities with Qur'anic learning and empowerment</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="font-semibold">Contact</div>
            <div className="text-sm mt-2">WhatsApp: +234XXXXXXXXX</div>
            <div className="text-sm">Email: info@alasadeducation.org</div>
          </div>
        </div>
        <div className="text-xs text-gray-300 mt-6">© {new Date().getFullYear()} Al-Asad Education Foundation</div>
      </div>
    </footer>
  )
}
