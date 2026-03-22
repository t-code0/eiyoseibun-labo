'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const APP_TITLE = 'HONMONO栄養成分ラボ'

const CATEGORIES = [
  {
    label: 'タンパク質', emoji: '💪',
    queries: ['プロテイン','ホエイプロテイン','ソイプロテイン','カゼインプロテイン','鶏胸肉','豆腐','卵','ツナ缶','サーモン','マグロ','納豆','枝豆','ギリシャヨーグルト','カッテージチーズ','牛肉','豚肉','鶏もも肉','ささみ','エビ','イカ','タコ','アジ','サバ','イワシ','鮭','チキンジャーキー','プロテインバー','ゆで卵','スキムミルク','豆乳','テンペ','セイタン','チーズ','ヨーグルト','モッツァレラ','プロセスチーズ','しらす','ちりめん','あさり','牡蠣','ホタテ','タラ','カレイ','ブリ','カツオ','ひき肉','ローストビーフ','ハム','ターキー','レンズ豆'],
  },
  {
    label: '糖質', emoji: '🍚',
    queries: ['白米','玄米','もち麦','オートミール','シリアル','パン','食パン','フランスパン','全粒粉パン','ライ麦パン','パスタ','全粒粉パスタ','そば','うどん','ラーメン','そうめん','ビーフン','フォー','クスクス','キヌア','さつまいも','じゃがいも','里芋','山芋','とうもろこし','バナナ','りんご','ぶどう','マンゴー','パイナップル','みかん','いちご','スイカ','メロン','桃','あんこ','餅','おせんべい','クラッカー','グラノーラ','コーンフレーク','ミューズリー','ポレンタ','タピオカ','アマランサス','スペルト小麦','ファッロ','チアシード','フラックスシード','ひよこ豆'],
  },
  {
    label: '脂質', emoji: '🥑',
    queries: ['アボカド','ナッツ','アーモンド','くるみ','カシューナッツ','マカダミアナッツ','ピスタチオ','ピーナッツ','ヘーゼルナッツ','ペカンナッツ','オリーブオイル','ごま油','亜麻仁油','えごま油','ココナッツオイル','MCTオイル','バター','ギー','クリームチーズ','生クリーム','サーモン','マグロ','イワシ','サバ','アジ','チーズ','ゴーダチーズ','ブリーチーズ','カマンベール','パルメザン','ダークチョコレート','ごま','亜麻仁','かぼちゃの種','ひまわりの種','チアシード','ショートニング','ラード','牛脂','鴨肉','うなぎ','たらこ','いくら','うに','あん肝','ピーナッツバター','アーモンドバター','タヒニ','ヌテラ','ごまペースト'],
  },
  {
    label: 'ビタミン・ミネラル', emoji: '🥦',
    queries: ['ほうれん草','ブロッコリー','トマト','にんじん','かぼちゃ','パプリカ','小松菜','モロヘイヤ','春菊','水菜','みかん','レモン','キウイ','いちご','アセロラ','ブルーベリー','ラズベリー','クランベリー','ざくろ','グレープフルーツ','しいたけ','まいたけ','えのき','しめじ','なめこ','わかめ','昆布','ひじき','のり','めかぶ','にんにく','しょうが','ターメリック','シナモン','黒ごま','あまに','クコの実','なつめ','ドライアプリコット','プルーン','アーモンド','かぼちゃの種','ひまわりの種','松の実','栗','レバー','牡蠣','しじみ','あさり','うなぎ'],
  },
  {
    label: 'サプリ', emoji: '💊',
    queries: ['ビタミンC','ビタミンD','ビタミンB12','ビタミンA','ビタミンE','ビタミンK','ビタミンB1','ビタミンB2','ビタミンB6','葉酸','ビオチン','ナイアシン','パントテン酸','コリン','イノシトール','マグネシウム','カルシウム','亜鉛','鉄分','カリウム','セレン','クロム','ヨウ素','マンガン','銅','オメガ3','DHA','EPA','フィッシュオイル','クリルオイル','プロバイオティクス','乳酸菌','ビフィズス菌','酪酸菌','ラクトフェリン','コラーゲン','グルコサミン','コンドロイチン','ヒアルロン酸','MSM','CoQ10','αリポ酸','NAD','レスベラトロール','NMN','クレアチン','BCAA','グルタミン','アルギニン','シトルリン'],
  },
]

export default function Home() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (q: string) => {
    if (selected.includes(q)) {
      setSelected(selected.filter(s => s !== q))
    } else {
      if (selected.length >= 10) return alert('最大10個まで選択できます')
      setSelected([...selected, q])
    }
  }

  const goToCompare = () => {
    router.push(`/compare?items=${selected.map(encodeURIComponent).join(',')}`)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* ヘッダー */}
      <div className="py-3 text-center shrink-0">
        <h1 className="text-xl font-bold">{APP_TITLE}</h1>
        <p className="text-gray-400 text-xs">+ で比較追加　食品名で詳細ページへ</p>
        <button
          onClick={() => router.push('/ranking')}
          className="mt-2 bg-yellow-600 hover:bg-yellow-500 px-4 py-1 rounded-full text-xs font-bold"
        >
          🏆 目的別ランキングを見る
        </button>
      </div>

      {/* 選択バー */}
      <div className="px-4 mb-2 shrink-0 flex items-center gap-3 flex-wrap min-h-8">
        {selected.length === 0 && (
          <span className="text-xs text-gray-500">食品をタップして選択（最大10個）</span>
        )}
        {selected.map(q => (
          <span key={q} className="bg-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            {q}
            <button onClick={() => toggle(q)} className="text-green-300 ml-1">✕</button>
          </span>
        ))}
        {selected.length >= 2 && (
          <button
            onClick={goToCompare}
            className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded-lg text-sm font-bold ml-auto"
          >
            📊 {selected.length}個を比較
          </button>
        )}
      </div>

      {/* カテゴリ列 */}
      <div className="flex flex-1 gap-2 px-3 pb-3 overflow-hidden">
        {CATEGORIES.map(cat => (
          <div key={cat.label} className="flex flex-col bg-gray-900 rounded-xl p-2 flex-1 overflow-hidden">
            <p className="text-center font-bold text-xs mb-2 shrink-0">
              {cat.emoji} {cat.label}
            </p>
            <div className="overflow-y-auto flex flex-col gap-1 flex-1">
              {cat.queries.map(q => {
                const isSelected = selected.includes(q)
                return (
                  <div key={q} className={`rounded-lg text-xs transition-colors shrink-0 ${
                    isSelected ? 'bg-green-700' : 'bg-gray-800 hover:bg-gray-700'
                  }`}>
                    <div className="flex items-center">
                      <button
                        onClick={() => toggle(q)}
                        className="w-6 flex items-center justify-center text-gray-400 hover:text-white shrink-0 py-1.5"
                      >
                        {isSelected ? '✓' : '+'}
                      </button>
                      <button
                        onClick={() => router.push(`/food/${encodeURIComponent(q)}`)}
                        className="flex-1 text-left px-1 py-1.5 text-gray-300"
                      >
                        {q}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}