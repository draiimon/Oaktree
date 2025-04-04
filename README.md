# Week 3: Cloud Services & Infrastructure as Code

A cloud infrastructure project using Terraform to deploy a containerized Node.js application to AWS with proper networking and security.

## Project Overview

This project demonstrates the implementation of Infrastructure as Code (IaC) using Terraform to provision and manage AWS resources. It includes:

1. A containerized Node.js/Express application
2. Terraform configuration for AWS infrastructure
3. Complete networking setup with VPC, subnets, and security groups
4. Container deployment using AWS ECS/Fargate

## Project Structure

```
.
├── app/                     # JavaScript application files
│   ├── server.js            # Express server with cloud deployment UI
│   ├── package.json         # Node.js dependencies
│   └── Dockerfile           # Container configuration
│
└── terraform/               # Infrastructure as Code files
    ├── main.tf              # Main Terraform configuration
    ├── variables.tf         # Terraform variables
    ├── providers.tf         # AWS provider configuration
    ├── outputs.tf           # Output definitions
    └── modules/             # Terraform modules
        ├── networking/      # VPC, subnets, gateways
        ├── ecr/             # Container registry
        └── ecs/             # Fargate service
```

## Features

- JavaScript/Node.js application with cloud deployment information display
- Docker container configuration for application
- Terraform modules for AWS infrastructure:
  - VPC and networking (public/private subnets, NAT/Internet gateways)
  - ECR for container registry
  - ECS Fargate for container deployment
  - Security groups and application load balancer
  - Auto-scaling configuration
  - CloudWatch logging

## Running the Application Locally

### Prerequisites
- Node.js (v14+)
- Docker (for containerization)

### Running the Node.js Application

1. Navigate to the app directory:
   ```
   cd app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm start
   ```
   
   Or for development with auto-reload:
   ```
   npm run dev
   ```

4. Access the application at http://localhost:3000

### Building and Running with Docker

1. Navigate to the app directory:
   ```
   cd app
   ```

2. Build the Docker image:
   ```
   docker build -t cloud-app .
   ```

3. Run the container:
   ```
   docker run -p 3000:3000 cloud-app
   ```

4. Access the application at http://localhost:3000

## Deploying to AWS with Terraform

### Prerequisites
- AWS account
- AWS CLI configured
- Terraform installed (v1.2.0+)

### Deployment Steps

1. Navigate to the terraform directory:
   ```
   cd terraform
   ```

2. Initialize Terraform:
   ```
   terraform init
   ```

3. Review the deployment plan:
   ```
   terraform plan
   ```

4. Apply the configuration to create infrastructure:
   ```
   terraform apply
   ```

5. After successful deployment, retrieve the application URL:
   ```
   terraform output app_url
   ```

### AWS Infrastructure Created

- VPC with public and private subnets across two availability zones
- Internet Gateway for public internet access
- NAT Gateway for private subnet internet access
- ECR repository for Docker images
- ECS Fargate cluster, service, and task definition
- Application Load Balancer with HTTP listener
- Security Groups for ECS tasks and load balancer
- CloudWatch Log Group for container logs
- Auto-scaling policies based on CPU and memory utilization

## Week 3 Objectives Completed

### Cloud Provider Basics
- AWS services configuration
- Core services: compute (ECS/Fargate), storage (ECR), networking (VPC, security groups)

### Infrastructure as Code (IaC)
- Terraform configuration for AWS resources
- Modular infrastructure design
- Resource relationships and dependencies

### Containerized App Deployment
- Docker containerization of Node.js application
- Container registry (ECR) configuration
- ECS Fargate for serverless container execution
- Environment variables and configuration

### Networking & Security
- VPC with public/private subnet architecture
- Security groups for access control
- Load balancer configuration
- Health checks and monitoring
