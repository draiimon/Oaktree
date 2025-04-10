provider "aws" {
  region = var.aws_region
}

# Networking module
module "networking" {
  source = "./modules/networking"

  environment     = var.environment
  vpc_cidr        = var.vpc_cidr
  azs             = var.azs
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  tags = var.tags
}

# ECR module
module "ecr" {
  source = "./modules/ecr"

  environment     = var.environment
  repository_name = var.ecr_repository_name

  tags = var.tags
}

# ECS module
module "ecs" {
  source = "./modules/ecs"

  environment         = var.environment
  ecr_repository_url  = module.ecr.repository_url
  vpc_id              = module.networking.vpc_id
  public_subnet_ids   = module.networking.public_subnet_ids
  private_subnet_ids  = module.networking.private_subnet_ids
  app_port            = var.app_port
  health_check_path   = var.health_check_path
  container_memory    = var.container_memory
  container_cpu       = var.container_cpu
  desired_count       = var.desired_count
  max_count           = var.max_count
  min_count           = var.min_count
  service_name        = var.service_name

  tags = var.tags
}
