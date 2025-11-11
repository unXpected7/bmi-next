import "@testing-library/jest-dom";

// Mock crypto.randomUUID for Node.js environment
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => Math.random().toString(36).substr(2, 9),
  },
});