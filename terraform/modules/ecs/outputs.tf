output "alb_hostname" {
  value       = aws_lb.main.dns_name
  description = "ALB DNS name"
}

output "ecs_cluster_name" {
  value       = aws_ecs_cluster.main.name
  description = "Name of the ECS cluster"
}

output "ecs_service_name" {
  value       = aws_ecs_service.app.name
  description = "Name of the ECS service"
}

output "cloudwatch_log_group_name" {
  value       = aws_cloudwatch_log_group.app_logs.name
  description = "Name of the CloudWatch Log Group"
}
