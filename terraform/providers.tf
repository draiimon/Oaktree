# Provider Configuration
# Week 3: Cloud Infrastructure Project

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  required_version = ">= 1.2.0"
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
  
  # For local development without actual AWS credentials
  # Remove these in production
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
}
