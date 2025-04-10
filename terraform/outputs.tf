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
  description = "URL of the ECR repository"
  value       = module.ecr.repository_url
}

output "ecr_repository_name" {
  description = "Name of the ECR repository"
  value       = module.ecr.repository_name
}

output "app_url" {
  description = "URL of the application load balancer"
  value       = module.ecs.app_url
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.ecs_cluster_name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = module.ecs.ecs_service_name
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  value       = aws_dynamodb_table.oaktree_users.name
}

output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.oaktree_users.id
}

output "cognito_app_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.oaktree_client.id
}