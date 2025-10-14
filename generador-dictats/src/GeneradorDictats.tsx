import React, { useMemo, useState } from 'react'
import { BookOpenText } from 'lucide-react'
import jsPDF from 'jspdf'

export default function Generador() {
  const [titol, setTitol] = useState('')
  const [regla, setRegla] = useState('')
  const [curs, setCurs] = useState(3)
  const [linies, setLinies] = useState(5)
  const [dictat, setDictat] = useState('')

  const cursos = ['1r','2n','3r','4t','5è','6è']

  function generar() {
    const temes = [
      'Els ocells volen sobre els arbres.',
      'A la primavera les flors s’obren i el sol brilla.',
      'El gos juga al parc amb la seva pilota.',
      'A l’escola aprenem paraules noves cada dia.',
      'El bosc és ple de vida i sons suaus.'
    ]
    let frases = []
    for (let i=0;i<linies;i++){
      frases.push(temes[Math.floor(Math.random()*temes.length)])
    }
    setDictat(frases.join('\n'))
  }

  function copiar(){ if(dictat) navigator.clipboard.writeText(dictat) }
  function descarregarPDF(){
    if(!dictat) return
    const pdf = new jsPDF()
    pdf.text(dictat,10,10)
    pdf.save('dictat.pdf')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-emerald-600 flex items-center gap-2"><BookOpenText/> Generador de dictats</h1>
        <span className="text-sm text-gray-500">Educació primària</span>
      </header>
      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <section className="bg-white p-4 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-3">Configuració</h2>
          <label className="block text-sm mb-1">Títol o tema</label>
          <input value={titol} onChange={e=>setTitol(e.target.value)} className="w-full border rounded-xl px-3 py-2 mb-3"/>
          <label className="block text-sm mb-1">Regla ortogràfica</label>
          <input value={regla} onChange={e=>setRegla(e.target.value)} className="w-full border rounded-xl px-3 py-2 mb-3"/>
          <label className="block text-sm mb-1">Curs</label>
          <div className="grid grid-cols-6 gap-1 mb-3">
            {cursos.map((c,i)=>(<button key={i} onClick={()=>setCurs(i+1)} className={\`py-2 rounded-xl text-sm border \${curs===i+1?'bg-emerald-50 border-emerald-300':'bg-white hover:bg-gray-50 border-gray-200'}\`}>{c}</button>))}
          </div>
          <label className="block text-sm mb-1">Nombre de línies: {linies}</label>
          <input type="range" min={1} max={10} value={linies} onChange={e=>setLinies(parseInt(e.target.value))} className="w-full mb-3"/>
          <button onClick={generar} className="w-full py-2 rounded-xl bg-emerald-500 text-white font-medium">Generar dictat</button>
        </section>
        <section className="lg:col-span-2 bg-white p-4 rounded-2xl shadow-sm border flex flex-col">
          <div className="flex gap-2 mb-3 flex-wrap">
            <button onClick={copiar} disabled={!dictat} className="text-sm px-3 py-1.5 border rounded-xl hover:bg-gray-50 disabled:opacity-50">Copiar</button>
            <button onClick={descarregarPDF} disabled={!dictat} className="text-sm px-3 py-1.5 border rounded-xl hover:bg-gray-50 disabled:opacity-50">Descarregar PDF</button>
            <button onClick={()=>setDictat('')} disabled={!dictat} className="text-sm px-3 py-1.5 border rounded-xl hover:bg-gray-50 disabled:opacity-50">Netejar</button>
          </div>
          <textarea value={dictat} onChange={e=>setDictat(e.target.value)} className="flex-1 border rounded-xl p-3 font-mono text-[15px]" placeholder="El dictat apareixerà aquí."/>
        </section>
      </main>
      <footer className="text-center text-xs text-gray-500 pb-10">
        <div>Desenvolupat per <strong>Oriol Soler</strong>. <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" className="underline">Llicència CC BY-SA 4.0</a>.</div>
        <div className="mt-1">Utilitza’l amb criteri pedagògic i revisa’l abans de compartir-lo amb l’alumnat.</div>
      </footer>
    </div>
  )
}
