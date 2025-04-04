output "vpc_id" {
  description = "ID of the VPC"
  value       = var.vpc_id
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = var.vpc_cidr
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = var.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = var.private_subnet_ids
}

output "availability_zones" {
  description = "List of availability zones"
  value       = var.availability_zones
}
