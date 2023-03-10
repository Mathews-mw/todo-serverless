import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'todo-serverless',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: {
    createTodo: {
      handler: 'src/functions/createTodo.handler',
      events: [
        {
          http: {
            path: 'todo/create/{id}',
            method: 'post',
            cors: true
          }
        }
      ]
    },
    getTodo: {
      handler: 'src/functions/getTodo.handler',
      events: [
        {
          http: {
            path: 'todo/list/{id}',
            method: 'get',
            cors: true
          }
        }
      ]
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ['dev', 'local'],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true
      }
    }
  },
  resources: {
    Resources: {
      dbUsersTodo: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "users_todo",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {
            AttributeName: "id",
            KeyType: "HASH"
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
