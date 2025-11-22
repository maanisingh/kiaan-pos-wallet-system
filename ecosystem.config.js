module.exports = {
  apps: [
    {
      name: 'landing-page',
      cwd: './apps/web',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'merchant-dashboard',
      cwd: './apps/merchant',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3001,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'customer-portal',
      cwd: './apps/customer',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3002,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'pos-terminal',
      cwd: './apps/pos',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3003,
        NODE_ENV: 'production'
      }
    }
  ]
}
