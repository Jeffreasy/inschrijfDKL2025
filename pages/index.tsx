import React, { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const iframe = document.getElementById('inschrijf-form-iframe') as HTMLIFrameElement
    
    const handleLoad = () => {
      setLoading(false)
    }

    const handleError = () => {
      setLoading(false)
      setError('Er is een probleem opgetreden bij het laden van het formulier. Probeer het later opnieuw.')
    }

    iframe.addEventListener('load', handleLoad)
    iframe.addEventListener('error', handleError)

    return () => {
      iframe.removeEventListener('load', handleLoad)
      iframe.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Koninklijke Loop 2025 - Inschrijfformulier</title>
        <meta name="description" content="Inschrijfformulier voor de Koninklijke Loop 2025" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-8">
        <h1 className="text-3xl font-bold mb-4">Koninklijke Loop 2025 - Inschrijfformulier</h1>
        
        {loading && <p className="text-gray-600">Formulier wordt geladen...</p>}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <iframe 
          id="inschrijf-form-iframe"
          src="https://inschrijf-dkl-2025.vercel.app"
          className="w-full border-0 min-h-[500px]"
          style={{display: loading ? 'none' : 'block'}}
        />
      </main>
    </div>
  )
}