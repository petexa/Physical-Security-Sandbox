# Prompt Inspector Guide - AI Transparency Training

## Overview

The **Prompt Inspector** is a transparency tool that shows you exactly what happens "behind the curtain" when you ask a natural language question in the AI Chat tab. It demonstrates how prompts are constructed and provides production-ready code examples for integrating with real LLM APIs like Claude.

## What You'll See

When you ask a question in the **Natural Language Queries** tab and get an AI response, you'll see an **"Inspect Prompt"** button next to the response. Click it to open the Prompt Inspector modal, which shows:

### 1. **Your Original Query**
The exact question you asked, displayed clearly at the top.

### 2. **Actual Prompt Sent to Claude**
This is the production prompt that gets constructed from:
- Your natural language question
- Structured data from the database (doors, event types, etc.)
- Sample events to provide context

This is identical to what would be sent to a real Claude API in production.

### 3. **Structured Data Context**
A breakdown of the data extracted from your PACS system:
- **Total Events**: Count of available events
- **Date Range**: Timeline of available data
- **Available Doors**: Physical locations in the system
- **Event Types**: Categories of security events

This context is injected into the prompt to help the AI understand what data is available.

### 4. **Python Implementation**
Complete, production-ready Python code showing:
- How to use the Anthropic Claude API
- How to build context from your database
- How to construct prompts with injected context
- How to call the API and handle responses
- Installation: `pip install anthropic`

### 5. **Node.js Implementation**
Complete, production-ready Node.js code showing:
- How to use the Anthropic SDK
- Async/await patterns for API calls
- Environment variable handling
- Full working example with error handling
- Installation: `npm install @anthropic-ai/sdk`

### 6. **Learning Resources**
Links to official documentation:
- **Claude API Documentation** - API reference and guides
- **Prompt Engineering Guide** - Best practices for effective prompts
- **Available Models** - Model options and pricing information
- **Vision Capabilities** - Using Claude for image analysis

## How It Helps Your Training

### Understanding Prompt Engineering
See exactly how your natural language query gets transformed into a structured prompt that the AI can understand and work with effectively.

### Production Implementation
The Python and Node.js examples are **production-ready**. You can copy them directly into your own backend code to implement AI capabilities in a live environment.

### Key Model Information
- **Model Used**: `claude-3-5-sonnet-20241022` (Latest Claude 3.5)
- **API Provider**: Anthropic
- **Max Tokens**: 1024 (configurable)

## Using the Code Examples

### Python Example
1. Install the SDK: `pip install anthropic`
2. Set your API key: `export ANTHROPIC_API_KEY="your-api-key"`
3. Copy the code from the inspector
4. Modify to use your actual events, doors, and cardholders from your database
5. Call the function with user queries

### Node.js Example
1. Install the SDK: `npm install @anthropic-ai/sdk`
2. Set your API key: `export ANTHROPIC_API_KEY="your-api-key"`
3. Copy the code from the inspector
4. TypeScript types are included for better IDE support
5. Use async/await to call the function

## Key Takeaways

1. **Prompts are Constructed** - Questions are combined with context and structure before sending to AI
2. **Context Matters** - The structured data (doors, event types, samples) helps AI provide better answers
3. **Production Integration** - The examples show how to do this in a real application
4. **Transparency** - You can see exactly what data is being sent to the AI system
5. **Extensibility** - You can modify the code examples to add more context, different prompts, or additional processing

## Try It Out

1. Go to the **Natural Language Queries** tab in the AI page
2. Ask a question like "How many door faults occurred last month?"
3. Wait for the AI response
4. Click **"Inspect Prompt"** on the AI's response
5. Explore the different sections
6. Copy the Python or Node.js code to your own projects

## Integration Steps for Production

1. **Set up environment**
   ```bash
   # Install dependencies
   npm install @anthropic-ai/sdk
   # or
   pip install anthropic
   ```

2. **Configure API key**
   ```bash
   export ANTHROPIC_API_KEY="your-key-from-anthropic.com"
   ```

3. **Load your data** from your actual PACS/security database

4. **Construct prompts** using the patterns shown in the inspector

5. **Handle responses** with error handling and response parsing

6. **Cache results** if making repeated queries with similar context

## Advanced Tips

- **System Prompts**: You can add a system message to instruct the model on its role
- **Temperature**: Adjust temperature (0.0-2.0) for more/less creative responses
- **Context Tokens**: The context size affects cost; optimize what you send to the API
- **Caching**: Anthropic supports prompt caching for cost optimization
- **Vision**: Claude can also analyze security camera feeds and images

## Questions?

Refer to the learning resources in the Prompt Inspector or check the official Anthropic documentation at https://docs.anthropic.com/
