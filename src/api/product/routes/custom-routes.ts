export default {
  routes: [
    {
      method: "GET",
      path: "/products/:slug",
      handler: "product.findOne",
    },
    {
      method: "GET",
      path: "/products/:slug/:sku",
      handler: "product.findVariant",
      config: {
        auth: false,
      },
    },
  ],
};
