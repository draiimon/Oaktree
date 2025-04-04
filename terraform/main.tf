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
  cpu                   = var.cpu                     # Using 'cpu' instead of 'fargate_cpu'
  memory                = var.memory                  # Using 'memory' instead of 'fargate_memory'
  health_check_path     = var.health_check_path
  ecr_repository_url    = var.ecr_repository_url     # Using the specified ECR URL directly
  container_name        = var.container_name
  
  desired_count         = var.desired_count
  max_capacity          = var.max_capacity           # Using 'max_capacity' instead of 'autoscaling_max_capacity'

  vpc_id                = var.vpc_id                 # Using the specified VPC ID directly
  public_subnet_ids     = var.public_subnet_ids      # Using the specified subnet IDs directly
  private_subnet_ids    = var.private_subnet_ids     # Using the specified subnet IDs directly
}
