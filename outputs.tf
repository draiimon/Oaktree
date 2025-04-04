// Output values from the infrastructure deployment

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

output "ecr_repository_urls" {
  description = "The URLs of the ECR repositories"
  value       = module.ecr.repository_urls
}

output "load_balancer_dns" {
  description = "The DNS name of the load balancer"
  value       = module.ecs.load_balancer_dns
}

output "app_urls" {
  description = "URLs to access the deployed applications"
  value       = {
    for app in var.app_names : app => "http://${module.ecs.load_balancer_dns}:${var.app_ports[app]}"
  }
}