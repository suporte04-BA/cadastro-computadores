module.exports = {
  apps: [{
    name: 'cadastro-computadores',
    script: 'java',
    args: '-jar backend/target/cadastro-computadores-2.0.0.jar',
    cwd: 'C:\\Users\\usuario\\Documents\\cadastro-computadores',
    autorestart: true,
    max_restarts: 999,
    restart_delay: 5000,
    watch: false,
    env: {
      NODE_ENV: 'production'
    }
  }]
};
