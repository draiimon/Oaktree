# Outputs for ECS Module
# Week 3: Cloud Infrastructure Project

output "cluster_id" {
  description = "The ID of the ECS cluster"
  value       = aws_ecs_cluster.app.id
}

output "cluster_name" {
  description = "The name of the ECS cluster"
  value       = aws_ecs_cluster.app.name
}

output "service_id" {
  description = "The ID of the ECS service"
  value       = aws_ecs_service.app.id
}

output "service_name" {
  description = "The name of the ECS service"
  value       = aws_ecs_service.app.name
}

output "task_definition_arn" {
  description = "The ARN of the task definition"
  value       = aws_ecs_task_definition.app.arn
}

output "load_balancer_dns" {
  description = "The DNS name of the load balancer"
  value       = aws_lb.app.dns_name
}

output "load_balancer_arn" {
  description = "The ARN of the load balancer"
  value       = aws_lb.app.arn
}

output "target_group_arn" {
  description = "The ARN of the target group"
  value       = aws_lb_target_group.app.arn
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group for the application"
  value       = aws_cloudwatch_log_group.app.name
}

output "security_group_ecs" {
  description = "Security group for ECS tasks"
  value       = aws_security_group.ecs_tasks.id
}

output "security_group_lb" {
  description = "Security group for the load balancer"
  value       = aws_security_group.lb.id
}
