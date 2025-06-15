import Link from "next/link";
import Head from "next/head";
import UserLayout from "./_components/userLayout";
import PackageSection from "./_components/PackageSection";
import { Contact } from "lucide-react";
import ContactSection from "./_components/ContactSection";

export default function Home() {
  return (
    <UserLayout>
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section id="home" className="relative py-32 bg-gradient-to-r from-pink-100 to-purple-100">
          <div className="absolute inset-0 bg-[url('/images/wedding-pattern.png')] opacity-10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Your Dream Wedding Starts Here</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">We turn your vision into reality with flawless planning and execution.</p>
            <div className="space-x-4">
              <Link href="#contact" className="px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors font-medium">
                Get Started
              </Link>
              <Link href="#packages" className="px-6 py-3 border border-pink-500 text-pink-500 rounded-md hover:bg-pink-50 transition-colors font-medium">
                View Packages
              </Link>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <PackageSection />

        {/* Location Section */}
        <section id="location" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Beautiful Wedding Venues</h3>
                <p className="text-gray-600 mb-6">We partner with the most stunning venues in the area to make your special day unforgettable.</p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-pink-100 p-2 rounded-full mr-4">
                      <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Garden Pavilion</h4>
                      <p className="text-gray-600">123 Bloom Street, Roseville</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-pink-100 p-2 rounded-full mr-4">
                      <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Grand Ballroom</h4>
                      <p className="text-gray-600">456 Elegance Avenue, Diamond City</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-pink-100 p-2 rounded-full mr-4">
                      <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Beachfront Resort</h4>
                      <p className="text-gray-600">789 Ocean Drive, Sunset Bay</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gray-200 h-64 md:h-96 rounded-lg overflow-hidden">
                  {/* Replace with actual map or image */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-pink-300 to-purple-300">
                    <span className="text-white font-medium">Venue Location Map</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Contact Us</h3>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">Ready to start planning your dream wedding? Get in touch with us today!</p>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <ContactSection />
            </div>
          </div>
        </section>
      </main>
    </UserLayout>
  );
}
