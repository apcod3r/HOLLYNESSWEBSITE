import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AboutPage() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/', { replace: true })
    setTimeout(() => {
      const el = document.getElementById('about')
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
    }, 350)
  }, [navigate])
  return null
}
