// Debounce for search inputs
export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Check if device is iPad
export function isiPad() {
  return /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
}

// Get optimal page size
export function getOptimalPageSize() {
  return isiPad() ? 50 : 100;
}

// Measure performance
export function measurePerformance(name, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
  return result;
}

export default {
  debounce,
  isiPad,
  getOptimalPageSize,
  measurePerformance
};
