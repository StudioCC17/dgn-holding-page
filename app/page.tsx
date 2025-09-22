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

function getRandomImage(images: SanityImage[]): SanityImage | null {
  if (!images || images.length === 0) return null
  return images[Math.floor(Math.random() * images.length)]
}

export default function Home() {
  const [data, setData] = useState<HoldingPageData | null>(null)
  const [currentImage, setCurrentImage] = useState<SanityImage | null>(null)
  const [loading, setLoading] = useState(true)

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
        setData(result)
        if (result?.backgroundImages) {
          setCurrentImage(getRandomImage(result.backgroundImages))
        }
      } catch (error) {
        console.error('Error fetching holding page data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || !data) {
    return <div className="h-screen flex items-center justify-center bg-white">
      <p className="text-black text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px]">Loading...</p>
    </div>
  }

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
        <div className="w-full h-full relative">
        {currentImage && (
  <Image
    src={urlFor(currentImage).quality(95).url()}
    alt="Background"
    fill
    sizes="40vw"
    className="object-cover"
    priority
  />
)}
        </div>
      </div>
    </div>
  )
}