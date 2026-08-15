-- =========================================================
-- STORAGE — bucket "product-photos"
-- Lecture publique (affichage des photos sur le site),
-- écriture réservée aux admins.
-- =========================================================

insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

create policy "product_photos_public_read" on storage.objects
  for select using (bucket_id = 'product-photos');

create policy "product_photos_admin_insert" on storage.objects
  for insert with check (bucket_id = 'product-photos' and is_admin());

create policy "product_photos_admin_update" on storage.objects
  for update using (bucket_id = 'product-photos' and is_admin());

create policy "product_photos_admin_delete" on storage.objects
  for delete using (bucket_id = 'product-photos' and is_admin());

-- Bucket pour le logo de la boutique
insert into storage.buckets (id, name, public)
values ('store-assets', 'store-assets', true)
on conflict (id) do nothing;

create policy "store_assets_public_read" on storage.objects
  for select using (bucket_id = 'store-assets');

create policy "store_assets_admin_write" on storage.objects
  for insert with check (bucket_id = 'store-assets' and is_admin());

create policy "store_assets_admin_update" on storage.objects
  for update using (bucket_id = 'store-assets' and is_admin());
