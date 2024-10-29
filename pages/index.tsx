import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // of een laad-indicator
  }

  return (
    <>
      <Head>
        <title>Inschrijfformulier Koninklijke Loop 2025</title>
        <meta name="description" content="Inschrijven voor de Koninklijke Loop 2025" />
        <meta httpEquiv="Content-Security-Policy" content="frame-ancestors 'self' https://*.webflow.io https://*.webflow.com" />
      </Head>

      <main className="min-h-screen bg-orange-100 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-orange-400 p-6 text-white">
            <img src="/logo.png" alt="De Koninklijke Loop" className="h-12 mb-4" />
            <h1 className="text-3xl font-bold">Koninklijke Loop 2025</h1>
            <p className="mt-2">De sponsorloop van mensen met een beperking Voor een goed doel!</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-orange-100 p-4 rounded">
                <h2 className="font-bold">DATUM</h2>
                <p>Zaterdag 17 mei 2025</p>
              </div>
              <div className="bg-orange-100 p-4 rounded">
                <h2 className="font-bold">LOCATIE</h2>
                <p>De Grote Kerk Apeldoorn</p>
              </div>
              <div className="bg-orange-100 p-4 rounded">
                <h2 className="font-bold">AFSTANDEN</h2>
                <p>2,5, 5, 10 en 15 KM</p>
              </div>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="naam" className="block text-sm font-medium text-gray-700">Naam: *</label>
                <input type="text" id="naam" name="naam" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail: *</label>
                <input type="email" id="email" name="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50" />
              </div>
              <div>
                <label htmlFor="afstand" className="block text-sm font-medium text-gray-700">Kies je afstand: *</label>
                <select id="afstand" name="afstand" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50">
                  <option value="">Selecteer een afstand</option>
                  <option value="2.5">2,5 KM</option>
                  <option value="5">5 KM</option>
                  <option value="10">10 KM</option>
                  <option value="15">15 KM</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
                Inschrijven
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home