<<<<<<< HEAD
# game101
````markdown
# game101

Nhỏ gọn: project Angular scaffolded bằng Angular CLI.

Repository: https://github.com/2309Binh/game101

## Yêu cầu
- Node.js (khuyến nghị dùng một phiên bản LTS như 18.x/20.x/24.x)
- npm (đi kèm với Node)

> Lưu ý: trên máy hiện tại Node v25 đã được dùng — build vẫn chạy nhưng nên chuyển về LTS cho production.

## Chạy phát triển (PowerShell)

Mở terminal tại thư mục project:

```powershell
cd C:\Users\Admin\angularTesting\game101\game
npm install
npm start
# Hoặc
npx ng serve --open
```

Ứng dụng sẽ chạy mặc định tại http://localhost:4200/.

## Build để deploy

```powershell
cd C:\Users\Admin\angularTesting\game101\game
npm run build
```

Kết quả build sẽ nằm trong `dist/game`.

## Test

Chạy unit tests:

```powershell
npm test
```

## Thêm & phát triển

- Tạo component mới: `npx ng generate component my-component`
- Chạy linter / format theo cấu hình nếu cần.

## Contribute & GitHub

Repo remote đã được thiết lập: `https://github.com/2309Binh/game101.git`

Gợi ý merge/pull request: https://github.com/2309Binh/game101/pull/new/master

## CI / Next steps

- Nếu muốn tôi có thể tạo sẵn workflow GitHub Actions để chạy `npm ci` + `npm run build` trên mỗi push.
- Nên chuyển sang branch `main` nếu bạn dùng convention `main` (hiện project đang dùng `master`).

## License

MIT (nếu bạn muốn đổi, cho biết license bạn muốn).

````

