module.exports = {
  apps: [
    {
      name: 'aws-codedeploy',
      script: 'npx',
      args: 'run nodemon',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
 }