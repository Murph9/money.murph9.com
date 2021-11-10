data "aws_route53_zone" "main" {
    name = "${var.root_domain}."
    private_zone = false
}

resource "aws_route53_record" "r53_A" {
    name = local.full_url
    type = "A"
    zone_id = data.aws_route53_zone.main.zone_id

    alias {
        name = aws_cloudfront_distribution.cdn.domain_name
        zone_id = aws_cloudfront_distribution.cdn.hosted_zone_id
        evaluate_target_health = false
    }
}

resource "aws_route53_record" "r53_AAAA" {
    name = local.full_url
    type = "AAAA"
    zone_id = data.aws_route53_zone.main.zone_id

    alias {
        name = aws_cloudfront_distribution.cdn.domain_name
        zone_id = aws_cloudfront_distribution.cdn.hosted_zone_id
        evaluate_target_health = false
    }
}
