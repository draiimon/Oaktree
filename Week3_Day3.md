# Week 3: Cloud Services & Infrastructure as Code - Day 3 (March 26, 2025)

## Introduction

Having established the project foundation and Terraform setup on Day 2, today I focused on implementing the core networking infrastructure and container registry components. These elements form the critical foundation for a secure, scalable cloud deployment. The networking layer provides isolation and controlled access, while the container registry offers a secure repository for application images.

## Objectives

- Design and implement VPC architecture with public/private subnets
- Configure internet and NAT gateways for appropriate access
- Set up route tables and network ACLs for traffic control
- Create ECR repository with security and lifecycle policies
- Validate all infrastructure configurations before deployment

## Accomplishments

### VPC & Networking Implementation

Implemented comprehensive networking infrastructure with security and availability in mind:

- Created VPC configuration with appropriate CIDR allocation
  ```hcl
  resource "aws_vpc" "main" {
    cidr_block           = var.vpc_cidr
    enable_dns_support   = true
    enable_dns_hostnames = true
    
    tags = {
      Name        = "${var.environment}-vpc"
      Environment = var.environment
    }
  }
  ```

- Configured public and private subnets across multiple availability zones
  ```hcl
  resource "aws_subnet" "public" {
    count                   = length(var.public_subnets)
    vpc_id                  = aws_vpc.main.id
    cidr_block              = var.public_subnets[count.index]
    availability_zone       = var.availability_zones[count.index]
    map_public_ip_on_launch = true
    
    tags = {
      Name        = "${var.environment}-public-subnet-${count.index + 1}"
      Environment = var.environment
    }
  }

  resource "aws_subnet" "private" {
    count                   = length(var.private_subnets)
    vpc_id                  = aws_vpc.main.id
    cidr_block              = var.private_subnets[count.index]
    availability_zone       = var.availability_zones[count.index]
    
    tags = {
      Name        = "${var.environment}-private-subnet-${count.index + 1}"
      Environment = var.environment
    }
  }
  ```

- Implemented Internet Gateway for public internet access
  ```hcl
  resource "aws_internet_gateway" "main" {
    vpc_id = aws_vpc.main.id
    
    tags = {
      Name        = "${var.environment}-igw"
      Environment = var.environment
    }
  }
  ```

- Set up NAT Gateway with Elastic IP for private subnet outbound traffic
  ```hcl
  resource "aws_eip" "nat" {
    domain = "vpc"
    tags = {
      Name        = "${var.environment}-nat-eip"
      Environment = var.environment
    }
  }

  resource "aws_nat_gateway" "main" {
    allocation_id = aws_eip.nat.id
    subnet_id     = aws_subnet.public[0].id
    depends_on    = [aws_internet_gateway.main]
    
    tags = {
      Name        = "${var.environment}-nat"
      Environment = var.environment
    }
  }
  ```

- Configured route tables for proper traffic flow
  ```hcl
  resource "aws_route_table" "public" {
    vpc_id = aws_vpc.main.id
    
    route {
      cidr_block = "0.0.0.0/0"
      gateway_id = aws_internet_gateway.main.id
    }
    
    tags = {
      Name        = "${var.environment}-public-route-table"
      Environment = var.environment
    }
  }

  resource "aws_route_table" "private" {
    vpc_id = aws_vpc.main.id
    
    route {
      cidr_block     = "0.0.0.0/0"
      nat_gateway_id = aws_nat_gateway.main.id
    }
    
    tags = {
      Name        = "${var.environment}-private-route-table"
      Environment = var.environment
    }
  }
  ```

- Created appropriate route table associations
  ```hcl
  resource "aws_route_table_association" "public" {
    count          = length(var.public_subnets)
    subnet_id      = aws_subnet.public[count.index].id
    route_table_id = aws_route_table.public.id
  }

  resource "aws_route_table_association" "private" {
    count          = length(var.private_subnets)
    subnet_id      = aws_subnet.private[count.index].id
    route_table_id = aws_route_table.private.id
  }
  ```

### Container Registry Implementation

Configured the Elastic Container Registry (ECR) with security and lifecycle management:

- Created ECR repository with appropriate configurations
  ```hcl
  resource "aws_ecr_repository" "main" {
    name                 = var.repository_name
    image_tag_mutability = "MUTABLE"
    
    image_scanning_configuration {
      scan_on_push = true
    }
    
    tags = {
      Name        = var.repository_name
      Environment = var.environment
    }
  }
  ```

- Implemented lifecycle policy to manage image versions and cleanup
  ```hcl
  resource "aws_ecr_lifecycle_policy" "main" {
    repository = aws_ecr_repository.main.name
    
    policy = jsonencode({
      rules = [{
        rulePriority = 1
        description  = "Keep last 5 images"
        selection = {
          tagStatus     = "any"
          countType     = "imageCountMoreThan"
          countNumber   = 5
        }
        action = {
          type = "expire"
        }
      }]
    })
  }
  ```

- Added repository policy for access control
  ```hcl
  resource "aws_ecr_repository_policy" "main" {
    repository = aws_ecr_repository.main.name
    
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Sid       = "AllowPushPull"
          Effect    = "Allow"
          Principal = {
            AWS = "arn:aws:iam::${var.aws_account_id}:root"
          }
          Action = [
            "ecr:GetDownloadUrlForLayer",
            "ecr:BatchGetImage",
            "ecr:BatchCheckLayerAvailability",
            "ecr:PutImage",
            "ecr:InitiateLayerUpload",
            "ecr:UploadLayerPart",
            "ecr:CompleteLayerUpload"
          ]
        }
      ]
    })
  }
  ```

