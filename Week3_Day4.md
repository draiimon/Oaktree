# Week 3: Cloud Services & Infrastructure as Code - Day 4

## Introduction
As I reach day 4 of my cloud infrastructure journey, I'm moving forward with implementing the compute resources for my containerized application. After successfully setting up the networking and container registry components yesterday, today I focused on creating the ECS cluster, service definitions, and load balancer configuration to actually run and expose my application.

## What I Did Today

### ECS Configuration:
- Created ECS cluster with Fargate launch type
- Defined task definition with CPU and memory constraints
- Set up CloudWatch log group for container logging
- Configured ECS service with desired count of tasks

### Load Balancer Implementation:
- Created Application Load Balancer in public subnets
- Set up target groups with health check configuration
- Defined listener for HTTP traffic on port 80
- Integrated load balancer with ECS service

### Security Configuration:
- Implemented security groups for ALB and ECS tasks
- Created IAM roles and policies for ECS task execution
- Applied least privilege principle to all permissions
- Set up service discovery for container communication

### Auto-scaling Configuration:
- Defined scaling policies based on CPU utilization
- Set minimum and maximum capacity limits
- Configured scaling cooldown periods
- Tested auto-scaling configuration

## Resources

### AWS Documentation:
- ECS Task Definition Parameters
- Application Load Balancer Configuration
- IAM Roles for ECS Tasks
- Auto-scaling for ECS Services

### Terraform:
- AWS ECS Resources Documentation
- Load Balancer Module Examples
- IAM Policy Configuration
- Target Group Health Checks

### Container Management:
- ECS vs Kubernetes on AWS
- Fargate Pricing and Optimization
- Container Logging Best Practices

## Challenges & Solutions

### Task Definition JSON:
- **Challenge**: Creating proper container definition JSON within Terraform.
- **Solution**: Used jsonencode function to generate valid JSON format.

### IAM Role Configuration:
- **Challenge**: Understanding the right permissions for ECS tasks.
- **Solution**: Started with AWS managed policies and customized as needed.

### Load Balancer Target Groups:
- **Challenge**: Configuring proper health checks for containers.
- **Solution**: Studied documentation and adjusted path and interval settings.

## Links for Screenshots
- ECS Cluster Configuration: https://console.aws.amazon.com/ecs/home#/clusters
- Load Balancer Setup: https://console.aws.amazon.com/ec2/v2/home#LoadBalancers
- IAM Roles: https://console.aws.amazon.com/iamv2/home#/roles

## Tomorrow's Plan
- Apply the complete infrastructure configuration with terraform apply
- Build and push Docker image to ECR
- Deploy application to ECS
- Test the deployed application
- Document the entire deployment process

## Conclusion
Today was challenging but rewarding as I configured the compute resources and load balancing for my containerized application. The ECS and load balancer configurations will allow my application to run in a scalable and reliable way. I'm learning that proper IAM configuration is crucial for security, and that there are many parameters to consider when setting up containers in the cloud. Tomorrow will be exciting as I actually deploy the infrastructure and application!