'use client'
import { useState } from 'react'

export default function ProductTabs({ description }: { description: string }) {
  const [activeTab, setActiveTab] = useState<'desc' | 'delivery'>('desc')

  return (
    <div className="mt-12 border-t border-gray-100 pt-0">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('desc')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'desc' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          상품 설명
        </button>
        <button
          onClick={() => setActiveTab('delivery')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'delivery' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          배송 / 반품
        </button>
      </div>

      {activeTab === 'desc' && (
        <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
          {description}
        </div>
      )}

      {activeTab === 'delivery' && (
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">배송 안내</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex gap-4"><span className="w-20 shrink-0 text-gray-400">배송방법</span><span>택배 (CJ대한통운)</span></div>
              <div className="flex gap-4"><span className="w-20 shrink-0 text-gray-400">배송비</span><span>30,000원 이상 무료 / 미만 시 3,000원</span></div>
              <div className="flex gap-4"><span className="w-20 shrink-0 text-gray-400">도착예정</span><span>오늘 오후 3시 이전 주문 시 내일 도착</span></div>
            </div>
          </div>
          <hr className="border-gray-100" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">교환 / 반품 안내</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex gap-4"><span className="w-20 shrink-0 text-gray-400">교환/반품</span><span>수령 후 7일 이내 가능</span></div>
              <div className="flex gap-4"><span className="w-20 shrink-0 text-gray-400">반품비용</span><span>왕복 6,000원 (단순 변심)</span></div>
              <div className="flex gap-4"><span className="w-20 shrink-0 text-gray-400">교환불가</span><span>개봉 후 단순 변심, 사용 흔적 있는 경우</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}