### Network Architecture Design

- Created a comprehensive network diagram using LucidChart
- Documented subnet CIDR allocations and routing configurations
- Planned security group rules based on application requirements
- Designed for high availability with multi-AZ deployment

### Validation & Planning

- Validated Terraform configurations
  ```bash
  terraform validate
  terraform plan
  ```

- Analyzed plan output to ensure expected resource creation
- Documented dependencies between resources
- Researched AWS best practices for security groups and NACLs

## Resources & References

### AWS Networking
- [VPC Design Best Practices](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-best-practices.html)
- [NAT Gateway vs NAT Instance Comparison](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-comparison.html)
- [Transit Gateway Documentation](https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html)
- [VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html)
- [VPC Peering](https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html)

### Container Registry
- [ECR Repository Management](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-create.html)
- [ECR Image Scanning](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html)
- [ECR Lifecycle Policies](https://docs.aws.amazon.com/AmazonECR/latest/userguide/lifecycle_policy.html)
- [ECR Repository Policies](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-policies.html)
- [ECR Private vs Public Repositories](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-policy-examples.html)

### Terraform Configuration
- [AWS VPC Terraform Resources](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc)
- [Terraform Resource Dependencies](https://developer.hashicorp.com/terraform/language/resources/behavior)
- [Using count with Terraform](https://developer.hashicorp.com/terraform/language/meta-arguments/count)
- [Terraform Dynamic Blocks](https://developer.hashicorp.com/terraform/language/expressions/dynamic-blocks)
- [Terraform AWS Modules](https://registry.terraform.io/namespaces/terraform-aws-modules)

### Network Design
- [CIDR Block Calculation Guide](https://cidr.xyz/)
- [Multi-AZ Architecture Patterns](https://aws.amazon.com/blogs/architecture/tag/high-availability/)
- [AWS Network Security Best Practices](https://aws.amazon.com/answers/networking/aws-single-vpc-design/)
- [AWS Security Group Best Practices](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html)

## Challenges & Solutions

### CIDR Block Allocation

**Challenge**:  
Designing an appropriate CIDR allocation strategy for VPC and subnets proved challenging. I needed to ensure sufficient IP address space for all resources while avoiding wasteful allocation, and plan for potential future expansion.

**Solution**:  
- Created a detailed IP address allocation plan document
- Used the CIDR.xyz tool to visualize subnet ranges
- Allocated 10.0.0.0/16 for VPC with proper subdivision
- Implemented consistent naming conventions for all subnets
- Reserved specific CIDR blocks for potential future services
- Documented subnet purpose and allocation in comments

### NAT Gateway Configuration

**Challenge**:  
Setting up the NAT Gateway required understanding the proper sequence of resource creation, dependencies, and ensuring proper routing from private subnets. Additionally, I needed to balance cost and availability.

**Solution**:  
- Researched NAT Gateway pricing and capabilities thoroughly
- Implemented explicit resource dependencies using `depends_on`
- Created a single NAT Gateway in a public subnet for cost control
- Configured Elastic IP allocation for consistent addressing
- Set up proper route table associations for private subnet traffic
- Added detailed comments explaining the NAT Gateway configuration

### Security Group Design

**Challenge**:  
Creating security groups that properly protect resources while allowing necessary traffic required in-depth understanding of application communication patterns and AWS security concepts.

**Solution**:  
- Developed a comprehensive security model document
- Created granular security groups based on service function
- Followed the principle of least privilege for all rules
- Used security group references instead of CIDR blocks where possible
- Implemented proper egress rules to restrict unnecessary outbound traffic
- Documented the purpose of each security group and rule

## Screenshot References

For documentation and reference purposes, I've captured screenshots of key configurations:

1. VPC Configuration: [https://console.aws.amazon.com/vpc/home](https://console.aws.amazon.com/vpc/home)
2. Subnet Layout: [https://console.aws.amazon.com/vpc/home#subnets](https://console.aws.amazon.com/vpc/home#subnets)
3. NAT Gateway Setup: [https://console.aws.amazon.com/vpc/home#NatGateways](https://console.aws.amazon.com/vpc/home#NatGateways)
4. Route Tables: [https://console.aws.amazon.com/vpc/home#RouteTables](https://console.aws.amazon.com/vpc/home#RouteTables)
5. ECR Repository: [https://console.aws.amazon.com/ecr/repositories](https://console.aws.amazon.com/ecr/repositories)
6. Network Diagram: [LucidChart Network Architecture](https://lucid.app/network-architecture-diagram)

## Tomorrow's Plan (March 27)

1. Implement ECS cluster configuration with Fargate launch type
2. Create task definitions with appropriate CPU and memory allocations
3. Configure ECS service with desired count and deployment parameters
4. Set up Application Load Balancer with target groups and listeners
5. Implement auto-scaling policies for the ECS service
6. Create CloudWatch log groups for container logging
7. Integrate all components in the main Terraform configuration

## Conclusion

Day 3 has been highly productive with the successful implementation of the networking and container registry components of our infrastructure. The VPC architecture with public and private subnets provides a secure foundation for our containerized application, while the ECR repository ensures our container images are stored securely with proper lifecycle management.

The networking configuration, with its carefully designed CIDR allocations, routing tables, and gateways, embodies the security and availability principles essential for cloud deployments. Tomorrow, I'll build upon this foundation by implementing the compute resources that will actually run our containerized application.