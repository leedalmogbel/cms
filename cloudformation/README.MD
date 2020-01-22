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

