resource "aws_s3_bucket" "web_bucket" {
    bucket = local.full_url
}

resource "aws_s3_bucket_policy" "default" {
    bucket = aws_s3_bucket.web_bucket.id
    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [{
            Effect = "Allow"
            Principal = {
                Service = [ "cloudfront.amazonaws.com" ]
            }
            Action = ["s3:GetObject"]
            Resource = ["${aws_s3_bucket.web_bucket.arn}/*"]
            Condition = {
                StringEquals = {
                    "AWS:SourceArn" = aws_cloudfront_distribution.cdn.arn
                }
            }
        }]
    })
}

resource "aws_s3_bucket_public_access_block" "default" {
    bucket = aws_s3_bucket.web_bucket.id

    block_public_acls       = true
    block_public_policy     = true
    ignore_public_acls      = true
    restrict_public_buckets = true
}
