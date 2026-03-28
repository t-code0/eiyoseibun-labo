'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  {
    label: 'タンパク質', emoji: '💪',
    queries: ['ホエイプロテイン','ソイプロテイン','カゼインプロテイン','エッグプロテイン','鶏胸肉','ささみ','マグロ','カツオ','鮭','サバ','イワシ','卵','納豆','豆腐','枝豆','ギリシャヨーグルト','牛肉','豚肉','鶏もも肉','エビ','ホタテ','牡蠣','あさり','タラ','ブリ','ツナ缶','豆乳','チーズ','ヨーグルト','しらす','レンズ豆'],
  },
  {
    label: '糖質', emoji: '🍚',
    queries: ['白米','玄米','もち麦','オートミール','さつまいも','じゃがいも','バナナ','りんご','そば','パスタ','全粒粉パスタ','ひよこ豆','キヌア','チアシード','グラノーラ','食パン','全粒粉パン','みかん','いちご','ぶどう','マンゴー','桃','メロン','里芋','山芋','とうもろこし'],
  },
  {
    label: '脂質', emoji: '🥑',
    queries: ['アボカド','アーモンド','くるみ','カシューナッツ','マカダミアナッツ','ピスタチオ','ピーナッツ','ダークチョコレート','かぼちゃの種','ひまわりの種','ごま','サーモン','イワシ','サバ','ピーナッツバター','アーモンドバター','クリームチーズ','パルメザン','ゴーダチーズ'],
  },
  {
    label: 'ビタミン', emoji: '🥦',
    queries: ['ほうれん草','ブロッコリー','パプリカ','小松菜','モロヘイヤ','水菜','春菊','アセロラ','キウイ','レモン','いちご','ブルーベリー','かぼちゃ','にんじん','トマト','しいたけ','まいたけ','えのき','しめじ','わかめ','ひじき','のり','鶏レバー','しじみ','にんにく'],
  },
  {
    label: 'サプリ', emoji: '💊',
    queries: ['ビタミンC','ビタミンD','ビタミンB12','ビタミンA','ビタミンE','ビタミンK','ビタミンB1','葉酸','マグネシウム','カルシウム','亜鉛','鉄分','オメガ3','DHA','EPA','クレアチン','BCAA','EAA','グルタミン','コラーゲン','乳酸菌','ビフィズス菌','CoQ10','NMN','イヌリン'],
  },
]

export default function Home() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [selected, setSelected] = useState<string[]>([])

  const toggle = useCallback((q: string) => {
    setSelected(prev => {
      if (prev.includes(q)) return prev.filter(s => s !== q)
      if (prev.length >= 10) { alert('最大10個まで選択できます'); return prev }
      return [...prev, q]
    })
  }, [])

  const cat = CATEGORIES[activeTab]

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      <div className="px-4 pt-4 pb-2 shrink-0">
        <h1 className="text-lg font-bold text-center">
          <span className="text-green-400">HONMONO</span>栄養成分検索図鑑
        </h1>
        <button
          onClick={() => router.push('/ranking')}
          className="w-full mt-2 bg-yellow-600 hover:bg-yellow-500 py-2 rounded-xl text-sm font-bold"
        >
          🏆 目的別ランキングを見る
        </button>
      </div>

      <div className="flex gap-1 px-3 pb-2 shrink-0 overflow-x-auto">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.label}
            onClick={() => setActiveTab(i)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              activeTab === i ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="px-3 pb-2 shrink-0">
          <div className="flex items-center gap-2 bg-gray-900 rounded-xl px-3 py-2">
            <div className="flex-1 flex flex-wrap gap-1">
              {selected.map(q => (
                <span key={q} className="bg-green-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  {q}
                  <button onClick={() => toggle(q)} className="text-green-300">✕</button>
                </span>
              ))}
            </div>
            {selected.length >= 2 && (
              <button
                onClick={() => router.push(`/compare?items=${selected.map(encodeURIComponent).join(',')}`)}
                className="shrink-0 bg-green-600 px-3 py-1 rounded-lg text-xs font-bold"
              >
                比較
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="flex flex-col gap-2">
          {cat.queries.map(q => {
            const isSelected = selected.includes(q)
            return (
              <div
                key={q}
                className={`flex items-center rounded-xl overflow-hidden ${
                  isSelected ? 'bg-green-800' : 'bg-gray-800'
                }`}
              >
                <button
                  onClick={() => toggle(q)}
                  className="w-12 h-12 flex items-center justify-center shrink-0 text-lg"
                >
                  {isSelected ? '✓' : '+'}
                </button>
                <button
                  onClick={() => router.push(`/food/${encodeURIComponent(q)}`)}
                  className="flex-1 text-left py-3 pr-4 font-medium"
                >
                  {q}
                </button>
                <span className="text-gray-500 text-xs pr-3">詳細 →</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
