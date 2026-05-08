import { projectCases, skillGroups, timeline } from './data'

export function createPortfolioChatContext(copy) {
  return {
    identity: {
      brand: copy.hero.title,
      name: copy.hero.name,
      role: copy.hero.role,
      summary: copy.hero.summary,
    },
    projects: projectCases.map((project) => ({
      title: copy.cases[project.key].title,
      tags: project.tags,
      problem: copy.cases[project.key].problem,
      solution: copy.cases[project.key].solution,
      result: copy.cases[project.key].result,
      repo: project.repo,
      live: project.live || '',
    })),
    skills: skillGroups.map((group) => ({
      area: copy.skills[group.key],
      items: group.items,
    })),
    timeline: timeline.map((item) => ({
      period: item.period,
      title: copy.timeline[item.key].title,
      body: copy.timeline[item.key].body,
    })),
    creative: {
      title: copy.music.title,
      body: copy.music.body,
      url: copy.music.url,
    },
    contact: {
      email: 'tomascabfer4@gmail.com',
      github: 'https://github.com/Tomascabfer4',
      linkedin: 'https://www.linkedin.com/in/tom%C3%A1s-cabello-fern%C3%A1ndez-25b838201/',
      instagram: 'https://www.instagram.com/tomas_cf4',
    },
  }
}
