# Variables for ECS Module
# Week 3: Cloud Infrastructure Project

variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "public_subnet_ids" {
  description = "The IDs of the public subnets"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "The IDs of the private subnets"
  type        = list(string)
}

variable "app_name" {
  description = "Name of the application"
  type        = string
}

variable "app_port" {
  description = "Port that the application listens on"
  type        = number
}

variable "ecr_repository_url" {
  description = "URL of the ECR repository"
  type        = string
}

variable "environment" {
  description = "The deployment environment (dev, staging, prod)"
  type        = string
}

variable "cpu" {
  description = "CPU units for the container (1024 = 1 vCPU)"
  type        = number
  default     = 512 # 0.5 vCPU
}

variable "memory" {
  description = "Memory for the container in MB"
  type        = number
  default     = 1024 # 1 GB
}

variable "container_count" {
  description = "Number of containers to run"
  type        = number
  default     = 2
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
