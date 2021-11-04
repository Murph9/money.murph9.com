# money.murph9.com

A Gatsby/React statically generated site
Deployed to an AWS S3 bucket, with user auth to another S3 bucket file for the data

---

## Environment Setup:

* install gatsby and node https://www.gatsbyjs.org/tutorial/part-zero/
`npm install -g gatsby-cli`

* install the aws cli https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-config

---

## Useful commands (including running the project and deploying to AWS S3)
```
project root> npm install
project root> gatsby develop

project root> gatsby build
project root> aws s3 sync public/. s3://money.murph9.com --delete
```

---

https://www.gatsbyjs.org/docs/deploying-to-s3-cloudfront/

Full documentation for Gatsby lives [on the website](https://www.gatsbyjs.org/). Here are some places to start:
- **For most developers, we recommend starting with our [in-depth tutorial for creating a site with Gatsby](https://www.gatsbyjs.org/tutorial/).** It starts with zero assumptions about your level of ability and walks through every step of the process.
- **To dive straight into code samples, head [to our documentation](https://www.gatsbyjs.org/docs/).** In particular, check out the _Guides_, _API Reference_, and _Advanced Tutorials_ sections in the sidebar.
