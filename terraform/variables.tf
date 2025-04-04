# Variables for AWS Infrastructure
# Week 3: Cloud Infrastructure Project

variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "ap-southeast-1"
}

variable "environment" {
  description = "The deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# VPC and Network variables
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

variable "availability_zones" {
  description = "Availability zones for the subnets"
  type        = list(string)
  default     = ["ap-southeast-1a", "ap-southeast-1b"]
}

# Application variables
variable "app_name" {
  description = "Name of the application to deploy"
  type        = string
  default     = "js-cloud-app"
}

variable "app_port" {
  description = "Port that the application listens on"
  type        = number
  default     = 3000
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
