resource "aws_s3_bucket" "web_bucket" {
    bucket = local.full_url
    acl = "public-read"

    website {
        index_document = "index.html"
    }

    policy = <<EOF
{
    "Version":"2008-10-17",
    "Statement":[{
        "Sid":"AllowPublicRead",
        "Effect":"Allow",
        "Principal": {"AWS": "*"},
        "Action":["s3:GetObject"],
        "Resource":["arn:aws:s3:::${local.full_url}/*"]
    }]
}
EOF
}