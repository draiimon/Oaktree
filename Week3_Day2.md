# Week 3: Cloud Services & Infrastructure as Code - Day 2 (March 25, 2025)

## Introduction

Building on the AWS account setup and service selection from yesterday, Day 2 focuses on implementing Infrastructure as Code (IaC) principles using Terraform. Today's objective was to install Terraform, understand its core concepts, and establish a well-structured project foundation that will enable efficient infrastructure deployment throughout the week.

## Objectives

- Install and configure Terraform on the development environment
- Understand core Infrastructure as Code concepts and benefits
- Design modular Terraform project structure
- Create initial configuration files and repository setup
- Learn Terraform HCL syntax and AWS provider configuration

## Accomplishments

### Terraform Installation & Setup

- Downloaded and installed Terraform on local development machine
  ```bash
  curl -fsSL https://releases.hashicorp.com/terraform/1.5.7/terraform_1.5.7_linux_amd64.zip -o terraform.zip
  unzip terraform.zip
  sudo mv terraform /usr/local/bin/
  ```

- Verified installation and examined available commands
  ```bash
  terraform --version
  # Terraform v1.5.7
  # on linux_amd64
  ```

- Initialized Terraform environment and tested basic commands
  ```bash
  terraform -help
  terraform init
  terraform validate
  ```

### Infrastructure as Code Concepts & Research

I conducted extensive research on Infrastructure as Code principles and Terraform capabilities:

| Concept | Description | Benefits |
|---------|-------------|----------|
| Declarative Approach | Define desired end-state rather than steps | Consistency, readability |
| Version Control | Track infrastructure changes in Git | History, collaboration, rollback |
| Modularity | Reusable components for infrastructure | Maintainability, standardization |
| State Management | Track deployed resources state | Consistency, change detection |
| Idempotency | Same result regardless of current state | Predictability, safety |

Key advantages of IaC identified for this project:
- Reproducible environments across development, staging, and production
- Self-documenting infrastructure through code
- Ability to test infrastructure changes before applying
- Consistent application deployment process
- Reduced human error through automation

### Project Structure Design

After studying Terraform best practices, I created a comprehensive project structure:

```
Oaktree/
├── app/
│   ├── server.js
│   └── package.json
├── terraform/
│   ├── main.tf          # Primary configuration file
│   ├── variables.tf     # Input variables declaration
│   ├── outputs.tf       # Output values definition
│   ├── providers.tf     # Provider configuration
│   └── modules/
│       ├── networking/  # VPC, subnets, security groups
│       │   ├── main.tf
│       │   ├── variables.tf
│       │   └── outputs.tf
│       ├── ecr/         # Elastic Container Registry
│       │   ├── main.tf
│       │   ├── variables.tf
│       │   └── outputs.tf
│       └── ecs/         # Elastic Container Service
│           ├── main.tf
│           ├── variables.tf
│           └── outputs.tf
└── Dockerfile          # Container definition
```

### Initial Configuration Implementation

Created baseline configuration files:

- **providers.tf** - AWS provider setup with region configuration
  ```hcl
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

- **variables.tf** - Common variables for the infrastructure
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
  ```

- **networking/variables.tf** - Started defining networking parameters
  ```hcl
  variable "vpc_cidr" {
    description = "CIDR block for the VPC"
    type        = string
    default     = "10.0.0.0/16"
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

### Git Repository Setup

- Initialized Git repository for version control
- Created .gitignore file for Terraform-specific patterns
- Configured remote repository on GitHub
- Pushed initial project structure to the repository

```bash
git init
cat > .gitignore << EOF
# Terraform specific
.terraform/
*.tfstate
*.tfstate.backup
*.tfplan
.terraform.lock.hcl
EOF

