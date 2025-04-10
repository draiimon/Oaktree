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

# DynamoDB table for users - retained from original implementation
resource "aws_dynamodb_table" "oaktree_users" {
  name           = "OakTreeUsers"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "username"

  attribute {
    name = "username"
    type = "S"
  }

  tags = {
    Name        = "OakTreeUsers"
    Environment = var.environment
    Project     = "OakTree"
  }
}

# Cognito User Pool - retained from original implementation
resource "aws_cognito_user_pool" "oaktree_users" {
  name = "oaktree-user-pool-${var.environment}"

  username_attributes      = ["email"]
  auto_verify_attributes   = ["email"]
  
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }

  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = true
  }

  schema {
    attribute_data_type = "String"
    name                = "name"
    required            = false
    mutable             = true
  }

  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}

# Cognito User Pool Client - retained from original implementation
resource "aws_cognito_user_pool_client" "oaktree_client" {
  name                = "oaktree-app-client"
  user_pool_id        = aws_cognito_user_pool.oaktree_users.id
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
  
  prevent_user_existence_errors = "ENABLED"
  access_token_validity        = 24
  refresh_token_validity       = 30
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