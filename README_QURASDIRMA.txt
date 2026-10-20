KERAUNOS CYBERSECURITY — PAROLLA QORUNAN ADMIN PANELİ

Fayllar:
- index.html: imtahan saytı
- admin.html: parol tələb edən admin paneli
- config.js: yalnız Supabase Project URL və anon/public key
- supabase_setup.sql: iştirakçı cədvəli və daha məhdud RLS siyasətləri
- supabase/functions/admin-api/index.ts: server tərəfli admin API

VACİB TƏHLÜKƏSİZLİK:
Admin parolu HTML/JavaScript faylında saxlanmır. Parol Supabase Edge Function üçün server secret kimi qurulur. Service-role açarı da heç vaxt GitHub-a yüklənməməlidir.

Quraşdırma:
1. Supabase layihəsini yarat.
2. SQL Editor-də supabase_setup.sql faylını işə sal.
3. Project Settings → API-dən Project URL və anon/public key götür.
4. config.js-də placeholder-ları öz Project URL və anon/public key-inlə əvəz et.
5. Supabase CLI quraşdırılmış kompüterdə bu layihə qovluğundan:
   supabase login
   supabase link --project-ref SƏNİN_PROJECT_REF
6. Server secrets təyin et:
   supabase secrets set ADMIN_PASSWORD='buraya admin parolunu yaz'
   (İstəsən daha güclü, uzun parol seç.)
7. Edge Function-u deploy et:
   supabase functions deploy admin-api
8. index.html, admin.html və config.js fayllarını GitHub Pages repozitoriyasına yüklə. supabase qovluğunu da repozitoriyaya saxlaya bilərsən, amma secret dəyərlərini heç bir fayla yazma.
9. İmtahan linki repozitoriyanın kök linkidir; admin paneli isə /admin.html ünvanıdır.

İş prinsipi:
- İştirakçılar imtahanı adi qaydada açır.
- Admin /admin.html səhifəsinə girib serverdə təyin etdiyin parolu daxil edir.
- Düzgün paroldan sonra iştirakçılar görünür; siyahı 5 saniyədən bir yenilənir.
- Bal/nəticələr admin panelində göstərilmir.

Qeyd:
- Mövcud imtahan səhifəsi iştirakçı yaratmaq və status yeniləmək üçün anon key istifadə edir. Bu başlanğıc nümunəsində həmin yazma siyasətləri açıqdır; daha ciddi ictimai imtahan üçün hər iştirakçıya ayrıca identifikator və server tərəfli doğrulama əlavə etmək məsləhətdir.
- Parol internet üzərindən HTTPS ilə göndərilir; GitHub kodunda saxlanmır. Supabase dashboard/CLI-yə girişini qorumaq vacibdir.
- Əvvəlki açıq SQL siyasətlərini dəyişmək üçün bu SQL drop policy əmrlərini də icra edir.
