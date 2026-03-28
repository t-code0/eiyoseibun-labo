'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const GOALS = [
  { id: 'muscle',  emoji: '💪', label: '筋肉' },
  { id: 'diet',    emoji: '🔥', label: 'ダイエット' },
  { id: 'fatigue', emoji: '⚡', label: '疲労回復' },
  { id: 'skin',    emoji: '✨', label: '美肌' },
  { id: 'gut',     emoji: '🌿', label: '腸活' },
  { id: 'immune',  emoji: '🛡️', label: '免疫' },
]

type RankItem = { id: string; name: string; brand: string; image: string; score: number; searchWord: string }
type Config = { label: string; description: string; evidence: string; sources: string[]; unit: string }

function RankRow({ item, index, onClick, unit }: { item: RankItem; index: number; onClick: () => void; unit: string }) {
  return (
    <div onClick={onClick} className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 rounded-xl p-3 cursor-pointer">
      <div className={`text-2xl font-black w-10 text-center shrink-0 ${
        index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-500'
      }`}>
        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
      </div>
      <div className="w-12 h-12 bg-gray-900 rounded-lg shrink-0 flex items-center justify-center text-xl">🍽️</div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">{item.name}</p>
        <p className="text-gray-400 text-xs">{item.brand}</p>
      </div>
      <div className="text-right shrink-0">
        <div className="text-green-400 font-black text-lg">{item.score}</div>
        <div className="text-gray-500 text-xs">{unit}</div>
      </div>
    </div>
  )
}

function RankingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const goalFromUrl = searchParams.get('goal') || 'muscle'
  const [supplements, setSupplements] = useState<RankItem[]>([])
  const [foods, setFoods] = useState<RankItem[]>([])
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(false)
  const [showEvidence, setShowEvidence] = useState(false)

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true)
      setSupplements([])
      setFoods([])
      setShowEvidence(false)
      const res = await fetch(`/api/ranking?goal=${goalFromUrl}`)
      const data = await res.json()
      setConfig(data.config)
      setSupplements(data.supplements || [])
      setFoods(data.foods || [])
      setLoading(false)
    }
    fetch_()
  }, [goalFromUrl])

  const goToFood = (name: string) => {
    router.push(`/food/${encodeURIComponent(name)}?from=ranking&goal=${goalFromUrl}`)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.push('/')} className="text-green-400 text-sm">← ホーム</button>
        <h1 className="text-xl font-bold">🏆 目的別ランキング</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {GOALS.map(g => (
          <button key={g.id} onClick={() => router.push(`/ranking?goal=${g.id}`)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              goalFromUrl === g.id ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}>
            {g.emoji} {g.label}
          </button>
        ))}
      </div>

      {config && (
        <div className="mb-4">
          <p className="text-gray-400 text-xs">{config.description}</p>
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="mt-1 text-xs text-blue-400 hover:text-blue-300"
          >
            📄 {showEvidence ? 'エビデンスを隠す' : 'このランキングの科学的根拠を見る'}
          </button>
          {showEvidence && (
            <div className="mt-2 bg-gray-900 rounded-xl p-4 border border-blue-900">
              <p className="text-xs text-gray-200 leading-relaxed mb-3">🔬 {config.evidence}</p>
              <p className="text-xs text-blue-400 font-bold mb-2">📚 参考文献・情報源</p>
              <ul className="space-y-1">
                {config.sources.map((s, i) => (
                  <li key={i} className="text-xs text-gray-400 flex gap-2">
                    <span className="text-blue-500 shrink-0">▸</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {loading && <div className="text-center text-gray-400 py-20"><div className="text-4xl mb-4">⏳</div><p>集計中...</p></div>}

      {supplements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-purple-400 mb-3">💊 サプリで摂るなら</h2>
          <div className="flex flex-col gap-2">
            {supplements.map((item, i) => <RankRow key={item.id} item={item} index={i} onClick={() => goToFood(item.searchWord)} unit={config?.unit || ''} />)}
          </div>
        </div>
      )}

      {foods.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-green-400 mb-3">🥗 食品で摂るなら</h2>
          <div className="flex flex-col gap-2">
            {foods.map((item, i) => <RankRow key={item.id} item={item} index={i} onClick={() => goToFood(item.searchWord)} unit={config?.unit || ''} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default function RankingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 text-white p-4">読み込み中...</div>}>
      <RankingContent />
    </Suspense>
  )
}
