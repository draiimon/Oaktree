variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "azs" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnets" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets" {
  description = "Private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "ecr_repository_name" {
  description = "Name of the ECR repository"
  type        = string
  default     = "cloud-app-dashboard"
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
  default     = "cloud-app-dashboard-service"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {
    Project     = "cloud-app-dashboard"
    Environment = "dev"
    Terraform   = "true"
  }
}
