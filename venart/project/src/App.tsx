import React, { useEffect, useState } from 'react'
import ArtisanPanel from './components/ArtisanPanel'
import VendingPanel from './components/VendingPanel'

export default function App() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('vendart_items')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('vendart_items', JSON.stringify(items))
  }, [items])

  const addItem = (item: any) => {
    // item: { id, imageDataUrl, title, caption, story, qr, status }
    setItems(prev => [item, ...prev])
  }

  const updateItem = (id: string, patch: any) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it))
  }

  // Famous artist names for background decoration
  const artistNames = [
    'Picasso', 'Van Gogh', 'Monet', 'Da Vinci', 'Frida Kahlo', 'Banksy', 
    'Warhol', 'Pollock', 'Matisse', 'Dali', 'Michelangelo', 'Renoir',
    'Cezanne', 'Degas', 'Manet', 'Gauguin', 'Kandinsky', 'Klee',
    'O\'Keeffe', 'Basquiat', 'Hockney', 'Rothko', 'Mondrian', 'Klimt'
  ]

  return (
    <div className="app-container">
      {/* Artistic background with artist names */}
      <div className="artist-names-bg">
        {artistNames.map((name, index) => (
          <span 
            key={name}
            className="artist-name"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              fontSize: `${12 + Math.random() * 20}px`,
              transform: `rotate(${-30 + Math.random() * 60}deg)`,
              animationDelay: `${index * 0.5}s`
            }}
          >
            {name}
          </span>
        ))}
      </div>

      <header className="main-header">
        <div className="header-content">
          <h1 className="main-title">
            <span className="vend">VEND</span>
            <span className="art">ART</span>
          </h1>
          <p className="subtitle">AI-Powered Artisan Vending Machine</p>
          <div className="team-info">
            <span className="team-label">Team Kundon</span>
            <span className="presenter">Presenter: Jhade Kartik</span>
          </div>
        </div>
      </header>

      <main className="main-grid">
        <section className="artisan-section">
          <div className="section-header">
            <h2>Artist Studio</h2>
            <p>Upload & Enrich Your Artwork</p>
          </div>
          <ArtisanPanel onAdd={addItem} />
        </section>

        <section className="vending-section">
          <div className="section-header">
            <h2>Vending Machine</h2>
            <p>Interactive Art Gallery</p>
          </div>
          <VendingPanel items={items} onPlace={updateItem} onUpdate={updateItem} />
        </section>
      </main>

      <footer className="main-footer">
        <div className="footer-content">
          <p>Frontend-only prototype showcasing AI-powered artisan marketplace</p>
          <p className="tech-note">All AI processing simulated for demonstration purposes</p>
        </div>
      </footer>
    </div>
  )
}