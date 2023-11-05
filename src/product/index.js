import { GetItemCommand } from "@aws-sdk/client-dynamodb"; 
import {client} from './ddbClient'
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

exports.handler = async (event) => {
    console.log('request: ', JSON.stringify(event, undefined, 2))

    const httpMethod = event.httpMethod

    switch (httpMethod) {
        case 'GET':
            if( event.pathParameters != null){
                body =  await getProduct(event.pathParameters)
            }
            else{
                body =  await getAllProducts()
            }
            
        // default:
        //     throw new Error(`Unsupported method "${httpMethod}"`)
    
    }

    return{
        statusCode: 200,
        body : `Hello from Lambda, Path: ${event.path}\n`
    }

   
}

async function getProduct(productId){
    console.log('getProduct Function')

    try {
        const params ={
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: {
              id: marshall({id: productId})
            },
        }
        const {item} = client.send(new GetItemCommand(params))

        return item ? unmarshall(item) : {}
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
    
}