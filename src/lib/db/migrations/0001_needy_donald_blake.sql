CREATE TYPE "public"."asset_kind" AS ENUM('code', 'figma', 'ai_prompt');--> statement-breakpoint
CREATE TYPE "public"."entitlement_scope" AS ENUM('all', 'category', 'template', 'course', 'feature');--> statement-breakpoint
CREATE TYPE "public"."entitlement_source" AS ENUM('purchase', 'subscription', 'admin_grant', 'promo', 'marketplace');--> statement-breakpoint
CREATE TABLE "entitlements" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"scope" "entitlement_scope" NOT NULL,
	"scope_id" text,
	"source" "entitlement_source" NOT NULL,
	"payment_id" text,
	"expires_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_downloads" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"prompt_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "asset_kind" "asset_kind" DEFAULT 'ai_prompt' NOT NULL;--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "is_free" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "asset_url" text;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_downloads" ADD CONSTRAINT "template_downloads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_downloads" ADD CONSTRAINT "template_downloads_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "entitlements_user_scope_idx" ON "entitlements" USING btree ("user_id","scope","scope_id");--> statement-breakpoint
CREATE INDEX "template_downloads_user_id_idx" ON "template_downloads" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "template_downloads_prompt_id_idx" ON "template_downloads" USING btree ("prompt_id");