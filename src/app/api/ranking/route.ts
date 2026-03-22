import { NextRequest, NextResponse } from 'next/server'

const GOAL_CONFIG: Record<string, {
  label: string
  description: string
  foods: string[]
  scoreKey: string
  penaltyKey?: string
  unit: string
}> = {
  muscle: {
    label: '筋肉をつけたい',
    description: 'タンパク質量÷カロリーで算出。コスパ最強の高タンパク食品ランキング。',
    scoreKey: 'proteins_100g',
    penaltyKey: 'energy_100g',
    unit: 'g/100g',
    foods: ['chicken breast','egg','tuna','tofu','greek yogurt','salmon','beef','shrimp','whey protein','soy protein','natto','sardine','mackerel','cottage cheese','skim milk'],
  },
  diet: {
    label: 'ダイエット',
    description: '低カロリー×高食物繊維スコアで算出。腹持ちが良く太りにくい食品。',
    scoreKey: 'fiber_100g',
    penaltyKey: 'energy_100g',
    unit: 'g/100g',
    foods: ['spinach','broccoli','tomato','cucumber','cabbage','lettuce','konjac','mushroom','wakame','tofu','strawberry','apple','oatmeal','sweet potato','carrot'],
  },
  fatigue: {
    label: '疲労回復',
    description: '鉄分×マグネシウム×ビタミンB12の合計スコアで算出。',
    scoreKey: 'iron_100g',
    unit: 'mg/100g',
    foods: ['liver','clam','oyster','spinach','natto','sardine','beef','pork','almond','cashew','banana','avocado','brown rice','egg','salmon'],
  },
  skin: {
    label: '美肌',
    description: 'ビタミンC×亜鉛スコアで算出。コラーゲン生成・抗酸化に効果的な食品。',
    scoreKey: 'vitamin-c_100g',
    unit: 'mg/100g',
    foods: ['paprika','kiwi','strawberry','lemon','broccoli','spinach','tomato','orange','blueberry','pumpkin','oyster','beef','almond','pork','egg'],
  },
  gut: {
    label: '腸活',
    description: '食物繊維スコアで算出。腸内環境を整える食品トップランキング。',
    scoreKey: 'fiber_100g',
    unit: 'g/100g',
    foods: ['natto','yogurt','oatmeal','burdock','avocado','almond','sweet potato','brown rice','apple','banana','broccoli','carrot','soba','lentil','edamame'],
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const goal = searchParams.get('goal') || 'muscle'
  const config = GOAL_CONFIG[goal]
  if (!config) return NextResponse.json({ error: 'invalid goal' }, { status: 400 })

  const results = await Promise.all(
    config.foods.map(async (food) => {
      try {
        const res = await fetch(
          `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(food)}&search_simple=1&action=process&json=1&page_size=3`,
          { next: { revalidate: 3600 } }
        )
        const data = await res.json()
        const p = data.products?.[0]
        if (!p) return null
        const score = p.nutriments?.[config.scoreKey] ?? 0
        return {
          id: p.id,
          name: p.product_name_ja || p.product_name || food,
          brand: p.brands || '',
          image: p.image_url || '',
          score: Math.round(score * 10) / 10,
          nutrients: p.nutriments || {},
          searchWord: food,
        }
      } catch { return null }
    })
  )

  const filtered = results
    .filter(Boolean)
    .filter(p => p!.score > 0)
    .sort((a, b) => b!.score - a!.score)

  return NextResponse.json({ goal, config, items: filtered })
}