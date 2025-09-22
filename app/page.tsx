// ... keep all the existing imports and functions ...

export default async function Home() {
  const data = await getHoldingPageData()
  
  if (!data) return null

  const shuffledImages = data.backgroundImages ? shuffleArray(data.backgroundImages) : []

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
      
      <GalleryClient images={shuffledImages} />
    </div>
  )
}