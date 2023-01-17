locals {
    s3_origin_name = "S3-${local.full_url}"
}

resource "aws_cloudfront_origin_access_control" "default" {
    name                              = "${local.full_url}-Access-Control"
    description                       = "Access control for ${local.full_url} assets"
    origin_access_control_origin_type = "s3"
    signing_behavior                  = "always"
    signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "cdn" {
    origin {
        domain_name = aws_s3_bucket.web_bucket.bucket_regional_domain_name
        origin_id = local.s3_origin_name
        origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    }

    enabled             = true
    is_ipv6_enabled     = true
    default_root_object = "index.html"

    aliases = [ local.full_url ]

    viewer_certificate {
        acm_certificate_arn = var.https_cert_arn
        ssl_support_method = "sni-only"
        minimum_protocol_version = "TLSv1.2_2018"
    }

    default_cache_behavior {
        allowed_methods  = ["GET", "HEAD", "OPTIONS"]
        cached_methods   = ["GET", "HEAD"]
        target_origin_id = local.s3_origin_name
        
        forwarded_values {
            query_string = true
            cookies {
                forward = "none"
            }
        }
        viewer_protocol_policy = "redirect-to-https"
        min_ttl = 0
        default_ttl = 3600
        max_ttl = 86400
    }

    tags = {
        terraform = "yes"
    }

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }
}