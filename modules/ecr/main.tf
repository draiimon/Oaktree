// ECR Module
// Creates ECR repositories for each application

// Create ECR Repositories
resource "aws_ecr_repository" "repositories" {
  count = length(var.repository_names)
  name  = "${var.environment}-${var.repository_names[count.index]}"
  
  image_scanning_configuration {
    scan_on_push = true
  }
  
  force_delete = true
  
  tags = {
    Name        = "${var.environment}-${var.repository_names[count.index]}"
    Environment = var.environment
  }
}

// Add Lifecycle Policy to ECR Repositories
resource "aws_ecr_lifecycle_policy" "policy" {
  count      = length(var.repository_names)
  repository = aws_ecr_repository.repositories[count.index].name
  
  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep only the 5 most recent images"
      selection = {
        tagStatus     = "any"
        countType     = "imageCountMoreThan"
        countNumber   = 5
      }
      action = {
        type = "expire"
      }
    }]
  })
}
