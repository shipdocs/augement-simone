const ACTIVITY_TYPE_KEYWORDS = {
  'create': ['create', 'add', 'new', 'generate', 'initialize'],
  'update': ['update', 'modify', 'change', 'edit'],
  'fix': ['fix', 'repair', 'resolve', 'solve', 'patch'],
  'review': ['review', 'check', 'examine', 'inspect'],
  'research': ['research', 'investigate', 'explore', 'search'],
  'document': ['document', 'write', 'describe', 'explain'],
  'test': ['test', 'verify', 'validate', 'check'],
  'deploy': ['deploy', 'release', 'publish', 'launch'],
  'configure': ['configure', 'setup', 'install', 'config'],
  'refactor': ['refactor', 'reorganize', 'restructure', 'clean'],
  'delete': ['delete', 'remove', 'clean', 'drop'],
  'analyze': ['analyze', 'assess', 'evaluate', 'measure'],
  'plan': ['plan', 'design', 'architect', 'outline'],
  'debug': ['debug', 'troubleshoot', 'diagnose', 'trace']
};

export function detectActivityType(activity: string): string {
  const lowerActivity = activity.toLowerCase();
  
  for (const [type, keywords] of Object.entries(ACTIVITY_TYPE_KEYWORDS)) {
    if (keywords.some(keyword => lowerActivity.includes(keyword))) {
      return type;
    }
  }
  
  // If no match, extract first verb or return 'other'
  const firstWord = lowerActivity.split(' ')[0];
  return firstWord.length > 2 ? firstWord : 'other';
}