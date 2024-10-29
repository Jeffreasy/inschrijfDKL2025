'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Stuur een bericht naar de parent (Webflow) dat de app is geladen
    if (window.parent) {
      window.parent.postMessage({ type: 'APP_LOADED' }, '*')
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welkom bij het Inschrijfformulier
        </h1>
        <p className="mt-3 text-2xl">
          Koninklijke Loop 2025
        </p>
        {/* Voeg hier uw formulier componenten toe */}
      </main>
    </div>
  )
}