# Week 3: Cloud Services & Infrastructure as Code - Day 1 (March 24, 2025)

## Introduction

Today marks the commencement of Week 3, focusing on Cloud Services and Infrastructure as Code (IaC). The primary objective for this week is to deploy a containerized application on AWS using Terraform for infrastructure management. This documentation chronicles Day 1, where I established foundational knowledge and tools necessary for the project.

## Objectives

- Set up AWS environment and security configurations
- Research appropriate AWS services for container deployment
- Install required development tools
- Understand fundamental cloud architecture concepts

## Accomplishments

### AWS Account Configuration

- Successfully created AWS Free Tier account with root user
- Implemented Multi-Factor Authentication (MFA) for enhanced security
- Created dedicated IAM user with programmatic access for development
- Generated and securely stored access keys following AWS best practices
- Configured appropriate permission policies adhering to principle of least privilege

### AWS Services Research and Selection

After thorough analysis of AWS documentation and comparative study, I selected the following services for the project:

| Service | Purpose | Rationale |
|---------|---------|-----------|
| VPC | Network isolation | Secure environment with public/private subnets |
| ECS | Container orchestration | Native AWS support, simpler than EKS |
| ECR | Container registry | Private, secure storage for Docker images |
| ALB | Load balancing | Seamless traffic distribution to containers |
| CloudWatch | Monitoring | Comprehensive logging and alerting |

I decided on ECS (Elastic Container Service) over EKS (Elastic Kubernetes Service) after careful consideration of the following factors:
- Lower operational complexity
- Native integration with other AWS services
- Cost-effectiveness for smaller workloads
- Sufficient feature set for current project requirements

### Development Environment Setup

- Installed AWS CLI v2 on local development machine
  ```bash
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  sudo ./aws/install
  ```

- Configured AWS CLI with credentials and default region
  ```bash
  aws configure
  # AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
  # AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
  # Default region name [None]: us-east-1
  # Default output format [None]: json
  ```

- Verified AWS CLI configuration with test commands
  ```bash
  aws sts get-caller-identity
  aws ec2 describe-regions
  ```

## Resources & References

### AWS Documentation
- [AWS Free Tier Overview](https://aws.amazon.com/free/)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS CLI Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [Getting Started with Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/getting-started.html)

### Container Technologies
- [AWS Containers Services Overview](https://aws.amazon.com/containers/)
- [Docker Documentation](https://docs.docker.com/)
- [ECS vs EKS Comparison](https://aws.amazon.com/blogs/containers/amazon-ecs-vs-amazon-eks-making-sense-of-aws-container-services/)

### Networking Resources
- [VPC Documentation](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [AWS Networking Fundamentals](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Networking.html)
- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)

### Tutorials & Guides
- [AWS Workshop - ECS Deep Dive](https://ecsworkshop.com/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Skill Builder - Cloud Essentials](https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials)

## Challenges & Solutions

### IAM Permission Management

**Challenge**: 
The AWS Identity and Access Management (IAM) system presents a complex array of permission types, policies, and roles. Determining the appropriate permission set for development purposes while maintaining security was challenging.

**Solution**:
- Started with AWS managed policies for common use cases
- Reviewed AWS IAM security best practices documentation
- Implemented the principle of least privilege by only granting necessary permissions
- Created a dedicated IAM user with programmatic access rather than using root credentials
- Documented all permissions for future reference and refinement

### Container Orchestration Selection

**Challenge**:
Choosing the most appropriate container orchestration service between Amazon ECS and Amazon EKS required careful evaluation of features, complexity, and project requirements.

**Solution**:
- Created comparison matrix of ECS vs EKS features
- Analyzed costs associated with each service
- Considered team expertise and learning curve
- Selected ECS for its simplicity, native AWS integration, and sufficient feature set
- Documented decision rationale for future reference

## Screenshot References

For documentation and reference purposes, I've captured screenshots of key configurations:

1. AWS Management Console: [https://console.aws.amazon.com/console/home](https://console.aws.amazon.com/console/home)
2. IAM User Creation: [https://console.aws.amazon.com/iamv2/home#/users/create](https://console.aws.amazon.com/iamv2/home#/users/create)
3. IAM Security Credentials: [https://console.aws.amazon.com/iamv2/home#/security_credentials](https://console.aws.amazon.com/iamv2/home#/security_credentials)
4. AWS Free Tier Dashboard: [https://console.aws.amazon.com/billing/home#/freetier](https://console.aws.amazon.com/billing/home#/freetier)
5. ECS Service Overview: [https://console.aws.amazon.com/ecs/home](https://console.aws.amazon.com/ecs/home)

## Tomorrow's Plan (March 25)

1. Install and configure Terraform for infrastructure management
2. Study Infrastructure as Code principles and best practices
3. Design the project structure for Terraform configurations
4. Implement initial Terraform files for provider configuration
5. Create modules for networking, container registry, and compute resources
6. Initialize Git repository and push initial code to GitHub

## Conclusion

Day 1 has provided a solid foundation for the Week 3 project on Cloud Services and Infrastructure as Code. By establishing AWS accounts, selecting appropriate services, and setting up the necessary tools, I'm well-positioned to begin implementing infrastructure as code with Terraform tomorrow. This methodical approach to cloud infrastructure will ensure a secure, scalable, and maintainable deployment for the containerized application.

The knowledge gained today about AWS services, IAM security, and containerization principles will be instrumental throughout this week as I progress from planning to implementation and finally to deployment. I look forward to leveraging these insights as I move forward with the project.