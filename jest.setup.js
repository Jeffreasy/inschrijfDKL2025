const jestDom = require('@testing-library/jest-dom');
require('whatwg-fetch');

// Mock voor window.print
window.print = jest.fn();

// Mock voor Google Analytics
window.gtag = jest.fn();

// Mock voor localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock voor fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ status: 'success' })
  })
);

// Mock voor window.location
delete window.location;
window.location = {
  href: 'http://localhost',
  origin: 'http://localhost'
}; 