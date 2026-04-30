import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let instance = null

function rafTick(time) {
  instance?.raf(time * 1000)
}

export function useLenis() {
  function init() {
    if (instance) return instance
    instance = new Lenis({
      duration: 1.12,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
    })
    window.lenis = instance
    instance.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(rafTick)
    gsap.ticker.lagSmoothing(0)
    return instance
  }

  function destroy() {
    if (!instance) return
    gsap.ticker.remove(rafTick)
    instance.destroy()
    instance = null
    delete window.lenis
  }

  function scrollTo(target, opts) {
    if (instance) {
      instance.scrollTo(target, opts)
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' })
    } else if (target instanceof Element) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return {
    init,
    destroy,
    scrollTo,
    get instance() {
      return instance
    },
  }
}
