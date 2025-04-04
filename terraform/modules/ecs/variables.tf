variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (e.g. dev, staging, prod)"
  type        = string
}

variable "app_port" {
  description = "Port on which the application container listens"
  type        = number
}

variable "app_count" {
  description = "Number of application instances to run"
  type        = number
  default     = 2
}

variable "cpu" {
  description = "CPU units for the Fargate task (1024 units = 1 vCPU)"
  type        = number
}

variable "memory" {
  description = "Memory for the Fargate task in MiB"
  type        = number
}

variable "container_name" {
  description = "Name of the container"
  type        = string
}

variable "health_check_path" {
  description = "Path for health checks"
  type        = string
  default     = "/"
}

variable "ecr_repository_url" {
  description = "URL of the ECR repository"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC where resources will be created"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "desired_count" {
  description = "Desired number of tasks"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum number of tasks for autoscaling"
  type        = number
  default     = 2
}
