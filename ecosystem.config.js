module.exports = {
  apps: [
    {
      name: 'admin-dashboard',
      cwd: './apps/admin',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3004,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'proxy-server',
      script: './server.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
