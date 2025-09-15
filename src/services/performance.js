// Performance optimization utilities

// Debounce function
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization for expensive calculations
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Lazy loading for images
export const lazyLoadImage = (img, src, placeholder = null) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = src;
          image.classList.remove('lazy');
          observer.unobserve(image);
        }
      });
    },
    { threshold: 0.1 }
  );
  
  if (placeholder) {
    img.src = placeholder;
  }
  img.classList.add('lazy');
  observer.observe(img);
  
  return observer;
};

// Virtual scrolling helper
export const getVisibleItems = (items, containerHeight, itemHeight, scrollTop) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  return {
    startIndex,
    endIndex,
    visibleItems: items.slice(startIndex, endIndex),
    totalHeight: items.length * itemHeight,
    offsetY: startIndex * itemHeight
  };
};

// Image optimization
export const optimizeImage = (url, width, height, quality = 80) => {
  if (!url) return null;
  
  // If it's a TMDB image, use their optimization
  if (url.includes('image.tmdb.org')) {
    const baseUrl = url.split('/').slice(0, -1).join('/');
    const size = width ? `w${width}` : 'original';
    return `${baseUrl}/${size}`;
  }
  
  // For other images, you might want to use a service like Cloudinary
  // return `https://res.cloudinary.com/your-cloud/image/fetch/w_${width},h_${height},q_${quality}/${encodeURIComponent(url)}`;
  
  return url;
};

// Cache management
export class CacheManager {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }
  
  set(key, value) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if item has expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  has(key) {
    return this.cache.has(key) && this.get(key) !== null;
  }
  
  clear() {
    this.cache.clear();
  }
  
  size() {
    return this.cache.size;
  }
}

// Request deduplication
export class RequestDeduplicator {
  constructor() {
    this.pendingRequests = new Map();
  }
  
  async deduplicate(key, requestFn) {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }
    
    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });
    
    this.pendingRequests.set(key, promise);
    return promise;
  }
}

// Performance monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }
  
  startTiming(name) {
    this.metrics.set(name, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }
  
  endTiming(name) {
    const metric = this.metrics.get(name);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
    }
  }
  
  getTiming(name) {
    return this.metrics.get(name);
  }
  
  getAllTimings() {
    return Object.fromEntries(this.metrics);
  }
  
  clearTimings() {
    this.metrics.clear();
  }
}

// Bundle size optimization
export const loadComponent = (importFn) => {
  return React.lazy(() => importFn());
};

// Preload critical resources
export const preloadResource = (href, as = 'script') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Prefetch resources
export const prefetchResource = (href, as = 'script') => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Web Vitals monitoring
export const measureWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
    };
  }
  return null;
};

// Network information
export const getNetworkInfo = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }
  return null;
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Resize Observer for responsive components
export const createResizeObserver = (callback) => {
  if ('ResizeObserver' in window) {
    return new ResizeObserver(callback);
  }
  return null;
};

// Mutation Observer for DOM changes
export const createMutationObserver = (callback, options = {}) => {
  const defaultOptions = {
    childList: true,
    subtree: true,
    attributes: true,
    ...options
  };
  
  return new MutationObserver(callback);
};

// Performance utilities
export const performanceUtils = {
  debounce,
  throttle,
  memoize,
  lazyLoadImage,
  getVisibleItems,
  optimizeImage,
  CacheManager,
  RequestDeduplicator,
  PerformanceMonitor,
  loadComponent,
  preloadResource,
  prefetchResource,
  registerServiceWorker,
  measureWebVitals,
  getMemoryUsage,
  getNetworkInfo,
  createIntersectionObserver,
  createResizeObserver,
  createMutationObserver,
};

export default performanceUtils;
