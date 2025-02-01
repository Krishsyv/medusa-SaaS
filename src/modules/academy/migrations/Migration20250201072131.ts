import { Migration } from '@mikro-orm/migrations';

export class Migration20250201072131 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "class" ("id" text not null, "portal_id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "class_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_class_deleted_at" ON "class" (deleted_at) WHERE deleted_at IS NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_class_name_portal_id_unique" ON "class" (name, portal_id) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "class_kit" ("id" text not null, "portal_id" text not null, "Kit_id" text not null, "class_id" text not null, "type" text check ("type" in (\'open\', \'closed\')) not null, "is_customizable" boolean not null default false, "second_language" text not null, "third_language" text null, "third_language_status" boolean not null default false, "status" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "class_kit_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_class_kit_deleted_at" ON "class_kit" (deleted_at) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_class_kit_portal_id" ON "class_kit" (portal_id) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "kit" ("id" text not null, "portal_id" text not null, "product_id" text not null, "qty" integer not null default 0, "status" boolean not null default false, "class_kit_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "kit_pkey" primary key ("id"));');
    this.addSql('alter table if exists "kit" add constraint "kit_class_kit_id_unique" unique ("class_kit_id");');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_kit_class_kit_id" ON "kit" (class_kit_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_kit_deleted_at" ON "kit" (deleted_at) WHERE deleted_at IS NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_kit_product_id_portal_id_unique" ON "kit" (product_id, portal_id) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "language" ("id" text not null, "portal_id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "language_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_language_deleted_at" ON "language" (deleted_at) WHERE deleted_at IS NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_language_name_portal_id_unique" ON "language" (name, portal_id) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "section" ("id" text not null, "portal_id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "section_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_section_deleted_at" ON "section" (deleted_at) WHERE deleted_at IS NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_section_name_portal_id_unique" ON "section" (name, portal_id) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "student" ("id" text not null, "portal_id" text not null, "student_enrollment_code" text not null, "email" text not null, "student_name" text not null, "class_id" text null, "section_id" text null, "second_language_id" text null, "third_language_id" text null, "fourth_language_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "student_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_student_class_id" ON "student" (class_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_student_section_id" ON "student" (section_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_student_second_language_id" ON "student" (second_language_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_student_third_language_id" ON "student" (third_language_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_student_fourth_language_id" ON "student" (fourth_language_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_student_deleted_at" ON "student" (deleted_at) WHERE deleted_at IS NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_student_student_enrollment_code_portal_id_email_unique" ON "student" (student_enrollment_code, portal_id, email) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "student_profile" ("id" text not null, "portal_id" text not null, "student_enrollment_code" text not null, "father_name" text null, "mother_name" text null, "mother_phone" text null, "mother_email" text null, "gender" text check ("gender" in (\'Male\', \'Female\', \'Other\')) null, "hap" integer null, "hasdp" integer null, "first_term_paid" boolean not null default false, "house" text null, "ai" boolean null, "academic_year" integer null, "date_of_admission" timestamptz null, "application_no" integer null, "locality" text null, "otp" text null, "active" boolean null, "referral_code" text null, "is_sheffler" boolean null, "student_references_code" text null, "student_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "student_profile_pkey" primary key ("id"));');
    this.addSql('alter table if exists "student_profile" add constraint "student_profile_student_id_unique" unique ("student_id");');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_student_profile_student_id" ON "student_profile" (student_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_student_profile_deleted_at" ON "student_profile" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "kit" add constraint "kit_class_kit_id_foreign" foreign key ("class_kit_id") references "class_kit" ("id") on update cascade;');

    this.addSql('alter table if exists "student" add constraint "student_class_id_foreign" foreign key ("class_id") references "class" ("id") on update cascade on delete set null;');
    this.addSql('alter table if exists "student" add constraint "student_section_id_foreign" foreign key ("section_id") references "section" ("id") on update cascade on delete set null;');
    this.addSql('alter table if exists "student" add constraint "student_second_language_id_foreign" foreign key ("second_language_id") references "language" ("id") on update cascade on delete cascade;');
    this.addSql('alter table if exists "student" add constraint "student_third_language_id_foreign" foreign key ("third_language_id") references "language" ("id") on update cascade on delete cascade;');
    this.addSql('alter table if exists "student" add constraint "student_fourth_language_id_foreign" foreign key ("fourth_language_id") references "language" ("id") on update cascade on delete cascade;');

    this.addSql('alter table if exists "student_profile" add constraint "student_profile_student_id_foreign" foreign key ("student_id") references "student" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "student" drop constraint if exists "student_class_id_foreign";');

    this.addSql('alter table if exists "kit" drop constraint if exists "kit_class_kit_id_foreign";');

    this.addSql('alter table if exists "student" drop constraint if exists "student_second_language_id_foreign";');

    this.addSql('alter table if exists "student" drop constraint if exists "student_third_language_id_foreign";');

    this.addSql('alter table if exists "student" drop constraint if exists "student_fourth_language_id_foreign";');

    this.addSql('alter table if exists "student" drop constraint if exists "student_section_id_foreign";');

    this.addSql('alter table if exists "student_profile" drop constraint if exists "student_profile_student_id_foreign";');

    this.addSql('drop table if exists "class" cascade;');

    this.addSql('drop table if exists "class_kit" cascade;');

    this.addSql('drop table if exists "kit" cascade;');

    this.addSql('drop table if exists "language" cascade;');

    this.addSql('drop table if exists "section" cascade;');

    this.addSql('drop table if exists "student" cascade;');

    this.addSql('drop table if exists "student_profile" cascade;');
  }

}
