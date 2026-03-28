'use client'
import { Suspense } from 'react'
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

const TYPICAL_SERVING: Record<string, { grams: number; label: string }> = {
  '鶏胸肉': { grams: 250, label: '1枚（250g）' },
  'ささみ': { grams: 45, label: '1本（45g）' },
  '鶏もも肉': { grams: 250, label: '1枚（250g）' },
  '鶏レバー': { grams: 40, label: '1個（40g）' },
  '牛肉': { grams: 100, label: '1人前（100g）' },
  '豚肉': { grams: 100, label: '1人前（100g）' },
  '卵': { grams: 60, label: '1個（60g）' },
  '納豆': { grams: 45, label: '1パック（45g）' },
  '豆腐': { grams: 150, label: '半丁（150g）' },
  '枝豆': { grams: 50, label: '1皿さや付き（50g可食部）' },
  '豆乳': { grams: 200, label: '1杯（200ml）' },
  '白米': { grams: 150, label: '茶碗1杯（150g）' },
  '玄米': { grams: 150, label: '茶碗1杯（150g）' },
  'もち麦': { grams: 50, label: '1食分（50g）' },
  'オートミール': { grams: 30, label: '1食分（30g）' },
  '食パン': { grams: 60, label: '1枚（60g）' },
  '全粒粉パン': { grams: 60, label: '1枚（60g）' },
  'バナナ': { grams: 100, label: '1本（100g）' },
  'りんご': { grams: 250, label: '1個（250g）' },
  'さつまいも': { grams: 150, label: '中1本（150g）' },
  'じゃがいも': { grams: 130, label: '中1個（130g）' },
  'そば': { grams: 170, label: '1人前茹で（170g）' },
  'パスタ': { grams: 250, label: '1人前茹で（250g）' },
  '全粒粉パスタ': { grams: 250, label: '1人前茹で（250g）' },
  'アボカド': { grams: 140, label: '1個（140g）' },
  'アーモンド': { grams: 25, label: '1掴み（25g）' },
  'くるみ': { grams: 25, label: '1掴み（25g）' },
  'カシューナッツ': { grams: 25, label: '1掴み（25g）' },
  'マカダミアナッツ': { grams: 25, label: '1掴み（25g）' },
  'ピスタチオ': { grams: 25, label: '1掴み（25g）' },
  'ピーナッツ': { grams: 25, label: '1掴み（25g）' },
  'ダークチョコレート': { grams: 25, label: '1片（25g）' },
  'ほうれん草': { grams: 80, label: '1/3束（80g）' },
  'ブロッコリー': { grams: 80, label: '1/3株（80g）' },
  'パプリカ': { grams: 120, label: '1個（120g）' },
  'トマト': { grams: 150, label: '中1個（150g）' },
  'にんじん': { grams: 150, label: '中1本（150g）' },
  'かぼちゃ': { grams: 80, label: '煮物1食分（80g）' },
  'キウイ': { grams: 80, label: '1個（80g）' },
  'いちご': { grams: 75, label: '5粒（75g）' },
  'レモン': { grams: 30, label: '1/2個（30g）' },
  'みかん': { grams: 80, label: '1個（80g）' },
  'サーモン': { grams: 80, label: '1切れ（80g）' },
  '鮭': { grams: 80, label: '1切れ（80g）' },
  'マグロ': { grams: 80, label: '刺身5切れ（80g）' },
  'カツオ': { grams: 80, label: '刺身5切れ（80g）' },
  'サバ': { grams: 80, label: '1切れ（80g）' },
  'イワシ': { grams: 60, label: '1尾（60g）' },
  'エビ': { grams: 60, label: '3尾（60g）' },
  'ホタテ': { grams: 60, label: '2個（60g）' },
  '牡蠣': { grams: 60, label: '3個（60g）' },
  'あさり': { grams: 30, label: '味噌汁1杯分（30g可食部）' },
  'しじみ': { grams: 20, label: '味噌汁1杯分（20g可食部）' },
  'タラ': { grams: 80, label: '1切れ（80g）' },
  'ブリ': { grams: 80, label: '1切れ（80g）' },
  'ツナ缶': { grams: 70, label: '1缶（70g）' },
  'しらす': { grams: 20, label: '大さじ2（20g）' },
  'チーズ': { grams: 20, label: '1切れ（20g）' },
  'ヨーグルト': { grams: 100, label: '1カップ（100g）' },
  'ギリシャヨーグルト': { grams: 100, label: '1カップ（100g）' },
  'クリームチーズ': { grams: 20, label: '1個（20g）' },
  'パルメザン': { grams: 10, label: '大さじ1（10g）' },
  'ゴーダチーズ': { grams: 20, label: '1切れ（20g）' },
  'ごま': { grams: 5, label: '小さじ2（5g）' },
  'ピーナッツバター': { grams: 16, label: '大さじ1（16g）' },
  'アーモンドバター': { grams: 16, label: '大さじ1（16g）' },
  'かぼちゃの種': { grams: 10, label: '大さじ1（10g）' },
  'ひまわりの種': { grams: 10, label: '大さじ1（10g）' },
  'チアシード': { grams: 10, label: '大さじ1（10g）' },
  '小松菜': { grams: 80, label: '1/3束（80g）' },
  'モロヘイヤ': { grams: 50, label: '1/2袋（50g）' },
  '水菜': { grams: 50, label: '1/4束（50g）' },
  '春菊': { grams: 50, label: '1/4束（50g）' },
  'ブルーベリー': { grams: 50, label: '1/3カップ（50g）' },
  'しいたけ': { grams: 30, label: '2個（30g）' },
  'まいたけ': { grams: 50, label: '1/2パック（50g）' },
  'えのき': { grams: 50, label: '1/2袋（50g）' },
  'しめじ': { grams: 50, label: '1/2パック（50g）' },
  'わかめ': { grams: 10, label: '味噌汁1杯分（10g）' },
  'ひじき': { grams: 10, label: '煮物1食分（乾10g）' },
  'のり': { grams: 3, label: '1枚（3g）' },
  'にんにく': { grams: 6, label: '1片（6g）' },
  'グラノーラ': { grams: 50, label: '1食分（50g）' },
  'キヌア': { grams: 40, label: '1食分（乾40g）' },
  'ぶどう': { grams: 100, label: '1房の半分（100g）' },
  'マンゴー': { grams: 100, label: '1/2個（100g）' },
  '桃': { grams: 200, label: '1個（200g）' },
  'メロン': { grams: 150, label: '1/8個（150g）' },
  '里芋': { grams: 60, label: '2個（60g）' },
  '山芋': { grams: 100, label: 'とろろ1食分（100g）' },
  'とうもろこし': { grams: 150, label: '1本（150g）' },
  'ひよこ豆': { grams: 50, label: '1食分（茹で50g）' },
  'レンズ豆': { grams: 50, label: '1食分（茹で50g）' },
  'アセロラ': { grams: 50, label: '5粒（50g）' },
}

