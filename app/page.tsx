import { client, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import { getPlaiceholder } from 'plaiceholder'

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

async function getHoldingPageData(): Promise<HoldingPageData | null> {
  try {
    const data = await client.fetch(`
      *[_type == "holdingPage"][0]{
        companyName,
        address,
        email,
        instagram,
        backgroundImages
      }
    `, {}, { next: { revalidate: 0 } })
    return data
  } catch (error) {
    console.error('Error fetching holding page data:', error)
    return null
  }
}

function getRandomImage(images: SanityImage[]): SanityImage | null {
  if (!images || images.length === 0) return null
  return images[Math.floor(Math.random() * images.length)]
}

export default async function Home() {
  const data = await getHoldingPageData()
  
  if (!data) return null

  const randomImage = getRandomImage(data.backgroundImages)
  
  let blurDataURL = ''
  if (randomImage) {
    try {
      const imageUrl = urlFor(randomImage).width(20).quality(20).url()
      const buffer = await fetch(imageUrl).then(async (res) =>
        Buffer.from(await res.arrayBuffer())
      )
      const { base64 } = await getPlaiceholder(buffer)
      blurDataURL = base64
    } catch (error) {
      console.error('Error generating blur placeholder:', error)
    }
  }

  return (
    <div className="h-screen flex bg-white overflow-hidden overscroll-none">
      <div className="w-1/2 relative bg-white overflow-hidden">
        <div className="absolute top-[25px] left-[20px]">
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
          {randomImage && (
            <Image
              src={urlFor(randomImage).width(1600).quality(85).url()}
              alt="Background"
              fill
              sizes="40vw"
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={blurDataURL}
            />
          )}
        </div>
      </div>
    </div>
  )
}