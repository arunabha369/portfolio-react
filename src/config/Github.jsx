export const githubConfig = {
  username: 'arunabha369',
  apiUrl: 'https://github-contributions-api.jogruber.de/v4',
  title: 'GitHub Activity',
  subtitle: 'coding journey over the past year',
  // Empty cell first, then four greens from least to most active.
  theme: {
    light: ['#ebebeb', '#b8f2c6', '#83df9e', '#4fc373', '#22a350'],
    dark: ['#1e1e1e', '#215a34', '#25864a', '#30b460', '#57e481']
  },
  errorState: {
    title: 'Unable to load GitHub contributions',
    description: 'Check out my profile directly for the latest activity',
    buttonText: 'View on GitHub'
  },
  loadingState: {
    description: 'Fetching your GitHub activity data'
  }
};
