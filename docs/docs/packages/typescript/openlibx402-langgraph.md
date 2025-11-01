# @402fly/langgraph

LangGraph.js integration for X402 payment protocol.

## Installation

```bash
npm install @402fly/langgraph
```

## Features

- LangGraph nodes for payments
- Workflow integration
- AI agent payment workflows
- TypeScript support

## Usage

```typescript
import { paymentNode } from '@402fly/langgraph';
import { StateGraph } from '@langchain/langgraph';

const workflow = new StateGraph();

workflow.addNode('pay', paymentNode);
workflow.addNode('fetch', fetchNode);

workflow.addEdge('pay', 'fetch');

const app = workflow.compile();
```

## License

MIT