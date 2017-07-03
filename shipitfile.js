module.exports = (shipit) => {
  require('shipit-deploy')(shipit);
  shipit.initConfig({
    default: {
      workspace: '/tmp/ws',
      deployTo: '/app',
      repositoryUrl: 'https://www.github.com/ryanquinn3/peeper',
      branch: 'master',
      ignores: ['node_modules']
    },
    production: {
      servers: 'root@peeper'
    },
  });

  shipit.task('copy-nginx', () => shipit.remoteCopy('./nginx.conf', '/etc/nginx/nginx.conf'));
  shipit.task('deploy-nginx', ['copy-nginx'], () => shipit.remote('systemctl restart nginx'));
  shipit.on('deployed', () => shipit.remote('yarn', { cwd: '/app/current' }));
};