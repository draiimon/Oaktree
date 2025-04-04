# Week 3: Cloud Services & Infrastructure as Code - Day 13 (March 12, 2023)

## Introduction

Building on the foundation established on Day 12, today's focus was implementing Infrastructure as Code (IaC) with Terraform. This approach enables us to define and provision our AWS infrastructure using declarative configuration files, ensuring consistency, reproducibility, and version control for our cloud resources.

## Objectives

- Install and configure Terraform for AWS infrastructure management
- Design efficient project structure for Terraform configurations
- Implement modular approach for better code organization
- Create initial provider configuration and project framework
- Set up GitHub repository for version control and collaboration

## Accomplishments

### Terraform Installation and Configuration

Successfully installed Terraform CLI for local development:

```bash
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
terraform -version # Verified installation (v1.5.7)
```

### Project Structure Design

Created a well-organized directory structure for the Terraform project:

```
terraform/
├── main.tf          # Main configuration file
├── variables.tf     # Input variables definition
├── outputs.tf       # Output values definition
├── providers.tf     # Provider configuration
└── modules/         # Reusable modules
    ├── networking/  # VPC, subnets, gateways configuration
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    ├── ecr/         # Container registry configuration
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    └── ecs/         # Container service configuration
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

### Provider Configuration

Implemented AWS provider configuration with appropriate version constraints:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "Week3-Cloud-Infrastructure"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
```

### Variables Definition

Created a comprehensive set of input variables to make the configuration flexible and reusable:

```hcl
variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones to use"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnets" {
  description = "List of public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets" {
  description = "List of private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}
```

### Module Implementation

Started implementing the core modules:

1. **Networking Module**: Basic structure for VPC, subnets, and gateways
2. **ECR Module**: Configuration for container registry
3. **ECS Module**: Framework for container service

### GitHub Repository Setup

- Created GitHub repository for version control
- Added proper .gitignore file for Terraform
- Established initial commit with project structure
- Configured README.md with project overview and setup instructions

### Terraform Initialization and Validation

Successfully initialized and validated the Terraform configuration:

```bash
cd terraform
terraform init  # Initialize Terraform working directory
terraform validate  # Validate configuration files
```

## Resources & References

### Terraform Documentation
- Terraform AWS Provider Documentation
- Terraform Best Practices
- Terraform Module Development

### Infrastructure as Code
- Infrastructure as Code: Principles and Patterns
- Terraform Up & Running (Book)
- AWS Architecture Center - IaC Patterns

### GitHub Resources
- Git Workflow Best Practices
- GitHub Actions for Terraform

## Challenges & Solutions

### Module Design Considerations

**Challenge**:  
Determining the appropriate level of modularity for the Terraform configuration required balancing reusability with maintainability. Overly granular modules can become complex to manage, while monolithic configurations lack flexibility.

**Solution**:
- Analyzed project requirements to identify logical separation of concerns
- Researched Terraform best practices for module design
- Created modules based on AWS service boundaries (networking, ECR, ECS)
- Implemented consistent interface patterns across modules
- Documented module inputs, outputs, and usage examples

### State Management Strategy

**Challenge**:  
Deciding on the appropriate Terraform state management approach for this project required evaluating tradeoffs between simplicity and robustness.

**Solution**:
- Evaluated local state vs. remote state management options
- Researched state locking mechanisms for collaborative work
- Decided to start with local state for development
- Prepared for future migration to S3 backend with DynamoDB locking
- Documented the decision and migration path for future reference

## Screenshot References

For documentation and reference purposes, I've captured screenshots of key configurations:

1. Terraform Installation: Terminal Screenshot
2. Project Directory Structure: VSCode Explorer
3. GitHub Repository
4. Terraform Init Command: Terminal Output
5. AWS Provider Configuration: VSCode Editor

## Tomorrow's Plan (March 13)

1. Implement comprehensive networking infrastructure with VPC, subnets, and gateways
2. Configure AWS ECR (Elastic Container Registry) for Docker image storage
3. Set up repository policies and lifecycle rules for ECR
4. Test Terraform plan and validate infrastructure design
5. Document networking architecture with diagrams
6. Begin implementation of ECS module components

## Conclusion

Day 13 has been productive in establishing the foundation for our Infrastructure as Code approach using Terraform. The modular project structure, provider configuration, and variable definitions create a solid framework for implementing the specific AWS resources in subsequent days. Tomorrow, I will focus on implementing the networking infrastructure and container registry components, which form the critical foundation for the cloud-based application deployment.

The GitHub repository setup also ensures proper version control and collaboration capabilities as the project progresses. The documentation of design decisions and challenges will serve as valuable reference material throughout the project and for future work.