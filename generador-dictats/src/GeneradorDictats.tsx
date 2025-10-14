import React, { useMemo, useState } from 'react'
import { BookOpenText } from 'lucide-react'
import jsPDF from 'jspdf'

type Curs = 1|2|3|4|5|6

const brand = { primary: '#53b8ac', onPrimary: '#ffffff', surface: '#ffffff' }

export default function Generador() {
  const [titol, setTitol] = useState('')
  const [reglaText, setReglaText] = useState('')
  const [curs, setCurs] = useState<Curs>(3)
  const [linies, setLinies] = useState(5)
  const [dictat, setDictat] = useState('')
  const [carregant, setCarregant] = useState(false)

  const cursos = [
    { id: 1 as Curs, label: '1r' },
    { id: 2 as Curs, label: '2n' },
    { id: 3 as Curs, label: '3r' },
    { id: 4 as Curs, label: '4t' },
    { id: 5 as Curs, label: '5è' },
    { id: 6 as Curs, label: '6è' },
  ]

  const bancRegles = useMemo(() => ({
    'b-v': ['branca','blau','barret','breu','viatge','verd','vella','avió','breument','valent'],
    'g-j': ['gel','girar','gerro','jardí','joguina','màgica','viatge','objectiu','gent'],
    'c-ç-s': ['casa','cotxe','braç','força','paciència','massa','cançó','país','plaça'],
    'accent': ['més','bé','déu','què','sòl','pèl','és','són','té','dóna'],
    'h': ['home','hora','herba','hivern','habitació','heura'],
    'punts-comes': ['per exemple','tanmateix','a més','però'],
  }), [])

  const plantilles = useMemo(() => ({
    estacions: [
      "A la tardor, les fulles cauen suaument i el vent bufa.",
      "A l'hivern, el poble queda en silenci i la neu tot ho cobreix.",
      "A la primavera, el bosc reneix i els ocells canten.",
      "A l'estiu, la platja s'omple de rialles i gelats.",
    ],
    animals: [
      "El gat observa en silenci i salta amb gràcia sobre la tanca.",
      "El gos fidel espera pacientment davant la porta de casa.",
      "Els ocells dibuixen un vol que sembla una cançó.",
      "La tortuga camina lenta però segura cap a l'estany.",
    ],
    escola: [
      "A classe aprenem paraules noves i compartim llibres.",
      "La mestra explica amb calma i respon cada dubte.",
      "Al pati hi ha jocs, amistats i corredisses alegres.",
      "A la biblioteca, el temps passa de pressa entre contes.",
    ],
    medi: [
      "El riu clar bressola la llum i les pedres brillen.",
      "El bosc necessita silenci i cura per continuar viu.",
      "Si reciclem cada dia, fem el món una mica millor.",
      "L'aire net ajuda a córrer lliures i respirar millor.",
    ],
    neutre: [
      "Avui escrivim un pensament senzill i clar.",
      "Ens fixem en els detalls i descrivim el que veiem.",
      "Fem frases amb ordre i cura per aprendre millor.",
      "Practiquem la calma i la constància quan escrivim.",
    ]
  }), [])

  function detectarTema(title: string): keyof typeof plantilles {
    const t = title.toLowerCase()
    if (/hivern|neu|fred|estiu|primavera|tardor|estacions/.test(t)) return 'estacions'
    if (/animal|gos|gat|ocell|tortuga|fauna/.test(t)) return 'animals'
    if (/escola|aula|mestra|pati|biblioteca|llibre/.test(t)) return 'escola'
    if (/medi|bosc|riu|aire|recicla|natura|planeta/.test(t)) return 'medi'
    return 'neutre'
  }

  function detectarRegla(ruleText: string): keyof typeof bancRegles | null {
    const r = ruleText.toLowerCase()
    if (/\bb\b|\bv\b|b i v|b\/v|b-v/.test(r)) return 'b-v'
    if (/g i j|g\/j|g-j|\bg\b|\bj\b/.test(r)) return 'g-j'
    if (/c i ç|c\/ç|c-ç|ç|s\b/.test(r)) return 'c-ç-s'
    if (/accent|diacrític|tilde/.test(r)) return 'accent'
    if (/\bh\b|h muda/.test(r)) return 'h'
    if (/punt|coma|puntuació|comes/.test(r)) return 'punts-comes'
    return null
  }

  function ajustaComplexitat(text: string, nivell: Curs) {
    let t = text
    if (nivell <= 2) {
      t = t.replace(/, però/g, '. Però').replace(/;|:/g, '.')
      if (t.length > 110) t = t.slice(0,105).replace(/\s\S*$/, '') + '.'
    }
    if (nivell >= 5 && !/(però|tanmateix|a més)/.test(t)) {
      t = t.replace(/\.$/, ', però cal constància.')
    }
    return t
  }

  function infonRegla(text: string, ruleKey: keyof typeof bancRegles | null) {
    if (!ruleKey) return text
    const arr = bancRegles[ruleKey]
    const pick = (a: string[]) => a[Math.floor(Math.random()*a.length)]
    if (Math.random() < 0.6) {
      return text.replace(/(el|la|els|les)\s([a-zç·'\-]+)/i, (m, art) => `${art} ${pick(arr)}`)
    }
    return text.replace(/\.$/, `, com ${pick(arr)} i ${pick(arr)}.`)
  }

  function generaFrase(nivell: Curs, temaKey: keyof typeof plantilles, ruleKey: keyof typeof bancRegles | null) {
    const pick = (a: string[]) => a[Math.floor(Math.random()*a.length)]
    let base = pick(plantilles[temaKey])
    base = ajustaComplexitat(base, nivell)
    base = infonRegla(base, ruleKey)
    if (!/[.!?]$/.test(base)) base += '.'
    return base
  }

  function generarLocal() {
    setCarregant(true)
    setTimeout(() => {
      const temaKey = detectarTema(titol)
      const ruleKey = detectarRegla(reglaText)
      const frases: string[] = []
      for (let i = 0; i < linies; i++) {
        frases.push(generaFrase(curs, temaKey, ruleKey))
      }
      setDictat(frases.join('\n'))
      setCarregant(false)
    }, 60)
  }

  function copiar() { if (dictat) navigator.clipboard.writeText(dictat) }
  function descarregarTXT() {
    if (!dictat) return
    const blob = new Blob([dictat], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dictat_${curs}_${(titol || 'tema').replace(/\s+/g,'-')}.txt`
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  }
  function descarregarPDF() {
    if (!dictat) return
    const pdf = new jsPDF()
    pdf.setFont('helvetica',''); pdf.setFontSize(12)
    pdf.text(`Dictat: ${titol}`, 10, 10)
    pdf.text(`Curs: ${cursos.find(c=>c.id===curs)?.label} de Primària`, 10, 18)
    pdf.text('Regla ortogràfica:', 10, 26); pdf.text(reglaText || 'General', 10, 33)
    pdf.text('\n\n' + dictat, 10, 45, { maxWidth: 180 })
    pdf.save(`dictat_${curs}.pdf`)
  }
  function imprimir() {
    if (!dictat) return
    const w = window.open('', '_blank'); w?.document.write(`<pre>${dictat}</pre>`); w?.print()
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="sticky top-0 z-10 border-b" style={{ background: brand.surface, borderColor: '#e8e8e8' }}>
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2" style={{ color: brand.primary }}>
            <BookOpenText className="w-6 h-6" /> Generador de dictats
          </h1>
          <span className="text-sm text-gray-500">Educació primària</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-2xl border p-4">
            <h2 className="text-lg font-semibold mb-3">Configuració</h2>

            <label className="block text-sm font-medium text-gray-700 mb-1">Títol o tema</label>
            <input className="w-full border rounded-xl px-3 py-2 mb-4" placeholder="Ex.: Un dia de neu" value={titol} onChange={e=>setTitol(e.target.value)} />

            <label className="block text-sm font-medium text-gray-700 mb-1">Regla ortogràfica / objectiu</label>
            <input className="w-full border rounded-xl px-3 py-2 mb-4" placeholder="Ex.: practicar l'ús de la b i la v" value={reglaText} onChange={e=>setReglaText(e.target.value)} />

            <label className="block text-sm font-medium text-gray-700 mb-1">Curs</label>
            <div className="grid grid-cols-6 gap-1 mb-4">
              {cursos.map(c => (
                <button key={c.id} onClick={()=>setCurs(c.id)} className={`py-2 rounded-xl text-sm border transition ${curs===c.id?'bg-emerald-50 border-emerald-300':'bg-white hover:bg-gray-50 border-gray-200'}`}>{c.label}</button>
              ))}
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de línies (aprox.)</label>
            <div className="flex items-center gap-3 mb-4">
              <input type="range" min={1} max={15} value={linies} onChange={e=>setLinies(parseInt(e.target.value))} className="w-full" />
              <input type="number" min={1} max={15} value={linies} onChange={e=>setLinies(Number(e.target.value))} className="w-16 border rounded-lg px-2 py-1" />
            </div>

            <button onClick={generarLocal} disabled={carregant} className="w-full rounded-2xl py-2.5 font-medium border shadow-sm transition disabled:opacity-60" style={{ background: brand.primary, color: brand.onPrimary, borderColor: '#2f8d82' }}>
              {carregant? 'Generant…' : 'Generar dictat'}
            </button>
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-2xl border p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Dictat generat</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={()=>navigator.clipboard.writeText(dictat)} disabled={!dictat} className="text-sm px-3 py-1.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50">Copiar</button>
                <button onClick={descarregarTXT} disabled={!dictat} className="text-sm px-3 py-1.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50">Descarregar .txt</button>
                <button onClick={descarregarPDF} disabled={!dictat} className="text-sm px-3 py-1.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50">Descarregar PDF</button>
                <button onClick={()=>{ const w = window.open('', '_blank'); w?.document.write(`<pre>${dictat}</pre>`); w?.print() }} disabled={!dictat} className="text-sm px-3 py-1.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50">Imprimir</button>
                <button onClick={()=>setDictat('')} disabled={!dictat} className="text-sm px-3 py-1.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50">Netejar</button>
              </div>
            </div>
            <textarea value={dictat} onChange={e=>setDictat(e.target.value)} className="flex-1 w-full border rounded-xl p-3 font-[ui-monospace] text-[15px] leading-7" placeholder="El teu dictat apareixerà aquí un cop generat." />
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 text-center text-xs text-gray-500">
        <div>Desenvolupat per <strong>Oriol Soler</strong>. <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" className="underline text-gray-600">Llicència CC BY-SA 4.0</a>.</div>
        <div className="mt-1">Utilitza’l amb criteri pedagògic i revisa’l abans de compartir-lo amb l’alumnat.</div>
      </footer>
    </div>
  )
}
