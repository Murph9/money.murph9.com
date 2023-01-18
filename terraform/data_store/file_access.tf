resource "aws_iam_user" "data_access" {
  name = var.iam_user_name
}

resource "aws_iam_access_key" "key" {
  user = aws_iam_user.data_access.name
}

resource "aws_iam_user_policy" "policy" {
  name = "AccessTo-${var.website_name}-DataFile"
  user = aws_iam_user.data_access.name

  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ],
        "Resource": [
          var.data_bucket_arn,
          "${var.data_bucket_arn}/${var.website_name}/${var.file_name}"
        ]
      }
    ]
  })
}
