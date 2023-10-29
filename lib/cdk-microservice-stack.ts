import * as cdk from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';


export class CdkMicroserviceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productTable = new Table(this, 'product', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      // overwrite default (retain) 
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: 'product'
      
    })

    // create NodeFunction
    // props in NodeFunctionProps
    // give lambda permission to access dynamodb table

    
  }
}
