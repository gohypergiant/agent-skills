export const appName = 'Agent Skills';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';
export const baseUrl = process.env.NODE_ENV === 'development'
    ? new URL('http://localhost:3000')
    : new URL('https://agent-skills.accelint.io');

export const gitConfig = {
  user: 'gohypergiant',
  repo: 'agent-skills',
  branch: 'main',
};