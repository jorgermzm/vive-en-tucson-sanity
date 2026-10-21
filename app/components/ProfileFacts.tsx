type Profile = {areasServed?:string|null;languages?:string|null;specialties?:string|null;responseTime?:string|null}
export function ProfileFacts({settings}:{settings?:Profile|null}){
  const facts=[['Zonas',settings?.areasServed],['Idiomas',settings?.languages],['Especialidades',settings?.specialties],['Tiempo de respuesta',settings?.responseTime]]
  return <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">{facts.filter(([,value])=>value).map(([label,value])=><div key={label}><dt className="font-bold">{label}</dt><dd className="mt-1 text-slate-600">{value}</dd></div>)}</dl>
}
