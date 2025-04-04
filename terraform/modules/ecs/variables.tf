variable "environment" {
  description = "The environment (dev, staging, prod)"
  type        = string
}

variable "ecr_repository_url" {
  description = "URL of the ECR repository"
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "public_subnet_ids" {
  description = "IDs of public subnets"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "IDs of private subnets"
  type        = list(string)
}

variable "app_port" {
  description = "Port the app runs on"
  type        = number
  default     = 3000
}

variable "health_check_path" {
  description = "Health check path for the load balancer"
  type        = string
  default     = "/"
}

variable "container_memory" {
  description = "Container memory in MiB"
  type        = number
  default     = 512
}

variable "container_cpu" {
  description = "Container CPU units"
  type        = number
  default     = 256
}

variable "desired_count" {
  description = "Desired number of containers"
  type        = number
  default     = 2
}

variable "max_count" {
  description = "Maximum number of containers"
  type        = number
  default     = 4
}

variable "min_count" {
  description = "Minimum number of containers"
  type        = number
  default     = 1
}

variable "service_name" {
  description = "Name of the ECS service"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
