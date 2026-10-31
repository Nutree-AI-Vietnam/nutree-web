# Chống Reverse Engineering cho app Nutree (web + mobile)

> Checklist phòng thủ (defensive hardening) cho sản phẩm **của chính Nutree**.
> File này viết trong repo `nutree-web` nhưng phần mobile dành để **mang sang repo app**
> (Android `com.nutreeai.mobile`, iOS `id6751159552`).

## Tư duy nền tảng (đọc trước)

- **Không thể "chặn" một công cụ RE cụ thể** (REA, Ghidra, JADX, Frida, Chrome DevTools…).
  Khi app đã phát hành, file APK/IPA/bundle JS nằm trên máy người dùng → ai cũng đọc được bytes.
- Mục tiêu đúng: **tăng chi phí RE đến mức không đáng**, không phải dựng tường tuyệt đối.
- **Quy tắc vàng: coi toàn bộ client (web + mobile) là đọc được.** Mọi logic tin cậy
  (auth, tính tiền, phân quyền, chống gian lận) phải nằm **server-side**. Tài sản thật cần
  bảo vệ là **backend/API**, thứ không thể moi ra từ một file binary.
- Đừng bao giờ nhúng secret thật (API secret, private key) trong client. Secret đã ship coi
  như đã lộ → phải **rotate**.

---

## 1. Backend / API — ưu tiên số 1

- [ ] Mọi quyết định nhạy cảm (giá, quyền, số dư, nội dung trả phí) do server quyết, **không tin client**.
- [ ] Xác thực + phân quyền kiểm tra lại ở server cho **mọi** endpoint (kể cả admin).
- [ ] Rate limiting + abuse detection ở API gateway.
- [ ] **Rotate** mọi secret từng bị nhúng vào app client trước đây.
- [ ] Bật **attestation** để chỉ app thật gọi được API: **Play Integrity** (Android) +
      **App Attest / DeviceCheck** (iOS). Từ chối request không có token attestation hợp lệ.
- [ ] Log + cảnh báo khi thấy pattern bất thường (nhiều thiết bị cùng token, client version lạ).

## 2. Android (`com.nutreeai.mobile`)

- [ ] Bật **R8 full mode**: `minifyEnabled true` + `shrinkResources true` cho build release
      (obfuscate tên class/method + loại code thừa). Giữ `proguard-rules.pro` tối thiểu.
- [ ] Không kèm **debug symbols / mapping** trong artifact phát hành; lưu `mapping.txt` riêng để de-obfuscate crash.
- [ ] Tắt log ở release (`BuildConfig.DEBUG`), không `Log.d` dữ liệu nhạy cảm.
- [ ] **Certificate pinning** cho toàn bộ traffic tới API (OkHttp CertificatePinner / Network Security Config).
- [ ] **Play Integrity API** để xác thực app/thiết bị (thay cho SafetyNet đã ngừng).
- [ ] Phát hiện **root / emulator / hooking** (Frida/Xposed) và hạ cấp tính năng nhạy cảm khi phát hiện.
- [ ] Logic "giá trị cao nhất" cân nhắc đưa xuống **native (NDK)** — khó RE hơn Java/Kotlin bytecode.
- [ ] Bảo vệ tài nguyên: không để key/endpoint nhạy cảm trong `res/`, `strings.xml`, `BuildConfig`.
- [ ] Kiểm tra tính toàn vẹn chữ ký APK lúc chạy (signature check) để chống repackaging.

## 3. iOS (`id6751159552`)

- [ ] Build release **strip symbols** (`Strip Linked Product`, `Deployment Postprocessing = Yes`).
- [ ] Không để secret/endpoint nhạy cảm trong `Info.plist`, string literals, hoặc asset.
- [ ] **App Attest / DeviceCheck** để chứng minh app thật, chưa bị chỉnh sửa.
- [ ] **Certificate pinning** (URLSession `serverTrust` / TrustKit).
- [ ] Phát hiện **jailbreak** + phát hiện debugger/Frida attach; hạ cấp tính năng nhạy cảm khi phát hiện.
- [ ] Logic nhạy cảm cân nhắc viết bằng **C/C++** thay vì Swift/Obj-C thuần.

## 4. Cả hai nền tảng

- [ ] **Secret off-device**: proxy mọi call nhạy cảm qua backend; client chỉ giữ token ngắn hạn, phạm vi hẹp.
- [ ] Nếu payoff đủ lớn (app fintech/cao giá trị): cân nhắc giải pháp **RASP / obfuscation thương mại**.
- [ ] Minh bạch kỳ vọng: attacker giỏi + kiên nhẫn vẫn có thể vượt. Đo thành công bằng **"đủ đắt để bỏ cuộc"**,
      và bằng việc backend vẫn an toàn khi client bị mổ xẻ.

## 5. Web (`nutree-web` — repo này)

- [ ] JS client **vốn đọc được** → không giấu logic/secret ở đó.
- [ ] Prod **không phát hành source map công khai**: verify `/_next/static/**` không có file `.map`
      (plugin PostHog upload source map riêng cho error-tracking, không để lộ ra public).
- [ ] **Audit biến `NEXT_PUBLIC_*`** (compile thẳng vào bundle, ai cũng thấy):
  - Firebase web API key = **định danh public**, chấp nhận được — khoá bằng **Firebase App Check + Security Rules**, đừng coi là secret.
  - Không gắn prefix `NEXT_PUBLIC_` cho secret thật (file `.env.example` đã cảnh báo đúng cho `TIKTOK_EVENTS_ACCESS_TOKEN` — giữ nguyên nguyên tắc đó).
  - `NEXT_PUBLIC_MEALTRACK_ADMIN_USE_PROXY=true`: xác nhận admin **thực sự đi qua server proxy**, API admin không gọi trực tiếp được từ client.
- [ ] Mọi auth/business logic đặt server-side (API routes / backend), không tin client.

## 6. Governance trong repo (đã làm trong `nutree-web`)

- [ ] `.claude/settings.json`: deny MCP server `rea` + CLI của nó; không auto-enable project MCP.
- [ ] `CLAUDE.md`: policy cấm wire RE tooling vào agent của repo.
- [ ] `.gitignore`: bỏ qua agent config cục bộ (`.claude/settings.local.json`).
- [ ] Áp policy tương tự cho **repo mobile** và các repo khác.
- Lưu ý: guard này chỉ ràng buộc **team/agent nội bộ** tôn trọng cấu hình repo — không ngăn attacker bên ngoài.
