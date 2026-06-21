'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function ProductGallery({
  imageUrls,
  productName,
}: {
  imageUrls: string[]
  productName: string
}) {
  const [selected, setSelected] = useState(0)

  if (imageUrls.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-xl">
        <span className="text-gray-400">이미지 없음</span>
      </div>
    )
  }

  return (
    <div>
      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
        <Image
          src={imageUrls[selected]}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {imageUrls.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {imageUrls.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                selected === idx ? 'border-black' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={url}
                alt={`${productName} ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}