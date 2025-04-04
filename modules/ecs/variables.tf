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

variable "app_names" {
  description = "Names of the applications to deploy"
  type        = list(string)
}

variable "app_ports" {
  description = "Ports that the applications listen on"
  type        = map(number)
}

variable "container_image" {
  description = "Docker image to use for containers"
  type        = string
}

variable "environment" {
  description = "The deployment environment (dev, staging, prod)"
  type        = string
}

variable "ecr_repository_urls" {
  description = "The URLs of the ECR repositories"
  type        = map(string)
}
