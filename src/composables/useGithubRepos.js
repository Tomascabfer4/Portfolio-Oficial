import { ref } from 'vue'
import { fallbackRepos } from '../data'

const CACHE_KEY = 'portfolio-repos-cache'
const CACHE_TTL = 30 * 60 * 1000

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.timestamp || Date.now() - parsed.timestamp > CACHE_TTL) return null
    return parsed.data
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }))
  } catch {
    /* quota exceeded or private mode */
  }
}

export function useGithubRepos() {
  const repositories = ref(fallbackRepos)
  const isFallback = ref(false)
  const isLoadingRepos = ref(true)
  let controller = null

  async function load() {
    const cached = readCache()
    if (cached) {
      repositories.value = cached
      isFallback.value = false
      isLoadingRepos.value = false
      return
    }

    controller = new AbortController()
    try {
      const response = await fetch(
        'https://api.github.com/users/Tomascabfer4/repos?sort=updated&per_page=100',
        { signal: controller.signal },
      )
      if (!response.ok) throw new Error('GitHub API unavailable')
      const data = await response.json()
      repositories.value = data
      isFallback.value = false
      writeCache(data)
    } catch (err) {
      if (err.name === 'AbortError') return
      repositories.value = fallbackRepos
      isFallback.value = true
    } finally {
      isLoadingRepos.value = false
    }
  }

  function abort() {
    controller?.abort()
  }

  return { repositories, isFallback, isLoadingRepos, load, abort }
}
