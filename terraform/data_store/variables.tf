variable "website_name" {
    type = string
}

variable "data_bucket_arn" {
    type = string
    description = "bucket which is meant to store a data entry"
}

variable "iam_user_name" {
    type = string
}
variable "file_name" {
    type = string
}
