# OakTree Infrastructure as Code (Terraform)

This directory contains Terraform configurations to provision the AWS infrastructure required for the OakTree DevOps project.

## Infrastructure Components

The Terraform configuration provisions the following AWS resources:

1. **DynamoDB Table**: For user data storage
2. **Cognito User Pool**: For user authentication and management
3. **ECS Cluster and Service**: For container deployment
4. **ECR Repository**: For storing Docker images
5. **IAM Roles and Policies**: For proper access control
6. **CloudWatch Log Group**: For application logging
7. **Security Group**: For network access control

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) (v1.0.0 or newer)
- AWS CLI configured with appropriate credentials
- AWS account with required permissions

## Configuration

You can customize the deployment by modifying the `terraform.tfvars` file with your specific AWS account details:

```hcl
aws_region  = "us-east-1"    # Your preferred AWS region
environment = "dev"          # Environment name (dev, staging, prod)

# VPC Configuration
vpc_cidr        = "10.0.0.0/16"  # CIDR block for the VPC
public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]  # Public subnet CIDR blocks
private_subnets = ["10.0.3.0/24", "10.0.4.0/24"]  # Private subnet CIDR blocks

# ECS Configuration
container_memory = 512  # Container memory in MiB
container_cpu    = 256  # Container CPU units
desired_count    = 2    # Desired number of containers
```

## Usage

Follow these steps to deploy the infrastructure:

1. **Initialize Terraform**:
   ```bash
   terraform init
   ```

2. **Plan the deployment**:
   ```bash
   terraform plan
   ```

3. **Apply the configuration**:
   ```bash
   terraform apply
   ```

4. **To destroy the infrastructure**:
   ```bash
   terraform destroy
   ```

## Outputs

After successful deployment, Terraform will output important resource identifiers that you'll need to configure the application:

- `dynamodb_table_name`: Name of the DynamoDB table
- `cognito_user_pool_id`: ID of the Cognito User Pool
- `cognito_client_id`: ID of the Cognito User Pool Client
- `ecr_repository_url`: URL of the ECR repository
- `ecs_cluster_name`: Name of the ECS cluster
- `ecs_service_name`: Name of the ECS service

These values should be used to set the appropriate environment variables in your CI/CD pipeline and application configuration.

## Security Notes

- The default configuration is suitable for development but should be hardened for production use
- Review and restrict the IAM permissions to follow the principle of least privilege
- Consider using AWS KMS for encrypting sensitive data in DynamoDB
- Update the security group rules to restrict access as needed