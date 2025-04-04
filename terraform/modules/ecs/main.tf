# ECS Module - Fargate Service
# Week 3: Cloud Infrastructure Project

# Create ECS Cluster
resource "aws_ecs_cluster" "app" {
  name = "${var.environment}-${var.app_name}-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  
  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-${var.app_name}-cluster"
    }
  )
}

# Create CloudWatch Log Group
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.environment}-${var.app_name}"
  retention_in_days = 30
  
  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-${var.app_name}-logs"
    }
  )
}

# Create ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.environment}-${var.app_name}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn
  
  container_definitions = jsonencode([
    {
      name      = var.app_name
      image     = "${var.ecr_repository_url}:latest"
      essential = true
      
      portMappings = [
        {
          containerPort = var.app_port
          hostPort      = var.app_port
          protocol      = "tcp"
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app.name
          "awslogs-region"        = "ap-southeast-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
      
      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        },
        {
          name  = "PORT"
          value = tostring(var.app_port)
        }
      ]
    }
  ])
  
  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-${var.app_name}-task"
    }
  )
}

# Create IAM role for ECS task execution
resource "aws_iam_role" "ecs_execution" {
  name = "${var.environment}-${var.app_name}-execution-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
  
  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-${var.app_name}-execution-role"
    }
  )
}

# Attach policies to ECS execution role
resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Create IAM role for ECS task
resource "aws_iam_role" "ecs_task" {
  name = "${var.environment}-${var.app_name}-task-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
  
  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-${var.app_name}-task-role"
    }
  )
}

# Create Security Group for ECS Tasks
resource "aws_security_group" "ecs_tasks" {
  name        = "${var.environment}-${var.app_name}-sg"
  description = "Allow inbound traffic to the app"
  vpc_id      = var.vpc_id
  
  ingress {
    from_port       = var.app_port
    to_port         = var.app_port
    protocol        = "tcp"
    security_groups = [aws_security_group.lb.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-${var.app_name}-sg"
    }
  )
}

# Create Load Balancer Security Group
resource "aws_security_group" "lb" {
  name        = "${var.environment}-${var.app_name}-lb-sg"
  description = "Controls access to the load balancer"
  vpc_id      = var.vpc_id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-${var.app_name}-lb-sg"
    }
  )
}

# Create Application Load Balancer
resource "aws_lb" "app" {
  name               = "${var.environment}-${var.app_name}-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb.id]
  subnets            = var.public_subnet_ids
  
  enable_deletion_protection = false
  
  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-${var.app_name}-lb"
    }
  )
}

# Create ALB Target Group
resource "aws_lb_target_group" "app" {
  name        = "${var.environment}-${var.app_name}-tg"
  port        = var.app_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  
  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
  
  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-${var.app_name}-tg"
    }
  )
}

# Create ALB Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# Create ECS Service
resource "aws_ecs_service" "app" {
  name            = "${var.environment}-${var.app_name}-service"
  cluster         = aws_ecs_cluster.app.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.container_count
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = var.app_name
    container_port   = var.app_port
  }
  
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  health_check_grace_period_seconds  = 60
  
  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-${var.app_name}-service"
    }
  )
  
  # To prevent modifications via the console
  lifecycle {
    ignore_changes = [desired_count]
  }
}

# Create Auto Scaling Target
resource "aws_appautoscaling_target" "app" {
  max_capacity       = 5
  min_capacity       = var.container_count
  resource_id        = "service/${aws_ecs_cluster.app.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# Create Auto Scaling Policies (CPU)
resource "aws_appautoscaling_policy" "cpu" {
  name               = "${var.environment}-${var.app_name}-cpu-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.app.resource_id
  scalable_dimension = aws_appautoscaling_target.app.scalable_dimension
  service_namespace  = aws_appautoscaling_target.app.service_namespace
  
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    
    target_value       = 70
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

# Create Auto Scaling Policies (Memory)
resource "aws_appautoscaling_policy" "memory" {
  name               = "${var.environment}-${var.app_name}-memory-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.app.resource_id
  scalable_dimension = aws_appautoscaling_target.app.scalable_dimension
  service_namespace  = aws_appautoscaling_target.app.service_namespace
  
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    
    target_value       = 70
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
