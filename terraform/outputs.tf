# Outputs from the Infrastructure
# Week 3: Cloud Infrastructure Project

output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.networking.vpc_id
}

output "public_subnet_ids" {
  description = "The IDs of the public subnets"
  value       = module.networking.public_subnet_ids
}

output "private_subnet_ids" {
  description = "The IDs of the private subnets"
  value       = module.networking.private_subnet_ids
}

output "ecr_repository_url" {
  description = "The URL of the ECR repository"
  value       = module.ecr.repository_url
}

output "ecr_repository_name" {
  description = "The name of the ECR repository"
  value       = module.ecr.repository_name
}

output "load_balancer_dns" {
  description = "The DNS name of the load balancer"
  value       = module.ecs.load_balancer_dns
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group for the application"
  value       = module.ecs.cloudwatch_log_group
}

output "app_url" {
  description = "The URL to access the application"
  value       = "http://${module.ecs.load_balancer_dns}"
}
