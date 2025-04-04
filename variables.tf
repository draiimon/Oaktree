// Variables for the AWS infrastructure

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

// VPC and Network variables
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

// Application variables
variable "app_names" {
  description = "Names of the applications to deploy"
  type        = list(string)
  default     = ["js-cloud-app"]
}

variable "app_ports" {
  description = "Ports that the applications listen on"
  type        = map(number)
  default     = {
    "js-cloud-app" = 3000
  }
}

variable "container_image" {
  description = "Docker image to use for containers (for testing)"
  type        = string
  default     = "nginx:latest"
}
