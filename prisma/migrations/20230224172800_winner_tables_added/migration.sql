-- CreateTable
CREATE TABLE "winner5methusdt" (
    "id" SERIAL NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "createdat" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "winner5methusdt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "winner5mminausdt" (
    "id" SERIAL NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "createdat" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "winner5mminausdt_pkey" PRIMARY KEY ("id")
);
