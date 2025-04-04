// AWS Cloud Infrastructure with Terraform
// Main configuration file

// VPC and Networking Module
module "networking" {
  source = "./modules/networking"
  
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  azs                  = var.availability_zones
  environment          = var.environment
}

// ECR Module for Container Repositories
module "ecr" {
  source = "./modules/ecr"
  
  repository_names = var.app_names
  environment      = var.environment
}

// ECS Module for Fargate Services
module "ecs" {
  source = "./modules/ecs"
  
  vpc_id                = module.networking.vpc_id
  public_subnet_ids     = module.networking.public_subnet_ids
  private_subnet_ids    = module.networking.private_subnet_ids
  app_names             = var.app_names
  app_ports             = var.app_ports
  container_image       = var.container_image
  environment           = var.environment
  ecr_repository_urls   = module.ecr.repository_urls
}
