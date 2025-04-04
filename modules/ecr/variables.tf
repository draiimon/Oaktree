variable "repository_names" {
  description = "Names of the ECR repositories to create"
  type        = list(string)
}

variable "environment" {
  description = "The deployment environment (dev, staging, prod)"
  type        = string
}
