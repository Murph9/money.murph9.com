terraform {
    required_version = ">= 1.0"
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 4.0"
        }
    }
}

provider "aws" {
    region = "ap-southeast-2"
    profile = "default"
}

data "aws_region" "current" {}

module "site" {
    source = "./site"

    sub_domain = "money"
    root_domain = "murph9.com"
    https_cert_arn = "arn:aws:acm:us-east-1:331595486750:certificate/5caf0062-64fb-43be-90d2-4e73ed3f5ba9"
}

output "website_link" {
    value = "https://${module.site.route53_domain}"
}