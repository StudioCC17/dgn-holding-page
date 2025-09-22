import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'

async function getHoldingPageData() {
  try {
    const data = await client.fetch(`
      *[_type == "holdingPage"][0]{
        companyName,
        address,
        email,
        instagram,
        backgroundImages
      }
    `)
    return data
  } catch (error) {
    console.error('Error fetching holding page data:', error)
    return null
  }
}

function getRandomImage(images: any[]) {
  if (!images || images.length === 0) return null
  return images[Math.floor(Math.random() * images.length)]
}

export default async function Home() {
  const data = await getHoldingPageData()
  
  if (!data) {
    return <div className="h-screen flex items-center justify-center bg-white">
      <p className="text-black text-[15.5px] leading-[1.3] font-smooth tracking-[0.2px]">Loading...</p>
    </div>
  }

  const randomImage = getRandomImage(data.backgroundImages)

  return (
    <div className="h-screen flex bg-white overflow-hidden overscroll-none">
      {/* Left side - Text content positioned 25px from top and left */}
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
      
      {/* Right side - High resolution portrait image with 10% padding */}
      <div className="w-1/2 relative overflow-hidden bg-white p-[10%]">
        <div className="w-full h-full relative">
          {randomImage && (
            <Image
              src={urlFor(randomImage).width(2400).quality(95).url()}
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