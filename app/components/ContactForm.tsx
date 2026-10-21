'use client'

import {useState, type FormEvent} from 'react'
import {SiteIcon} from './SiteIcon'

export function ContactForm() {
  const [prepared, setPrepared] = useState<string | null>(null)
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '').trim()
    const phone = String(form.get('phone') || '').trim()
    const interest = String(form.get('interest') || '')
    const message = `Hola Jorge, soy ${name}. Me interesa: ${interest}.${phone ? ` Mi teléfono es ${phone}.` : ''}`
    setPrepared(`https://wa.me/15203359349?text=${encodeURIComponent(message)}`)
  }
  return <form className="vet-contact-form" onSubmit={prepare} onChange={() => setPrepared(null)}>
    <h3 className="font-serif text-3xl font-bold">Hablemos de tu próximo paso</h3>
    <p className="mt-3 text-sm leading-6 text-[#fff1d2]/70">Resuelve tus dudas sobre Tucson y las opciones de vivienda.</p>
    <label className="vet-form-label" htmlFor="contact-name">Tu nombre</label><input id="contact-name" name="name" autoComplete="name" required maxLength={80} placeholder="¿Cómo te llamas?"/>
    <label className="vet-form-label" htmlFor="contact-phone">Teléfono o WhatsApp <span className="font-normal normal-case">(opcional)</span></label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="(520) 000-0000"/>
    <label className="vet-form-label" htmlFor="contact-interest">¿Qué te interesa?</label><select id="contact-interest" name="interest"><option>Comprar casa en Tucson</option><option>Vender mi propiedad</option><option>Conocer más sobre la ciudad</option></select>
    <button type="submit" className="vet-button vet-button-gold mt-6 w-full"><SiteIcon name="chat"/>Preparar consulta</button>
    <p className="mt-4 text-xs leading-5 text-[#fff1d2]/70">Prepararemos tu mensaje para que puedas revisarlo en WhatsApp antes de enviarlo.</p>
    {prepared && <p role="status" className="mt-5"><a href={prepared} target="_blank" rel="noopener noreferrer" className="vet-button vet-button-green w-full">Continuar en WhatsApp <SiteIcon name="arrow"/></a></p>}
  </form>
}
