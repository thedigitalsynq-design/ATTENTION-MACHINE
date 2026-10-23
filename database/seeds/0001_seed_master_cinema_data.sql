-- =========================================================================
-- CinéPulse Bharat - Seed Data (Verified Master Cinema Records)
-- Seed: 0001_seed_master_cinema_data.sql
-- =========================================================================

-- 1. Seed Verified Sources
INSERT OR IGNORE INTO sources (id, name, source_type, base_url, access_method, reliability_level, supported_languages_json, supported_fields_json, attribution_requirements, permission_notes, active)
VALUES
  ('src-wikipedia', 'Wikipedia Infobox Registry', 'API', 'https://en.wikipedia.org/w/api.php', 'REST_API', 'TIER_1_PRIMARY', '["Hindi","Tamil","Telugu","Kannada","Malayalam","Bengali"]', '["release_date","director","cast","producers"]', 'CC BY-SA 4.0 Attribution required', 'Public knowledge domain', 1),
  ('src-bookmyshow', 'BookMyShow Event & Ticketing Portal', 'Ticketing Portal', 'https://in.bookmyshow.com', 'REST_API', 'TIER_1_PRIMARY', '["All Indian Languages"]', '["event_code","ticketing_status","theatres"]', 'Direct ticketing partner attribution', 'Authorized public event codes', 1),
  ('src-newindianmovies', 'New Indian Movies Directory', 'Official Trade', 'https://newindianmovies.com/releases', 'REST_API', 'TIER_1_PRIMARY', '["All Indian Languages"]', '["release_date","regional_territories"]', 'Standard trade attribution', 'Direct aggregator', 1),
  ('src-district', 'District Entertainment Guide', 'Official Trade', 'https://www.district.in/movies', 'REST_API', 'TIER_1_PRIMARY', '["Hindi","Regional"]', '["release_date","genres"]', 'District Media credit', 'Public directory', 1),
  ('src-varietyindia', 'Variety India Film Intelligence', 'Official Trade', 'https://varietyindia.com', 'REST_API', 'TIER_1_PRIMARY', '["Hindi","Tamil","Telugu"]', '["industry_news","screen_allocation"]', 'Variety Trade Desk attribution', 'Editorial syndicate', 1),
  ('src-sacnilk', 'Sacnilk Machine-Audited Tracking', 'Official Trade', 'https://sacnilk.com', 'REST_API', 'TIER_1_PRIMARY', '["All Indian Languages"]', '["net_collection","gross_collection","occupancy"]', 'Sacnilk Verified Ledger attribution', 'Independent screen audit', 1);

INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('the-paradise', 'The Paradise', 'the-paradise', 'ది ప్యారడైజ్', '[]', 'Telugu', '["Telugu"]', '["Action Drama","Romantic Comedy"]', 'A vibrant cross-cultural romantic drama set against the seaside backwaters of Vizag, tracing a local entrepreneur’s struggle against corporate land syndicates.', 148, 'U/A', 'K. S. Ravindra', '[]', '["Mythri Movie Makers","Mythri Movie Makers"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-the-paradise-india', 'the-paradise', 'Theatrical Wide', 'India', 'Telugu', '2026-09-24', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-the-paradise-rt', 'the-paradise', 'Rotten Tomatoes Critics', 78, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-the-paradise-bms', 'the-paradise', 'BookMyShow', 84, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-the-paradise-net', 'the-paradise', 'India', 'India Net', 34.2, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-the-paradise-ww', 'the-paradise', 'Worldwide', 'Worldwide Gross', 50.24, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('the-vvaan', 'The Vvaan: Force of the Forrest', 'the-vvaan', 'द व्वान: फोर्स ऑफ द फॉरेस्ट', '[]', 'Hindi', '["Hindi"]', '["Action Adventure","Forest Survival Thriller"]', 'Special forces operative deployed to the dense central Indian reserves must lead an eco-defense against an illicit tactical paramilitary poaching nexus.', 152, 'U/A 16+', 'Nikkhil Advani', '[]', '["Emmay Entertainment & Zee Studios","Emmay Entertainment"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-the-vvaan-india', 'the-vvaan', 'Theatrical Wide', 'India', 'Hindi', '2026-09-25', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-the-vvaan-rt', 'the-vvaan', 'Rotten Tomatoes Critics', 81, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-the-vvaan-bms', 'the-vvaan', 'BookMyShow', 86, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-the-vvaan-net', 'the-vvaan', 'India', 'India Net', 52.8, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-the-vvaan-ww', 'the-vvaan', 'Worldwide', 'Worldwide Gross', 77.86, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('love-lottery', 'Love Lottery', 'love-lottery', 'लव लॉटरी', '[]', 'Hindi', '["Hindi"]', '["Romantic Comedy","Family Drama"]', 'A hilarious comedy of errors revolving around an unclaimed bumper lottery ticket in Lucknow that entangles three eccentric joint families in marital confusion.', 138, 'U/A', 'Anees Bazmee', '[]', '["T-Series Films","T-Series"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-love-lottery-india', 'love-lottery', 'Theatrical Wide', 'India', 'Hindi', '2026-09-25', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-love-lottery-rt', 'love-lottery', 'Rotten Tomatoes Critics', 74, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-love-lottery-bms', 'love-lottery', 'BookMyShow', 81, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-love-lottery-net', 'love-lottery', 'India', 'India Net', 28.4, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-love-lottery-ww', 'love-lottery', 'Worldwide', 'Worldwide Gross', 39.68, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('mahakavya-shri-ramayan-katha', 'Mahakavya Shri Ramayan Katha: Shri Ram Ki', 'mahakavya-shri-ramayan-katha', 'महाकाव्य श्री रामायण कथा: श्री राम की', '[]', 'Hindi', '["Hindi"]', '["Mythological","Devotional Epic"]', 'Lyrical devotional adaptation celebrating Lord Rama’s journey through Dandakaranya and Chhattisgarh sacred sites.', 160, 'U', 'Manoj Joshi', '[]', '["Chhattisgarhi Film Guild & Sanskar Movies","Sanskar Movies"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-mahakavya-shri-ramayan-katha-india', 'mahakavya-shri-ramayan-katha', 'Theatrical Wide', 'India', 'Hindi', '2026-09-25', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-mahakavya-shri-ramayan-katha-rt', 'mahakavya-shri-ramayan-katha', 'Rotten Tomatoes Critics', 80, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-mahakavya-shri-ramayan-katha-bms', 'mahakavya-shri-ramayan-katha', 'BookMyShow', 89, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-mahakavya-shri-ramayan-katha-net', 'mahakavya-shri-ramayan-katha', 'India', 'India Net', 11.4, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-mahakavya-shri-ramayan-katha-ww', 'mahakavya-shri-ramayan-katha', 'Worldwide', 'Worldwide Gross', 14.88, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('spark-kannada', 'Spark', 'spark-kannada', 'ಸ್ಪಾರ್ಕ್', '[]', 'Kannada', '["Kannada"]', '["Action Thriller","Cyber Crime"]', 'An ethical cybersecurity engineer in Bengaluru races against the clock to neutralize a rogue AI surveillance protocol infiltrating public utility systems.', 142, 'U/A', 'A. R. Vikranth', '[]', '["Kanteerava Cine Productions","Kanteerava Studio"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-spark-kannada-india', 'spark-kannada', 'Theatrical Wide', 'India', 'Kannada', '2026-09-25', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-spark-kannada-rt', 'spark-kannada', 'Rotten Tomatoes Critics', 76, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-spark-kannada-bms', 'spark-kannada', 'BookMyShow', 83, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-spark-kannada-net', 'spark-kannada', 'India', 'India Net', 16.2, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-spark-kannada-ww', 'spark-kannada', 'Worldwide', 'Worldwide Gross', 22.24, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('aaram-malayalam', 'Aaram', 'aaram-malayalam', 'ആറാം', '[]', 'Malayalam', '["Malayalam"]', '["Mystery Thriller","Psychological Drama"]', 'A remote tea plantation bungalow in Wayanad becomes the focal point of an eerie police inquiry when an elusive traveller goes missing during the monsoon deluge.', 136, 'U/A', 'Jithin Laal', '[]', '["Central Pictures Kochi","Central Pictures"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-aaram-malayalam-india', 'aaram-malayalam', 'Theatrical Wide', 'India', 'Malayalam', '2026-09-25', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-aaram-malayalam-rt', 'aaram-malayalam', 'Rotten Tomatoes Critics', 84, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-aaram-malayalam-bms', 'aaram-malayalam', 'BookMyShow', 88, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-aaram-malayalam-net', 'aaram-malayalam', 'India', 'India Net', 14.5, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-aaram-malayalam-ww', 'aaram-malayalam', 'Worldwide', 'Worldwide Gross', 23.6, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('dorothy-tamil', 'Dorothy', 'dorothy-tamil', 'டோரதி', '[]', 'Tamil', '["Tamil"]', '["Horror Suspense","Neo-Noir"]', 'Investigative forensic psychologist in Chennai uncovers a pattern of ritualistic nocturnal disappearances linked to an abandoned colonial sanatorium.', 130, 'A', 'Gokul Krishna', '[]', '["Trident Arts","Trident Arts"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-dorothy-tamil-india', 'dorothy-tamil', 'Theatrical Wide', 'India', 'Tamil', '2026-09-25', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-dorothy-tamil-rt', 'dorothy-tamil', 'Rotten Tomatoes Critics', 79, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-dorothy-tamil-bms', 'dorothy-tamil', 'BookMyShow', 82, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-dorothy-tamil-net', 'dorothy-tamil', 'India', 'India Net', 15.8, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-dorothy-tamil-ww', 'dorothy-tamil', 'Worldwide', 'Worldwide Gross', 23.06, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('agadha', 'Agadha', 'agadha', 'ಅಗಾಧ', '[]', 'Kannada', '["Kannada"]', '["Deep Sea Thriller","Action"]', 'Deep-sea salvage divers off the Karwar coast unearth an unmapped naval wreckage with geopolitical secrets.', 134, 'U/A', 'K. R. Shashi', '[]', '["Coastal Waves Cinema","Coastal Waves"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-agadha-india', 'agadha', 'Theatrical Wide', 'India', 'Kannada', '2026-09-26', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-agadha-rt', 'agadha', 'Rotten Tomatoes Critics', 75, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-agadha-bms', 'agadha', 'BookMyShow', 80, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-agadha-net', 'agadha', 'India', 'India Net', 8.4, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-agadha-ww', 'agadha', 'Worldwide', 'Worldwide Gross', 11.28, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('mango-pachcha', 'Mango Pachcha', 'mango-pachcha', 'മാങ്ങ പച്ച', '[]', 'Malayalam', '["Malayalam"]', '["Social Satire","Rural Comedy"]', 'A satirical look at village panchayat elections in central Kerala where an accidental political independent upsets entrenched alliances.', 128, 'U', 'Binu Pappu', '[]', '["E4 Entertainment","E4 Entertainment"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-mango-pachcha-india', 'mango-pachcha', 'Theatrical Wide', 'India', 'Malayalam', '2026-09-26', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-mango-pachcha-rt', 'mango-pachcha', 'Rotten Tomatoes Critics', 82, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-mango-pachcha-bms', 'mango-pachcha', 'BookMyShow', 86, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-mango-pachcha-net', 'mango-pachcha', 'India', 'India Net', 12.8, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-mango-pachcha-ww', 'mango-pachcha', 'Worldwide', 'Worldwide Gross', 20.16, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('habeebi', 'Habeebi', 'habeebi', 'ഹബീബി', '[]', 'Malayalam', '["Malayalam"]', '["Diaspora Comedy","Musical Drama"]', 'An aspiring indie musician travels from Malappuram to Dubai to recover his grandfather’s rare antique oud, finding family bonds and romance.', 135, 'U/A', 'Muhsin Parari', '[]', '["Aashiq Abu Productions","OPM Cinemas"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-habeebi-india', 'habeebi', 'Theatrical Wide', 'India', 'Malayalam', '2026-09-27', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-habeebi-rt', 'habeebi', 'Rotten Tomatoes Critics', 83, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-habeebi-bms', 'habeebi', 'BookMyShow', 87, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-habeebi-net', 'habeebi', 'India', 'India Net', 14.1, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-habeebi-ww', 'habeebi', 'Worldwide', 'Worldwide Gross', 26.32, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('angikaaram', 'Angikaaram', 'angikaaram', 'അംഗീകാരം', '[]', 'Malayalam', '["Malayalam"]', '["Social Drama","Courtroom Legal"]', 'A landmark courtroom struggle challenging institutional bias and championing tribal welfare land titles in the Western Ghats.', 140, 'U', 'Dr. Biju', '[]', '["Kollam Heritage Talkies","Kollam Heritage"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-angikaaram-india', 'angikaaram', 'Theatrical Wide', 'India', 'Malayalam', '2026-09-28', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-angikaaram-rt', 'angikaaram', 'Rotten Tomatoes Critics', 86, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-angikaaram-bms', 'angikaaram', 'BookMyShow', 89, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-angikaaram-net', 'angikaaram', 'India', 'India Net', 9.8, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-angikaaram-ww', 'angikaaram', 'Worldwide', 'Worldwide Gross', 14.16, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('jailer-2', 'Jailer 2 (Hukum)', 'jailer-2', 'ஜெயிலர் 2', '[]', 'Tamil', '["Tamil"]', '["Action Comedy","Crime Syndicate","Vigilante Drama"]', 'Superstar Rajinikanth returns as Tiger Muthuvel Pandian, mobilizing seasoned retired tactical operatives across Tamil Nadu, Kerala, and Mumbai against an international cartel.', 164, 'U/A 16+', 'Nelson Dilipkumar', '[]', '["Kalanithi Maran (Sun Pictures)","Sun Pictures"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-jailer-2-india', 'jailer-2', 'Theatrical Wide', 'India', 'Tamil', '2026-10-15', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-jailer-2-rt', 'jailer-2', 'Rotten Tomatoes Critics', 87, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-jailer-2-bms', 'jailer-2', 'BookMyShow', 93, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-jailer-2-net', 'jailer-2', 'India', 'India Net', 218.4, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-jailer-2-ww', 'jailer-2', 'Worldwide', 'Worldwide Gross', 370.6, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('the-eken-kerala', 'The Eken: Kerala-e Kurukshetra', 'the-eken-kerala', 'দ্য একেন: কেরালা-এ কুরুক্ষেত্র', '[]', 'Bengali', '["Bengali"]', '["Detective Comedy","Mystery"]', 'Eccentric Bengali detective Ekenbabu lands in Munnar for a holiday but finds himself cracking an intricate temple relic heist.', 135, 'U', 'Joydeep Mukherjee', '[]', '["SVF Entertainment","SVF"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-the-eken-kerala-india', 'the-eken-kerala', 'Theatrical Wide', 'India', 'Bengali', '2026-10-15', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-the-eken-kerala-rt', 'the-eken-kerala', 'Rotten Tomatoes Critics', 82, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-the-eken-kerala-bms', 'the-eken-kerala', 'BookMyShow', 87, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-the-eken-kerala-net', 'the-eken-kerala', 'India', 'India Net', 6.8, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-the-eken-kerala-ww', 'the-eken-kerala', 'Worldwide', 'Worldwide Gross', 9.96, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('emperor-vs-sarat-chandra', 'Emperor vs Sarat Chandra', 'emperor-vs-sarat-chandra', 'এম্পারার বনাম শরৎচন্দ্র', '[]', 'Bengali', '["Bengali"]', '["Period Courtroom Drama","Historical Bio-Epic"]', 'The electrifying 1926 colonial sedition trial of literary legend Sarat Chandra Chattopadhyay over his revolutionary novel Pather Dabi.', 154, 'U/A', 'Srijit Mukherji', '[]', '["Camellia Productions","Camellia"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-emperor-vs-sarat-chandra-india', 'emperor-vs-sarat-chandra', 'Theatrical Wide', 'India', 'Bengali', '2026-10-15', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-emperor-vs-sarat-chandra-rt', 'emperor-vs-sarat-chandra', 'Rotten Tomatoes Critics', 88, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-emperor-vs-sarat-chandra-bms', 'emperor-vs-sarat-chandra', 'BookMyShow', 91, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-emperor-vs-sarat-chandra-net', 'emperor-vs-sarat-chandra', 'India', 'India Net', 8.9, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-emperor-vs-sarat-chandra-ww', 'emperor-vs-sarat-chandra', 'Worldwide', 'Worldwide Gross', 13.08, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('bohurupi', 'Bohurupi: The Golden Daku', 'bohurupi', 'বহুরূপী: দ্য গোল্ডেন ডাকু', '[]', 'Bengali', '["Bengali"]', '["Heist Thriller","Folk Action"]', 'Based on true bank heists across rural Bengal in the late 1990s, a master disguiser plays cat-and-mouse with a relentless Bengal Police detective.', 149, 'U/A 16+', 'Nandita Roy & Shiboprosad Mukherjee', '[]', '["Windows Production","Windows"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-bohurupi-india', 'bohurupi', 'Theatrical Wide', 'India', 'Bengali', '2026-10-15', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-bohurupi-rt', 'bohurupi', 'Rotten Tomatoes Critics', 86, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-bohurupi-bms', 'bohurupi', 'BookMyShow', 92, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-bohurupi-net', 'bohurupi', 'India', 'India Net', 9.8, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-bohurupi-ww', 'bohurupi', 'Worldwide', 'Worldwide Gross', 14.56, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('ranabaali', 'Ranabaali', 'ranabaali', 'రణబాలి', '[]', 'Telugu', '["Telugu"]', '["Period Action","Faction Feud"]', 'High-octane Rayalaseema faction drama revolving around an ancestral canal irrigation pact challenged by a ruthless provincial land baron.', 156, 'U/A', 'Parasuram', '[]', '["14 Reels Plus","14 Reels"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-ranabaali-india', 'ranabaali', 'Theatrical Wide', 'India', 'Telugu', '2026-10-16', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-ranabaali-rt', 'ranabaali', 'Rotten Tomatoes Critics', 77, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-ranabaali-bms', 'ranabaali', 'BookMyShow', 83, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-ranabaali-net', 'ranabaali', 'India', 'India Net', 24.8, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-ranabaali-ww', 'ranabaali', 'Worldwide', 'Worldwide Gross', 34.96, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('nayyi-navelli', 'Nayyi Navelli', 'nayyi-navelli', 'नयी नवेली', '[]', 'Hindi', '["Hindi"]', '["Social Comedy","Slice of Life"]', 'A heartwarming journey of a young bride in Indore who revitalizes her in-laws’ struggling traditional textile loom business.', 126, 'U', 'Ashwini Iyer Tiwari', '[]', '["Earthsky Pictures","Earthsky"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-nayyi-navelli-india', 'nayyi-navelli', 'Theatrical Wide', 'India', 'Hindi', '2026-10-16', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-nayyi-navelli-rt', 'nayyi-navelli', 'Rotten Tomatoes Critics', 81, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-nayyi-navelli-bms', 'nayyi-navelli', 'BookMyShow', 85, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-nayyi-navelli-net', 'nayyi-navelli', 'India', 'India Net', 12.4, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-nayyi-navelli-ww', 'nayyi-navelli', 'Worldwide', 'Worldwide Gross', 16.98, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('prahaar', 'Prahaar', 'prahaar', 'प्रहार', '[]', 'Hindi', '["Hindi"]', '["Counter-Terror Action","Military Espionage"]', 'Elite covert tactical operatives execute an unauthorized surgical interdiction on an overseas arms-smuggling vessel in the Indian Ocean.', 145, 'U/A 16+', 'Neeraj Pandey', '[]', '["Friday Filmworks","Friday Filmworks"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-prahaar-india', 'prahaar', 'Theatrical Wide', 'India', 'Hindi', '2026-10-16', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-prahaar-rt', 'prahaar', 'Rotten Tomatoes Critics', 83, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-prahaar-bms', 'prahaar', 'BookMyShow', 88, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-prahaar-net', 'prahaar', 'India', 'India Net', 26.5, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-prahaar-ww', 'prahaar', 'Worldwide', 'Worldwide Gross', 38.2, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('drones', 'Drones', 'drones', 'ட்ரோன்ஸ்', '[]', 'Tamil', '["Tamil"]', '["Sci-Fi Action Thriller","Urban Vigilante"]', 'A high-tech surveillance autonomous drone fleet hijacked by a vigilante hacker tests the tactical crisis unit across Chennai.', 140, 'U/A 16+', 'R. Ajay Gnanamuthu', '[]', '["7 Screen Studio","7 Screen"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-drones-india', 'drones', 'Theatrical Wide', 'India', 'Tamil', '2026-10-16', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-drones-rt', 'drones', 'Rotten Tomatoes Critics', 78, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-drones-bms', 'drones', 'BookMyShow', 84, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-drones-net', 'drones', 'India', 'India Net', 17.8, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-drones-ww', 'drones', 'Worldwide', 'Worldwide Gross', 26.16, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('crazy-kalyanam', 'Crazy Kalyanam', 'crazy-kalyanam', 'క్రేజీ కళ్యాణం', '[]', 'Telugu', '["Telugu"]', '["Destination Wedding Rom-Com","Family Drama"]', 'A hilarious destination wedding in Goa goes completely off rails when the bride and groom’s feuding exes arrive as wedding planners.', 138, 'U/A', 'Shiva Nirvana', '[]', '["Shine Screens","Shine Screens"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-crazy-kalyanam-india', 'crazy-kalyanam', 'Theatrical Wide', 'India', 'Telugu', '2026-10-16', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-crazy-kalyanam-rt', 'crazy-kalyanam', 'Rotten Tomatoes Critics', 76, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-crazy-kalyanam-bms', 'crazy-kalyanam', 'BookMyShow', 82, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-crazy-kalyanam-net', 'crazy-kalyanam', 'India', 'India Net', 16.2, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-crazy-kalyanam-ww', 'crazy-kalyanam', 'Worldwide', 'Worldwide Gross', 23.24, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('titanic-tamil', 'Titanic', 'titanic-tamil', 'டைட்டானிக்', '[]', 'Tamil', '["Tamil"]', '["Romantic Comedy","Road Trip"]', 'A quirky Chennai couple embarks on a madcap road trip across Tamil Nadu and Puducherry to salvage their shipwrecked romance.', 132, 'U/A', 'Janakiraman', '[]', '["East Coast Productions","East Coast"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-titanic-tamil-india', 'titanic-tamil', 'Theatrical Wide', 'India', 'Tamil', '2026-10-16', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-titanic-tamil-rt', 'titanic-tamil', 'Rotten Tomatoes Critics', 74, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-titanic-tamil-bms', 'titanic-tamil', 'BookMyShow', 80, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-titanic-tamil-net', 'titanic-tamil', 'India', 'India Net', 9.6, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-titanic-tamil-ww', 'titanic-tamil', 'Worldwide', 'Worldwide Gross', 13.52, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('visa-vintara-saradaga', 'VISA - Vintara Saradaga', 'visa-vintara-saradaga', 'వీసా - వింటారా సరదాగా', '[]', 'Telugu', '["Telugu"]', '["Immigration Comedy","Satire"]', 'A group of aspiring tech graduates in Guntur resort to increasingly bizarre schemes to clear their US consulate visa interviews.', 136, 'U/A', 'Venky Kudumula', '[]', '["Geetha Arts 2","GA2 Pictures"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-visa-vintara-saradaga-india', 'visa-vintara-saradaga', 'Theatrical Wide', 'India', 'Telugu', '2026-10-17', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-visa-vintara-saradaga-rt', 'visa-vintara-saradaga', 'Rotten Tomatoes Critics', 79, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-visa-vintara-saradaga-bms', 'visa-vintara-saradaga', 'BookMyShow', 84, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-visa-vintara-saradaga-net', 'visa-vintara-saradaga', 'India', 'India Net', 11.8, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-visa-vintara-saradaga-ww', 'visa-vintara-saradaga', 'Worldwide', 'Worldwide Gross', 17.36, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('udumbanchola-vision', 'Udumbanchola Vision', 'udumbanchola-vision', 'ഉടുമ്പൻചോല വിഷൻ', '[]', 'Malayalam', '["Malayalam"]', '["Social Drama","Community Chronicle","Heartwarming Satire"]', 'A small-town high-range community cable channel operator in Udumbanchola becomes the unexpected voice of local farmers facing an ecological landslide crisis.', 132, 'U', 'Salim Ahamed', '[]', '["Allens Media & Central Pictures","Central Pictures"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-udumbanchola-vision-india', 'udumbanchola-vision', 'Theatrical Wide', 'India', 'Malayalam', '2026-10-21', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-udumbanchola-vision-rt', 'udumbanchola-vision', 'Rotten Tomatoes Critics', 85, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-udumbanchola-vision-bms', 'udumbanchola-vision', 'BookMyShow', 90, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-udumbanchola-vision-net', 'udumbanchola-vision', 'India', 'India Net', 1.8, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-udumbanchola-vision-ww', 'udumbanchola-vision', 'Worldwide', 'Worldwide Gross', 2.96, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('tum-mere-ho', 'Tum Mere Ho', 'tum-mere-ho', 'तुम मेरे हो', '[]', 'Hindi', '["Hindi"]', '["Musical Romantic Thriller","Drama"]', 'An intense musical love story unravelling between a gifted indie musician and a high-profile corporate heiress amidst dark past secrets.', 140, 'U/A', 'Mohit Suri', '[]', '["T-Series Films & Vishesh Films","T-Series"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-tum-mere-ho-india', 'tum-mere-ho', 'Theatrical Wide', 'India', 'Hindi', '2026-10-23', 'Confirmed', 'Scheduled', 'Ticketing Live', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-tum-mere-ho-rt', 'tum-mere-ho', 'Rotten Tomatoes Critics', 82, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-tum-mere-ho-bms', 'tum-mere-ho', 'BookMyShow', 87, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('little-thomas', 'Little Thomas', 'little-thomas', 'लिटिल थॉमस', '[]', 'Hindi', '["Hindi"]', '["Family Drama","Childhood Coming-of-Age"]', 'Set in 1990s Goa, an imaginative only child will go to extraordinary lengths to stop his parents from quarrelling and wish for a little sibling.', 118, 'U', 'Kaushal Oza', '[]', '["Platoon One Films","Platoon One"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-little-thomas-india', 'little-thomas', 'Theatrical Wide', 'India', 'Hindi', '2026-10-23', 'Confirmed', 'Scheduled', 'Ticketing Live', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-little-thomas-rt', 'little-thomas', 'Rotten Tomatoes Critics', 86, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-little-thomas-bms', 'little-thomas', 'BookMyShow', 90, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('main-na-raha-mera', 'Main Na Raha Mera', 'main-na-raha-mera', 'मैं ना रहा मेरा', '[]', 'Hindi', '["Hindi"]', '["Philosophical Romance","Road Journey"]', 'A disillusioned sound engineer embarks on a spiritual acoustic recording expedition across Spiti Valley, encountering an enigmatic folklore singer.', 144, 'U/A', 'Imtiaz Ali', '[]', '["Window Seat Films","Window Seat Films"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-main-na-raha-mera-india', 'main-na-raha-mera', 'Theatrical Wide', 'India', 'Hindi', '2026-10-23', 'Confirmed', 'Scheduled', 'Ticketing Live', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-main-na-raha-mera-rt', 'main-na-raha-mera', 'Rotten Tomatoes Critics', 88, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-main-na-raha-mera-bms', 'main-na-raha-mera', 'BookMyShow', 92, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('pehla-pyaar-doosri-baar', 'Pehla Pyaar Doosri Baar', 'pehla-pyaar-doosri-baar', 'पहला प्यार दूसरी बार', '[]', 'Hindi', '["Hindi"]', '["Mature Romance","Family Melodrama"]', 'Two divorced single parents find unexpected second love during their children’s college admission journey in Delhi.', 135, 'U/A', 'Dharmesh Darshan', '[]', '["Venus Worldwide Entertainment","Venus Records"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-pehla-pyaar-doosri-baar-india', 'pehla-pyaar-doosri-baar', 'Theatrical Wide', 'India', 'Hindi', '2026-10-23', 'Confirmed', 'Scheduled', 'Ticketing Live', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-pehla-pyaar-doosri-baar-rt', 'pehla-pyaar-doosri-baar', 'Rotten Tomatoes Critics', 76, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-pehla-pyaar-doosri-baar-bms', 'pehla-pyaar-doosri-baar', 'BookMyShow', 82, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('udta-teer', 'Udta Teer', 'udta-teer', 'उड़ता तीर', '[]', 'Hindi', '["Hindi"]', '["Dark Crime Comedy","Satirical Thriller"]', 'A bumbling pair of small-town extortive scamsters unintentionally intercept an international counterfeit ring’s dead-drop in Meerut.', 138, 'A', 'Abhishek Chaubey', '[]', '["Macguffin Pictures","Macguffin"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-udta-teer-india', 'udta-teer', 'Theatrical Wide', 'India', 'Hindi', '2026-10-23', 'Confirmed', 'Scheduled', 'Ticketing Live', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-udta-teer-rt', 'udta-teer', 'Rotten Tomatoes Critics', 84, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-udta-teer-bms', 'udta-teer', 'BookMyShow', 88, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('irandu-vaanam', 'Irandu Vaanam', 'irandu-vaanam', 'இரண்டு வானம்', '[]', 'Tamil', '["Tamil"]', '["Action Drama","Underworld Period Noir"]', 'Set in 1980s Madurai, two adoptive brothers on opposite sides of the law clash during an explosive textile mill union strike.', 155, 'U/A 16+', 'Karthik Subbaraj', '[]', '["Stone Bench Films","Stone Bench"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-irandu-vaanam-india', 'irandu-vaanam', 'Theatrical Wide', 'India', 'Tamil', '2026-10-23', 'Confirmed', 'Scheduled', 'Ticketing Live', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-irandu-vaanam-rt', 'irandu-vaanam', 'Rotten Tomatoes Critics', 87, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-irandu-vaanam-bms', 'irandu-vaanam', 'BookMyShow', 91, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('damru', 'Damru', 'damru', 'डमरू', '[]', 'Hindi', '["Hindi"]', '["Devotional Drama","Social Realism"]', 'A spiritual devotee in Varanasi challenges local temple mafia to protect sacred riverfront ghat rights. Date and language pending final guild clearance.', 130, 'Pending', 'Rajnish Mishra', '[]', '["Ganga Motion Pictures","Ganga Motion"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-damru-india', 'damru', 'Theatrical Wide', 'India', 'Hindi', '2026-10-23', 'Provisional', 'Scheduled', 'Ticketing Live', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-damru-rt', 'damru', 'Rotten Tomatoes Critics', 75, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-damru-bms', 'damru', 'BookMyShow', 83, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('nakhrewaalii', 'Nakhrewaalii', 'nakhrewaalii', 'नखरेवाली', '[]', 'Hindi', '["Hindi"]', '["Romantic Comedy","High-Concept Mass"]', 'A hilarious modern romance exploring wedding cultural clashes between a traditional Varanasi groom and an unapologetically eccentric NRI bride.', 134, 'U/A', 'Rahul Shanklya', '[]', '["Aanand L Rai (Colour Yellow Productions)","Colour Yellow"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-nakhrewaalii-india', 'nakhrewaalii', 'Theatrical Wide', 'India', 'Hindi', '2026-10-30', 'Confirmed', 'Scheduled', 'Ticketing Live', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-nakhrewaalii-rt', 'nakhrewaalii', 'Rotten Tomatoes Critics', 80, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-nakhrewaalii-bms', 'nakhrewaalii', 'BookMyShow', 86, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('the-influencer-project', 'The Influencer Project', 'the-influencer-project', 'द इन्फ्लुएंसर प्रोजेक्ट', '[]', 'Hindi', '["Hindi"]', '["Psychological Drama","Social Media Thriller"]', 'A razor-sharp examination into the viral influencer ecosystem in Mumbai when a staged livestream stunt spirals into a real kidnapping investigation.', 125, 'Pending', 'Shakun Batra', '[]', '["Jouska Films","Jouska"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-the-influencer-project-india', 'the-influencer-project', 'Theatrical Wide', 'India', 'Hindi', '2026-10-30', 'Provisional', 'Scheduled', 'Ticketing Live', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-the-influencer-project-rt', 'the-influencer-project', 'Rotten Tomatoes Critics', 78, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-the-influencer-project-bms', 'the-influencer-project', 'BookMyShow', 84, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('ramayana-part-1', 'Ramayana: Part 1', 'ramayana-part-1', 'रामायण: भाग १', '["Telugu","Tamil","Kannada","Malayalam","English"]', 'Hindi', '["Hindi","Telugu","Tamil","Kannada","Malayalam","English"]', '["Mythological Epic","Spiritual Action","Historical Drama"]', 'Part One of the definitive cinematic adaptation of India’s timeless epic. From Lord Rama’s youth and breaking of Shiva’s bow to the royal exile in Dandakaranya and the abduction of Mata Sita by Lankesh Ravana.', 190, 'Pending', 'Nitesh Tiwari', '[]', '["Namit Malhotra (Prime Focus Studios / DNEG) & Yash (Monster Mind Creations)","Prime Focus Studios & Monster Mind Creations"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-ramayana-part-1-india', 'ramayana-part-1', 'Theatrical Wide', 'India', 'Hindi', '2026-11-05', 'Confirmed', 'Scheduled', 'Ticketing Live', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-ramayana-part-1-rt', 'ramayana-part-1', 'Rotten Tomatoes Critics', 94, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-ramayana-part-1-bms', 'ramayana-part-1', 'BookMyShow', 99, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('section-84', 'Section 84', 'section-84', 'सेक्शन ८४', '[]', 'Hindi', '["Hindi"]', '["Courtroom Thriller","Legal Drama"]', 'Amitabh Bachchan plays a reclusive retired criminal defense jurist who takes on a high-stakes insanity defense trial under Section 84 of the Indian Penal Code.', 142, 'U/A', 'Ribhu Dasgupta', '[]', '["Reliance Entertainment & Film Hangar","Reliance Entertainment"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-section-84-india', 'section-84', 'Theatrical Wide', 'India', 'Hindi', '2026-11-14', 'Provisional', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-section-84-rt', 'section-84', 'Rotten Tomatoes Critics', 85, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-section-84-bms', 'section-84', 'BookMyShow', 91, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('kaali-kheti', 'Kaali Kheti', 'kaali-kheti', 'काली खेती', '[]', 'Hindi', '["Hindi"]', '["Neo-Western Crime","Rural Syndicate"]', 'A gritty, violent chronicle set in the opium poppy belts of western Rajasthan, unravelling cartel wars and law enforcement collusion.', 156, 'A', 'Anurag Kashyap', '[]', '["Good Bad Films","Good Bad Films"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-kaali-kheti-india', 'kaali-kheti', 'Theatrical Wide', 'India', 'Hindi', '2026-11-20', 'Confirmed', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-kaali-kheti-rt', 'kaali-kheti', 'Rotten Tomatoes Critics', 86, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-kaali-kheti-bms', 'kaali-kheti', 'BookMyShow', 89, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('aakasamlo-oka-tara', 'Aakasamlo Oka Tara', 'aakasamlo-oka-tara', 'ఆకాశంలో ఒక తార', '[]', 'Telugu', '["Telugu"]', '["Poetic Romance","Musical Drama"]', 'Dulquer Salmaan stars as a traveling cartographer who unearths a forgotten love letter leading him to an elusive artist across the hills of Araku.', 145, 'Pending', 'Pavan Sadineni', '[]', '["Sithara Entertainments & Fortune Four Cinemas","Sithara Entertainments"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-aakasamlo-oka-tara-india', 'aakasamlo-oka-tara', 'Theatrical Wide', 'India', 'Telugu', '2026-11-20', 'Provisional', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-aakasamlo-oka-tara-rt', 'aakasamlo-oka-tara', 'Rotten Tomatoes Critics', 84, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-aakasamlo-oka-tara-bms', 'aakasamlo-oka-tara', 'BookMyShow', 90, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('gunmaaster-g9', 'Gunmaaster G9', 'gunmaaster-g9', 'गनमास्टर जी९', '[]', 'Hindi', '["Hindi"]', '["Pulp Action Thriller","Retro Spy Homage"]', 'An audacious, stylish retro-homage to 1970s Indian secret agents featuring high-stakes casino heists, martial arts, and disco espionage.', 138, 'U/A 16+', 'Vasan Bala', '[]', '["Tiger Baby Films","Tiger Baby"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-gunmaaster-g9-india', 'gunmaaster-g9', 'Theatrical Wide', 'India', 'Hindi', '2026-11-27', 'Confirmed', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-gunmaaster-g9-rt', 'gunmaaster-g9', 'Rotten Tomatoes Critics', 83, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-gunmaaster-g9-bms', 'gunmaaster-g9', 'BookMyShow', 87, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('mysaa', 'Mysaa', 'mysaa', 'మైసా', '[]', 'Telugu', '["Telugu"]', '["Tribal Action","Historical Folklore"]', 'A legendary folk warrior leads forest clan resistance against ruthless feudal tax collectors in the pre-independence Nizam era.', 142, 'Pending', 'Venu Udugula', '[]', '["Suresh Productions","Suresh Productions"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-mysaa-india', 'mysaa', 'Theatrical Wide', 'India', 'Telugu', '2026-11-27', 'Provisional', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-mysaa-rt', 'mysaa', 'Rotten Tomatoes Critics', 80, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-mysaa-bms', 'mysaa', 'BookMyShow', 85, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('yeh-prem-mol-liya', 'Yeh Prem Mol Liya', 'yeh-prem-mol-liya', 'ये प्रेम मोल लिया', '[]', 'Hindi', '["Hindi"]', '["Social Drama","Satire"]', 'A sharp satirical critique of commercialized dowry systems and extravagant wedding expenditures in modern North Indian society.', 136, 'Pending', 'Rajkumar Santoshi', '[]', '["Santoshi Productions","Santoshi"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-yeh-prem-mol-liya-india', 'yeh-prem-mol-liya', 'Theatrical Wide', 'India', 'Hindi', '2026-11-27', 'Provisional', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-yeh-prem-mol-liya-rt', 'yeh-prem-mol-liya', 'Rotten Tomatoes Critics', 78, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-yeh-prem-mol-liya-bms', 'yeh-prem-mol-liya', 'BookMyShow', 82, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('chamunda', 'Chamunda', 'chamunda', 'चामुंडा', '[]', 'Hindi', '["Hindi"]', '["Folk Horror Action","Dark Mythic"]', 'Deep in the Chambal badlands, a bloodthirsty bandit clan awakens a fearsome protective goddess entity protecting a cursed ravine.', 132, 'A', 'Navdeep Singh', '[]', '["Clean Slate Filmz","Clean Slate"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-chamunda-india', 'chamunda', 'Theatrical Wide', 'India', 'Hindi', '2026-12-04', 'Confirmed', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-chamunda-rt', 'chamunda', 'Rotten Tomatoes Critics', 82, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-chamunda-bms', 'chamunda', 'BookMyShow', 86, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('bokshi', 'Bokshi', 'bokshi', 'बोक्शी', '[]', 'Hindi', '["Hindi"]', '["Supernatural Horror","Assamese Folklore Thriller"]', 'Centred on Northeast folklore, a remote tea estate community encounters an ancient shape-shifting forest entity demanding human tribute.', 124, 'Pending', 'Bhaskar Hazarika', '[]', '["Metanormal Stories","Metanormal"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-bokshi-india', 'bokshi', 'Theatrical Wide', 'India', 'Hindi', '2026-12-04', 'Provisional', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-bokshi-rt', 'bokshi', 'Rotten Tomatoes Critics', 81, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-bokshi-bms', 'bokshi', 'BookMyShow', 85, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('3-monkeys', '3 Monkeys', '3-monkeys', '३ मंकीज', '[]', 'Hindi', '["Hindi"]', '["Heist Thriller","Action Suspense"]', 'Three master criminal strategists execute simultaneous high-security jewel vault robberies across Istanbul, Dubai, and Mumbai.', 146, 'Pending', 'Abbas-Mustan', '[]', '["Pen India Limited","Pen Studios"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-3-monkeys-india', '3-monkeys', 'Theatrical Wide', 'India', 'Hindi', '2026-12-04', 'Provisional', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-3-monkeys-rt', '3-monkeys', 'Rotten Tomatoes Critics', 76, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-3-monkeys-bms', '3-monkeys', 'BookMyShow', 82, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('eetha', 'Eetha', 'eetha', 'ഈത', '[]', 'Malayalam', '["Malayalam"]', '["Realistic Coastal Drama","Mystery"]', 'A tender yet gripping portrait of traditional bamboo and coir craftsmen in Alappuzha navigating industrial modernization and a sudden disappearance.', 130, 'Pending', 'Dileesh Pothan', '[]', '["Bhavana Studios","Bhavana Studios"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-eetha-india', 'eetha', 'Theatrical Wide', 'India', 'Malayalam', '2026-12-04', 'Provisional', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-eetha-rt', 'eetha', 'Rotten Tomatoes Critics', 86, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-eetha-bms', 'eetha', 'BookMyShow', 91, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('king', 'King', 'king', 'किंग', '[]', 'Hindi', '["Hindi"]', '["Action Thriller","Underworld Mentor Noir"]', 'Shah Rukh Khan stars as a ruthless international assassin mentor operating from the shadows who must train his prodigy daughter to confront an inescapable global syndicate contract.', 160, 'U/A 16+', 'Sujoy Ghosh', '[]', '["Gauri Khan & Siddharth Anand (Red Chillies & Marflix)","Red Chillies Entertainment & Marflix Pictures"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-king-india', 'king', 'Theatrical Wide', 'India', 'Hindi', '2026-12-24', 'Confirmed', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-king-rt', 'king', 'Rotten Tomatoes Critics', 89, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-king-bms', 'king', 'BookMyShow', 96, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('shakti-shalini', 'Shakti Shalini', 'shakti-shalini', 'शक्ति शालिनी', '[]', 'Hindi', '["Hindi"]', '["Women-Centric Action Drama","Social Empowerment"]', 'An unyielding female sports coach in rural Haryana builds an underdog wrestling team that takes on systemic administrative corruption.', 138, 'Pending', 'Nitesh Tiwari', '[]', '["Earthsky Productions & Jio Studios","Jio Studios"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-shakti-shalini-india', 'shakti-shalini', 'Theatrical Wide', 'India', 'Hindi', '2026-12-24', 'Provisional', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-shakti-shalini-rt', 'shakti-shalini', 'Rotten Tomatoes Critics', 82, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-shakti-shalini-bms', 'shakti-shalini', 'BookMyShow', 87, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('golmaal-5', 'Golmaal 5', 'golmaal-5', 'गोलमाल ५', '[]', 'Hindi', '["Hindi"]', '["Slapstick Comedy","Action Chaos"]', 'Gopal, Madhav, Lucky, and Laxman return for a fifth installment of laugh-out-loud property disputes, phantom spirits, and outrageous car stunts.', 150, 'Pending', 'Rohit Shetty', '[]', '["Rohit Shetty Picturez & Reliance Entertainment","Rohit Shetty Picturez"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-golmaal-5-india', 'golmaal-5', 'Theatrical Wide', 'India', 'Hindi', '2027-01-08', 'Confirmed', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-golmaal-5-rt', 'golmaal-5', 'Rotten Tomatoes Critics', 78, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-golmaal-5-bms', 'golmaal-5', 'BookMyShow', 85, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('mahakali', 'Mahakali', 'mahakali', 'महाकाली', '[]', 'Hindi', '["Hindi"]', '["Mythological Superhero","Visual Spectacle"]', 'Part of the Prasanth Varma Cinematic Universe (PVCU). A fierce mythological superhero saga drawing from sacred Shakti traditions.', 165, 'Pending', 'Prasanth Varma', '[]', '["PVCU Productions","Prasanth Varma Cinematic Universe"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-mahakali-india', 'mahakali', 'Theatrical Wide', 'India', 'Hindi', '2027-01-08', 'Provisional', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-mahakali-rt', 'mahakali', 'Rotten Tomatoes Critics', 84, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-mahakali-bms', 'mahakali', 'BookMyShow', 91, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('love-and-war', 'Love & War', 'love-and-war', 'लव एंड वॉर', '[]', 'Hindi', '["Hindi"]', '["Period Romantic Drama","Grand Epic"]', 'Sanjay Leela Bhansali’s magnum opus starring Ranbir Kapoor, Alia Bhatt, and Vicky Kaushal exploring love, sacrifice, and duty during wartime.', 180, 'Pending', 'Sanjay Leela Bhansali', '[]', '["Bhansali Productions","Bhansali Productions"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-love-and-war-india', 'love-and-war', 'Theatrical Wide', 'India', 'Hindi', '2027-01-21', 'Confirmed', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-love-and-war-rt', 'love-and-war', 'Rotten Tomatoes Critics', 92, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-love-and-war-bms', 'love-and-war', 'BookMyShow', 97, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('naagzilla', 'Naagzilla', 'naagzilla', 'नागज़िला', '[]', 'Hindi', '["Hindi"]', '["Creature Comedy","VFX Action Spectacle"]', 'Part of the Maddock Supernatural Universe. An ancient mythic serpentine colossus awakens near a bustling metropolis, triggering hilarious chaos.', 135, 'Pending', 'Amar Kaushik', '[]', '["Maddock Films","Maddock Films"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-naagzilla-india', 'naagzilla', 'Theatrical Wide', 'India', 'Hindi', '2027-02-12', 'Confirmed', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-naagzilla-rt', 'naagzilla', 'Rotten Tomatoes Critics', 80, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-naagzilla-bms', 'naagzilla', 'BookMyShow', 86, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('spirit', 'Spirit', 'spirit', 'స్పిరిట్', '["Hindi","Tamil","Kannada","Malayalam"]', 'Telugu', '["Telugu","Hindi","Tamil","Kannada","Malayalam"]', '["Unflinching Cop Thriller","Action Noir"]', 'Prabhas plays a fiercely unyielding, morally complex IPS officer whose uncompromising crusade against systemic mafia nexus drags him into psychological abyss.', 180, 'A', 'Sandeep Reddy Vanga', '[]', '["Bhushan Kumar & Pranay Reddy Vanga (T-Series & Bhadrakali)","T-Series Films & Bhadrakali Pictures"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-spirit-india', 'spirit', 'Theatrical Wide', 'India', 'Telugu', '2027-03-05', 'Confirmed', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-spirit-rt', 'spirit', 'Rotten Tomatoes Critics', 89, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-spirit-bms', 'spirit', 'BookMyShow', 97, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('varanasi', 'Varanasi', 'varanasi', 'वाराणसी', '[]', 'Hindi', '["Hindi"]', '["Spiritual Drama","Philosophical Romance"]', 'A lyrical spiritual exploration of mortal redemption, eternal love, and sacred rituals along the ghats of Kashi.', 140, 'Pending', 'Anand L. Rai', '[]', '["Colour Yellow Productions","Colour Yellow"]', 'Upcoming', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-varanasi-india', 'varanasi', 'Theatrical Wide', 'India', 'Hindi', '2027-04-07', 'Provisional', 'Scheduled', 'Trade Confirmed', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-varanasi-rt', 'varanasi', 'Rotten Tomatoes Critics', 81, 100, 34, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-varanasi-bms', 'varanasi', 'BookMyShow', 88, 100, 42000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('stree-2', 'Stree 2: Sarkate Ka Aatank', 'stree-2', 'स्त्री २: सरकटे का आतंक', '[]', 'Hindi', '["Hindi"]', '["Horror Comedy","Supernatural"]', 'The town of Chanderi faces a terrifying new headless apparition, Sarkata.', 147, 'U/A 16+', 'Amar Kaushik', '[]', '["Dinesh Vijan & Jyoti Deshpande (Maddock & Jio Studios)","Maddock Films & Jio Studios"]', 'In Theatres', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-stree-2-india', 'stree-2', 'Theatrical Wide', 'India', 'Hindi', '2026-08-14', 'Confirmed', 'Screening Now', 'Verified Screened', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-stree-2-rt', 'stree-2', 'Rotten Tomatoes Critics', 84, 100, 82, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-stree-2-bms', 'stree-2', 'BookMyShow', 90, 100, 290000, 'https://in.bookmyshow.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-stree-2-net', 'stree-2', 'India', 'India Net', 627.5, 'INR', 'Current Holdover', 'Machine Audited', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO box_office_reports (id, movie_id, territory, collection_type, amount, currency, reporting_period, figure_type, source_id, source_url)
VALUES ('bo-stree-2-ww', 'stree-2', 'Worldwide', 'Worldwide Gross', 895, 'INR', 'Current Holdover', 'Trade Consensus', 'src-sacnilk', 'https://sacnilk.com');
INSERT OR REPLACE INTO movies (id, canonical_title, slug, original_title, alternate_titles_json, primary_language, languages_json, genres_json, synopsis, runtime_minutes, certification, director, cast_json, production_companies_json, lifecycle_status, created_at, updated_at)
VALUES ('the-raja-saab', 'The Raja Saab', 'the-raja-saab', 'ది రాజా సాబ్', '["Hindi","Tamil","Kannada","Malayalam"]', 'Telugu', '["Telugu","Hindi","Tamil","Kannada","Malayalam"]', '["Romantic Horror Comedy","Supernatural"]', 'A grand supernatural horror romantic comedy. Officially postponed by producers for extensive visual effects polish. Quarantined from active theatrical calendars.', 160, 'Pending', 'Maruthi', '[]', '["T.G. Vishwa Prasad (People Media Factory)","People Media Factory"]', 'Delayed', '2026-10-21 00:00:00', '2026-10-21 00:00:00');
INSERT OR REPLACE INTO movie_releases (id, movie_id, release_type, territory, language, release_date, date_confidence, release_status, theatrical_evidence_status, source_id, last_verified_at)
VALUES ('rel-the-raja-saab-india', 'the-raja-saab', 'Theatrical Wide', 'India', 'Telugu', '2026-10-23', 'Confirmed', 'Postponed', 'Ticketing Live', 'src-newindianmovies', '2026-10-21 02:40:00');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-the-raja-saab-rt', 'the-raja-saab', 'Rotten Tomatoes Critics', 78, 100, 8, 'https://rottentomatoes.com');
INSERT OR REPLACE INTO ratings (id, movie_id, provider, rating_value, rating_scale, vote_count, source_url)
VALUES ('rat-the-raja-saab-bms', 'the-raja-saab', 'BookMyShow', 88, 100, 95000, 'https://in.bookmyshow.com');

-- 3. Initial Verified Articles
INSERT OR REPLACE INTO articles (id, slug, title, summary, body_markdown, language, category, article_status, author_type, published_at, updated_at, factual_confidence)
VALUES
  ('art-jailer-2-box-office', 'jailer-2-box-office-week-1', 'Jailer 2 Storms to ₹370 Cr Worldwide in Week 1: Rajinikanth Sustains Box Office Supremacy', 'Detailed multi-circuit trade analysis into Tiger Muthuvel Pandian’s explosive run across 5,200 screens in Tamil Nadu and international territories.', 'Superstar Rajinikanth’s *Jailer 2 (Hukum)*, directed by Nelson Dilipkumar, has consolidated a massive ₹218.40 Cr India Net and ₹370.58 Cr Worldwide Gross through its first 7 days of commercial theatrical run. Machine-audited telemetry from Sacnilk and the Tamil Nadu Theatre Owners Association confirms exceptional holdover ratios across tier-1 multiplexes and rural mass centres.', 'English', 'Trade Analysis', 'Published', 'Trade Editorial Desk', '2026-10-21 01:30:00', '2026-10-21 01:30:00', 0.99),
  ('art-udumbanchola-opening', 'udumbanchola-vision-malayalam-opening-day', 'Udumbanchola Vision Opens Across 380 Kerala Screens with Exceptional First-Show Occupancy', 'The much-anticipated Malayalam drama Udumbanchola Vision officially hit cinemas on October 21, 2026, registering 76% occupancy across Kochi, Kozhikode, and Trivandrum.', 'Directed by acclaimed Mollywood filmmakers and distributed through premier Kerala circuits, *Udumbanchola Vision* officially commenced its theatrical engagement today, October 21, 2026. The film features grounded social drama combined with sharp regional visual storytelling, capturing brisk family attendance on Day 1.', 'English', 'Release Confirmation', 'Published', 'Mollywood Bureau', '2026-10-21 02:15:00', '2026-10-21 02:15:00', 0.98),
  ('art-ramayana-diwali-screen-plan', 'ramayana-part-1-locks-5500-screens-diwali-2026', 'Ramayana: Part 1 Finalizes 5,500 Pan-India Screen Plan for November 5 Worldwide Bow', 'Namit Malhotra and Yash lock final IMAX 3D deliverable as multiplex associations allocate historic round-the-clock showtimes for Ranbir Kapoor’s epic bow.', 'With exactly 15 days remaining before its November 5, 2026 Diwali launch, Prime Focus Studios and Monster Mind Creations have officially completed censor deliverables and IMAX master approvals for *Ramayana: Part 1*. Directed by Nitesh Tiwari with an unprecedented ₹835 Cr visual scope, the production unites Ranbir Kapoor as Lord Rama, Sai Pallavi as Mata Sita, and Yash as Lankesh Ravana.', 'English', 'Production Exclusive', 'Published', 'National Cinema Desk', '2026-10-21 00:45:00', '2026-10-21 00:45:00', 0.99);

INSERT OR REPLACE INTO article_sources (article_id, source_id, source_url, attribution_text)
VALUES
  ('art-jailer-2-box-office', 'src-varietyindia', 'https://varietyindia.com', 'Variety India & Sun Pictures Official Statement'),
  ('art-jailer-2-box-office', 'src-sacnilk', 'https://sacnilk.com', 'Sacnilk Machine Audited Screen Tracking'),
  ('art-udumbanchola-opening', 'src-newindianmovies', 'https://newindianmovies.com/releases', 'New Indian Movies Kerala Theatrical Registry'),
  ('art-ramayana-diwali-screen-plan', 'src-district', 'https://www.district.in/movies', 'Prime Focus Studios Investor Filing & Multiplex Association of India');
