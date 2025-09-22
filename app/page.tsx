'use client'
import { useState, useEffect } from 'react'
import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'

interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

interface HoldingPageData {
  companyName: string
  address: string
  email: string
  instagram: string
  backgroundImages: SanityImage[]
}

export default function Home() {
  const [data, setData] = useState<HoldingPageData | null>(null)
  const [images, setImages] = useState<SanityImage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await client.fetch(`
          *[_type == "holdingPage"][0]{
            companyName,
            address,
            email,
            instagram,
            backgroundImages
          }
        `)
        
        if (result?.backgroundImages) {
          // Randomize the order of images
          const shuffled = [...result.backgroundImages].sort(() => Math.random() - 0.5)
          setImages(shuffled)
        }
        
        setData(result)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

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

  if (!data || images.length === 0) return null

  const currentImage = images[currentIndex]
  const showNavigation = images.length > 1

  return (
    <div className="h-screen flex bg-white overflow-hidden overscroll-none">
      <div className="w-1/2 relative bg-white overflow-hidden">
        <div className="absolute top-[25px] left-[25px]">
          <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[1px]">
            {data.companyName}
          </div>
          <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
            &nbsp;
          </div>
          <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px] whitespace-pre-line">
            {data.address}
          </div>
          <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
            &nbsp;
          </div>
          <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
            <a 
              href={`mailto:${data.email}`}
              className="transition-all duration-200 no-underline hover:no-underline"
            >
              {data.email}
            </a>
          </div>
          <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
            <a 
              href={`https://instagram.com/${data.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-200 no-underline hover:no-underline"
            >
              @{data.instagram}
            </a>
          </div>
        </div>
      </div>
      
      <div className="w-1/2 relative overflow-hidden bg-white p-[10%]">
        {/* Counter */}
        {showNavigation && (
          <div className="absolute top-[25px] right-[25px] z-10">
            <span className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
              {currentIndex + 1}/{images.length}
            </span>
          </div>
        )}
        
        {/* Image Container */}
        <div 
          className="w-full h-full relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false)
            setHoverSide(null)
          }}
          onMouseMove={handleMouseMove}
        >
          {currentImage && (
            <Image
              src={urlFor(currentImage).width(1600).quality(85).url()}
              alt="Background"
              fill
              sizes="40vw"
              className="object-cover transition-opacity duration-300"
              priority
            />
          )}
          
          {/* Navigation Areas */}
          {showNavigation && isHovering && (
            <>
              {/* Left Navigation */}
              <div 
                className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center cursor-pointer z-20"
                onClick={() => handleClick('left')}
                style={{ cursor: hoverSide === 'left' ? 'pointer' : 'default' }}
              >
                {hoverSide === 'left' && (
                  <span className="text-[24px] text-white font-smooth bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center">
                    ←
                  </span>
                )}
              </div>
              
              {/* Right Navigation */}
              <div 
                className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center cursor-pointer z-20"
                onClick={() => handleClick('right')}
                style={{ cursor: hoverSide === 'right' ? 'pointer' : 'default' }}
              >
                {hoverSide === 'right' && (
                  <span className="text-[24px] text-white font-smooth bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center">
                    →
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}