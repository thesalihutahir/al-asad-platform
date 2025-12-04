"use client";

import Link from "next/link";
import Image from "next/image";

// Define brand colors for reuse
const BRAND_DARK = '#432e16'; // Footer background
const BRAND_GOLD = '#d17600'; // Send button

export default function Footer() {
  return (

    <footer className={`w-full bg-[${BRAND_DARK}] text-white font-body pt-12 pb-6`}>
      <div className="max-w-7xl mx-auto flex flex-col items-center px-4">

        {/* Logo */}
        {/* Adjusted margin top/bottom and size to match the mockup's prominence */}
        <div className="mb-6 mt-2"> 
          <Image 
            src="/footerlogo.svg" 
            alt="Al-Asad Education Foundation Logo" 
            // Increased height significantly to match the mockup (h-20 or h-24 is better than h-12)
            className="h-24 w-auto object-contain" 
            sizes="100vw"
          />
        </div>

        {/* Social icons + email bar container */}
        <div className="flex flex-col items-center justify-center w-full mt-6 mb-8 gap-4">

          {/* Social icons and Email Bar are now in a single row layout for mobile and desktop */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full"> 
            
            {/* Social icons - Reduced size and spacing */}
            <div className="flex items-center gap-1.5"> 
              
              {/* Note: The w-2 h-2 attributes on Image components were not valid Tailwind CSS classes. 
                  They are replaced with class="w-8 h-8" (or similar small size) for proper rendering.
                  The logo images are assumed to have a surrounding circular/square container in the SVG, 
                  so we just set the size of the Image component itself (w-8 h-8 is common for small icons). */}
                  
              <Link href="https://www.facebook.com/share/1D438MVXpQ/">
                <Image src="/fbicon.svg" alt="Facebook" width={32} height={32} className="w-8 h-8"/>
              </Link>

              <Link href="https://youtube.com/@alasadeducation">
                <Image src="/yticon.svg" alt="YouTube" width={32} height={32} className="w-8 h-8"/>
              </Link>

              <Link href="https://www.instagram.com/alasad_education_foundation">
                <Image src="/igicon.svg" alt="Instagram" width={32} height={32} className="w-8 h-8"/>
              </Link>

              <Link href="https://www.tiktok.com/@alasad_tv">
                <Image src="/tticon.svg" alt="TikTok" width={32} height={32} className="w-8 h-8"/>
              </Link>

              <Link href="https://t.me/alasadeducation">
                <Image src="/tgicon.svg" alt="Telegram" width={32} height={32} className="w-8 h-8"/>
              </Link>

              <Link href="https://x.com/AsadEducation">
                <Image src="/xicon.svg" alt="X" width={32} height={32} className="w-8 h-8"/>
              </Link>

              <Link href="https://whatsapp.com/channel/0029VawdL4n6xCSHyUsMzc2V">
                <Image src="/waicon.svg" alt="WhatsApp" width={32} height={32} className="w-8 h-8"/>
              </Link>
            </div>


            {/* Email bar - Placed on the same line, responsive width */}
            <form
              action={`mailto:alasadeducationfoundation@yahoo.com`}
              method="POST"
              encType="text/plain"
              className="flex items-center mt-4 sm:mt-0" // Add margin-top for separation on mobile
            >
              <input
                type="email"
                required
                placeholder="Send us a mail..."
                // Added rounded-l to match the mockup's continuous shape
                className="bg-white text-black text-base px-4 py-3 w-44 outline-none border-y border-l rounded-l-md"
              />
              <button
                type="submit"
                // Used the GOLD color, increased padding/height to match input, added rounded-r
                style={{ backgroundColor: BRAND_GOLD }}
                className="px-6 py-3 text-base font-semibold hover:opacity-90 rounded-r-md"
              >
                Send
              </button>
            </form>
          </div>
          
        </div>

        {/* Copyright */}
        {/* Adjusted margin to match mockup spacing */}
        <p className="mt-2 text-[#9a9a9a] text-sm text-center">
          © All rights reserved | Al-Asad Education Foundation - CAC-IT-973975
        </p>
      </div>
    </footer>
  );
}
