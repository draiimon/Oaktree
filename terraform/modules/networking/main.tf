# Networking Module
# Note: We're using existing VPC and subnets, so this module primarily provides outputs
# of the existing infrastructure for other modules to use

# Use data sources to fetch information about existing infrastructure
data "aws_vpc" "existing" {
  id = var.vpc_id
}

data "aws_subnets" "public" {
  filter {
    name   = "vpc-id"
    values = [var.vpc_id]
  }

  filter {
    name   = "subnet-id"
    values = var.public_subnet_ids
  }
}

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [var.vpc_id]
  }

  filter {
    name   = "subnet-id"
    values = var.private_subnet_ids
  }
}

# The module doesn't create resources, but provides outputs for other modules
