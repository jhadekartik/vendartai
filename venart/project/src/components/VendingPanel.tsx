import React, { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Play, ShoppingCart, Globe, Volume2, CheckCircle, RotateCw, Eye } from 'lucide-react'

function useRotate(items: any[], interval = 4000) {
  const [index, setIndex] = useState(0)
  const [isRotating, setIsRotating] = useState(true)
  
  useEffect(() => {
    if (!items.length || !isRotating) return
    const iv = setInterval(() => setIndex(i => (i + 1) % items.length), interval)
    return () => clearInterval(iv)
  }, [items.length, interval, isRotating])
  
  return [index, setIndex, isRotating, setIsRotating] as const
}

export default function VendingPanel({ items, onPlace, onUpdate }: { 
  items: any[], 
  onPlace: (id: string, patch: any) => void,
  onUpdate: (id: string, patch: any) => void 
}) {
  const displayItems = items.filter(i => !i.sold)
  const [rotIndex, setRotIndex, isRotating, setIsRotating] = useRotate(displayItems)
  const [selected, setSelected] = useState<any>(null)
  const [lang, setLang] = useState('en')
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (displayItems.length === 0) {
      setSelected(null)
    } else {
      setSelected(displayItems[rotIndex] || displayItems[0])
    }
  }, [displayItems, rotIndex])

  const placeInVending = async (id: string) => {
    onPlace(id, { placed: true, status: 'ready' })
    // Show success animation
    const notification = document.createElement('div')
    notification.className = 'place-notification'
    notification.textContent = 'Artwork successfully placed in vending machine! 🎨'
    document.body.appendChild(notification)
    setTimeout(() => document.body.removeChild(notification), 3000)
  }

  const playStory = async (item: any) => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    const text = (item.translations && item.translations[lang]) || item.story || item.caption || item.title
    if (!text) return alert('No story available')
    
    setIsPlaying(true)
    const utter = new SpeechSynthesisUtterance(text)
    
    // Language mapping
    if (lang === 'hi') utter.lang = 'hi-IN'
    if (lang === 'te') utter.lang = 'te-IN'
    if (lang === 'en') utter.lang = 'en-US'
    
    utter.onend = () => setIsPlaying(false)
    utter.onerror = () => setIsPlaying(false)
    
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  const buyNow = (item: any) => {
    if (!item.placed) {
      alert('This artwork needs to be placed in the vending machine first!')
      return
    }
    
    const price = item.price || '₹999'
    const confirmation = window.confirm(`Purchase "${item.title}" for ${price}?\n\nThis will simulate a successful payment and notify the artist.`)
    
    if (!confirmation) return
    
    // Simulate payment processing
    const paymentModal = document.createElement('div')
    paymentModal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
        <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 400px;">
          <div style="font-size: 48px; margin-bottom: 20px;">💳</div>
          <h3>Processing Payment...</h3>
          <div style="margin: 20px 0;">
            <div style="width: 200px; height: 4px; background: #f0f0f0; border-radius: 2px; margin: 0 auto; overflow: hidden;">
              <div style="width: 0%; height: 100%; background: #4CAF50; border-radius: 2px; animation: loading 2s ease-in-out forwards;"></div>
            </div>
          </div>
        </div>
      </div>
      <style>
        @keyframes loading { to { width: 100%; } }
      </style>
    `
    document.body.appendChild(paymentModal)
    
    setTimeout(() => {
      document.body.removeChild(paymentModal)
      onUpdate(item.id, { sold: true, status: 'sold', soldAt: new Date().toISOString() })
      
      // Success message
      const successModal = document.createElement('div')
      successModal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
          <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 400px;">
            <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
            <h3 style="color: #4CAF50; margin-bottom: 15px;">Purchase Successful!</h3>
            <p>Payment of ${price} has been processed.</p>
            <p style="margin: 15px 0;">The artist will receive 85% of the sale amount directly in their account.</p>
            <p style="font-size: 14px; color: #666;">Thank you for supporting local artisans!</p>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 20px; padding: 10px 30px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer;">Close</button>
          </div>
        </div>
      `
      document.body.appendChild(successModal)
    }, 2500)
  }

  const toggleRotation = () => {
    setIsRotating(!isRotating)
  }

  return (
    <div className="vending-panel">
      <div className="vending-machine">
        <div className="machine-header">
          <div className="status-lights">
            <div className="status-light active"></div>
            <div className="status-light active"></div>
            <div className="status-light"></div>
          </div>
          <div className="machine-title">VENDART GALLERY</div>
          <button className="rotation-control" onClick={toggleRotation}>
            <RotateCw size={16} className={isRotating ? 'spinning' : ''} />
            {isRotating ? 'Stop' : 'Start'} Rotation
          </button>
        </div>

        <div className="display-screens">
          {displayItems.slice(0, 4).map((item, idx) => (
            <div 
              key={item.id} 
              className={`display-screen ${selected && selected.id === item.id ? 'active' : ''} ${!item.placed ? 'draft' : ''}`}
              onClick={() => {
                setSelected(item)
                setIsRotating(false)
              }}
            >
              <div className="screen-content">
                {item.imageDataUrl ? (
                  <img src={item.imageDataUrl} alt={item.title} />
                ) : (
                  <div className="placeholder-art">
                    <Eye size={24} />
                    <span>No Image</span>
                  </div>
                )}
                <div className="screen-overlay">
                  <h4>{item.title}</h4>
                  <p className="price">{item.price || '₹999'}</p>
                  {!item.placed && <span className="draft-label">DRAFT</span>}
                </div>
              </div>
            </div>
          ))}
          {displayItems.length === 0 && (
            <div className="empty-gallery">
              <div className="empty-content">
                <h3>Gallery Empty</h3>
                <p>Upload artwork from the Artist Studio to begin</p>
              </div>
            </div>
          )}
        </div>

        {selected && (
          <div className="control-panel">
            <div className="artwork-details">
              <div className="artwork-header">
                <h3>{selected.title}</h3>
                <span className="price-tag">{selected.price || '₹999'}</span>
              </div>
              <p className="artwork-caption">{selected.caption}</p>
            </div>

            <div className="interaction-controls">
              <div className="language-control">
                <Globe size={18} />
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="lang-select">
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                </select>
                <button 
                  onClick={() => playStory(selected)} 
                  className={`play-btn ${isPlaying ? 'playing' : ''}`}
                >
                  {isPlaying ? <Volume2 size={16} className="pulsing" /> : <Play size={16} />}
                  {isPlaying ? 'Playing...' : 'Play Story'}
                </button>
              </div>

              <div className="qr-and-purchase">
                <div className="qr-display">
                  <QRCodeCanvas value={selected.qr || 'demo'} size={80} level="H" />
                  <span className="qr-label">Scan QR</span>
                </div>

                <div className="action-buttons">
                  {!selected.placed && (
                    <button 
                      onClick={() => placeInVending(selected.id)} 
                      className="place-btn"
                    >
                      <CheckCircle size={18} />
                      Place in Machine
                    </button>
                  )}
                  <button 
                    onClick={() => buyNow(selected)} 
                    className={`buy-btn ${!selected.placed ? 'disabled' : ''}`}
                    disabled={!selected.placed}
                  >
                    <ShoppingCart size={18} />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            <div className="story-preview">
              <h4>Artwork Story</h4>
              <div className="story-text">
                {(selected.translations && selected.translations[lang]) || selected.story}
              </div>
            </div>
          </div>
        )}

        <div className="machine-footer">
          <div className="usage-tips">
            <p><strong>How to use:</strong> Artists upload artwork on the left → Generate AI story & QR → Place in vending machine → Buyers can browse, listen to stories in multiple languages, and purchase instantly</p>
          </div>
        </div>
      </div>
    </div>
  )
}