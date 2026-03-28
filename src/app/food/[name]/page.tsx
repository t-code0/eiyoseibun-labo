'use client'
import { useRouter, useParams } from 'next/navigation'
import { JAPAN_FOODS } from '@/lib/japanFoods'

const NUTRIENT_INFO: Record<string, { label: string; unit: string; effect: string }> = {
  energy:    { label: 'カロリー',     unit: 'kcal', effect: '体を動かすエネルギー源。過剰摂取は体脂肪として蓄積される。' },
  protein:   { label: 'タンパク質',   unit: 'g',    effect: '筋肉・髪・爪・ホルモンの原料。免疫機能の維持にも必須。1日体重×1gが目安。' },
  carbs:     { label: '炭水化物',     unit: 'g',    effect: '脳と筋肉の主なエネルギー源。食物繊維も含まれる。' },
  fat:       { label: '脂質',         unit: 'g',    effect: 'ホルモン合成・脂溶性ビタミン吸収に必要。質（飽和/不飽和）が重要。' },
  fiber:     { label: '食物繊維',     unit: 'g',    effect: '腸内環境を整え、血糖値上昇を緩やかにする。1日20〜25g推奨。' },
  sodium:    { label: 'ナトリウム',   unit: 'mg',   effect: '過剰摂取は高血圧・むくみの原因。1日2000mg以下推奨。' },
  calcium:   { label: 'カルシウム',   unit: 'mg',   effect: '骨・歯の形成に必須。神経伝達・筋収縮にも関与。1日700mg推奨。' },
  iron:      { label: '鉄分',         unit: 'mg',   effect: '赤血球のヘモグロビン合成に必須。不足すると貧血・疲労感の原因に。' },
  vitaminC:  { label: 'ビタミンC',    unit: 'mg',   effect: '抗酸化作用・コラーゲン合成・免疫強化。水溶性のため毎日補給が必要。' },
  potassium: { label: 'カリウム',     unit: 'mg',   effect: 'ナトリウムを排出し血圧を下げる。筋肉・神経機能にも必要。' },
  magnesium: { label: 'マグネシウム', unit: 'mg',   effect: '300以上の酵素反応に関与。エネルギー産生・筋弛緩・睡眠の質に影響。' },
  zinc:      { label: '亜鉛',         unit: 'mg',   effect: '免疫・味覚・創傷治癒・テストステロン合成に必須。不足は免疫低下の原因。' },
}

export default function FoodDetail() {
  const router = useRouter()
  const params = useParams()
  const foodName = decodeURIComponent(params.name as string)
  const food = JAPAN_FOODS.find(f => f.name === foodName)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <button onClick={() => router.back()} className="mb-4 text-green-400 text-sm">← 戻る</button>
      <h1 className="text-2xl font-bold mb-1">{foodName}</h1>
      <p className="text-gray-400 text-sm mb-6">栄養成分・効果の詳細（100gあたり）</p>

      {!food ? (
        <div className="text-gray-400">
          <p>データがまだ登録されていません</p>
          <p className="text-xs mt-2">登録済み食品：{JAPAN_FOODS.map(f => f.name).join('、')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(NUTRIENT_INFO).map(([key, { label, unit, effect }]) => {
            const value = food.per100g[key as keyof typeof food.per100g]
            if (value === undefined) return null
            return (
              <div key={key} className="bg-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">{label}</span>
                  <span className="text-green-400 font-bold">{value} {unit}</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{effect}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}