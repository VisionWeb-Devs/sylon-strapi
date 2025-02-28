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
  })
);
