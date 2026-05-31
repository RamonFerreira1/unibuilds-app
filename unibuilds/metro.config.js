// metro.config.js
// Necessário para resolver o erro "Cannot use 'import.meta' outside a module"
// causado pelo Zustand que usa import.meta.env nos seus arquivos ESM (.mjs).
// Esta config força o Metro a usar o build CommonJS do Zustand em vez do ESM.

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Força o Metro a preferir o campo "main" (CJS) dos packages.json em vez do "exports" ESM
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
