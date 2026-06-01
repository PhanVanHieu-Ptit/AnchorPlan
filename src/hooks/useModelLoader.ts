import { useState, useEffect } from 'react'

interface ModelLoaderState {
  glbUrl: string | null
  loading: boolean
  error: string | null
}

export function useModelLoader(file: File | null): ModelLoaderState {
  const [glbUrl, setGlbUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (file === null) {
      setGlbUrl(null)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    let createdUrl: string | null = null
    try {
      createdUrl = URL.createObjectURL(file)
      setGlbUrl(createdUrl)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create object URL')
      setGlbUrl(null)
      setLoading(false)
    }

    return () => {
      if (createdUrl !== null) URL.revokeObjectURL(createdUrl)
    }
  }, [file])

  return { glbUrl, loading, error }
}
