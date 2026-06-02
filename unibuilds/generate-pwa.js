const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const manifestPath = path.join(distDir, 'manifest.json');
const indexHtmlPath = path.join(distDir, 'index.html');

// 1. Criar o manifest.json
const manifest = {
  "short_name": "UniBuilds",
  "name": "UniBuilds - LoL",
  "icons": [
    {
      "src": "/assets/icon.png",
      "type": "image/png",
      "sizes": "1024x1024"
    },
    {
      "src": "/assets/icon.png",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "any maskable"
    }
  ],
  "start_url": "/",
  "background_color": "#020F1F",
  "display": "standalone",
  "theme_color": "#020F1F",
  "description": "App de Builds e Runas de League of Legends"
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✅ manifest.json criado com sucesso em dist/');

// 2. Copiar a logo original de alta resolução para dentro de dist/assets/
const srcIcon = path.join(__dirname, 'assets', 'icon.png');
const destIconDir = path.join(distDir, 'assets');
const destIcon = path.join(destIconDir, 'icon.png');

if (!fs.existsSync(destIconDir)) {
  fs.mkdirSync(destIconDir, { recursive: true });
}
if (fs.existsSync(srcIcon)) {
  fs.copyFileSync(srcIcon, destIcon);
  console.log('✅ icon.png de alta resolução copiado para dist/assets/');
}

// 3. Injetar a tag do manifest e os meta tags do PWA no index.html
if (fs.existsSync(indexHtmlPath)) {
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  if (!indexHtml.includes('manifest.json')) {
    const headInjection = `
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/assets/icon.png" />
    <meta name="theme-color" content="#020F1F" />
    `;
    indexHtml = indexHtml.replace('</head>', headInjection + '</head>');
    fs.writeFileSync(indexHtmlPath, indexHtml);
    console.log('✅ index.html atualizado com as tags do PWA!');
  }
} else {
  console.log('❌ index.html não encontrado em dist/');
}
