'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

const NUTRIENT_LABELS: Record<string, { label: string; unit: string; effect: string }> = {
  energy_100g: { label: 'カロリー', unit: 'kcal', effect: '体を動かすエネルギー源。過剰摂取は体脂肪として蓄積される。' },
  proteins_100g: { label: 'タンパク質', unit: 'g', effect: '筋肉・髪・爪・ホルモンの原料。免疫機能の維持にも必須。1日体重×1gが目安。' },
  carbohydrates_100g: { label: '炭水化物', unit: 'g', effect: '脳と筋肉の主なエネルギー源。食物繊維も含まれる。' },
  sugars_100g: { label: '糖質', unit: 'g', effect: '素早いエネルギー源。過剰摂取は血糖値スパイクや脂肪蓄積の原因に。' },
  fat_100g: { label: '脂質', unit: 'g', effect: 'ホルモン合成・脂溶性ビタミン吸収に必要。質（飽和/不飽和）が重要。' },
  'saturated-fat_100g': { label: '飽和脂肪酸', unit: 'g', effect: '過剰摂取はLDLコレステロールを上昇させる可能性。動物性脂肪に多い。' },
  fiber_100g: { label: '食物繊維', unit: 'g', effect: '腸内環境を整え、血糖値上昇を緩やかにする。1日20〜25g推奨。' },
  sodium_100g: { label: 'ナトリウム', unit: 'mg', effect: '神経・筋肉機能に必要。過剰摂取は高血圧・むくみの原因。1日2000mg以下推奨。' },
  calcium_100g: { label: 'カルシウム', unit: 'mg', effect: '骨・歯の形成に必須。神経伝達・筋収縮にも関与。1日700mg推奨。' },
  iron_100g: { label: '鉄分', unit: 'mg', effect: '赤血球のヘモグロビン合成に必須。不足すると貧血・疲労感の原因に。' },
  'vitamin-c_100g': { label: 'ビタミンC', unit: 'mg', effect: '抗酸化作用・コラーゲン合成・免疫強化。水溶性のため毎日補給が必要。' },
  potassium_100g: { label: 'カリウム', unit: 'mg', effect: 'ナトリウムを排出し血圧を下げる。筋肉・神経機能にも必要。' },
  magnesium_100g: { label: 'マグネシウム', unit: 'mg', effect: '300以上の酵素反応に関与。エネルギー産生・筋弛緩・睡眠の質に影響。' },
  zinc_100g: { label: '亜鉛', unit: 'mg', effect: '免疫・味覚・創傷治癒・テストステロン合成に必須。不足は免疫低下の原因。' },
}

type Product = {
  id: string
  name: string
  brand: string
  image: string
  nutrients: Record<string, number>
  ingredients: string
}

export default function FoodDetail() {
  const router = useRouter()
  const params = useParams()
  const foodName = decodeURIComponent(params.name as string)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(foodName)}`)
      const data = await res.json()
      setProducts(data.products || [])
      setLoading(false)
    }
    fetchData()
  }, [foodName])

  const topProduct = products[0]

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* 戻るボタン */}
      <button
        onClick={() => router.back()}
        className="mb-4 text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
      >
        ← 戻る
      </button>

      <h1 className="text-2xl font-bold mb-1">{foodName}</h1>
      <p className="text-gray-400 text-sm mb-6">栄養成分・効果の詳細</p>

      {loading && <p className="text-gray-400">読み込み中...</p>}

      {topProduct && (
        <div className="flex gap-4 mb-8">
          {topProduct.image && (
            <img src={topProduct.image} alt={topProduct.name} className="w-32 h-32 object-contain bg-gray-800 rounded-xl" />
          )}
          <div>
            <p className="font-bold">{topProduct.name}</p>
            <p className="text-gray-400 text-sm">{topProduct.brand}</p>
            {topProduct.ingredients && (
              <p className="text-gray-500 text-xs mt-2 max-w-md line-clamp-3">原材料：{topProduct.ingredients}</p>
            )}
          </div>
        </div>
      )}

      {/* 栄養成分カード */}
      {topProduct && (
        <div>
          <h2 className="text-lg font-bold mb-4">📊 栄養成分（100gあたり）＋効果</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(NUTRIENT_LABELS).map(([key, { label, unit, effect }]) => {
              const value = topProduct.nutrients[key]
              if (value === undefined) return null
              return (
                <div key={key} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">{label}</span>
                    <span className="text-green-400 font-bold">{typeof value === 'number' ? Math.round(value * 10) / 10 : value} {unit}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{effect}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 他の商品 */}
      {products.length > 1 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">他の「{foodName}」商品</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.slice(1).map(p => (
              <div key={p.id} className="bg-gray-800 rounded-xl p-3">
                {p.image && <img src={p.image} alt={p.name} className="w-full h-24 object-contain mb-2" />}
                <p className="text-xs font-bold line-clamp-2">{p.name}</p>
                <p className="text-gray-400 text-xs">{p.brand}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}