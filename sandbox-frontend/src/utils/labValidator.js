// Lab Validator - Validates user responses against expected results

export function validateLabStep(step, userResponse) {
  const { expectedEndpoint, expectedMethod, expectedResult } = step;
  
  // Validate endpoint
  if (userResponse.endpoint !== expectedEndpoint) {
    return {
      success: false,
      message: `Incorrect endpoint. Expected: ${expectedEndpoint}, but got: ${userResponse.endpoint}`,
      hint: step.hint
    };
  }
  
  // Validate method
  if (userResponse.method !== expectedMethod) {
    return {
      success: false,
      message: `Incorrect HTTP method. Expected: ${expectedMethod}, but got: ${userResponse.method}`,
      hint: step.hint
    };
  }
  
  // Validate status code if response is available
  if (userResponse.statusCode && expectedResult.statusCode) {
    if (userResponse.statusCode !== expectedResult.statusCode) {
      return {
        success: false,
        message: `Unexpected status code. Expected: ${expectedResult.statusCode}, but got: ${userResponse.statusCode}`
      };
    }
  }
  
  // Validate response body contains expected fields
  if (userResponse.responseBody && expectedResult.bodyContains) {
    try {
      const bodyStr = JSON.stringify(userResponse.responseBody).toLowerCase();
      const missingFields = expectedResult.bodyContains.filter(
        field => !bodyStr.includes(field.toLowerCase())
      );
      
      if (missingFields.length > 0) {
        return {
          success: false,
          message: `Response is missing expected fields: ${missingFields.join(', ')}`
        };
      }
    } catch {
      return {
        success: false,
        message: 'Unable to validate response body format'
      };
    }
  }
  
  // All validations passed
  return {
    success: true,
    message: "Excellent work! You completed this step correctly."
  };
}

export function getHint(step, attemptNumber) {
  // Return progressively more detailed hints based on attempt count
  if (attemptNumber === 1) {
    return step.hint;
  } else if (attemptNumber === 2) {
    return `${step.hint}\n\nTry: ${step.expectedMethod} ${step.expectedEndpoint}`;
  } else if (attemptNumber >= 3) {
    return getSolution(step);
  }
  return step.hint;
}

export function getSolution(step) {
  let solution = `**Solution:**\n`;
  solution += `Method: ${step.expectedMethod}\n`;
  solution += `Endpoint: ${step.expectedEndpoint}\n`;
  
  if (step.sampleBody) {
    solution += `\nBody:\n\`\`\`json\n${JSON.stringify(step.sampleBody, null, 2)}\n\`\`\``;
  }
  
  return solution;
}

export function calculateLabProgress(lab, completedSteps) {
  const totalSteps = lab.steps.length;
  const completed = completedSteps.length;
  return {
    completed,
    total: totalSteps,
    percentage: Math.round((completed / totalSteps) * 100)
  };
}

export function isLabComplete(lab, completedSteps) {
  return completedSteps.length === lab.steps.length;
}

export function getNextStep(lab, completedSteps) {
  const completedIds = completedSteps.map(s => s.id);
  return lab.steps.find(step => !completedIds.includes(step.id));
}
