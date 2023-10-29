import * as cdk from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

const PRIMARY_KEY = 'id'

export class CdkMicroserviceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productTable = new Table(this, 'product', {
      partitionKey: {
        name: PRIMARY_KEY,
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      // overwrite default (retain) 
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: 'product'
      
    })

    // create NodeFunction
    // props in NodeFunctionProps

    const lambdaProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ['aws-sdk'],
        
      },
      runtime: Runtime.NODEJS_18_X,
      environment: {
        PRIMARY_KEY,
        TABLE_NAME: productTable.tableName
      }
    }

    const productLambda = new NodejsFunction(this, 'productLambda', {
      entry: join(__dirname, '../src/product/index.js'),
      ...lambdaProps,
    })

    // give lambda permission to access dynamodb table
    productTable.grantReadWriteData(productLambda)


  }
}
