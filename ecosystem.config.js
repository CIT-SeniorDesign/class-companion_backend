module.exports = {
  apps: [
    {
      name: 'aws-codedeploy',
      script: 'npm',
      args: 'run nodemon',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}