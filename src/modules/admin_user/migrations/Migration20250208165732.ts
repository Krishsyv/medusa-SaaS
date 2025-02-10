import { Migration } from '@mikro-orm/migrations';

export class Migration20250208165732 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "admin_user" ("id" text not null, "portal_id" text not null, "email" text not null, "role" text check ("role" in (\'admin\', \'super_admin\')) not null default \'admin\', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "admin_user_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_admin_user_portal_id_unique" ON "admin_user" (portal_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_admin_user_email_unique" ON "admin_user" (email) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_admin_user_deleted_at" ON "admin_user" (deleted_at) WHERE deleted_at IS NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_admin_user_portal_id_email_unique" ON "admin_user" (portal_id, email) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "admin_user" cascade;');
  }

}
