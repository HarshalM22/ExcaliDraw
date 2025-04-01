# Excalidraw

A whiteboard collaboration tool built from first principles without external drawing libraries. This project uses Next.js for both HTTP and WebSocket servers, all structured within a Turbo repo for efficient development.

## Features

- Real-time collaborative drawing
- Custom drawing engine built from scratch
- No external drawing libraries
- WebSocket-based real-time updates
- Efficient monorepo structure with Turborepo
- Next.js and HTTP backend for API requests
- Persistent storage of drawings

## Tech Stack

- **Frontend**: React.js with Next.js
- **Backend**: Express API routes for HTTP endpoints
- **Real-time**: Custom WebSocket server implementation
- **Build System**: Turborepo for monorepo management
- **Styling**:  Tailwind CSS 



## Getting Started

### Prerequisites

- Node.js (v18.0.0 or later)
- pnpm, npm, or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/HarshalM22/ExcaliDraw.git
cd excalidraw
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
pnpm run dev
```

4. Open your browser to `http://localhost:3000`


## Custom Canvas Engine

The drawing functionality is built from first principles without relying on external libraries. Key components include:

- **Rendering Engine**: Custom implementation using the Canvas API
- **Shape Management**: Vector-based shape creation and manipulation
- **Event Handling**: Custom event system for drawing interactions
- **Serialization**: JSON-based format for saving and loading drawings


### Environment Variables

Create a `.env.local` file in the web app directory:

```
NEXT_PUBLIC_WS_URL=wss://your-domain.com/ws
DATABASE_URL=your-database-url
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the original [Excalidraw](https://excalidraw.com/) project
- Built as a learning exercise to understand canvas drawing from first principles