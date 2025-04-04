output "repository_urls" {
  description = "The URLs of the ECR repositories"
  value       = { for idx, repo in aws_ecr_repository.repositories : var.repository_names[idx] => repo.repository_url }
}

output "repository_names" {
  description = "The names of the ECR repositories"
  value       = { for idx, repo in aws_ecr_repository.repositories : var.repository_names[idx] => repo.name }
}
