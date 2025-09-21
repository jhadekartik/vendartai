import React, { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Upload, Palette, Sparkles, QrCode, ArrowRight } from 'lucide-react'

function mockAIEnhance(text: string) {
  if (!text || !text.trim()) {
    return "A beautiful handcrafted piece by a local artisan. Made with care and traditional techniques."
  }
  const base = text.trim()
  return `This exquisite handcrafted artwork tells a story of ${base}. Created using traditional materials and time-honored techniques passed down through generations of skilled artisans. Each brushstroke carries the essence of cultural heritage, making this piece perfect for collectors who appreciate authentic craftsmanship. The artwork reflects the artist's deep connection with their roots while embracing contemporary artistic expression. Care instructions: Keep away from direct sunlight and moisture to preserve the vibrant colors and intricate details.`
}

export default function ArtisanPanel({ onAdd }: { onAdd: (item: any) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [mockStory, setMockStory] = useState('')
  const [qrValue, setQrValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(f)
  }

  const generate = async () => {
    setIsProcessing(true)
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const id = 'art_' + Date.now().toString(36).slice(-6)
    const titleText = title || (caption.split('.')[0] || 'Untitled Masterpiece')
    const story = mockAIEnhance(caption)
    setMockStory(story)

    // QR value links to a demo URL
    const qr = `https://vendart.demo/artwork/${id}`

    // Build item with enhanced metadata
    const item = {
      id,
      title: titleText,
      caption,
      imageDataUrl: image,
      story,
      artist: 'Local Artisan', // Could be made dynamic
      price: '₹' + (500 + Math.floor(Math.random() * 2000)),
      translations: {
        en: story,
        hi: `हिंदी संस्करण: ${story}`,
        te: `తెలుగు వెర్షన్: ${story}`
      },
      audioUrls: {},
      qr,
      status: 'draft',
      placed: false,
      sold: false,
      createdAt: new Date().toISOString()
    }
    
    setQrValue(qr)
    onAdd(item)
    setIsProcessing(false)
    setShowSuccess('Artwork generated successfully! Ready to place in vending machine.')
    
    // Reset form
    setTimeout(() => {
      setTitle('')
      setCaption('')
      setImage(null)
      setMockStory('')
      setQrValue('')
      setShowSuccess('')
      if (fileRef.current) fileRef.current.value = ''
    }, 3000)
  }

  return (
    <div className="artisan-panel">
      <div className="upload-section">
        <div className="upload-area" onClick={() => fileRef.current?.click()}>
          <input 
            ref={fileRef} 
            type="file" 
            accept="image/*" 
            onChange={handleFile}
            className="hidden-input"
          />
          {image ? (
            <div className="image-preview">
              <img src={image} alt="Preview" />
              <div className="image-overlay">
                <Upload size={24} />
                <span>Click to change image</span>
              </div>
            </div>
          ) : (
            <div className="upload-placeholder">
              <Upload size={48} />
              <h3>Upload Your Artwork</h3>
              <p>Click here or drag & drop your image</p>
              <span className="file-types">JPG, PNG up to 10MB</span>
            </div>
          )}
        </div>
      </div>

      <div className="form-section">
        <div className="input-group">
          <label className="input-label">
            <Palette size={18} />
            Artwork Title
          </label>
          <input 
            type="text"
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g., Madhubani Sunrise, Village Life, Abstract Dreams..."
            className="styled-input"
          />
        </div>

        <div className="input-group">
          <label className="input-label">
            <Sparkles size={18} />
            Artist's Story
          </label>
          <textarea 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
            placeholder="Share the inspiration behind your artwork. What techniques did you use? What story does it tell?"
            className="styled-textarea"
            rows={4}
          />
        </div>

        <button 
          onClick={generate} 
          disabled={(!image && !caption) || isProcessing}
          className={`generate-btn ${isProcessing ? 'processing' : ''}`}
        >
          {isProcessing ? (
            <>
              <div className="processing-spinner" />
              AI Processing...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate AI Story & QR
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>

      {mockStory && (
        <div className="ai-story-section">
          <h3 className="story-title">
            <Sparkles size={20} />
            AI-Enhanced Story
          </h3>
          <div className="story-content">
            <p>{mockStory}</p>
          </div>
        </div>
      )}

      {qrValue && (
        <div className="qr-section">
          <div className="qr-header">
            <QrCode size={20} />
            <span>Generated QR Code</span>
          </div>
          <div className="qr-container">
            <div className="qr-code">
              <QRCodeCanvas value={qrValue} size={120} level="H" />
            </div>
            <div className="qr-instructions">
              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Print and attach this QR code to your physical artwork</li>
                <li>Use the vending panel to place your artwork in the machine</li>
                <li>Your art is now ready for buyers to discover and purchase!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="success-message">
          <div className="success-icon">✨</div>
          <p>{showSuccess}</p>
        </div>
      )}
    </div>
  )
}