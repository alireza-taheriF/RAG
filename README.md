# سنجش (Sanjesh)

سیستم RAG مقید به منبع به‌علاوهٔ هارنس ارزیابی آفلاین. برای رزومهٔ مهندسی LLM طراحی شده، نه به‌عنوان چت‌بات عمومی.

همراه آن یک نقشهٔ پروژه برای مسیر ایران→آمریکا در `/` هست.

## چه چیزی پیاده شده

- پیکرهٔ ۱۸ سندی دربارهٔ مهندسی RAG
- قطعه‌بندی پایدار با شناسهٔ `doc#index`
- بازیابی BM25، TF-IDF کسینوسی، هیبرید RRF
- کنترل منفی بدون بازیابی
- پاسخ extractive با استناد؛ امتناع وقتی مدرک کافی نیست
- مجموعهٔ طلایی ۴۸ سؤالی (قابل‌پاسخ + خارج از دامنه)
- متریک‌ها: Recall@k، MRR، nDCG، Hit rate، Answer F1، وفاداری ۳-گرام، نرخ ادعای بی‌منبع، دقت امتناع، p50/p95

بدون کلید API کار می‌کند.

## اجرا

```bash
npm install
npm run dev
```

- آزمایشگاه: [http://127.0.0.1:43147/lab](http://127.0.0.1:43147/lab)
- هارنس: [http://127.0.0.1:43147/eval](http://127.0.0.1:43147/eval)

```bash
npm run build
npm start -- --port 43147
```

## خط رزومه (نمونه)

Built a grounded RAG workbench with BM25/TF-IDF/RRF retrieval, citation-required extractive answers, and an offline eval harness (48 gold questions) reporting Recall@k, faithfulness, unsupported-claim rate, abstention accuracy, and p95 latency.
