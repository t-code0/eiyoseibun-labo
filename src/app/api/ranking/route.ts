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
    description: 'タンパク質量・アミノ酸スコアで算出。',
    evidence: '筋タンパク合成にはロイシンを含む必須アミノ酸（EAA）が重要。ホエイはDIAASスコア最高・吸収速度が速く筋肥大に最も有効。クレアチンは筋出力向上の強固なエビデンスあり。コラーゲンはロイシンが少ないため筋肥大効果は低い。',
    sources: [
      'Morton et al. (2018) タンパク質摂取と筋肥大メタ分析, British Journal of Sports Medicine',
      '国際スポーツ栄養学会（ISSN）ホエイプロテインポジションスタンド2017',
      'Phillips & Van Loon (2011) スポーツ栄養学レビュー, Journal of Sports Sciences',
      '国立健康・栄養研究所（NIHN）日本人の食事摂取基準2020年版',
      'McMaster大学スポーツ医学研究室（カナダ）クレアチン研究',
      '米国スポーツ医学会（ACSM）タンパク質摂取ガイドライン2016',
    ],
    unit: 'スコア',
    scores: [{ key: 'protein', weight: 1.0 }],
    supplementBoost: {
      'ホエイプロテイン': 1.15,
      'エッグプロテイン': 1.10,
      'カゼインプロテイン': 1.05,
      'ソイプロテイン': 1.0,
      'クレアチン': 50,
      'EAA': 1.0,
      'コラーゲン': 0.2,
      'ラクトフェリン': 0.3,
      'BCAA': 0.5,
      'グルタミン': 0.4,
      'アルギニン': 0.3,
      'シトルリン': 0.3,
    },
  },
  diet: {
    label: 'ダイエット',
    description: '食物繊維・タンパク質の複合スコアで算出。高カロリー食品はペナルティあり。',
    evidence: '食物繊維は腸内細菌のエサとなり短鎖脂肪酸を産生、血糖値上昇を抑制し脂肪蓄積を防ぐ。高タンパク食は基礎代謝を維持しながら筋肉量を保つ。食物繊維1日25g以上で心疾患・糖尿病リスクが有意に低下。',
    sources: [
      'Reynolds et al. (2019) 食物繊維と慢性疾患リスク, The Lancet',
      'Leidy et al. (2015) 高タンパク質食と体重管理, AJCN',
      'Harvard T.H. Chan School of Public Health 栄養学部',
      '国立がん研究センター 多目的コホート研究（JPHC Study）',
      'WHO（世界保健機関）成人の糖・脂質摂取ガイドライン2023',
      '農林水産省 食事バランスガイド・食物繊維推奨量データ',
    ],
    unit: 'スコア',
    scores: [
      { key: 'fiber', weight: 2.0 },
      { key: 'protein', weight: 0.3 },
    ],
  },
  fatigue: {
    label: '疲労回復',
    description: '鉄分・マグネシウム・ビタミンB1・ビタミンCの複合スコアで算出。',
    evidence: '鉄欠乏性貧血は日本人女性の約20〜30%に見られ慢性疲労の主要因。マグネシウムはATP合成に不可欠。ビタミンB1は糖質をエネルギーに変える補酵素として必須。ビタミンCは非ヘム鉄の吸収を最大3〜4倍促進。',
    sources: [
      'Vaucher et al. (2012) 鉄補給と疲労改善, CMAJ（カナダ医師会誌）',
      'Volpe (2013) マグネシウムとエネルギー代謝, Nutrients',
      '厚生労働省 国民健康・栄養調査2022年版',
      '東京大学医学部附属病院 栄養管理部 鉄欠乏性貧血臨床データ',
      '日本疲労学会 慢性疲労ガイドライン',
      'Cleveland Clinic（米国）栄養・疲労外来プロトコル',
    ],
    unit: 'スコア',
    scores: [
      { key: 'iron', weight: 2.0 },
      { key: 'magnesium', weight: 0.05 },
      { key: 'vitaminB1', weight: 15.0 },
      { key: 'vitaminC', weight: 0.2 },
    ],
  },
  skin: {
    label: '美肌',
    description: 'ビタミンC・タンパク質・亜鉛・ビタミンE・ビタミンAの複合スコアで算出。',
    evidence: '皮膚の70%はコラーゲンで構成され合成にビタミンCが必須。ビタミンEは細胞膜酸化を防ぎ抗老化に寄与。ビタミンAは皮膚のターンオーバーを正常化。亜鉛は炎症抑制・ニキビ改善に複数RCTで有効性確認。',
    sources: [
      'Pullar et al. (2017) ビタミンCと皮膚コラーゲン合成, Nutrients',
      'Gupta et al. (2014) 亜鉛と皮膚疾患, Dermatology',
      '慶應義塾大学医学部皮膚科学教室 コラーゲン代謝研究',
      '日本皮膚科学会 スキンケアガイドライン2022',
      'Linus Pauling Institute（オレゴン州立大学）ビタミンCデータベース',
      '花王株式会社研究開発部門 皮膚科学研究（日本）',
    ],
    unit: 'スコア',
    scores: [
      { key: 'vitaminC', weight: 0.8 },
      { key: 'protein', weight: 0.4 },
      { key: 'zinc', weight: 4.0 },
      { key: 'vitaminE', weight: 0.5 },
      { key: 'vitaminA', weight: 0.3 },
    ],
  },
  gut: {
    label: '腸活',
    description: '食物繊維（プレバイオティクス）＋発酵食品評価の複合スコアで算出。',
    evidence: '腸内細菌は約100兆個・1000種類以上存在し免疫・メンタル・代謝に広く影響する。食物繊維はビフィズス菌・乳酸菌のエサ（プレバイオティクス）。発酵食品は生きた菌を直接補給（プロバイオティクス）。',
    sources: [
      'Sonnenburg & Bäckhed (2016) 腸内細菌と代謝疾患, Nature',
      'Gibson et al. (2017) プレバイオティクスの定義と効果, Nature Reviews Gastroenterology',
      '理化学研究所（RIKEN）腸内フローラ研究センター',
      '京都大学大学院農学研究科 腸内細菌研究',
      '森永乳業 技術・研究開発本部 ビフィズス菌B-3臨床研究',
      'ISAPP（国際プロバイオティクス・プレバイオティクス学術協会）声明',
    ],
    unit: 'スコア',
    scores: [
      { key: 'fiber', weight: 2.0 },
    ],
  },
  immune: {
    label: '免疫',
    description: 'ビタミンD・ビタミンC・亜鉛・タンパク質の複合スコアで算出。',
    evidence: 'ビタミンDは免疫調節ホルモンとして機能し不足すると感染症リスクが上昇。ビタミンCは白血球に高濃度蓄積され抗菌作用を担う。亜鉛はT細胞・NK細胞の成熟・活性化に不可欠。タンパク質は抗体（免疫グロブリン）の原料。',
    sources: [
      'Carr & Maggini (2017) ビタミンCと免疫機能, Nutrients（1000回以上引用）',
      'Prasad (2008) 亜鉛と免疫老化, AJCN',
      'Martineau et al. (2017) ビタミンD補給と呼吸器感染症予防, BMJ（メタ分析）',
      'WHO（世界保健機関）微量栄養素と免疫機能レポート2020',
      '大阪大学免疫学フロンティア研究センター（IFReC）',
      'Cochrane Review 亜鉛サプリメントと感染症予防メタ分析（2021）',
    ],
    unit: 'スコア',
    scores: [
      { key: 'vitaminD', weight: 0.8 },
      { key: 'vitaminC', weight: 0.6 },
      { key: 'zinc', weight: 4.0 },
      { key: 'iron', weight: 0.8 },
      { key: 'protein', weight: 0.2 },
    ],
  },
}

const FERMENTED_BOOST = ['キムチ', '納豆', 'ヨーグルト', 'ギリシャヨーグルト', '味噌', '甘酒', 'ぬか漬け']

function calcScore(food: typeof JAPAN_FOODS[0], config: GoalConfig): number {
  let score = config.scores.reduce((total, { key, weight }) => {
    return total + (food.per100g[key as keyof typeof food.per100g] ?? 0) * weight
  }, 0)

  // サプリの補正
  if (config.supplementBoost && food.category === 'supplement') {
    const boost = config.supplementBoost[food.name]
    if (boost !== undefined) {
      if (boost < 5) {
        score = score * boost
      } else {
        score = boost
      }
    }
  }

  // 腸活：発酵食品ボーナス
  if (config.label === '腸活' && FERMENTED_BOOST.includes(food.name)) {
    score += 8
  }

  return score
}

const EXCLUDE_FOODS = [
  'オリーブオイル', 'ごま油', '亜麻仁油', 'えごま油', 'ココナッツオイル', 'MCTオイル',
  'ショートニング', 'ラード', '牛脂', 'ギー', 'バター', '生クリーム',
]

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
