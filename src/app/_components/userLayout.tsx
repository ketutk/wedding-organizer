import Head from "next/head";
import Link from "next/link";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full scroll-smooth">
      <Head>
        <title>EverAfter - Premium Wedding Organizer</title>
        <meta name="description" content="Creating unforgettable wedding experiences" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="text-pink-500">Ever</span>
              <span className="text-gray-600">After</span>
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/#home" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">
              Home
            </Link>
            <Link href="/#packages" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">
              Packages
            </Link>
            <Link href="/#location" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">
              Location
            </Link>
            <Link href="/#contact" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">
              Contact
            </Link>
          </nav>
          <Link href="/#packages" className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors">
            Book Now
          </Link>
        </div>
      </header>
      {children}
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">
                <span className="text-pink-400">Ever</span>
                <span className="text-gray-300">After</span>
              </h2>
              <p className="text-gray-400">Creating magical wedding experiences since 2010. Let us make your special day truly unforgettable.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/#home" className="text-gray-400 hover:text-pink-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/#packages" className="text-gray-400 hover:text-pink-400 transition-colors">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link href="/#location" className="text-gray-400 hover:text-pink-400 transition-colors">
                    Locations
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="text-gray-400 hover:text-pink-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <address className="not-italic text-gray-400 space-y-2">
                <p>123 Wedding Lane</p>
                <p>Happily Ever After City</p>
                <p>Phone: (123) 456-7890</p>
                <p>Email: info@everafter.com</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">© {new Date().getFullYear()} EverAfter Wedding Organizer. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
