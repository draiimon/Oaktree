variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "IDs of the public subnets"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "IDs of the private subnets"
  type        = list(string)
}

variable "app_port" {
  description = "Port exposed by the docker container"
  type        = number
}

variable "app_count" {
  description = "Number of docker containers to run"
  type        = number
}

variable "cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  type        = number
}

variable "memory" {
  description = "Fargate instance memory to provision (in MiB)"
  type        = number
}

variable "desired_count" {
  description = "Desired number of tasks"
  type        = number
}

variable "max_capacity" {
  description = "Maximum number of tasks for autoscaling"
  type        = number
}

variable "health_check_path" {
  description = "Path for health check"
  type        = string
}

variable "ecr_repository_url" {
  description = "URL of the ECR repository"
  type        = string
}

variable "container_name" {
  description = "Name of the container"
  type        = string
}
