// ECS Module
// Creates ECS Cluster, Task Definitions, and Services with Load Balancer

// Create Security Group for Load Balancer
resource "aws_security_group" "lb_sg" {
  name        = "${var.environment}-lb-sg"
  description = "Security group for load balancer"
  vpc_id      = var.vpc_id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name        = "${var.environment}-lb-sg"
    Environment = var.environment
  }
}

// Create Security Group for ECS Tasks
resource "aws_security_group" "ecs_sg" {
  name        = "${var.environment}-ecs-sg"
  description = "Security group for ECS tasks"
  vpc_id      = var.vpc_id
  
  dynamic "ingress" {
    for_each = var.app_ports
    content {
      from_port       = ingress.value
      to_port         = ingress.value
      protocol        = "tcp"
      security_groups = [aws_security_group.lb_sg.id]
    }
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name        = "${var.environment}-ecs-sg"
    Environment = var.environment
  }
}

// Create Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb_sg.id]
  subnets            = var.public_subnet_ids
  
  enable_deletion_protection = false
  
  tags = {
    Name        = "${var.environment}-alb"
    Environment = var.environment
  }
}

// Create Target Groups for each application
resource "aws_lb_target_group" "app_tg" {
  for_each = { for app in var.app_names : app => var.app_ports[app] }
  
  name     = "${var.environment}-${each.key}-tg"
  port     = each.value
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  target_type = "ip"
  
  health_check {
    enabled             = true
    interval            = 30
    path                = "/health"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    protocol            = "HTTP"
    matcher             = "200"
  }
  
  tags = {
    Name        = "${var.environment}-${each.key}-tg"
    Environment = var.environment
  }
}

// Create Listeners for the Load Balancer
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg[var.app_names[0]].arn
  }
}

// Create additional listener rules for each application
resource "aws_lb_listener_rule" "app_rules" {
  count        = length(var.app_names) - 1
  listener_arn = aws_lb_listener.http.arn
  priority     = 100 + count.index
  
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg[var.app_names[count.index + 1]].arn
  }
  
  condition {
    path_pattern {
      values = ["/${var.app_names[count.index + 1]}/*"]
    }
  }
}

// Create CloudWatch Log Group
resource "aws_cloudwatch_log_group" "app_logs" {
  for_each = toset(var.app_names)
  
  name              = "/ecs/${var.environment}-${each.value}"
  retention_in_days = 30
  
  tags = {
    Name        = "${var.environment}-${each.value}-logs"
    Environment = var.environment
  }
}

// Create ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.environment}-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  
  tags = {
    Name        = "${var.environment}-cluster"
    Environment = var.environment
  }
}

// Create IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.environment}-ecs-execution-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
  
  tags = {
    Name        = "${var.environment}-ecs-execution-role"
    Environment = var.environment
  }
}

// Attach policies to the IAM Role
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

// Create Task Definitions for each application
resource "aws_ecs_task_definition" "app_task" {
  for_each = { for app in var.app_names : app => var.app_ports[app] }
  
  family                   = "${var.environment}-${each.key}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  
  container_definitions = jsonencode([{
    name      = each.key
    image     = lookup(var.ecr_repository_urls, each.key, var.container_image)
    essential = true
    
    portMappings = [{
      containerPort = each.value
      hostPort      = each.value
      protocol      = "tcp"
    }]
    
    environment = [
      { name = "APP_ENV", value = var.environment },
      { name = "PORT", value = tostring(each.value) }
    ]
    
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/${var.environment}-${each.key}"
        "awslogs-region"        = "ap-southeast-1"
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
  
  tags = {
    Name        = "${var.environment}-${each.key}-task"
    Environment = var.environment
  }
}

// Create ECS Services for each application
resource "aws_ecs_service" "app_service" {
  for_each = { for app in var.app_names : app => var.app_ports[app] }
  
  name            = "${var.environment}-${each.key}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app_task[each.key].arn
  launch_type     = "FARGATE"
  desired_count   = 1
  
  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.app_tg[each.key].arn
    container_name   = each.key
    container_port   = each.value
  }
  
  depends_on = [
    aws_lb_listener.http
  ]
  
  tags = {
    Name        = "${var.environment}-${each.key}-service"
    Environment = var.environment
  }
}
