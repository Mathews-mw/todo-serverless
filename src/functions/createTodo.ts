import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from 'src/utils/dynamodbClient';

interface ICreateTodo {
	id: string;
	title: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
	const { id: user_id } = event.pathParameters;
	const { id, title } = JSON.parse(event.body) as ICreateTodo;

	console.log(event.pathParameters);

	await document
		.put({
			TableName: 'users_todo',
			Item: {
				id,
				user_id,
				title,
				done: false,
				deadline: new Date().getTime(),
			},
		})
		.promise();

	const response = await document
		.query({
			TableName: 'users_todo',
			KeyConditionExpression: 'id = :id',
			ExpressionAttributeValues: {
				':id': id,
			},
		})
		.promise();

	return {
		statusCode: 200,
		body: JSON.stringify(response.Items[0]),
	};
};
