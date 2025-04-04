output "cluster_id" {
  description = "The ID of the ECS cluster"
  value       = aws_ecs_cluster.main.id
}

output "cluster_name" {
  description = "The name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "load_balancer_dns" {
  description = "The DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}

output "task_definitions" {
  description = "The ARNs of the task definitions"
  value       = { for app, task in aws_ecs_task_definition.app_task : app => task.arn }
}

output "security_groups" {
  description = "The security groups created"
  value = {
    lb_sg  = aws_security_group.lb_sg.id
    ecs_sg = aws_security_group.ecs_sg.id
  }
}
