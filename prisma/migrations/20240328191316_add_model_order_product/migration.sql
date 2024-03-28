-- CreateTable
CREATE TABLE "orderproduct" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orderproduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orderproduct" ADD CONSTRAINT "orderproduct_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderproduct" ADD CONSTRAINT "orderproduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
