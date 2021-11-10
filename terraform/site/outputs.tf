output "route53_domain" {
    value = aws_route53_record.r53_A.fqdn
}

output "s3_bucket_id" {
    value = aws_s3_bucket.web_bucket.id
}