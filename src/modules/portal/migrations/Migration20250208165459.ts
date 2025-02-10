import { Migration } from '@mikro-orm/migrations';

export class Migration20250208165459 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "portal" ("id" text not null, "portal_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "portal_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_portal_portal_id_unique" ON "portal" (portal_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_portal_deleted_at" ON "portal" (deleted_at) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_portal_portal_id" ON "portal" (portal_id) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "portal" cascade;');
  }

}
