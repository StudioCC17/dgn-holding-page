import { client } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import GalleryClient from '@/components/GalleryClient'

interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

interface HoldingPageData {
  companyName: string
  subHeader: string
  address: string
  phone1: string
  phone2: string
  email: string
  instagram: string
  ribaInfo: string
  ribaLogo: SanityImage
  backgroundImages: SanityImage[]
}

async function getHoldingPageData(): Promise<HoldingPageData | null> {
  try {
    const data = await client.fetch(`
      *[_type == "holdingPage"][0]{
        companyName,
        subHeader,
        address,
        phone1,
        phone2,
        email,
        instagram,
        ribaInfo,
        ribaLogo,
        backgroundImages
      }
    `, {}, { next: { revalidate: 0 } })
    return data
  } catch (error) {
    console.error('Error fetching holding page data:', error)
    return null
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default async function Home() {
  const data = await getHoldingPageData()
  
  if (!data) return null

  const shuffledImages = data.backgroundImages ? shuffleArray(data.backgroundImages) : []

  return (
    <div className="h-screen flex flex-col md:flex-row bg-white overflow-hidden overscroll-none">
      {/* Mobile: Full screen gallery with text overlay */}
      <div className="md:hidden relative w-full h-full">
        <GalleryClient images={shuffledImages} isMobile={true} />
        
        {/* Text overlay on mobile */}
        <div className="absolute top-[15px] left-[15px] z-30 text-white">
          {/* Company Name */}
          <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[1px]">
            {data.companyName}
          </div>
          
          {/* Sub Header */}
          {data.subHeader && (
            <>
              <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px]">
                &nbsp;
              </div>
              <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px]">
                {data.subHeader}
              </div>
            </>
          )}
          
          <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px]">
            &nbsp;
          </div>
          
          {/* Address */}
          <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px] whitespace-pre-line">
            {data.address}
          </div>
          
          {/* Phone Numbers */}
          {(data.phone1 || data.phone2) && (
            <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px]">
              &nbsp;
            </div>
          )}
          {data.phone1 && (
            <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px]">
              {data.phone1}
            </div>
          )}
          {data.phone2 && (
            <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px]">
              {data.phone2}
            </div>
          )}
          
          <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px]">
            &nbsp;
          </div>
          
          {/* Email */}
          <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px]">
            <a 
              href={`mailto:${data.email}`}
              className="transition-all duration-200 no-underline hover:no-underline text-white"
            >
              {data.email}
            </a>
          </div>
          
          {/* Instagram */}
          <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px]">
            <a 
              href={`https://instagram.com/${data.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-200 no-underline hover:no-underline text-white"
            >
              @{data.instagram}
            </a>
          </div>

          {/* RIBA section on mobile */}
          {(data.ribaInfo || data.ribaLogo) && (
            <>
              <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px]">
                &nbsp;
              </div>
              <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px]">
                &nbsp;
              </div>
              <div>
                {/* RIBA Info */}
                {data.ribaInfo && (
                  <div className="text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px] whitespace-pre-line">
                    {data.ribaInfo}
                  </div>
                )}
                
                {/* RIBA Logo */}
                {data.ribaLogo && (
                  <div className="mt-2">
                    <Image
                      src={urlFor(data.ribaLogo).width(100).quality(95).url()}
                      alt="RIBA Logo"
                      width={100}
                      height={50}
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop: Original layout */}
      <div className="hidden md:block w-1/2 relative bg-white overflow-hidden flex-shrink-0">
        {/* Main content */}
        <div className="absolute top-[15px] left-[15px]">
          {/* Company Name */}
          <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[1px]">
            {data.companyName}
          </div>
          
          {/* Sub Header */}
          {data.subHeader && (
            <>
              <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
                &nbsp;
              </div>
              <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
                {data.subHeader}
              </div>
            </>
          )}
          
          <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
            &nbsp;
          </div>
          
          {/* Address */}
          <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px] whitespace-pre-line">
            {data.address}
          </div>
          
          {/* Phone Numbers */}
          {(data.phone1 || data.phone2) && (
            <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
              &nbsp;
            </div>
          )}
          {data.phone1 && (
            <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
              {data.phone1}
            </div>
          )}
          {data.phone2 && (
            <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
              {data.phone2}
            </div>
          )}
          
          <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
            &nbsp;
          </div>
          
          {/* Email */}
          <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px]">
            <a 
              href={`mailto:${data.email}`}
              className="transition-all duration-200 no-underline hover:no-underline"
            >
              {data.email}
            </a>
          </div>
          
          {/* Instagram */}
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

        {/* RIBA section - Desktop only: bottom aligned */}
        {(data.ribaInfo || data.ribaLogo) && (
          <div className="absolute bottom-[25px] left-[15px]">
            {/* RIBA Info */}
            {data.ribaInfo && (
              <div className="text-[15.5px] leading-[1.3] text-black font-smooth tracking-[0.2px] whitespace-pre-line">
                {data.ribaInfo}
              </div>
            )}
            
            {/* RIBA Logo */}
            {data.ribaLogo && (
              <div className="mt-2">
                <Image
                  src={urlFor(data.ribaLogo).width(100).quality(95).url()}
                  alt="RIBA Logo"
                  width={100}
                  height={50}
                  className="object-contain"
                />
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="hidden md:block w-1/2">
        <GalleryClient images={shuffledImages} isMobile={false} />
      </div>
    </div>
  )
}