function round1(v: number): number {
  return Math.round(v * 10) / 10
}

function getRecommendations(per100g: Record<string, number | undefined>): string[] {
  const recs: string[] = []
  if ((per100g.protein ?? 0) > 20) recs.push('💪 筋トレ中の人・タンパク質不足の人におすすめ')
  if ((per100g.vitaminC ?? 0) > 50) recs.push('✨ 美肌・免疫力アップを目指す人におすすめ')
  if ((per100g.fiber ?? 0) > 5) recs.push('🌿 腸活・ダイエット中の人におすすめ')
  if ((per100g.iron ?? 0) > 3) recs.push('🩸 疲れやすい人・貧血気味の人におすすめ')
  if ((per100g.calcium ?? 0) > 100) recs.push('🦴 骨を丈夫にしたい人におすすめ')
  if ((per100g.zinc ?? 0) > 3) recs.push('🛡️ 免疫力を高めたい人におすすめ')
  if ((per100g.magnesium ?? 0) > 50) recs.push('😴 睡眠の質を改善したい人におすすめ')
  return recs
}

function FoodDetailContent() {
  const router = useRouter()
  const params = useParams()
  const rawName = params.name
  if (!rawName) return <div className="min-h-screen bg-gray-950 text-white p-4">読み込み中...</div>

  const foodName = decodeURIComponent(rawName as string)
  const food = JAPAN_FOODS.find(f => f.name === foodName)
  const serving = TYPICAL_SERVING[foodName]

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <button onClick={() => router.back()} className="mb-4 text-green-400 text-sm">← 戻る</button>
      <h1 className="text-2xl font-bold mb-1">{foodName}</h1>
      <p className="text-gray-400 text-sm mb-4">栄養成分・効果の詳細（100gあたり）</p>

      {!food ? (
        <div className="text-gray-400">
          <p>データがまだ登録されていません</p>
          <p className="text-xs mt-2">登録済み食品：{JAPAN_FOODS.map(f => f.name).join('、')}</p>
        </div>
      ) : (
        <>
          {/* おすすめ判定 */}
          {getRecommendations(food.per100g).length > 0 && (
            <div className="bg-gray-900 rounded-xl p-3 mb-4">
              <p className="text-sm font-bold mb-2 text-yellow-400">この食品がおすすめな人</p>
              {getRecommendations(food.per100g).map(rec => (
                <p key={rec} className="text-sm whitespace-nowrap">{rec}</p>
              ))}
            </div>
          )}

          {/* 栄養成分 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(NUTRIENT_INFO).map(([key, { label, unit, effect }]) => {
              const value = food.per100g[key as keyof typeof food.per100g]
              if (value === undefined) return null
              const rounded = round1(value)
              const servingValue = serving ? round1(value * serving.grams / 100) : null
              return (
                <div key={key} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm whitespace-nowrap">{label}</span>
                    <span className="text-green-400 font-bold whitespace-nowrap">{rounded} {unit}</span>
                  </div>
                  {servingValue !== null && (
                    <p className="text-yellow-300 text-xs mb-1 whitespace-nowrap">
                      📏 1食分（{serving.label}）：{servingValue} {unit}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs leading-relaxed">{effect}</p>
                </div>
              )
            })}
          </div>

          {/* Amazonリンク */}
          <a
            href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(foodName)}&tag=trustcheck-22`}
            target="_blank"
            className="block w-full bg-orange-500 hover:bg-orange-400 text-white text-center py-3 rounded-xl font-bold mt-4"
          >
            🛒 Amazonで{foodName}を探す
          </a>
        </>
      )}
    </div>
  )
}

export default function FoodDetail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 text-white p-4">読み込み中...</div>}>
      <FoodDetailContent />
    </Suspense>
  )
}
