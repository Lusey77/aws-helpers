import { Context } from 'aws-lambda';
import { SSM } from 'aws-sdk';

export type CodeBuildStatus = "FAILED" | "SUCCEEDED" | "IN_PROGRESS" | "STOPPED";

export type CodeBuildPhase = "BUILD" | "DOWNLOAD_SOURCE" | "FINALIZING" | "INSTALL" | "POST_BUILD" | "PRE_BUILD" | "PROVISIONING" | "SUBMITTED" | "UPLOAD_ARTIFACTS";

export interface CodeBuildStateChange {
    "build-status": CodeBuildStatus;
    "project-name": string;
    "build-id": string;
    "current-phase": CodeBuildPhase;
    "current-phase-context": string;
    version: string;
}

export interface CloudWatchEvent<T> {
    version: string;
    id: string;
    "detail-type": string;
    source: string;
    account: string;
    time: Date;
    region: string;
    resources: string[];
    detail: T;
}

export const handler = async (event: CloudWatchEvent<CodeBuildStateChange>, context: Context): Promise<string> => {
    const ssm = new SSM();

    const parameterName = `/build-number/${event.detail['project-name']}`;

    const getBuildNumberParams = {
        Name: parameterName
    };

    const getBuildNumberResponse = await ssm.getParameter(getBuildNumberParams).promise();

    if (getBuildNumberResponse.Parameter === undefined || getBuildNumberResponse.Parameter.Value === undefined) {
        console.log(`Failed to get build number for ${parameterName}:
                    \nEvent:\n${JSON.stringify(event)}
                    \nContext:\n${JSON.stringify(context)}`);
        return Promise.reject("Failed");
    }

    const buildNumber = parseInt(getBuildNumberResponse.Parameter.Value);

    const setBuildNumberParams = {
        Name: parameterName,
        Type: 'String',
        Value: (buildNumber + 1).toString(),
        Overwrite: true
    };

    const setBuildNumberResponse = await ssm.putParameter(setBuildNumberParams).promise();

    return Promise.resolve("Completed");
};