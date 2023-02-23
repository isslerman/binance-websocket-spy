-- CreateTable
CREATE TABLE "tradeETHUSDT" (
    "id" SERIAL NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "quantityTotal" DECIMAL(65,30) NOT NULL,
    "side" TEXT NOT NULL,
    "contractsPS" DECIMAL(65,30) NOT NULL,
    "buyers" DECIMAL(65,30) NOT NULL,
    "buyersPS" DECIMAL(65,30) NOT NULL,
    "sellers" DECIMAL(65,30) NOT NULL,
    "sellersPS" DECIMAL(65,30) NOT NULL,
    "winner" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tradeETHUSDT_pkey" PRIMARY KEY ("id")
);
