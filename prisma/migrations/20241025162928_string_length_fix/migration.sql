-- AlterTable
ALTER TABLE `challenges` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `issues` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `resources` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `solutions` MODIFY `code` TEXT NOT NULL;
