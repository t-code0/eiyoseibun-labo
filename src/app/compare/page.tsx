'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const NUTRIENT_LABELS: Record<string, { label: string; unit: string; effect: string }> = {
  energy_100g: { label: 'カロリー', unit: 'kcal', effect: '体を動かすエネルギー源' },
  proteins_100g: { label: 'タンパク質', unit: 'g', effect: '筋肉・免疫・ホルモンの原料' },
  carbohydrates_100g: { label: '炭水化物', unit: 'g', effect: '脳と筋肉のエネルギー源' },
  sugars_100g: { label: '糖質', unit: 'g', effect: '過剰摂取は血糖値スパイクの原因' },
  fat_100g: { label: '脂質', unit: 'g', effect: 'ホルモン合成・ビタミン吸収に必要' },
  fiber_100g: { label: '食物繊維', unit: 'g', effect: '腸内環境を整える。1日20〜25g推奨' },
  sodium_100g: { label: 'ナトリウム', unit: 'mg', effect: '過剰摂取は高血圧の原因' },
  calcium_100g: { label: 'カルシウム', unit: 'mg', effect: '骨・歯の形成に必須' },
  iron_100g: { label: '鉄分', unit: 'mg', effect: '貧血予防・エネルギー産生' },
  potassium_100g: { label: 'カリウム', unit: 'mg', effect: '血圧を下げる・筋肉機能' },
  magnesium_100g: { label: 'マグネシウム', unit: 'mg', effect: 'エネルギー産生・睡眠の質' },
  zinc_100g: { label: '亜鉛', unit: 'mg', effect: '免疫・味覚・創傷治癒' },
}

type Product = {
  id: string
  name: string
  brand: string
  image: string
  nutrients: Record<string, number>
}

function CompareContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const items = (searchParams.get('items') || '').split(',').filter(Boolean).map(decodeURIComponent)
  const [products, setProducts] = useState<(Product | null)[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        items.map(async (item) => {
          const res = await fetch(`/api/search?q=${encodeURIComponent(item)}`)
          const data = await res.json()
          return data.products?.[0] || null
        })
      )
      setProducts(results)
      setLoading(false)
    }
    if (items.length > 0) fetchAll()
  }, [])

  const validProducts = products.filter(Boolean) as Product[]

  // 各栄養素の最大値を取得（ハイライト用）
  const getMax = (key: string) =>
    Math.max(...validProducts.map(p => p.nutrients[key] ?? 0))

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
      >
        ← 戻る
      </button>

      <h1 className="text-xl font-bold mb-1">📊 栄養成分比較</h1>
      <p className="text-gray-400 text-sm mb-6">{items.join(' vs ')}</p>

      {loading && <p className="text-gray-400">読み込み中...</p>}

      {!loading && validProducts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-gray-800 w-48 sticky left-0">成分 / 効果</th>
                {validProducts.map(p => (
                  <th key={p.id} className="p-3 bg-gray-800 text-center min-w-36">
                    {p.image && (
                      <img src={p.image} alt={p.name} className="w-16 h-16 object-contain mx-auto mb-1" />
                    )}
                    <div className="text-xs font-bold line-clamp-2">{p.name}</div>
                    <div className="text-gray-400 text-xs">{p.brand}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(NUTRIENT_LABELS).map(([key, { label, unit, effect }]) => {
                const hasAny = validProducts.some(p => p.nutrients[key] !== undefined)
                if (!hasAny) return null
                const max = getMax(key)
                return (
                  <tr key={key} className="border-t border-gray-800">
                    <td className="p-3 sticky left-0 bg-gray-950">
                      <div className="font-bold text-sm">{label}</div>
                      <div className="text-gray-500 text-xs leading-relaxed">{effect}</div>
                    </td>
                    {validProducts.map(p => {
                      const val = p.nutrients[key]
                      const isMax = val !== undefined && val === max && max > 0
                      return (
                        <td key={p.id} className={`p-3 text-center font-bold ${isMax ? 'text-green-400' : 'text-white'}`}>
                          {val !== undefined ? `${val} ${unit}` : '—'}
                          {isMax && <div className="text-xs text-green-500">最高</div>}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 text-white p-4">読み込み中...</div>}>
      <CompareContent />
    </Suspense>
  )
}