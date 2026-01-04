// Error Helper - User-friendly error messages and explanations

/**
 * Get user-friendly explanation for HTTP status codes
 * @param {number} statusCode - HTTP status code
 * @param {string} context - Optional context for more specific messages
 * @returns {object} Error explanation with message and suggestion
 */
export function explainError(statusCode, context = '') {
  const explanations = {
    400: {
      message: 'Invalid data provided',
      suggestion: 'Please check that all required fields are filled correctly. Common issues: missing firstName, lastName, or invalid data format.',
      icon: '⚠️'
    },
    401: {
      message: 'Authentication failed',
      suggestion: 'Your API key is invalid or missing. Go to Settings → Backend Configuration to verify your API key.',
      icon: '🔒'
    },
    403: {
      message: 'Access denied',
      suggestion: "You don't have permission to perform this action. Contact your administrator if you believe this is an error.",
      icon: '🚫'
    },
    404: {
      message: 'Resource not found',
      suggestion: "This item doesn't exist or may have been deleted. Try refreshing the data or check the ID.",
      icon: '❓'
    },
    409: {
      message: 'Conflict detected',
      suggestion: 'This operation conflicts with existing data. For example, trying to add an access group that already exists.',
      icon: '⚡'
    },
    422: {
      message: 'Validation failed',
      suggestion: 'The data format is correct but the values are invalid. Check business rules and constraints.',
      icon: '✗'
    },
    429: {
      message: 'Too many requests',
      suggestion: 'You are making requests too quickly. Please wait a moment before trying again.',
      icon: '⏱️'
    },
    500: {
      message: 'Server error',
      suggestion: 'An unexpected error occurred on the server. Please try again later or contact support if the problem persists.',
      icon: '🔥'
    },
    502: {
      message: 'Bad gateway',
      suggestion: 'Unable to reach the backend server. Check your network connection and backend URL in Settings.',
      icon: '🌐'
    },
    503: {
      message: 'Service unavailable',
      suggestion: 'The server is temporarily unavailable. This might be due to maintenance. Please try again in a few minutes.',
      icon: '🔧'
    }
  };

  const explanation = explanations[statusCode] || {
    message: 'An unexpected error occurred',
    suggestion: `Error code ${statusCode}. Please try again or contact support if the problem continues.`,
    icon: '❗'
  };

  return {
    statusCode,
    ...explanation,
    context
  };
}

/**
 * Format error for display in UI
 * @param {Error|object} error - Error object or API response
 * @returns {string} Formatted error message
 */
export function formatErrorMessage(error) {
  if (!error) return 'An unknown error occurred';

  // Handle API error responses
  if (error.status || error.statusCode) {
    const code = error.status || error.statusCode;
    const explained = explainError(code);
    return `${explained.icon} ${explained.message}: ${explained.suggestion}`;
  }

  // Handle standard Error objects
  if (error.message) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}

/**
 * Get actionable suggestions based on error type
 * @param {number} statusCode - HTTP status code
 * @returns {Array} List of action items
 */
export function getErrorActions(statusCode) {
  const actions = {
    401: [
      'Check Settings → Backend Configuration',
      'Verify your API key is correct',
      'Try refreshing the page'
    ],
    404: [
      'Verify the item ID is correct',
      'Try refreshing the data',
      'Check if the item was deleted'
    ],
    400: [
      'Review all required fields',
      'Check data format (dates, numbers, etc.)',
      'Look for validation messages'
    ],
    500: [
      'Wait a moment and try again',
      'Check if other operations work',
      'Contact support if issue persists'
    ],
    503: [
      'Wait a few minutes',
      'Check system status',
      'Try again later'
    ]
  };

  return actions[statusCode] || [
    'Try the operation again',
    'Refresh the page',
    'Contact support if problem continues'
  ];
}

/**
 * Determine if error is retryable
 * @param {number} statusCode - HTTP status code
 * @returns {boolean} True if should retry
 */
export function isRetryableError(statusCode) {
  // Retry on server errors and rate limiting
  return statusCode >= 500 || statusCode === 429 || statusCode === 408;
}

/**
 * Get appropriate retry delay based on error
 * @param {number} statusCode - HTTP status code
 * @param {number} attemptNumber - Current retry attempt (0-indexed)
 * @returns {number} Delay in milliseconds
 */
export function getRetryDelay(statusCode, attemptNumber = 0) {
  if (statusCode === 429) {
    // Rate limiting - exponential backoff starting at 5s
    return Math.min(5000 * Math.pow(2, attemptNumber), 30000);
  }
  
  if (statusCode >= 500) {
    // Server errors - exponential backoff starting at 1s
    return Math.min(1000 * Math.pow(2, attemptNumber), 8000);
  }
  
  return 1000;
}
