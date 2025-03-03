/**
 * product controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { slug } = ctx.params;

      //   Get all attributes reltion fields
      //   const model = strapi.contentType("api::product.product");
      //   const allRelations = Object.keys(model.attributes).filter(
      //     (key) => model.attributes[key].type === "relation"
      //   );

      const response = await strapi.db.query("api::product.product").findOne({
        where: { slug },
        populate: {
          categories: true,
          thumbnail: true,
          variants: {
            populate: {
              images: true,
              colors: true,
            },
          },
        },
        // populate: {
        //   ...allRelations.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        //   thumbnail: true,
        // },
      });
      if (!response) {
        return ctx.notFound();
      }

      return response;
    },
    async findVariant(ctx) {
      const { slug, sku } = ctx.params;

      const slugs = slug.split(",");
      const skus = sku.split(",");

      if (slugs.length < 1 || skus.length < 1) {
        return ctx.badRequest();
      }

      const products = [];

      for (let i = 0; i < slugs.length; i++) {
        const response = await strapi.db.query("api::product.product").findOne({
          where: { slug: slugs[i] },
          populate: {
            variants: {
              where: { sku: skus[i] },
              populate: {
                images: true,
                colors: true,
              },
            },
          },
        });
        if (!response) {
          return ctx.notFound();
        }
        products.push(response);
      }

      return products;
    },
  })
);
