# Main Terraform file that calls all modules

# Networking Module
module "networking" {
  source = "./modules/networking"

  project_name          = var.project_name
  environment           = var.environment
  vpc_cidr              = var.vpc_cidr
  public_subnet_cidrs   = var.public_subnet_cidrs
  private_subnet_cidrs  = var.private_subnet_cidrs
  availability_zones    = var.availability_zones
}

# ECR Module
module "ecr" {
  source = "./modules/ecr"

  project_name          = var.project_name
  environment           = var.environment
}

# ECS Module
module "ecs" {
  source = "./modules/ecs"

  project_name          = var.project_name
  environment           = var.environment
  app_port              = var.app_port
  app_count             = var.app_count
  fargate_cpu           = var.fargate_cpu
  fargate_memory        = var.fargate_memory
  health_check_path     = var.health_check_path
  health_check_timeout  = var.health_check_timeout
  health_check_interval = var.health_check_interval
  health_check_matcher  = var.health_check_matcher
  ecr_repository_url    = module.ecr.repository_url
  
  autoscaling_min_capacity = var.autoscaling_min_capacity
  autoscaling_max_capacity = var.autoscaling_max_capacity
  cpu_target_value      = var.cpu_target_value
  memory_target_value   = var.memory_target_value

  vpc_id                = module.networking.vpc_id
  public_subnets        = module.networking.public_subnet_ids
  private_subnets       = module.networking.private_subnet_ids
}
