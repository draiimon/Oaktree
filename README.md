# Week 3: Cloud Services & Infrastructure as Code

Simple cloud project using Terraform to deploy a Node.js app to AWS with proper networking and security.

## Mabilis na Guide

### Local App (Run locally)

1. Start app:
   ```
   cd app
   npm install
   npm start
   ```

2. Open browser: http://localhost:3000

### Docker Run (Optional)

1. Build and run:
   ```
   cd app
   docker build -t cloud-app .
   docker run -p 3000:3000 cloud-app
   ```

### AWS Deployment

1. Deploy to cloud:
   ```
   cd terraform
   terraform init
   terraform apply
   ```

2. Get website link:
   ```
   terraform output app_url
   ```

## Project Files

- **app** folder: Node.js application
- **terraform** folder: AWS infrastructure code

## What You'll Learn

- ✅ Cloud Provider (AWS)
- ✅ Infrastructure as Code (Terraform)
- ✅ Containerized App Deployment
- ✅ Networking & Security

## AWS Resources Created

- VPC with public/private subnets
- Internet Gateway & NAT
- ECR for container images
- ECS Fargate for running app
- Load balancer & Security groups
- CloudWatch logs & Auto-scaling