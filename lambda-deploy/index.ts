import { Context, S3EventRecord } from 'aws-lambda';

export const handler = async (event: S3EventRecord, context: Context): Promise<string> => {
    console.log(`Attempting to deploy app-v3`);
    console.log(`Event: ${JSON.stringify(event)}`);
    console.log(`Context: ${JSON.stringify(context)}`);

    return Promise.resolve("Completed");
};