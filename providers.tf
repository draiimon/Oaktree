// Terraform provider configuration

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  required_version = ">= 1.2.0"
}

// Configure the AWS Provider
provider "aws" {
  region = var.aws_region
  
  // Use default profile or environment variables for credentials
  // Skip credential validation to avoid timeouts in the Replit environment
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
}
