import React from 'react'
import { useLanguage } from '../../lib/i18n.jsx'

export default function LanguageToggle(){
  const { lang, setLang } = useLanguage()
  const next = lang === 'ne' ? 'en' : 'ne'
  const label = lang === 'ne' ? 'EN' : 'ने'
  return (
    <button className="lang-toggle" onClick={() => setLang(next)} title="Change language">
      {label}
    </button>
  )
}

