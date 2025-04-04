# Cloud Infrastructure Dashboard

A dynamic Node.js application for monitoring and displaying real-time system infrastructure details with AWS cloud deployment support using Terraform.

## Project Overview

This project provides a real-time dashboard for monitoring cloud infrastructure metrics. It displays various system information metrics and is designed to be deployed to AWS using ECS (Elastic Container Service) through Terraform.

### Key Features

- Real-time system information display
- AWS environment information integration
- Containerization with Docker
- Infrastructure as Code with Terraform
- Responsive modern UI

## Architecture

The application follows a simple yet powerful architecture:

1. **Frontend/Backend**: Single Express.js application serving an HTML dashboard
2. **Containerization**: Docker for consistent deployment
3. **Infrastructure**: AWS resources defined using Terraform modules
   - Networking (VPC, Subnets, Internet Gateway)
   - ECR (Elastic Container Registry)
   - ECS (Elastic Container Service)
   - Load Balancer with auto-scaling

## Local Development

### Prerequisites

- Node.js (v14+)
- Docker
- AWS CLI (configured with appropriate credentials)
- Terraform

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/draiimon/Oaktree.git
   cd Oaktree
   ```

2. Install dependencies:
   ```
   cd app
   npm install
   ```

3. Run the application locally:
   ```
   npm start
   ```

4. View the application at: http://localhost:5000

## AWS Deployment

### Prerequisites

- AWS account with appropriate permissions
- AWS CLI configured
- Terraform installed

### Deployment Steps

1. Initialize Terraform:
   ```
   cd terraform
   terraform init
   ```

2. Review the deployment plan:
   ```
   terraform plan
   ```

3. Deploy the infrastructure:
   ```
   terraform apply
   ```

4. Build and push the Docker image:
   ```
   # Login to ECR (replace with your account ID and region)
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [AWS_ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com
   
   # Build the image
   docker build -t cloud-app-dashboard .
   
   # Tag the image
   docker tag cloud-app-dashboard:latest [ECR_REPOSITORY_URL]:latest
   
   # Push the image
   docker push [ECR_REPOSITORY_URL]:latest
   ```

5. Access your application at the URL provided in the Terraform outputs.

## Terraform Configuration

The Terraform configuration is organized into modules:

- **Networking**: VPC, subnets, internet gateway, and NAT gateway
- **ECR**: Container registry for storing Docker images
- **ECS**: Container service for running the application

## Project Structure

```
.
├── app/
│   ├── server.js        # Express application
│   └── package.json     # Node.js dependencies
├── terraform/
│   ├── main.tf          # Main Terraform configuration
│   ├── variables.tf     # Input variables
│   ├── outputs.tf       # Output values
│   └── modules/         # Modular Terraform configuration
│       ├── networking/  # VPC and network resources
│       ├── ecr/         # Container registry
│       └── ecs/         # Container service
├── Dockerfile           # Docker configuration
└── README.md            # Project documentation
```

## Learning Outcomes

This project demonstrates several key cloud and DevOps concepts:

1. **Containerization**: Building and deploying applications in containers
2. **Infrastructure as Code**: Using Terraform to define and provision infrastructure
3. **Cloud Architecture**: Designing applications for cloud environments
4. **CI/CD Readiness**: Structuring a project for continuous integration and deployment

## License

MIT