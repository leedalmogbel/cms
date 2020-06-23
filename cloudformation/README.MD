DEV
aws cloudformation update-stack --stack-name kapp-cms-cf-frontend-website-s3-dev --template-body file://kapp-cms.json --tags Key=Name,Value=CMS-frontend-website-s3-cf-DEV Key=ProjectCode,Value=CMS Key=SupportContact,Value=Stratpoint --region ap-southeast-1

aws cloudformation create-stack --stack-name kapp-cms-cf-frontend-website-s3-dev --template-body file://kapp-cms.json --tags Key=Name,Value=CMS-frontend-website-s3-cf-DEV Key=ProjectCode,Value=CMS Key=SupportContact,Value=Stratpoint --region ap-southeast-1

QA

aws cloudformation update-stack --stack-name kapp-cms-cf-frontend-website-s3-QA --template-body file://kapp-cms.json --tags Key=Name,Value=CMS-frontend-website-s3-cf-QA Key=ProjectCode,Value=CMS Key=SupportContact,Value=Stratpoint --region ap-southeast-1

aws cloudformation create-stack --stack-name kapp-cms-cf-frontend-website-s3-QA --template-body file://kapp-cms.json --tags Key=Name,Value=CMS-frontend-website-s3-cf-QA Key=ProjectCode,Value=CMS Key=SupportContact,Value=Stratpoint --region ap-southeast-1

UAT

aws cloudformation update-stack --stack-name kapp-cms-cf-frontend-website-s3-UAT --template-body file://kapp-cms.json --tags Key=Name,Value=CMS-frontend-website-s3-cf-UAT Key=ProjectCode,Value=CMS Key=SupportContact,Value=Stratpoint --region ap-southeast-1

aws cloudformation create-stack --stack-name kapp-cms-cf-frontend-website-s3-UAT --template-body file://kapp-cms.json --tags Key=Name,Value=CMS-frontend-website-s3-cf-UAT Key=ProjectCode,Value=CMS Key=SupportContact,Value=Stratpoint --region ap-southeast-1

DEMO

aws cloudformation update-stack --stack-name kapp-cms-cf-frontend-website-s3-DEMO --template-body file://kapp-cms.json --tags Key=Name,Value=CMS-frontend-website-s3-cf-DEMO Key=ProjectCode,Value=CMS Key=SupportContact,Value=Stratpoint --region ap-southeast-1

aws cloudformation create-stack --stack-name kapp-cms-cf-frontend-website-s3-DEMO --template-body file://kapp-cms.json --tags Key=Name,Value=CMS-frontend-website-s3-cf-DEMO Key=ProjectCode,Value=CMS Key=SupportContact,Value=Stratpoint --region ap-southeast-1


PRODSIM


aws cloudformation update-stack --stack-name kapp-media-cf-alb-dev --template-body file://cloudformation.yml --tags Key=Name,Value=MEDIA-ALB-CF-DEV Key=ProjectCode,Value=MEDIA Key=SupportContact,Value=Stratpoint --region ap-southeast-1 --parameters ParameterKey=Lambda,ParameterValue=arn:aws:lambda:ap-southeast-1:210231714834:function:kapp-media-api-dev-app

aws cloudformation create-stack --stack-name kapp-cms-cf-prodsim --template-body file://kapp-cms.yml --tags Key=Name,Value=CMS-CF-prodsim Key=ProjectCode,Value=CMS Key=SupportContact,Value=Stratpoint --region ap-southeast-1  --parameters file://parameters.json --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND

aws cloudformation update-stack --stack-name kapp-cms-cf-prodsim --template-body file://kapp-cms.yml --tags Key=Name,Value=CMS-CF-prodsim Key=ProjectCode,Value=CMS Key=SupportContact,Value=Stratpoint --region ap-southeast-1  --parameters file://parameters.json --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
