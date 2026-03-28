import { NextRequest, NextResponse } from 'next/server'
import { JAPAN_FOODS } from '@/lib/japanFoods'

type NutrientKey = 'protein' | 'fiber' | 'iron' | 'vitaminC' | 'zinc' | 'calcium' | 'magnesium' | 'potassium' | 'vitaminD' | 'vitaminE' | 'vitaminA' | 'vitaminB1'

type GoalConfig = {
  label: string
  description: string
  evidence: string
  sources: string[]
  unit: string
  scores: { key: NutrientKey; weight: number }[]
  supplementBoost?: Record<string, number>
}

const GOAL_CONFIG: Record<string, GoalConfig> = {
  muscle: {
    label: '筋肉',
    description: 'タンパク質量で算出。',
    evidence: '筋タンパク合成にはロイシンを含む必須アミノ酸が重要。ホエイはDIAASスコア最高。',
    sources: ['Morton et al. (2018) BJSM', '国際スポーツ栄養学会（ISSN）2017', '国立健康・栄養研究所（NIHN）2020'],
    unit: 'スコア',
    scores: [{ key: 'protein', weight: 1.0 }],
    supplementBoost: {
      'ホエイプロテイン': 1.15, 'エッグプロテイン': 1.10, 'カゼインプロテイン': 1.05,
      'ソイプロテイン': 1.0, 'クレアチン': 50, 'EAA': 1.0,
      'コラーゲン': 0.2, 'ラクトフェリン': 0.3, 'BCAA': 0.5,
      'グルタミン': 0.4, 'アルギニン': 0.3, 'シトルリン': 0.3,
    },
  },
  diet: {
    label: 'ダイエット',
    description: '食物繊維・タンパク質の複合スコアで算出。',
    evidence: '食物繊維は血糖値安定と満腹感に寄与。高タンパクは代謝維持に有効。',
    sources: ['Reynolds et al. (2019) Lancet', 'Leidy et al. (2015) AJCN', 'WHO 2023'],
    unit: 'スコア',
    scores: [{ key: 'fiber', weight: 2.0 }, { key: 'protein', weight: 0.3 }],
  },
  fatigue: {
    label: '疲労回復',
    description: '鉄分・マグネシウム・ビタミンB1・ビタミンCの複合スコアで算出。',
    evidence: '鉄欠乏は慢性疲労の主要因。マグネシウムはATP合成に必須。B1は糖質をエネルギーに変換。',
    sources: ['Vaucher et al. (2012) CMAJ', 'Volpe (2013) Nutrients', '厚生労働省 2022'],
    unit: 'スコア',
    scores: [
      { key: 'iron', weight: 2.0 }, { key: 'magnesium', weight: 0.05 },
      { key: 'vitaminB1', weight: 15.0 }, { key: 'vitaminC', weight: 0.2 },
    ],
  },
  skin: {
    label: '美肌',
    description: 'ビタミンC・タンパク質・亜鉛・ビタミンEの複合スコアで算出。',
    evidence: 'ビタミンCはコラーゲン合成に必須。亜鉛は炎症抑制に有効。',
    sources: ['Pullar et al. (2017) Nutrients', 'Gupta et al. (2014) Dermatology', '日本皮膚科学会 2022'],
    unit: 'スコア',
    scores: [
      { key: 'vitaminC', weight: 0.8 }, { key: 'protein', weight: 0.4 },
      { key: 'zinc', weight: 4.0 }, { key: 'vitaminE', weight: 0.5 },
    ],
  },
  gut: {
    label: '腸活',
    description: '食物繊維（プレバイオティクス）＋発酵食品の複合スコアで算出。',
    evidence: '食物繊維はビフィズス菌・乳酸菌のエサ。発酵食品は生きた菌を直接補給。',
    sources: ['Sonnenburg & Bäckhed (2016) Nature', 'Gibson et al. (2017) Nature Reviews', 'RIKEN腸内フローラ研究センター'],
    unit: 'スコア',
    scores: [{ key: 'fiber', weight: 2.0 }],
  },
  immune: {
    label: '免疫',
    description: 'ビタミンD・ビタミンC・亜鉛・タンパク質の複合スコアで算出。',
    evidence: 'ビタミンDは免疫調節ホルモンとして機能。ビタミンCは白血球機能を強化。',
    sources: ['Carr & Maggini (2017) Nutrients', 'Martineau et al. (2017) BMJ', '大阪大学IFReC', 'Cochrane Review 2021'],
    unit: 'スコア',
    scores: [
      { key: 'vitaminD', weight: 0.8 }, { key: 'vitaminC', weight: 0.6 },
      { key: 'zinc', weight: 4.0 }, { key: 'iron', weight: 0.8 }, { key: 'protein', weight: 0.2 },
    ],
  },
}

const FERMENTED_BOOST = ['キムチ', '納豆', 'ヨーグルト', 'ギリシャヨーグルト', '味噌', '甘酒', 'ぬか漬け']

const EXCLUDE_FOODS = [
  'オリーブオイル', 'ごま油', '亜麻仁油', 'えごま油', 'ココナッツオイル', 'MCTオイル',
  'ショートニング', 'ラード', '牛脂', 'ギー', 'バター', '生クリーム',
]

function calcScore(food: typeof JAPAN_FOODS[0], config: GoalConfig): number {
  let score = config.scores.reduce((total, { key, weight }) => {
    return total + ((food.per100g as Record<string, number>)[key] ?? 0) * weight
  }, 0)

  if (config.supplementBoost && food.category === 'supplement') {
    const boost = config.supplementBoost[food.name]
    if (boost !== undefined) {
      score = boost < 5 ? score * boost : boost
    }
  }

  if (config.label === '腸活' && FERMENTED_BOOST.includes(food.name)) {
    score += 8
  }

  return score
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const goal = searchParams.get('goal') || 'muscle'
  const config = GOAL_CONFIG[goal]
  if (!config) return NextResponse.json({ error: 'invalid goal' }, { status: 400 })

  const makeItem = (food: typeof JAPAN_FOODS[0]) => ({
    id: food.name,
    name: food.name,
    brand: '日本食品成分表より',
    image: '',
    score: Math.round(calcScore(food, config) * 10) / 10,
    searchWord: food.name,
  })

  const supplements = JAPAN_FOODS
    .filter(f => f.category === 'supplement')
    .map(makeItem)
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  const foods = JAPAN_FOODS
    .filter(f => f.category !== 'supplement')
    .filter(f => !EXCLUDE_FOODS.includes(f.name))
    .map(makeItem)
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)

  return NextResponse.json({ goal, config, supplements, foods })
}
