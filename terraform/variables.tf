# General Variables
variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-southeast-1"
}

variable "environment" {
  description = "Environment name (e.g. dev, staging, prod)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name used for tagging and naming resources"
  type        = string
  default     = "cloud-app-dev"
}

# VPC Variables
variable "vpc_id" {
  description = "ID of the VPC to use"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for the public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for the private subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "public_subnet_ids" {
  description = "IDs of the public subnets"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "IDs of the private subnets"
  type        = list(string)
}

variable "availability_zones" {
  description = "Availability zones for the subnets"
  type        = list(string)
  default     = ["ap-southeast-1a", "ap-southeast-1b"]
}

# ECR Variables
variable "ecr_repository_url" {
  description = "URL of the ECR repository"
  type        = string
}

variable "container_name" {
  description = "Name of the container"
  type        = string
  default     = "cloud-app-dev"
}

# ECS Variables
variable "app_port" {
  description = "Port the application listens on"
  type        = number
  default     = 5000
}

variable "app_count" {
  description = "Number of application containers to run"
  type        = number
  default     = 2
}

variable "cpu" {
  description = "Fargate CPU units (1024 = 1 vCPU)"
  type        = number
  default     = 256
}

variable "memory" {
  description = "Fargate memory in MiB"
  type        = number
  default     = 512
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

variable "health_check_path" {
  description = "Health check path for the application"
  type        = string
  default     = "/"
}

variable "health_check_timeout" {
  description = "Health check timeout in seconds"
  type        = number
  default     = 5
}

variable "health_check_interval" {
  description = "Health check interval in seconds"
  type        = number
  default     = 30
}

variable "health_check_matcher" {
  description = "Health check matcher HTTP code"
  type        = string
  default     = "200"
}

# Tags
variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Terraform   = "true"
    Application = "cloud-app"
    Environment = "production"
  }
}
