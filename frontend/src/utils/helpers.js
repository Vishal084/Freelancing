export const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const truncateText = (text, maxLen = 100) => {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen) + '...'
}