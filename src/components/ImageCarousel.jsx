import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ImageCarousel = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="relative h-[400px] bg-muted flex items-center justify-center">
        <p>No images available</p>
      </div>
    )
  }

  const nextImage = (e) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative h-[400px] bg-muted">
      <img
        src={images[currentImage].image_url}
        alt="Spot"
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  currentImage === idx ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ImageCarousel
