import { GetItemCommand, ScanCommand , PutItemCommand } from "@aws-sdk/client-dynamodb"; 
import {client} from './ddbClient'
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from 'uuid';

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
        case 'POST': 
            body = await createProduct(event)
            break;
            
        default:
            throw new Error(`Unsupported method "${httpMethod}"`)
    
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
        const {Item} = client.send(new GetItemCommand(params))

        return Item ? unmarshall(Item) : {}
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
    
}

async function getAllProducts(){
    console.log('getAllProducts Function')

    try {
        const params ={
            TableName: process.env.DYNAMODB_TABLE_NAME,
        }
        const {Items} = client.send(new ScanCommand(params))
        console.log(Items)
        return Items ? Items.map(item => unmarshall(item)) : []
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
    

}


async function createProduct(event){
    console.log(`create Function with event: ${event}`)

    const product = JSON.parse(event.body)
    product.id = uuidv4()

    try {
        const params ={
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(product) || {}
        }
        const response = client.send(new PutItemCommand(params))
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }

}