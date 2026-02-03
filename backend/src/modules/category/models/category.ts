import { model } from "@medusajs/framework/utils"

const Category = model
  .define("category", {
    id: model.id().primaryKey(),
    name: model.text(),
    slug: model.text(),
    parent: model.belongsTo(() => Category, { mappedBy: "children" }).nullable(),
    children: model.hasMany(() => Category, { mappedBy: "parent" }),
  })
  .cascades({ delete: ["children"] })

export default Category
