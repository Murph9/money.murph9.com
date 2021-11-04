module.exports = {
  siteMetadata: {
    siteUrl: "https://money.murph9.com",
    title: "Money But Daily",
    description: `my money, go away`,
    author: `@murph9`,
    awsInfo: {
      bucketName: `murph9-data`,
      region: `ap-southeast-2`,
      fileName: `moneyButDaily.json`
    }
  },
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        background_color: `#f7f0eb`,
        start_url: `/`,
        icon: `src/images/favicon.png`
      }
    }
  ],
};
