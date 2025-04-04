variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for the public subnets"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for the private subnets"
  type        = list(string)
}

variable "azs" {
  description = "Availability zones for the subnets"
  type        = list(string)
}

variable "environment" {
  description = "The deployment environment (dev, staging, prod)"
  type        = string
}
