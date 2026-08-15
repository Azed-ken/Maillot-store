-- =========================================================
-- SEED DE DÉMONSTRATION (optionnel)
-- À exécuter uniquement si tu veux des données d'exemple.
-- Remplace/complète librement depuis l'espace admin ensuite.
-- =========================================================

insert into categories (name, slug, type, country_flag, sort_order) values
  ('Real Madrid', 'real-madrid', 'club', null, 1),
  ('FC Barcelone', 'fc-barcelone', 'club', null, 2),
  ('Paris Saint-Germain', 'psg', 'club', null, 3),
  ('Manchester United', 'manchester-united', 'club', null, 4),
  ('Liverpool', 'liverpool', 'club', null, 5),
  ('Bénin', 'benin', 'selection', '🇧🇯', 1),
  ('Côte d''Ivoire', 'cote-divoire', 'selection', '🇨🇮', 2),
  ('France', 'france', 'selection', '🇫🇷', 3),
  ('Brésil', 'bresil', 'selection', '🇧🇷', 4),
  ('Maroc', 'maroc', 'selection', '🇲🇦', 5),
  ('Sénégal', 'senegal', 'selection', '🇸🇳', 6)
on conflict (slug) do nothing;

insert into products (name, slug, description, price, stock, category_id, kind, sizes, photos, is_new, is_popular)
select
  'Maillot ' || c.name || ' Domicile 2025/26',
  c.slug || '-domicile-2526',
  'Maillot domicile officiel de ' || c.name || ', saison 2025/26. Coupe moderne, tissu respirant.',
  25000,
  15,
  c.id,
  'domicile',
  array['S','M','L','XL','XXL'],
  array[]::text[],
  true,
  true
from categories c
on conflict (slug) do nothing;
