module.exports = (shipit) => {
  require('shipit-deploy')(shipit);
  shipit.initConfig({
    production: {
      servers: 'root@peeper'
    },
  });

  shipit.task('ls', () => shipit.remote('ls -asl'));
};