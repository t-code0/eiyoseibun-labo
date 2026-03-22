import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'クエリが必要です' }, { status: 400 })
  }

  const res = await fetch(
    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&lc=ja&page_size=20`
  )
  const data = await res.json()

  const products = (data.products || []).map((p: any) => ({
    id: p.id,
    name: p.product_name_ja || p.product_name || '名称不明',
    brand: p.brands || '',
    image: p.image_url || '',
    nutrients: p.nutriments || {},
    ingredients: p.ingredients_text_ja || p.ingredients_text || '',
  }))

  return NextResponse.json({ products })
}