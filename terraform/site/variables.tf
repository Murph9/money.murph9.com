variable "root_domain" {
    type = string
    description = "root domain where this sub domain goes"
}

variable "sub_domain" {
    type = string
    description = "xxxxxxx.domain.com the xxxxx part which is also the s3 bucket name and url it gets"
}

variable "https_cert_arn" {
    type = string
    description = "ssl cert for the cloudfront dist"
}

locals {
    full_url = "${var.sub_domain}.${var.root_domain}"
}