git add .
git commit -m "Initial project structure with Terraform modules"
git branch -M Week-3
git remote add origin https://github.com/draiimon/Oaktree.git
git push -u origin Week-3
```

## Resources & References

### Terraform Documentation
- [Terraform Getting Started](https://learn.hashicorp.com/collections/terraform/aws-get-started)
- [AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Module Development](https://developer.hashicorp.com/terraform/language/modules/develop)
- [Terraform State Management](https://developer.hashicorp.com/terraform/language/state)

### Infrastructure as Code
- [Infrastructure as Code Best Practices](https://www.terraform-best-practices.com/)
- [Terraform vs CloudFormation](https://www.hashicorp.com/blog/terraform-vs-cloudformation-a-detailed-comparison)
- [HCL Syntax Guide](https://developer.hashicorp.com/terraform/language/syntax/configuration)
- [IaC Security Considerations](https://www.hashicorp.com/resources/securing-infrastructure-as-code)

### AWS Integration
- [AWS Terraform Services Reference](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc)
- [AWS Architecture Center](https://aws.amazon.com/architecture/)
- [ECS Task Definitions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)
- [ECR Repository Management](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-create.html)

### Version Control
- [Git Workflow Best Practices](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [GitHub Repository Management](https://docs.github.com/en/repositories)
- [GitOps for Infrastructure](https://www.weave.works/technologies/gitops/)

## Challenges & Solutions

### Terraform Syntax and Structure

**Challenge**:  
Understanding HashiCorp Configuration Language (HCL) syntax proved challenging, particularly with expressions, functions, and resource references. The declarative nature was different from my procedural programming experience.

**Solution**:  
- Studied the Terraform language documentation extensively
- Created small practice configurations to test syntax concepts
- Used the `terraform fmt` command to ensure proper formatting
- Reviewed existing examples in the AWS provider documentation
- Referenced open-source Terraform modules to understand patterns

### Module Organization

**Challenge**:  
Determining the optimal structure for Terraform modules required balancing between granularity and maintainability. Too many modules would increase complexity, while too few would reduce reusability.

**Solution**:  
- Researched Terraform module best practices
- Analyzed several open-source module structures
- Adopted a service-based approach (networking, ecr, ecs)
- Created consistent variable and output naming conventions
- Documented module interfaces through variables and outputs
- Implemented clear responsibility boundaries for each module

### Provider Configuration

**Challenge**:  
Properly configuring the AWS provider with appropriate authentication, region settings, and tags required understanding the provider ecosystem and authentication mechanisms.

**Solution**:  
- Studied AWS provider documentation for configuration options
- Leveraged AWS CLI credentials for authentication
- Implemented standardized tagging strategy for all resources
- Created variables for region and environment to support multiple deployments
- Tested provider configuration with simple resource creation

## Screenshot References

For documentation and reference purposes, I've captured screenshots of key configurations:

1. Terraform Installation: [Terminal Screenshot](https://replit.com/@user/terminal-terraform-version.png)
2. Project Directory Structure: [VSCode Explorer](https://replit.com/@user/vscode-terraform-structure.png)
3. GitHub Repository: [https://github.com/draiimon/Oaktree/tree/Week-3](https://github.com/draiimon/Oaktree/tree/Week-3)
4. Terraform Init Command: [Terminal Output](https://replit.com/@user/terraform-init-output.png)
5. AWS Provider Configuration: [VSCode Editor](https://replit.com/@user/terraform-aws-provider.png)

## Tomorrow's Plan (March 26)

1. Implement the networking module with VPC, subnets, and gateways
2. Configure security groups for application components
3. Create the ECR repository infrastructure definition
4. Implement IAM roles and policies for service access
5. Validate configurations using terraform validate and plan
6. Create network architecture diagram for documentation

## Conclusion

Day 2 has established a solid foundation for the infrastructure as code implementation. By installing Terraform, understanding its core concepts, and creating a structured project layout, I've prepared for efficient infrastructure development in the coming days. The modular approach will enable greater maintainability and reuse as the project evolves.

The benefits of Infrastructure as Code are becoming increasingly clear as I develop this project. The ability to define, version, test, and deploy infrastructure through code provides tremendous advantages for reliability, reproducibility, and collaboration. Tomorrow, I'll begin implementing the actual AWS resources, starting with the networking components that will form the backbone of the application deployment.