'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const GOALS = [
  { id: 'muscle', emoji: '💪', label: '筋肉をつけたい' },
  { id: 'diet',   emoji: '🔥', label: 'ダイエット' },
  { id: 'fatigue',emoji: '⚡', label: '疲労回復' },
  { id: 'skin',   emoji: '✨', label: '美肌' },
  { id: 'gut',    emoji: '🌿', label: '腸活' },
]

type RankItem = {
  id: string
  name: string
  brand: string
  image: string
  score: number
  searchWord: string
}

type Config = {
  label: string
  description: string
  unit: string
}

export default function RankingPage() {
  const router = useRouter()
  const [goal, setGoal] = useState('muscle')
  const [items, setItems] = useState<RankItem[]>([])
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true)
      setItems([])
      const res = await fetch(`/api/ranking?goal=${goal}`)
      const data = await res.json()
      setConfig(data.config)
      setItems(data.items || [])
      setLoading(false)
    }
    fetch_()
  }, [goal])

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <button onClick={() => router.back()} className="mb-4 text-green-400 text-sm">← 戻る</button>
      <h1 className="text-xl font-bold mb-4">🏆 目的別ランキング</h1>

      {/* 目的タブ */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {GOALS.map(g => (
          <button
            key={g.id}
            onClick={() => setGoal(g.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              goal === g.id ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {g.emoji} {g.label}
          </button>
        ))}
      </div>

      {config && (
        <p className="text-gray-400 text-xs mb-6">{config.description}</p>
      )}

      {loading && (
        <div className="text-center text-gray-400 py-20">
          <div className="text-4xl mb-4">⏳</div>
          <p>ランキング集計中...</p>
        </div>
      )}

      {/* ランキングリスト */}
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div
            key={item.id}
            onClick={() => router.push(`/food/${encodeURIComponent(item.searchWord)}`)}
            className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 rounded-xl p-3 cursor-pointer"
          >
            {/* 順位 */}
            <div className={`text-2xl font-black w-10 text-center shrink-0 ${
              i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-gray-500'
            }`}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
            </div>

            {/* 画像 */}
            {item.image
              ? <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-900 rounded-lg shrink-0" />
              : <div className="w-16 h-16 bg-gray-900 rounded-lg shrink-0 flex items-center justify-center text-2xl">🍽️</div>
            }

            {/* 情報 */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm line-clamp-2">{item.name}</p>
              <p className="text-gray-400 text-xs">{item.brand}</p>
            </div>

            {/* スコア */}
            <div className="text-right shrink-0">
              <div className="text-green-400 font-black text-lg">{item.score}</div>
              <div className="text-gray-500 text-xs">{config?.unit}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}