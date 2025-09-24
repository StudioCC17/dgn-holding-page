'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

export default function GalleryClient({ images }: { images: SanityImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null)
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>({})

  // Aggressive preloading with load tracking
  useEffect(() => {
    const loadPromises = images.map((image, index) => {
      return new Promise<void>((resolve) => {
        const img = new window.Image()
        img.onload = () => {
          setImagesLoaded(prev => ({ ...prev, [index]: true }))
          resolve()
        }
        img.onerror = () => resolve() // Still resolve on error to prevent hanging
        img.src = urlFor(image).quality(95).url()
      })
    })

    Promise.all(loadPromises).then(() => {
      console.log('All images preloaded')
    })
  }, [images])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (images.length <= 1) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const isLeftSide = x < rect.width / 2
    setHoverSide(isLeftSide ? 'left' : 'right')
  }

  const handleClick = (direction: 'left' | 'right') => {
    if (images.length <= 1) return
    
    if (direction === 'left') {
      setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)
    } else {
      setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)
    }
  }

  const currentImage = images[currentIndex]
  const showNavigation = images.length > 1

  return (
    <div className="w-full h-full relative overflow-hidden bg-white p-[10%]">
      {/* Render ALL images, but only show the current one */}
      {images.map((image, index) => (
        <div 
          key={index}
          className="w-full h-full relative"
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: index === currentIndex ? 1 : 0
          }}
        >
          <Image
            src={urlFor(image).quality(95).url()}
            alt="Background"
            fill
            sizes="40vw"
            className="object-cover"
            priority={index <= 2} // Priority for first 3 images
          />
        </div>
      ))}

      {showNavigation && (
        <div className="absolute top-[15px] right-[15px] z-10">
          <span className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
            {currentIndex + 1}/{images.length}
          </span>
        </div>
      )}
      
      <div 
        className="absolute inset-0 w-full h-full z-20"
        onMouseLeave={() => setHoverSide(null)}
        onMouseMove={handleMouseMove}
      >
        {/* Click areas with custom cursors */}
        {showNavigation && (
          <>
            <div 
              className="absolute left-0 top-0 w-1/2 h-full"
              style={{ 
                cursor: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'25\' height=\'25\' viewBox=\'0 0 25 25\'><text x=\'12.5\' y=\'18\' text-anchor=\'middle\' font-family=\'ABC Arizona Mix, Arial\' font-size=\'20\' fill=\'black\'>←</text></svg>") 12 12, auto'
              }}
              onClick={() => handleClick('left')}
            />
            <div 
              className="absolute right-0 top-0 w-1/2 h-full"
              style={{ 
                cursor: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'25\' height=\'25\' viewBox=\'0 0 25 25\'><text x=\'12.5\' y=\'18\' text-anchor=\'middle\' font-family=\'ABC Arizona Mix, Arial\' font-size=\'20\' fill=\'black\'>→</text></svg>") 12 12, auto'
              }}
              onClick={() => handleClick('right')}
            />
          </>
        )}
      </div>
    </div>
  )
}