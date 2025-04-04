output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.networking.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.networking.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.networking.private_subnet_ids
}

output "repository_url" {
  description = "The URL of the ECR repository"
  value       = module.ecr.repository_url
}

output "repository_name" {
  description = "The name of the ECR repository"
  value       = module.ecr.repository_name
}

output "cluster_name" {
  description = "The name of the ECS cluster"
  value       = module.ecs.cluster_name
}

output "service_name" {
  description = "The name of the ECS service"
  value       = module.ecs.service_name
}

output "task_definition_arn" {
  description = "The ARN of the task definition"
  value       = module.ecs.task_definition_arn
}

output "alb_dns_name" {
  description = "The DNS name of the load balancer"
  value       = module.ecs.alb_dns_name
}

output "app_url" {
  description = "The URL of the application"
  value       = "http://${module.ecs.alb_dns_name}"
}
