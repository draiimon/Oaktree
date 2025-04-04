# Main Terraform Configuration File
# Week 3: Cloud Infrastructure Project

# VPC and Networking Module
module "networking" {
  source = "./modules/networking"
  
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  azs                  = var.availability_zones
  environment          = var.environment
  
  tags = {
    Project     = "Week 3: Cloud Services"
    Environment = var.environment
    Terraform   = "true"
  }
}

# ECR Module for Container Registry
module "ecr" {
  source = "./modules/ecr"
  
  repository_name = "${var.app_name}-repo"
  environment     = var.environment
  
  tags = {
    Project     = "Week 3: Cloud Services"
    Environment = var.environment
    Terraform   = "true"
  }
}

# ECS Module for Fargate Service
module "ecs" {
  source = "./modules/ecs"
  
  vpc_id                = module.networking.vpc_id
  public_subnet_ids     = module.networking.public_subnet_ids
  private_subnet_ids    = module.networking.private_subnet_ids
  app_name              = var.app_name
  app_port              = var.app_port
  ecr_repository_url    = module.ecr.repository_url
  environment           = var.environment
  cpu                   = var.cpu
  memory                = var.memory
  container_count       = var.container_count
  
  tags = {
    Project     = "Week 3: Cloud Services"
    Environment = var.environment
    Terraform   = "true"
  }
}
