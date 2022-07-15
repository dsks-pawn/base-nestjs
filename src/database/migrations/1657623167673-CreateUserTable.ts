import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1657623167673 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `users` (' +
        '`id` int(11) NOT NULL AUTO_INCREMENT, ' +
        '`phone` varchar(255) DEFAULT NULL, ' +
        '`email` varchar(255) DEFAULT NULL, ' +
        '`role` tinyint NOT NULL DEFAULT 1, ' +
        '`status` tinyint NOT NULL DEFAULT 0, ' +
        '`password` varchar(255) NOT NULL, ' +
        '`email_verified` tinyint(1) DEFAULT 0, ' +
        '`phone_verified` tinyint(1) DEFAULT 0, ' +
        '`user_name` varchar(255) DEFAULT NULL, ' +
        '`first_name` varchar(255) DEFAULT NULL, ' +
        '`last_name` varchar(255) DEFAULT NULL, ' +
        '`avatar` varchar(255) DEFAULT NULL, ' +
        '`about` longtext DEFAULT NULL, ' +
        '`last_login` datetime(6) DEFAULT NULL, ' +
        '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6), ' +
        '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6), ' +
        'PRIMARY KEY (`id`))' +
        'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `users`');
  }
}
