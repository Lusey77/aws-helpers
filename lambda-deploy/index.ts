export const handler = async (event: any, context: any): Promise<any> => {
    console.log(`Attempting to deploy app`);
    console.log(`Event: ${JSON.stringify(event)}`);
    console.log(`Context: ${JSON.stringify(context)}`);

    return Promise.resolve("Completed");
};