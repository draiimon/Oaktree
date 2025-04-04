# ECR Module - Container Registry
# Week 3: Cloud Infrastructure Project

# Create ECR Repository
resource "aws_ecr_repository" "app" {
  name                 = var.repository_name
  image_tag_mutability = "MUTABLE"
  
  image_scanning_configuration {
    scan_on_push = true
  }
  
  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-${var.repository_name}"
    }
  )
}

# Create ECR Repository Policy
resource "aws_ecr_repository_policy" "app" {
  repository = aws_ecr_repository.app.name
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowPushPull"
        Effect    = "Allow"
        Principal = {
          "AWS" = "*" # In production, limit this to specific roles/users
        }
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
      }
    ]
  })
}

# Create ECR Lifecycle Policy for Image Management
resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name
  
  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep only the last 5 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 5
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}
