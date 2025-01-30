provider "aws" {
  region = "us-east-1"  # Set to your desired region
}

# Data sources to use the default VPC and subnet
data "aws_vpc" "default" {
  default = true
}

data "aws_subnet" "default" {
  vpc_id            = data.aws_vpc.default.id
  availability_zone = "us-east-1a"  # Replace with your desired AZ
}

# Security Group to allow inbound traffic on port 80 (HTTP)
resource "aws_security_group" "game_server_sg" {
  name_prefix = "game-server-sg-"

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow access from anywhere
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"  # Allow all outbound traffic
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance to run Docker container in the default VPC
resource "aws_instance" "game_server" {
  ami           = "ami-014d544cfef21b42d"  # Amazon Linux 2 AMI for us-east-1 (adjust for your region)
  instance_type = "t2.micro"  # You can adjust the instance type
  subnet_id     = data.aws_subnet.default.id  # Use the default subnet

  # Explicitly assign the custom security group by ID
  vpc_security_group_ids = [aws_security_group.game_server_sg.id]  # Use vpc_security_group_ids for security group by ID

  # User data to install Docker and run the container on startup
  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y docker
              service docker start
              docker pull danpuz7/spacedodge-game:latest  # Replace with your Docker Hub image
              docker run -d -p 8080:80 danpuz7/spacedodge-game:latest  # Adjust if using a different port
              EOF

  tags = {
    Name = "GameServerInstance"
  }
}

# Output the public IP of the EC2 instance
output "public_ip" {
  value = aws_instance.game_server.public_ip
}
