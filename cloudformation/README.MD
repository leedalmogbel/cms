Deployment Flow

    Cognito (Done)
    Database + S3 + Cloudfront CF Deployment
    Secrets Manager Deployment
    Backend Deployment Deployment
    Lambda Edge Security Headers Deployment
    S3 Events Notification

    The deployments mentioned above will be recorded.

    To Create:
    aws cloudformation create-stack --stack-name kapp-cms-cf-prod --template-body file://kapp-cms.yml --tags Key=Name,Value=CMS-CF-prod Key=ProjectCode,Value=CMS Key=SupportContact,Value=Stratpoint --region ap-southeast-1  --parameters file://parameters/parameters-prod.json 

    to Update:
    aws cloudformation update-stack --stack-name kapp-cms-cf-prod --template-body file://kapp-cms.yml --tags Key=Name,Value=CMS-CF-prod Key=ProjectCode,Value=CMS Key=SupportContact,Value=Stratpoint --region ap-southeast-1  --parameters file://parameters/parameters.json 

Implementation Plan:
- Backend devs to create backup of DBs prior to deployment and migration
- Devs to merge, build and deploy all changes from the QA branch (BE) and dedicated branch (FE) to the UAT environment.
- Backend devs to execute migration script for old posts
    

    [FOR APP]
    Update secrets manager with values from env.yml.
    
    aws secretsmanager create-secret --name prod/CMS/application --description "secrets for cms app" --secret-string file://secrets/secrets-prod.json

    [FOR DATABASE]
    Configure secrets on console

    
Security Headers Lambda 

exports.handler = async (event, context, callback) => 
{
    //Get contents of response
    const response = event.Records[0].cf.response;
    const headers = response.headers;

    //Set new headers 
    headers['strict-transport-security'] = [{key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubdomains; preload'}]; 
    headers['x-content-type-options'] = [{key: 'X-Content-Type-Options', value: 'nosniff'}]; 
    headers['x-frame-options'] = [{key: 'X-Frame-Options', value: 'DENY'}]; 
    console.log({headers});
    //Return modified response
    callback(null, response);
};
