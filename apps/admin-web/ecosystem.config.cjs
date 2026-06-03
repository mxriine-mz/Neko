// Démarrage PM2 du panneau d'administration Neko (Next.js, port 3000).
// Lancer : pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'neko-db',
      cwd: __dirname,
      script: 'node_modules/next/dist/bin/next',
      args: 'start -H 127.0.0.1 -p 3000',
      interpreter: 'node',
      env: { NODE_ENV: 'production' },
      max_restarts: 10,
      autorestart: true,
    },
  ],
};
