-- DropForeignKey
ALTER TABLE "UserFavorite" DROP CONSTRAINT "UserFavorite_user_id_fkey";

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
